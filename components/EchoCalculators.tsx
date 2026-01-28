
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { HeartIcon, MetricsIcon } from './Icons';

interface EchoCalculatorsProps {
    bsa: string;
}

const DSignDiagram = () => (
    <div className="flex flex-col items-center my-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">LV Short Axis View (Mid-Papillary Level)</h5>
        <svg viewBox="0 0 400 220" className="w-full h-auto rounded select-none bg-black border border-gray-800">
            <defs>
                <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
                 <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrowhead-start-green" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="10 0, 0 3.5, 10 7" fill="#10b981" />
                </marker>
                 <marker id="arrowhead-start-blue" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="10 0, 0 3.5, 10 7" fill="#3b82f6" />
                </marker>
            </defs>

            {/* --- LEFT PANEL: NORMAL --- */}
            <g transform="translate(0, 0)">
                <rect x="0" y="0" width="200" height="30" fill="#1f2937" fillOpacity="0.8"/>
                <text x="100" y="20" fill="#10b981" textAnchor="middle" fontSize="13" fontWeight="bold">Normal (EI ≈ 1.0)</text>
                
                {/* RV Cavity */}
                <path d="M 55 145 Q 30 120 55 95 Q 65 120 55 145" fill="black" stroke="#4b5563" strokeWidth="6" strokeLinecap="round" />
                <text x="35" y="125" fill="#9ca3af" fontSize="10" fontWeight="bold">RV</text>

                {/* LV Myocardium (Circle) */}
                <circle cx="110" cy="120" r="38" fill="none" stroke="#4b5563" strokeWidth="8" />
                {/* LV Cavity */}
                <circle cx="110" cy="120" r="34" fill="black" />
                
                {/* Papillary Muscles */}
                <circle cx="130" cy="135" r="5" fill="#4b5563" opacity="0.6"/>
                <circle cx="90" cy="135" r="5" fill="#4b5563" opacity="0.6"/>

                {/* D1: Septal-Lateral (Horizontal) */}
                <line x1="76" y1="120" x2="144" y2="120" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-start-green)" />
                <text x="110" y="115" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">D1</text>
                
                {/* D2: Ant-Inf (Vertical) */}
                <line x1="110" y1="86" x2="110" y2="154" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowhead-blue)" markerStart="url(#arrowhead-start-blue)"/>
                <text x="115" y="100" fill="#3b82f6" fontSize="11" fontWeight="bold">D2</text>
                
                <text x="100" y="180" fill="#9ca3af" textAnchor="middle" fontSize="10">Circular LV</text>
            </g>
            
            {/* Divider */}
            <line x1="200" y1="40" x2="200" y2="190" stroke="#374151" strokeWidth="1" />

            {/* --- RIGHT PANEL: ABNORMAL --- */}
            <g transform="translate(200, 0)">
                <rect x="0" y="0" width="200" height="30" fill="#1f2937" fillOpacity="0.8"/>
                <text x="100" y="20" fill="#ef4444" textAnchor="middle" fontSize="13" fontWeight="bold">RV Overload (EI &gt; 1.0)</text>
                
                {/* Dilated RV on Left */}
                <path d="M 70 80 Q 20 120 70 160" fill="none" stroke="#4b5563" strokeWidth="8" strokeLinecap="round"/>
                <text x="40" y="125" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">RV</text>
                
                {/* D-Shaped LV */}
                <path d="M 80 85 L 80 155 C 145 155 145 85 80 85 Z" fill="none" stroke="#4b5563" strokeWidth="8" strokeLinejoin="round" />
                <path d="M 84 89 L 84 151 C 135 151 135 89 84 89 Z" fill="black" />
                
                {/* Septum Highlight */}
                <line x1="80" y1="85" x2="80" y2="155" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.7" />

                {/* D1: Septal-Lateral (Horizontal) - SHORTENED */}
                {/* Moves from Septum (Left) to Lateral Wall (Right) */}
                <line x1="84" y1="120" x2="132" y2="120" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-start-green)" />
                {/* Label moved below to avoid overlap */}
                <text x="108" y="135" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">D1 (Perp)</text>
                
                {/* D2: Ant-Inf (Vertical) - PRESERVED/LONGER */}
                <line x1="110" y1="89" x2="110" y2="151" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowhead-blue)" markerStart="url(#arrowhead-start-blue)" />
                {/* Label moved to side */}
                <text x="116" y="105" fill="#3b82f6" fontSize="11" fontWeight="bold">D2 (Para)</text>
                
                <text x="100" y="180" fill="#9ca3af" textAnchor="middle" fontSize="10">D-Shaped LV</text>
            </g>

            {/* Footer */}
            <text x="200" y="210" fill="#e5e7eb" textAnchor="middle" fontSize="11" fontWeight="bold">EI = D2 (Parallel) / D1 (Perpendicular)</text>
        </svg>
    </div>
);


