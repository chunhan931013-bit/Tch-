import React, { useState, useMemo } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { TreadmillIcon } from './Icons';

export const DukeTreadmillCalculator: React.FC = () => {
    const [duration, setDuration] = useState('');
    const [stDeviation, setStDeviation] = useState('');
    const [angina, setAngina] = useState('0');

    const { score, interpretation, colorClass } = useMemo(() => {
        const dur = parseFloat(duration);
        const st = parseFloat(stDeviation);
        const ang = parseInt(angina, 10);
        
        if (!isNaN(dur) && !isNaN(st) && !isNaN(ang)) {
            const scoreValue = dur - (5 * st) - (4 * ang);
            
            let interp = '';
            let color = '';
            if (scoreValue >= 5) {
                interp = 'Low Risk';
                color = 'text-success';
            } else if (scoreValue >= -10) {
                interp = 'Moderate Risk';
                color = 'text-warning';
            } else {
                interp = 'High Risk';
                color = 'text-danger';
            }
            return {
                score: scoreValue.toFixed(0),
                interpretation: interp,
                colorClass: color,
            };
        }
        return { score: '-', interpretation: '', colorClass: '' };

    }, [duration, stDeviation, angina]);

    return (
        <CalculatorCard title="Duke Treadmill Score" icon={<TreadmillIcon />}>
            <FormField label="Exercise Duration" id="duration" value={duration} onChange={e => setDuration(e.target.value)} unit="mins" />
            <FormField label="Max ST Deviation" id="st_dev" value={stDeviation} onChange={e => setStDeviation(e.target.value)} unit="mm" />
            <FormField
                label="Angina During Exercise"
                id="angina"
                value={angina}
                onChange={e => setAngina(e.target.value)}
                type="select"
                options={[
                    { value: '0', label: 'None' },
                    { value: '1', label: 'Non-limiting' },
                    { value: '2', label: 'Exercise-limiting' },
                ]}
            />
            <ResultDisplay label="Duke Score" value={score} interpretation={interpretation} colorClass={colorClass} />
        </CalculatorCard>
    );
};
