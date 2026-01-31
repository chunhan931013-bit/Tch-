
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { CalendarIcon } from './Icons';

export const DayCalculator: React.FC = () => {
    // Mode 1: Difference
    const [startDate1, setStartDate1] = useState('');
    const [endDate1, setEndDate1] = useState('');

    // Mode 2: Addition
    const [startDate2, setStartDate2] = useState('');
    const [durationDays, setDurationDays] = useState('');

    const dayDifference = useMemo(() => {
        if (!startDate1 || !endDate1) return '-';
        const start = new Date(startDate1);
        const end = new Date(endDate1);
        
        // Reset hours for date-only comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays.toString();
    }, [startDate1, endDate1]);

    const calculatedEndDate = useMemo(() => {
        if (!startDate2 || !durationDays) return '-';
        const start = new Date(startDate2);
        const duration = parseInt(durationDays, 10);
        if (isNaN(duration)) return '-';
        
        const end = new Date(start);
        end.setDate(start.getDate() + duration);
        
        return end.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }, [startDate2, durationDays]);

    return (
        <CollapsibleCard title="Day & Date Calculator" icon={<CalendarIcon />} initialCollapsed={true}>
            <div className="space-y-6">
                {/* Task 1: Duration Between Dates */}
                <div>
                    <h3 className="font-semibold text-primary dark:text-blue-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        1. Duration Between Dates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField 
                            label="Start Date" 
                            id="start_date_1" 
                            value={startDate1} 
                            onChange={e => setStartDate1(e.target.value)} 
                            type="date" 
                        />
                        <FormField 
                            label="End Date" 
                            id="end_date_1" 
                            value={endDate1} 
                            onChange={e => setEndDate1(e.target.value)} 
                            type="date" 
                        />
                    </div>
                    <ResultDisplay label="Total Duration" value={dayDifference} unit="days" />
                </div>

                <hr className="border-secondary dark:border-gray-600" />

                {/* Task 2: Calculate Future Date */}
                <div>
                    <h3 className="font-semibold text-primary dark:text-blue-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        2. Calculate Target Date
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField 
                            label="Start Date" 
                            id="start_date_2" 
                            value={startDate2} 
                            onChange={e => setStartDate2(e.target.value)} 
                            type="date" 
                        />
                        <FormField 
                            label="Duration (Add Days)" 
                            id="duration_days" 
                            value={durationDays} 
                            onChange={e => setDurationDays(e.target.value)} 
                            unit="days" 
                            type="number"
                        />
                    </div>
                    <ResultDisplay label="Tentative End Date" value={calculatedEndDate} />
                </div>
            </div>
        </CollapsibleCard>
    );
};
