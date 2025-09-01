import React, { useState, useMemo } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { BodyIcon } from './Icons';

export const BmiBsaCalculator: React.FC = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const { bmi, bsa, interpretation, colorClass } = useMemo(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (h > 0 && w > 0) {
            const heightInMeters = h / 100;
            const bmiValue = w / (heightInMeters * heightInMeters);

            const bsaValue = Math.sqrt((h * w) / 3600);
            
            let interp = '';
            let color = '';
            if (bmiValue < 18.5) {
                interp = 'Underweight';
                color = 'text-warning';
            } else if (bmiValue < 25) {
                interp = 'Normal weight';
                color = 'text-success';
            } else if (bmiValue < 30) {
                interp = 'Overweight';
                color = 'text-warning';
            } else {
                interp = 'Obese';
                color = 'text-danger';
            }

            return {
                bmi: bmiValue.toFixed(2),
                bsa: bsaValue.toFixed(2),
                interpretation: interp,
                colorClass: color,
            };
        }
        return { bmi: '-', bsa: '-', interpretation: '', colorClass: '' };
    }, [height, weight]);

    return (
        <CalculatorCard title="BMI & BSA" icon={<BodyIcon />}>
            <FormField label="Height" id="height" value={height} onChange={e => setHeight(e.target.value)} unit="cm" />
            <FormField label="Weight" id="weight" value={weight} onChange={e => setWeight(e.target.value)} unit="kg" />
            <ResultDisplay label="BMI" value={bmi} unit="kg/m²" interpretation={interpretation} colorClass={colorClass} formula="weight (kg) / [height (m)]²" />
            <ResultDisplay label="BSA (Mosteller)" value={bsa} unit="m²" formula="√([height(cm) * weight(kg)] / 3600)" />
        </CalculatorCard>
    );
};
