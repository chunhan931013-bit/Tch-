
import React from 'react';

interface ResultDisplayProps {
    label: string;
    value: string | number;
    unit?: string;
    interpretation?: string;
    colorClass?: string;
    formula?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ label, value, unit, interpretation, colorClass, formula }) => {
    return (
        <div className="mt-4 p-4 bg-secondary-light dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-200">{label}</span>
                <span className={`text-2xl font-bold ${colorClass || 'text-primary dark:text-blue-400'}`}>
                    {value}
                    {unit && <span className="text-lg ml-1">{unit}</span>}
                </span>
            </div>
            {interpretation && <p className={`text-sm mt-1 ${colorClass || 'text-gray-600 dark:text-gray-400'}`}>{interpretation}</p>}
            {formula && <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{formula}</p>}
        </div>
    );
};