export const EchoCalculators: React.FC<EchoCalculatorsProps> = ({ bsa }) => {
    // Simpson's
    const [edv, setEdv] = useState('');
    const [esv, setEsv] = useState('');
    // Teicholz
    const [lvidd, setLvidd] = useState('');
    const [lvids, setLvids] = useState('');
    // AutoEF
    const [autoEf, setAutoEf] = useState('');
    // LVOT
    const [lvotVti, setLvotVti] = useState('');
    const [lvotDiameter, setLvotDiameter] = useState('');
    const [heartRate, setHeartRate] = useState('');
    // EPSS
    const [epss, setEpss] = useState('');
    // Other metrics
    const [mapse, setMapse] = useState('');
    const [tapse, setTapse] = useState('');
    // Eccentricity Index
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    
    // New: Others
    const [peSize, setPeSize] = useState('none');
    const [thrombus, setThrombus] = useState('absent');
    const [thrombusDesc, setThrombusDesc] = useState('');

    const lvefSimpson = useMemo(() => {
        const edvNum = parseFloat(edv);
        const esvNum = parseFloat(esv);
        if (edvNum > 0 && esvNum > 0 && edvNum > esvNum) {
            return (((edvNum - esvNum) / edvNum) * 100).toFixed(1);
        }
        return '-';
    }, [edv, esv]);

    const lvefTeicholz = useMemo(() => {
        const lviddNum = parseFloat(lvidd);
        const lvidsNum = parseFloat(lvids);
        if (lviddNum > 0 && lvidsNum > 0 && lviddNum > lvidsNum) {
            const edvT = (7 * Math.pow(lviddNum, 3)) / (2.4 + lviddNum);
            const esvT = (7 * Math.pow(lvidsNum, 3)) / (2.4 + lvidsNum);
            if (edvT > 0) {
                 return (((edvT - esvT) / edvT) * 100).toFixed(1);
            }
        }
        return '-';
    }, [lvidd, lvids]);

    const autoEfResult = useMemo(() => {
        const ef = parseFloat(autoEf);
        if (!isNaN(ef) && ef > 0) {
            let interp = '';
            let color = '';
            // Simplified classification for rapid bedside assessment
            if (ef >= 50) {
                interp = 'Preserved';
                color = 'text-success';
            } else if (ef >= 41) {
                interp = 'Mildly Reduced';
                color = 'text-warning';
            } else if (ef >= 30) {
                interp = 'Moderately Reduced';
                color = 'text-warning';
            } else {
                interp = 'Severely Reduced';
                color = 'text-danger';
            }
            return { interpretation: interp, colorClass: color };
        }
        return { interpretation: '', colorClass: '' };
    }, [autoEf]);

    const lvotCalculations = useMemo(() => {
        const vti = parseFloat(lvotVti);
        const diameter = parseFloat(lvotDiameter);
        const hr = parseFloat(heartRate);
        const bsaVal = parseFloat(bsa);

        let area = NaN;
        let strokeVolume = NaN;
        let cardiacOutputValue = NaN;
        let cardiacIndexValue = NaN;

        if (vti > 0 && diameter > 0) {
            const radius = diameter / 2;
            area = Math.PI * Math.pow(radius, 2);
            strokeVolume = area * vti;

            if (hr > 0) {
                cardiacOutputValue = (strokeVolume * hr) / 1000;
                if (bsaVal > 0) {
                    cardiacIndexValue = cardiacOutputValue / bsaVal;
                }
            }
        }

        return {
            lvotArea: !isNaN(area) ? area.toFixed(2) : '-',
            strokeVolume: !isNaN(strokeVolume) ? strokeVolume.toFixed(1) : '-',
            cardiacOutput: !isNaN(cardiacOutputValue) ? cardiacOutputValue.toFixed(2) : '-',
            cardiacIndex: !isNaN(cardiacIndexValue) ? cardiacIndexValue.toFixed(2) : '-',
        };
    }, [lvotVti, lvotDiameter, heartRate, bsa]);

    const epssResult = useMemo(() => {
        const epssNum = parseFloat(epss);
        if (epssNum > 0) {
            if (epssNum < 7) {
                return {
                    interpretation: 'Suggests normal LVEF',
                    colorClass: 'text-success',
                };
            } else {
                return {
                    interpretation: 'Suggests reduced LVEF',
                    colorClass: 'text-warning',
                };
            }
        }
        return { interpretation: '', colorClass: '' };
    }, [epss]);

    const mapseResult = useMemo(() => {
        const mapseNum = parseFloat(mapse);
        if (mapseNum > 0) {
            if (mapseNum >= 1.0) {
                return {
                    interpretation: 'Suggests normal LV longitudinal function',
                    colorClass: 'text-success',
                };
            } else {
                return {
                    interpretation: 'Suggests reduced LV longitudinal function',
                    colorClass: 'text-warning',
                };
            }
        }
        return { interpretation: '', colorClass: '' };
    }, [mapse]);

    const tapseResult = useMemo(() => {
        const tapseNum = parseFloat(tapse);
        if (tapseNum > 0) {
            if (tapseNum >= 1.7) {
                return {
                    interpretation: 'Suggests normal RV systolic function',
                    colorClass: 'text-success',
                };
            } else {
                return {
                    interpretation: 'Suggests reduced RV systolic function',
                    colorClass: 'text-warning',
                };
            }
        }
        return { interpretation: '', colorClass: '' };
    }, [tapse]);

    const eiResult = useMemo(() => {
        const d1Num = parseFloat(d1);
        const d2Num = parseFloat(d2);
        if (d1Num > 0 && d2Num > 0) {
            const val = d2Num / d1Num;
            let interp = '';
            let color = '';
            if (val > 1.1) {
                interp = 'Suggests RV Overload (D-shaped LV)';
                color = 'text-warning';
            } else {
                interp = 'Normal LV geometry';
                color = 'text-success';
            }
            return { value: val.toFixed(2), interpretation: interp, colorClass: color };
        }
        return { value: '-', interpretation: '', colorClass: '' };
    }, [d1, d2]);

    const SubIcon = () => <HeartIcon className="h-5 w-5" />;

    return (
        <CollapsibleCard title="Echocardiography" icon={<HeartIcon />}>
            <div className="space-y-4">
                {/* LV Systolic Assessment */}
                <CollapsibleCard title="LV Systolic Assessment" icon={<SubIcon />} initialCollapsed={false}>
                    {/* Simpson */}
                    <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">LVEF (Simpson's Biplane)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="EDV" id="edv" value={edv} onChange={e => setEdv(e.target.value)} unit="mL" />
                        <FormField label="ESV" id="esv" value={esv} onChange={e => setEsv(e.target.value)} unit="mL" />
                    </div>
                    <ResultDisplay label="LVEF" value={lvefSimpson} unit="%" formula="[(EDV-ESV)/EDV] * 100"/>
                    
                    <hr className="my-4 border-secondary-dark dark:border-gray-600" />
                    
                    {/* Teichholz */}
                    <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">LVEF (Teichholz)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="LVIDd" id="lvidd" value={lvidd} onChange={e => setLvidd(e.target.value)} unit="cm" />
                        <FormField label="LVIDs" id="lvids" value={lvids} onChange={e => setLvids(e.target.value)} unit="cm" />
                    </div>
                    <ResultDisplay label="LVEF" value={lvefTeicholz} unit="%" formula="Teichholz Formula"/>

                    <hr className="my-4 border-secondary-dark dark:border-gray-600" />
                    
                    {/* AutoEF */}
                    <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">AutoEF (Self Key In)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Global EF" id="auto_ef" value={autoEf} onChange={e => setAutoEf(e.target.value)} unit="%" placeholder="Machine value" />
                        {autoEfResult.interpretation && <ResultDisplay label="Classification" value={autoEfResult.interpretation} colorClass={autoEfResult.colorClass} />}
                    </div>

                    <hr className="my-4 border-secondary-dark dark:border-gray-600" />

                    {/* EPSS & MAPSE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">EPSS</h4>
                            <FormField label="E-Point Septal Separation" id="epss" value={epss} onChange={e => setEpss(e.target.value)} unit="mm" />
                            {epssResult.interpretation && <ResultDisplay label="Interpretation" value={epssResult.interpretation} colorClass={epssResult.colorClass} />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">MAPSE</h4>
                            <FormField label="Mitral Annular Plane Excursion" id="mapse" value={mapse} onChange={e => setMapse(e.target.value)} unit="cm" step={0.1} />
                            {mapseResult.interpretation && <ResultDisplay label="Interpretation" value={mapseResult.interpretation} colorClass={mapseResult.colorClass} />}
                        </div>
                    </div>
                </CollapsibleCard>

                {/* RV Systolic Assessment */}
                <CollapsibleCard title="RV Systolic Assessment" icon={<SubIcon />} initialCollapsed={true}>
                    <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">TAPSE</h4>
                    <FormField label="Tricuspid Annular Plane Excursion" id="tapse" value={tapse} onChange={e => setTapse(e.target.value)} unit="cm" step={0.1} />
                    {tapseResult.interpretation && <ResultDisplay label="Interpretation" value={tapseResult.interpretation} colorClass={tapseResult.colorClass} />}
                    
                    <hr className="my-4 border-secondary-dark dark:border-gray-600" />

                    <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">Eccentricity Index (EI)</h4>
                    <DSignDiagram />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="LV D1 (Perpendicular to Septum)" id="d1" value={d1} onChange={e => setD1(e.target.value)} unit="cm" placeholder="Short axis dimension" />
                        <FormField label="LV D2 (Parallel to Septum)" id="d2" value={d2} onChange={e => setD2(e.target.value)} unit="cm" placeholder="Long axis dimension" />
                    </div>
                    <ResultDisplay 
                        label="Eccentricity Index" 
                        value={eiResult.value} 
                        formula="LV D2 (Parallel) / LV D1 (Perpendicular)" 
                        interpretation={eiResult.interpretation}
                        colorClass={eiResult.colorClass}
                    />
                    
                    {/* Clinical Context Table */}
                    <div className="mt-4 overflow-x-auto">
                         <table className="min-w-full text-xs text-center border border-secondary dark:border-gray-600">
                             <thead className="bg-secondary dark:bg-gray-700 font-bold">
                                 <tr>
                                     <th className="p-2 border-r border-secondary-dark dark:border-gray-600">Phase</th>
                                     <th className="p-2 border-r border-secondary-dark dark:border-gray-600">Pressure Overload</th>
                                     <th className="p-2">Volume Overload</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-secondary dark:divide-gray-600">
                                 <tr>
                                     <td className="p-2 font-medium bg-secondary-light dark:bg-gray-800 border-r dark:border-gray-600">Systole</td>
                                     <td className="p-2 text-danger border-r dark:border-gray-600">D-Sign (EI &gt; 1.1)</td>
                                     <td className="p-2">Normal (EI ≤ 1.1)</td>
                                 </tr>
                                 <tr>
                                     <td className="p-2 font-medium bg-secondary-light dark:bg-gray-800 border-r dark:border-gray-600">Diastole</td>
                                     <td className="p-2 text-danger border-r dark:border-gray-600">D-Sign (EI &gt; 1.1)</td>
                                     <td className="p-2 text-danger">D-Sign (EI &gt; 1.1)</td>
                                 </tr>
                             </tbody>
                         </table>
                    </div>

                </CollapsibleCard>

                {/* Hemodynamic Assessment */}
                <CollapsibleCard title="Hemodynamic Assessment" icon={<MetricsIcon className="h-5 w-5"/>} initialCollapsed={true}>
                    <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">LVOT Doppler Calculations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="LVOT VTI" id="lvot_vti" value={lvotVti} onChange={e => setLvotVti(e.target.value)} unit="cm" />
                        <FormField label="LVOT Diameter" id="lvot_diameter" value={lvotDiameter} onChange={e => setLvotDiameter(e.target.value)} unit="cm" step={0.1} />
                        <FormField label="Heart Rate" id="hr" value={heartRate} onChange={e => setHeartRate(e.target.value)} unit="bpm" />
                        <div className="p-3 bg-secondary-light dark:bg-gray-800 rounded-md flex justify-between items-center h-fit mt-auto mb-4 md:mb-0">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BSA (from Patient Data)</span>
                            <span className="font-bold text-text-light dark:text-text-dark">{bsa || '-'} m²</span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultDisplay label="Stroke Volume" value={lvotCalculations.strokeVolume} unit="mL" formula="LVOT Area * VTI" />
                        <ResultDisplay label="Cardiac Output" value={lvotCalculations.cardiacOutput} unit="L/min" formula="SV * HR" />
                        <ResultDisplay label="Cardiac Index" value={lvotCalculations.cardiacIndex} unit="L/min/m²" formula="CO / BSA" />
                        <ResultDisplay label="LVOT Area" value={lvotCalculations.lvotArea} unit="cm²" />
                    </div>
                </CollapsibleCard>

                {/* Others */}
                <CollapsibleCard title="Others (Pericardial Effusion, Thrombus)" icon={<SubIcon />} initialCollapsed={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">Pericardial Effusion</h4>
                             <FormField 
                                label="Size" 
                                id="pe_size" 
                                value={peSize} 
                                onChange={e => setPeSize(e.target.value)} 
                                type="select"
                                options={[
                                    { value: 'none', label: 'None' },
                                    { value: 'trivial', label: 'Trivial (systole only)' },
                                    { value: 'small', label: 'Small (<10mm)' },
                                    { value: 'moderate', label: 'Moderate (10-20mm)' },
                                    { value: 'large', label: 'Large (>20mm)' },
                                    { value: 'tamponade', label: 'Tamponade Physiology' },
                                ]} 
                             />
                        </div>
                        <div>
                            <h4 className="font-semibold text-primary dark:text-blue-400 mb-2">Thrombus / Mass</h4>
                            <FormField 
                                label="Presence" 
                                id="thrombus" 
                                value={thrombus} 
                                onChange={e => setThrombus(e.target.value)} 
                                type="select"
                                options={[
                                    { value: 'absent', label: 'Absent' },
                                    { value: 'present', label: 'Present' },
                                    { value: 'suspected', label: 'Suspected' },
                                ]} 
                             />
                             {thrombus !== 'absent' && (
                                 <div className="animate-fade-in mt-2">
                                     <FormField 
                                        label="Description / Location" 
                                        id="thrombus_desc" 
                                        value={thrombusDesc} 
                                        onChange={e => setThrombusDesc(e.target.value)} 
                                        type="text"
                                        placeholder="e.g. 1.5cm x 2cm mobile mass in LV apex"
                                     />
                                 </div>
                             )}
                        </div>
                    </div>
                </CollapsibleCard>
            </div>
        </CollapsibleCard>
    );
};
