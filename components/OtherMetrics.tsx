import React, { useState } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { FormField } from './FormField';
import { MetricsIcon } from './Icons';

export const OtherMetrics: React.FC = () => {
    const [ipss, setIpss] = useState('');

    // IPSS interpretation
    const getIpssInterpretation = (score: number) => {
        if (isNaN(score)) return '';
        if (score >= 0 && score <= 7) return 'Mildly symptomatic';
        if (score >= 8 && score <= 19) return 'Moderately symptomatic';
        if (score >= 20 && score <= 35) return 'Severely symptomatic';
        return 'Invalid score (must be 0-35)';
    };
    
    const interpretation = getIpssInterpretation(parseInt(ipss, 10));

    return (
        <CalculatorCard title="Other Scores" icon={<MetricsIcon />}>
             <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">IPSS</h3>
             <FormField
                label="International Prostate Symptom Score"
                id="ipss"
                value={ipss}
                onChange={e => setIpss(e.target.value)}
                unit="points"
                min={0}
                max={35}
                type="number"
             />
             {interpretation && <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{interpretation}</p>}
        </CalculatorCard>
    );
};
