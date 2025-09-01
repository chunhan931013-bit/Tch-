
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { LungIcon } from './Icons';

export const HemoCalculators: React.FC = () => {
    // RAP
    const [ivcDiameter, setIvcDiameter] = useState('');
    const [ivcCollapse, setIvcCollapse] = useState('gt50');

    // mPAP
    const [spap, setSpap] = useState('');
    const [dpap, setDpap] = useState('');
    
    const rap = useMemo(() => {
        const diam = parseFloat(ivcDiameter);
        if (isNaN(diam)) return '-';

        const collapses = ivcCollapse === 'gt50';
        if (diam <= 2.1 && collapses) return '3 (0-5)';
        if (diam > 2.1 && collapses) return '8 (5-10)';
        if (diam <= 2.1 && !collapses) return '8 (5-10)';
        if (diam > 2.1 && !collapses) return '15 (10-20)';
        return '-';
    }, [ivcDiameter, ivcCollapse]);

    const mpap = useMemo(() => {
        const s = parseFloat(spap);
        const d = parseFloat(dpap);
        if (s > 0 && d > 0 && s > d) {
            return ((s + 2 * d) / 3).toFixed(1);
        }
        return '-';
    }, [spap, dpap]);

    return (
        <CollapsibleCard title="Hemodynamics" icon={<LungIcon />}>
            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">RAP from IVC</h3>
            <FormField label="IVC Diameter" id="ivc_diam" value={ivcDiameter} onChange={e => setIvcDiameter(e.target.value)} unit="cm" />
            <FormField
                label="IVC Collapse (sniff test)"
                id="ivc_collapse"
                value={ivcCollapse}
                onChange={e => setIvcCollapse(e.target.value)}
                type="select"
                options={[
                    { value: 'gt50', label: '> 50%' },
                    { value: 'lt50', label: '< 50%' },
                ]}
            />
            <ResultDisplay label="Est. RAP" value={rap} unit="mmHg" />
            
            <hr className="my-4 border-secondary-dark dark:border-gray-600" />

            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">Mean PAP</h3>
            <FormField label="Systolic PAP" id="spap" value={spap} onChange={e => setSpap(e.target.value)} unit="mmHg" />
            <FormField label="Diastolic PAP" id="dpap" value={dpap} onChange={e => setDpap(e.target.value)} unit="mmHg" />
            <ResultDisplay label="mPAP" value={mpap} unit="mmHg" formula="(sPAP + 2*dPAP) / 3" />
        </CollapsibleCard>
    );
};
