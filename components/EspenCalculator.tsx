
import React, { useState, useMemo, useEffect } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { NutritionIcon } from './Icons';

interface EspenCalculatorProps {
    weight: string;
    height: string;
    age: string;
    gender: string;
    ibw: string;
    abw: string;
    bmi: string;
}

type PatientSetting = 'ambulatory' | 'stable' | 'critical';
type FluidRestriction = 'none' | '500' | '700' | '1000';

const ONS_PRODUCTS = {
    enercal: { name: 'Enercal Plus', kcal: 60, protein: 2.4, unit: 'scoop', type: 'standard' },
    ensure: { name: 'Ensure Original', kcal: 44, protein: 1.75, unit: 'scoop', type: 'standard' },
    nutren_opt: { name: 'Nutren Optimum', kcal: 36, protein: 1.45, unit: 'scoop', type: 'standard' },
    peptamen: { name: 'Peptamen', kcal: 36, protein: 1.45, unit: 'scoop', type: 'standard' },
    glucerna: { name: 'Glucerna', kcal: 45, protein: 2.04, unit: 'scoop', type: 'diabetic' },
    nutren_diab: { name: 'Nutren Diabetic', kcal: 36, protein: 1.6, unit: 'scoop', type: 'diabetic' },
    nepro: { name: 'Nepro HP', kcal: 1.82, protein: 0.08, unit: 'ml', type: 'renal' },
    novasource: { name: 'Novasource Renal', kcal: 2, protein: 0.09, unit: 'ml', type: 'renal' },
};

const SettingButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; className?: string; }> = ({ label, isActive, onClick, className }) => {
    const baseClasses = "w-full px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800";
    const activeClasses = "bg-primary text-white shadow-md";
    const inactiveClasses = "bg-secondary-dark dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600";
    return (
        <button type="button" onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}>
            {label}
        </button>
    );
};

