
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { SyringeIcon } from './Icons';

interface VasopressorCalculatorProps {
    weight: string;
}

type Drug = 'noradrenaline' | 'adrenaline' | 'vasopressin' | 'dobutamine' | 'dopamine';
type CalculationMode = 'rate_from_dose' | 'dose_from_rate';

const DRUG_CONFIG: Record<Drug, { label: string; unit: string; doseUnit: string; isWeightBased: boolean }> = {
    noradrenaline: { label: 'Noradrenaline (Norepinephrine)', unit: 'mg', doseUnit: 'mcg/kg/min', isWeightBased: true },
    adrenaline: { label: 'Adrenaline (Epinephrine)', unit: 'mg', doseUnit: 'mcg/kg/min', isWeightBased: true },
    vasopressin: { label: 'Vasopressin', unit: 'Units', doseUnit: 'Units/min', isWeightBased: false },
    dobutamine: { label: 'Dobutamine', unit: 'mg', doseUnit: 'mcg/kg/min', isWeightBased: true },
    dopamine: { label: 'Dopamine', unit: 'mg', doseUnit: 'mcg/kg/min', isWeightBased: true },
};

export const VasopressorCalculator: React.FC<VasopressorCalculatorProps> = ({ weight }) => {
    const [drug, setDrug] = useState<Drug>('noradrenaline');
    const [amount, setAmount] = useState('');
    const [volume, setVolume] = useState('');
    const [mode, setMode] = useState<CalculationMode>('dose_from_rate');
    const [inputValue, setInputValue] = useState(''); // Stores Rate (ml/hr) or Dose (mcg/kg/min etc)

    // Derived values
    const config = DRUG_CONFIG[drug];
    
    // Concentration Calculation
    const concentrationInfo = useMemo(() => {
        const amt = parseFloat(amount);
        const vol = parseFloat(volume);
        
        if (amt > 0 && vol > 0) {
            if (config.unit === 'mg') {
                const concMgMl = amt / vol;
                const concMcgMl = concMgMl * 1000;
                return { value: concMcgMl, display: `${concMcgMl.toFixed(0)} mcg/mL` }; // Standardize to mcg/mL for calculation
            } else {
                // Units
                const concUnitsMl = amt / vol;
                return { value: concUnitsMl, display: `${concUnitsMl.toFixed(2)} Units/mL` };
            }
        }
        return { value: 0, display: '-' };
    }, [amount, volume, config.unit]);

    // Main Calculation
    const result = useMemo(() => {
        const val = parseFloat(inputValue);
        const conc = concentrationInfo.value;
        const ptWeight = parseFloat(weight);

        if (val > 0 && conc > 0) {
            if (mode === 'dose_from_rate') {
                // Input is Rate (mL/hr) -> Output Dose
                const rate = val;
                
                if (config.isWeightBased) {
                    if (ptWeight > 0) {
                        // Rate (ml/hr) * Conc (mcg/ml) / 60 / Weight (kg) = mcg/kg/min
                        const dose = (rate * conc) / 60 / ptWeight;
                        return { value: dose.toFixed(2), unit: config.doseUnit };
                    }
                    return { value: '-', unit: 'Missing Weight' };
                } else {
                    // Vasopressin: Rate (ml/hr) * Conc (Units/ml) / 60 = Units/min
                    const dose = (rate * conc) / 60;
                    return { value: dose.toFixed(3), unit: config.doseUnit };
                }
            } else {
                // Input is Dose -> Output Rate (mL/hr)
                const dose = val;

                if (config.isWeightBased) {
                    if (ptWeight > 0) {
                        // Dose (mcg/kg/min) * Weight * 60 / Conc (mcg/ml) = mL/hr
                        const rate = (dose * ptWeight * 60) / conc;
                        return { value: rate.toFixed(1), unit: 'mL/hr' };
                    }
                    return { value: '-', unit: 'Missing Weight' };
                } else {
                    // Vasopressin: Dose (Units/min) * 60 / Conc (Units/ml) = mL/hr
                    const rate = (dose * 60) / conc;
                    return { value: rate.toFixed(1), unit: 'mL/hr' };
                }
            }
        }
        return { value: '-', unit: '' };
    }, [inputValue, concentrationInfo.value, weight, mode, config]);

    const handleDrugChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setDrug(e.target.value as Drug);
        setInputValue(''); // Reset input on drug change to avoid confusion
    };

    return (
        <CollapsibleCard title="Inotropes & Vasopressors" icon={<SyringeIcon />}>
            <div className="mb-4">
                <FormField 
                    label="Select Medication" 
                    id="drug_select" 
                    value={drug} 
                    onChange={handleDrugChange} 
                    type="select" 
                    options={Object.entries(DRUG_CONFIG).map(([key, cfg]) => ({ value: key, label: cfg.label }))}
                />
            </div>

            <div className="bg-secondary-light dark:bg-gray-800 p-4 rounded-lg mb-6 border border-secondary dark:border-gray-700">
                <h3 className="font-semibold text-primary dark:text-blue-400 mb-3 flex items-center">
                    1. Preparation Dilution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label={`Amount in Bag (${config.unit})`} 
                        id="amount" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        unit={config.unit} 
                    />
                    <FormField 
                        label="Total Volume (mL)" 
                        id="volume" 
                        value={volume} 
                        onChange={e => setVolume(e.target.value)} 
                        unit="mL" 
                    />
                </div>
                <div className="mt-2 text-right">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Final Concentration: </span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{concentrationInfo.display}</span>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-primary dark:text-blue-400 mb-3">
                    2. Calculation Mode
                </h3>
                <div className="flex bg-secondary dark:bg-gray-700 p-1 rounded-lg mb-4">
                     <button
                        onClick={() => setMode('dose_from_rate')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                            mode === 'dose_from_rate' 
                            ? 'bg-surface-light dark:bg-gray-600 text-primary dark:text-blue-300 shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        Find Dose (from mL/hr)
                    </button>
                    <button
                        onClick={() => setMode('rate_from_dose')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                            mode === 'rate_from_dose' 
                            ? 'bg-surface-light dark:bg-gray-600 text-primary dark:text-blue-300 shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        Find Rate (from Dose)
                    </button>
                </div>

                <div className="animate-fade-in">
                    {mode === 'dose_from_rate' ? (
                        <FormField 
                            label="Current Infusion Rate" 
                            id="infusion_rate" 
                            value={inputValue} 
                            onChange={e => setInputValue(e.target.value)} 
                            unit="mL/hr" 
                        />
                    ) : (
                        <FormField 
                            label={`Target Dose`} 
                            id="target_dose" 
                            value={inputValue} 
                            onChange={e => setInputValue(e.target.value)} 
                            unit={config.doseUnit} 
                        />
                    )}
                </div>
            </div>

            {config.isWeightBased && (!weight || parseFloat(weight) <= 0) && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-warning text-yellow-800 dark:text-yellow-200 text-sm">
                    Warning: Patient weight is required for this calculation. Please enter it in the Patient Data section.
                </div>
            )}

            <hr className="my-4 border-secondary-dark dark:border-gray-600" />

            <ResultDisplay 
                label={mode === 'dose_from_rate' ? "Calculated Dose" : "Required Infusion Rate"}
                value={result.value}
                unit={result.unit}
                colorClass="text-primary dark:text-blue-400"
            />
            {mode === 'dose_from_rate' && drug === 'noradrenaline' && result.value !== '-' && config.isWeightBased && (
                 <p className="text-xs text-gray-500 mt-2 text-right">
                    (Equivalent to {((parseFloat(inputValue) * concentrationInfo.value) / 60).toFixed(2)} mcg/min)
                 </p>
            )}
        </CollapsibleCard>
    );
};
