
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { KidneyIcon } from './Icons';

interface RenalCalculatorProps {
    age: string;
    weight: string;
    serumCreatinine: string;
    gender: string;
}

export const RenalCalculator: React.FC<RenalCalculatorProps> = ({ age, weight, serumCreatinine, gender }) => {
    const [raceEgfr, setRaceEgfr] = useState('non_black');
    
    const crcl = useMemo(() => {
        const ageNum = parseFloat(age);
        const wt = parseFloat(weight);
        const crUmol = parseFloat(serumCreatinine);
        
        if (ageNum > 0 && wt > 0 && crUmol > 0) {
            // Convert umol/L to mg/dL for the formula (1 mg/dL = 88.4 umol/L)
            const crMgdl = crUmol / 88.4;
            const femaleMultiplier = gender === 'female' ? 0.85 : 1;
            const result = ((140 - ageNum) * wt * femaleMultiplier) / (72 * crMgdl);
            return result.toFixed(1);
        }
        return '-';
    }, [age, weight, serumCreatinine, gender]);

    const egfr = useMemo(() => {
        const ageNum = parseFloat(age);
        const scrUmol = parseFloat(serumCreatinine);

        if (ageNum > 0 && scrUmol > 0) {
            // Convert umol/L to mg/dL for the formula (1 mg/dL = 88.4 umol/L)
            const scrMgdl = scrUmol / 88.4;
            const isFemale = gender === 'female';
            const isBlack = raceEgfr === 'black';
            const kappa = isFemale ? 0.7 : 0.9;
            const alpha = isFemale ? -0.241 : -0.302;
            const femaleMultiplier = isFemale ? 1.012 : 1;
            const raceMultiplier = isBlack ? 1.159 : 1; // From pre-2021 CKD-EPI formula
            
            const term1 = Math.min(scrMgdl / kappa, 1) ** alpha;
            const term2 = Math.max(scrMgdl / kappa, 1) ** -1.200;
            const term3 = 0.9938 ** ageNum;
            
            const result = 142 * term1 * term2 * term3 * femaleMultiplier * raceMultiplier;
            return result.toFixed(0);
        }
        return '-';
    }, [age, serumCreatinine, gender, raceEgfr]);

    const raceOptions = [
        { value: 'non_black', label: 'Non-Black' },
        { value: 'black', label: 'Black' },
    ];
    
    return (
        <CollapsibleCard title="Renal Function" icon={<KidneyIcon />}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 -mt-2">
                Uses data from the "Patient Data" card.
            </p>
            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">CrCl (Cockcroft-Gault)</h3>
            <ResultDisplay label="CrCl" value={crcl} unit="mL/min" />

            <hr className="my-4 border-secondary-dark dark:border-gray-600" />
            
            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">eGFR (CKD-EPI)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 -mt-2">Uses 2021 CKD-EPI refit formula. The race option is provided for legacy calculations.</p>
            <FormField label="Race" id="race_egfr" value={raceEgfr} onChange={e => setRaceEgfr(e.target.value)} type="select" options={raceOptions} />
            <ResultDisplay label="eGFR" value={egfr} unit="mL/min/1.73m²" />
        </CollapsibleCard>
    );
};