export const EspenCalculator: React.FC<EspenCalculatorProps> = ({ weight, height, age, gender, ibw, abw, bmi }) => {
    const [patientSetting, setPatientSetting] = useState<PatientSetting>('ambulatory');
    const [activityFactor, setActivityFactor] = useState('1.2');
    const [targetKcalPerKg, setTargetKcalPerKg] = useState('25');
    
    // ONS Planner State
    const [showOnsPlanner, setShowOnsPlanner] = useState(false);
    const [isDiabetic, setIsDiabetic] = useState(false);
    const [fluidRestriction, setFluidRestriction] = useState<FluidRestriction>('none');
    const [selectedProductKey, setSelectedProductKey] = useState('');
    const [feedingsPerDay, setFeedingsPerDay] = useState('6');

    useEffect(() => {
        if (patientSetting === 'stable') setTargetKcalPerKg('25');
        if (patientSetting === 'critical') setTargetKcalPerKg('20');
    }, [patientSetting]);

    const caloricNeeds = useMemo(() => {
        const wt = parseFloat(weight);
        const bmiNum = parseFloat(bmi);
        const abwNum = parseFloat(abw);
        const isObese = bmiNum >= 30 && abwNum > 0;
        
        let weightToUse = wt;
        let weightSource = 'Actual Weight';
        if (isObese && (patientSetting === 'stable' || patientSetting === 'critical')) {
            weightToUse = abwNum;
            weightSource = 'Adjusted Body Weight';
        }

        if (patientSetting === 'stable' || patientSetting === 'critical') {
             if (weightToUse > 0) {
                 const factor = parseFloat(targetKcalPerKg) || 0;
                 const total = factor * weightToUse;
                 return { 
                     type: 'hospitalized',
                     total: total.toFixed(0), 
                     formula: `${factor} kcal/kg/day * ${weightToUse.toFixed(1)} kg (${weightSource})`, 
                     target: total
                 };
             }
             return { type: 'hospitalized', total: '-', formula: 'Missing Weight', target: 0 };
        }
        
        // Ambulatory logic (Harris-Benedict)
        const ht = parseFloat(height);
        const ageNum = parseFloat(age);
        const factor = parseFloat(activityFactor);

        if (wt > 0 && ht > 0 && ageNum > 0) {
            let bmr: number;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * wt) + (4.799 * ht) - (5.677 * ageNum);
            } else {
                bmr = 447.593 + (9.247 * wt) + (3.098 * ht) - (4.330 * ageNum);
            }
            const tdee = bmr * factor;
            return { type: 'ambulatory', bmr: bmr.toFixed(0), tdee: tdee.toFixed(0), target: tdee };
        }

        return { type: 'ambulatory', bmr: '-', tdee: '-', target: 0 };

    }, [weight, height, age, gender, activityFactor, patientSetting, bmi, abw, targetKcalPerKg]);

    const onsProducts = useMemo(() => {
        if (fluidRestriction !== 'none') {
            return Object.entries(ONS_PRODUCTS).filter(([_, p]) => p.type === 'renal');
        }
        if (isDiabetic) {
            return Object.entries(ONS_PRODUCTS).filter(([_, p]) => p.type === 'diabetic');
        }
        return Object.entries(ONS_PRODUCTS).filter(([_, p]) => p.type === 'standard');
    }, [isDiabetic, fluidRestriction]);

    useEffect(() => {
        if (onsProducts.length > 0) {
            setSelectedProductKey(onsProducts[0][0]);
        } else {
            setSelectedProductKey('');
        }
    }, [onsProducts]);

    const onsPlan = useMemo(() => {
        const target = caloricNeeds.target;
        const product = ONS_PRODUCTS[selectedProductKey as keyof typeof ONS_PRODUCTS];
        const feedings = parseInt(feedingsPerDay, 10);

        if (!target || !product || !feedings || target <= 0 || feedings <= 0) {
            return null;
        }
        
        const kcalPerFeeding = target / feedings;
        const amountPerFeeding = kcalPerFeeding / product.kcal;
        const totalAmount = amountPerFeeding * feedings;
        const totalProtein = totalAmount * product.protein;
        const totalCalories = totalAmount * product.kcal;

        return {
            amountPerFeeding: amountPerFeeding.toFixed(1),
            totalAmount: totalAmount.toFixed(1),
            totalProtein: totalProtein.toFixed(1),
            totalCalories: totalCalories.toFixed(0),
            unit: product.unit,
        };
    }, [caloricNeeds, selectedProductKey, feedingsPerDay]);

    return (
        <CollapsibleCard title="ESPEN Caloric Needs" icon={<NutritionIcon />}>
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 -mt-2">Uses data from Patient Data. Select setting below.</p>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient Setting</label>
                <div className="flex shadow-sm rounded-md overflow-hidden">
                    <SettingButton label="Ambulatory" isActive={patientSetting === 'ambulatory'} onClick={() => setPatientSetting('ambulatory')} />
                    <SettingButton label="Stable" isActive={patientSetting === 'stable'} onClick={() => setPatientSetting('stable')} />
                    <SettingButton label="Critically Ill" isActive={patientSetting === 'critical'} onClick={() => setPatientSetting('critical')} />
                </div>
            </div>

            {patientSetting === 'ambulatory' && (
                <div className="animate-fade-in">
                    <FormField label="Activity/Stress Factor" id="activity_factor" value={activityFactor} onChange={e => setActivityFactor(e.target.value)} type="select"
                        options={[
                            { value: '1.2', label: 'Confined to bed / Sedentary' },
                            { value: '1.3', label: 'Ambulatory / Lightly Active' },
                            { value: '1.5', label: 'Normal Activity / Moderately Active' },
                            { value: '1.7', label: 'Very Active' },
                        ]} />
                </div>
            )}

            {(patientSetting === 'stable' || patientSetting === 'critical') && (
                 <div className="animate-fade-in mb-4">
                     <FormField 
                        label="Target Caloric Intake" 
                        id="target_kcal_kg" 
                        value={targetKcalPerKg} 
                        onChange={e => setTargetKcalPerKg(e.target.value)} 
                        unit="kcal/kg/day"
                        type="number"
                     />
                     <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3 mb-2">
                        Recommended: {patientSetting === 'stable' ? '25 - 30' : '20 - 25'} kcal/kg/day
                     </p>
                </div>
            )}
            
            <div className="mt-4">
                {caloricNeeds.type === 'ambulatory' && (
                    <div className="animate-fade-in space-y-2">
                        <ResultDisplay label="BMR" value={(caloricNeeds as any).bmr} unit="kcal/day" formula="Harris-Benedict Equation" />
                        <ResultDisplay label="Est. Caloric Needs" value={(caloricNeeds as any).tdee} unit="kcal/day" formula="BMR x Activity Factor" />
                    </div>
                )}
                 {caloricNeeds.type === 'hospitalized' && (
                     <div className="animate-fade-in">
                        <ResultDisplay label="Est. Caloric Needs" value={(caloricNeeds as any).total} unit="kcal/day" formula={(caloricNeeds as any).formula} />
                    </div>
                )}
            </div>

            <hr className="my-6 border-secondary-dark dark:border-gray-600" />
            
            <div>
                 <button onClick={() => setShowOnsPlanner(!showOnsPlanner)} className="w-full text-left font-semibold text-primary dark:text-blue-400 hover:underline">
                    {showOnsPlanner ? '▼ Hide' : '► Show'} Oral Nutrition Supplement Planner
                </button>
            </div>

            {showOnsPlanner && (
                <div className="mt-4 space-y-4 animate-fade-in">
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={isDiabetic} onChange={(e) => setIsDiabetic(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                            <span>Diabetic?</span>
                        </label>
                         <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={fluidRestriction !== 'none'} onChange={(e) => setFluidRestriction(e.target.checked ? '1000' : 'none')} className="rounded text-primary focus:ring-primary" />
                            <span>Fluid Restriction?</span>
                        </label>
                    </div>

                    {fluidRestriction !== 'none' && (
                        <FormField label="Fluid Limit" id="fluid_limit" value={fluidRestriction} onChange={e => setFluidRestriction(e.target.value as FluidRestriction)} type="select" options={[
                            { value: '500', label: '500 cc / day' },
                            { value: '700', label: '700 cc / day' },
                            { value: '1000', label: '1000 cc / day' },
                        ]} />
                    )}

                    <FormField label="Select Product" id="ons_product" value={selectedProductKey} onChange={e => setSelectedProductKey(e.target.value)} type="select"
                        options={onsProducts.map(([key, product]) => ({ value: key, label: product.name }))} />
                    
                    <FormField label="Feedings per Day" id="feedings" value={feedingsPerDay} onChange={e => setFeedingsPerDay(e.target.value)} />

                    {onsPlan && (
                        <div className="mt-4 space-y-2">
                             <ResultDisplay label="Amount per Feeding" value={`${onsPlan.amountPerFeeding}`} unit={onsPlan.unit} />
                             <ResultDisplay label="Total Daily Amount" value={`${onsPlan.totalAmount}`} unit={onsPlan.unit} />
                             <ResultDisplay label="Total Daily Protein" value={onsPlan.totalProtein} unit="g" />
                             <ResultDisplay label="Total Calories Provided" value={onsPlan.totalCalories} unit="kcal" />
                        </div>
                    )}
                </div>
            )}
        </CollapsibleCard>
    );
};
