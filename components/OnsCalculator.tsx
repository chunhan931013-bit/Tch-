import React, { useState, useMemo } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { NutritionIcon } from './Icons';

export const OnsCalculator: React.FC = () => {
    const [targetKcal, setTargetKcal] = useState('');
    const [kcalPerScoop, setKcalPerScoop] = useState('100'); // Common value

    const scoopsNeeded = useMemo(() => {
        const target = parseFloat(targetKcal);
        const perScoop = parseFloat(kcalPerScoop);
        if (target > 0 && perScoop > 0) {
            return (target / perScoop).toFixed(1);
        }
        return '-';
    }, [targetKcal, kcalPerScoop]);

    return (
        <CalculatorCard title="Oral Nutrition Supplement" icon={<NutritionIcon />}>
            <FormField label="Targeted KCAL" id="target_kcal" value={targetKcal} onChange={e => setTargetKcal(e.target.value)} unit="kcal" />
            <FormField label="KCAL per Scoop" id="kcal_scoop" value={kcalPerScoop} onChange={e => setKcalPerScoop(e.target.value)} unit="kcal" />
            <ResultDisplay label="Scoops Needed" value={scoopsNeeded} />
        </CalculatorCard>
    );
};
