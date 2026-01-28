
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { UltrasoundIcon } from './Icons';
import { ResultDisplay } from './ResultDisplay';
import { FormField } from './FormField';

// Fix: Define an interface for a lung zone's state to provide strong typing.
interface ZoneState {
  aLine: boolean;
  bLine: boolean;
  sliding: boolean;
  shred: boolean;
}

const initialZoneState: ZoneState = { aLine: true, bLine: false, sliding: true, shred: false };
const ZONES = ['R1', 'R2', 'R3', 'R4', 'L1', 'L2', 'L3', 'L4'];

const initialEffusionState = {
  present: 'absent',
  location: { anterior: false, lateral: false, posterior: false },
  deepestPool: '',
  echogenicity: 'anechoic',
  septations: 'no',
  diaphragmaticNodules: 'no',
  pleuralThickness: '',
  // Volume estimation params
  calcH: '', // Lateral height (cm)
  calcD: '', // Diaphragm-lung distance (cm)
  calcC: '', // Chest wall-lung distance (cm)
};

const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <label className="flex items-center space-x-2 cursor-pointer text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="rounded text-primary focus:ring-primary" />
      <span>{label}</span>
    </label>
);

const PleuralEffusionDiagram: React.FC = () => (
    <div className="flex flex-col items-center my-4">
        <svg viewBox="0 0 300 200" className="w-full max-w-xs h-auto border border-gray-200 dark:border-gray-700 rounded bg-black">
            {/* Ultrasound Sector */}
            <defs>
                <mask id="sectorMask">
                     <path d="M150 0 L300 200 H0 Z" fill="white"/>
                </mask>
            </defs>
            
            {/* Background (Tissue) */}
            <rect width="300" height="200" fill="#333" />
            
            {/* Chest Wall (Top) */}
            <rect x="0" y="0" width="300" height="20" fill="#555" />
            <text x="220" y="15" fill="white" fontSize="10">Lateral Chest Wall</text>

            {/* Pleural Fluid (Anechoic) */}
            <path d="M50 40 Q150 220 250 150 L250 40 Z" fill="black" />

            {/* Collapsed Lung */}
            <path d="M50 40 Q100 120 180 120 Q120 60 50 40" fill="#777" />
            <text x="60" y="100" fill="white" fontSize="10">Collapsed Lung</text>

            {/* Diaphragm */}
            <path d="M180 120 Q240 140 280 180" stroke="#aaa" strokeWidth="3" fill="none"/>
            <text x="240" y="130" fill="white" fontSize="10">Diaphragm</text>
            
            {/* Measurement Lines */}
            
            {/* C: Chest wall to Lung */}
            <line x1="120" y1="20" x2="120" y2="90" stroke="white" strokeWidth="2" />
            <text x="125" y="60" fill="white" fontSize="14" fontWeight="bold">C</text>

            {/* H: Lateral Height (Simulated as width of pocket here for schematic) */}
            <line x1="20" y1="30" x2="280" y2="30" stroke="white" strokeWidth="2" />
            <text x="280" y="25" fill="white" fontSize="14" fontWeight="bold">H</text>
            
             {/* D: Diaphragm to Lung */}
             <line x1="180" y1="120" x2="250" y2="150" stroke="white" strokeWidth="2" />
             <text x="210" y="150" fill="white" fontSize="14" fontWeight="bold">D</text>

        </svg>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center italic px-2">
            Fig 1: H = Lateral height, D = Diaphragm to Lung, C = Chest wall to Lung
        </p>
    </div>
);

export const LungUltrasound: React.FC = () => {
    const [zones, setZones] = useState<Record<string, ZoneState>>(
        ZONES.reduce((acc, zone) => ({ ...acc, [zone]: { ...initialZoneState } }), {})
    );

    const [pleuralEffusion, setPleuralEffusion] = useState({
      right: { ...initialEffusionState },
      left: { ...initialEffusionState },
    });

    const handleZoneChange = (zone: string, field: keyof ZoneState) => {
        setZones(prev => ({
            ...prev,
            [zone]: { ...prev[zone], [field]: !prev[zone][field] }
        }));
    };

    const handleEffusionChange = (side: 'right' | 'left', field: string, value: any) => {
        setPleuralEffusion(prev => ({
            ...prev,
            [side]: { ...prev[side], [field]: value }
        }));
    };
    
    const duetsScores = useMemo(() => {
        const calculateSideScore = (side: 'right' | 'left') => {
            const effusion = pleuralEffusion[side];
            if (effusion.present !== 'present') {
                return { score: null, interpretation: '' };
            }

            let score = 0;
            const adjacentZone = side === 'right' ? zones['R4'] : zones['L4'];

            // Pleural Thickness (>2mm or 0.2cm) = 2 points
            if (parseFloat(effusion.pleuralThickness) > 0.2) {
                score += 2;
            }
            
            // Echogenic effusion = 1 point
            if (effusion.echogenicity !== 'anechoic') {
                score += 1;
            }

            // Diaphragmatic nodules = 3 points
            if (effusion.diaphragmaticNodules === 'yes') {
                score += 3;
            }
            
            // Adjacent B-lines or consolidation = 1 point
            if (adjacentZone && (adjacentZone.bLine || adjacentZone.shred)) {
                score += 1;
            }

            let interpretation = '';
            if (score <= 1) {
                interpretation = 'Suggestive of transudate.';
            } else {
                interpretation = 'Suggestive of exudate.';
            }

            return { score, interpretation };
        };

        return {
            right: calculateSideScore('right'),
            left: calculateSideScore('left'),
        };
    }, [pleuralEffusion, zones]);


    const interpretation = useMemo(() => {
        let findings = [];
        
        // Lung Parenchyma Interpretation
        const bLineZones = (Object.values(zones) as ZoneState[]).filter(z => z.bLine).length;
        if (bLineZones >= 2) {
            findings.push('Multiple B-lines suggest interstitial syndrome (e.g., pulmonary edema, pneumonitis, ARDS).');
        }

        const consolidationZones = (Object.values(zones) as ZoneState[]).filter(z => z.shred).length;
        if (consolidationZones > 0) {
            findings.push('Shred sign indicates lung consolidation.');
        }

        const pneumothoraxSuspectZones = (Object.values(zones) as ZoneState[]).filter(z => !z.sliding).length;
        if (pneumothoraxSuspectZones > 0) {
            findings.push('Absent lung sliding is suspicious for pneumothorax. Confirmation with a "lung point" is recommended.');
        }

        if (bLineZones === 0 && consolidationZones === 0 && pneumothoraxSuspectZones === 0) {
            findings.push('Normal lung aeration pattern (A-lines with sliding).');
        }

        // Pleural Effusion Interpretation
        (['right', 'left'] as const).forEach(side => {
            const effusion = pleuralEffusion[side];
            if (effusion.present === 'present') {
                let effusionSummary = `A ${side} pleural effusion is noted.`;
                if (effusion.echogenicity !== 'anechoic' || effusion.septations === 'yes') {
                    effusionSummary += ' Complex features (echogenic, septated) may suggest an exudate (e.g., parapneumonic effusion, empyema, hemothorax).';
                } else {
                    effusionSummary += ' Anechoic appearance is consistent with a simple effusion or transudate.';
                }
                if (effusion.diaphragmaticNodules === 'yes' || parseFloat(effusion.pleuralThickness) > 1) {
                    effusionSummary += ' Pleural nodules or thickening (>1 cm) are concerning and raise suspicion for malignancy.';
                }
                findings.push(effusionSummary);
            }
        });

        return findings;

    }, [zones, pleuralEffusion]);

    return (
        <CollapsibleCard title="Lung Ultrasound Module" icon={<UltrasoundIcon className="h-8 w-8" />} initialCollapsed={true}>
            <div className="space-y-4">
                <CollapsibleCard title="Lung Ultrasound Findings" icon={<UltrasoundIcon className="h-6 w-6" />} initialCollapsed={false}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        {ZONES.map(zone => (
                            <div key={zone} className="p-3 bg-secondary-light dark:bg-gray-800 rounded-lg">
                                <h4 className="font-bold text-center mb-2 text-primary dark:text-blue-400">{zone}</h4>
                                <div className="space-y-2">
                                    <Checkbox label="A-line" checked={zones[zone].aLine} onChange={() => handleZoneChange(zone, 'aLine')} />
                                    <Checkbox label="B-line" checked={zones[zone].bLine} onChange={() => handleZoneChange(zone, 'bLine')} />
                                    <Checkbox label="Sliding" checked={zones[zone].sliding} onChange={() => handleZoneChange(zone, 'sliding')} />
                                    <Checkbox label="Shred" checked={zones[zone].shred} onChange={() => handleZoneChange(zone, 'shred')} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4">
                    {(['Right', 'Left'] as const).map(side => {
                        const sideKey = side.toLowerCase() as 'right' | 'left';
                        const effusionData = pleuralEffusion[sideKey];
                        const duetsResult = duetsScores[sideKey];

                        // Volume Calculation Logic
                        const h = parseFloat(effusionData.calcH);
                        const d = parseFloat(effusionData.calcD);
                        const c = parseFloat(effusionData.calcC);
                        
                        let volEst1 = '-';
                        let volEst2 = '-';
                        
                        if (!isNaN(h) && !isNaN(d)) {
                            // Formula: V = 70 * (H + D)
                            volEst1 = ((h + d) * 70).toFixed(0);
                        }
                        if (!isNaN(c)) {
                            // Balik Formula: V = 20 * Sep (mm)
                            // Input is cm, so C * 10 * 20 = C * 200
                            volEst2 = (c * 200).toFixed(0);
                        }

                        return (
                            <CollapsibleCard key={side} title={`${side} Pleural Effusion`} icon={<UltrasoundIcon className="h-6 w-6" />} initialCollapsed={false}>
                                <FormField 
                                    label="Presence" id={`${sideKey}_effusion_present`} value={effusionData.present} 
                                    onChange={e => handleEffusionChange(sideKey, 'present', e.target.value)}
                                    type="select" options={[{value: 'absent', label: 'Absent'}, {value: 'present', label: 'Present'}]} 
                                />

                                {effusionData.present === 'present' && (
                                    <div className="animate-fade-in mt-4 space-y-4">
                                        <h4 className="font-semibold text-primary dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Characteristics</h4>
                                        <FormField label="Deepest Pool" id={`${sideKey}_depth`} value={effusionData.deepestPool} onChange={e => handleEffusionChange(sideKey, 'deepestPool', e.target.value)} unit="cm" step={0.1} />
                                        <FormField label="Echogenicity" id={`${sideKey}_echo`} value={effusionData.echogenicity} onChange={e => handleEffusionChange(sideKey, 'echogenicity', e.target.value)} type="select" options={[{value: 'anechoic', label: 'Anechoic'}, {value: 'complex_non_septated', label: 'Complex Non-Septated'}, {value: 'complex_septated', label: 'Complex Septated'}, {value: 'echogenic', label: 'Homogeneously Echogenic'}]} />
                                        <FormField label="Septations" id={`${sideKey}_sept`} value={effusionData.septations} onChange={e => handleEffusionChange(sideKey, 'septations', e.target.value)} type="select" options={[{value: 'no', label: 'No'}, {value: 'yes', label: 'Yes'}]} />
                                        <FormField label="Diaphragmatic Nodules" id={`${sideKey}_nod`} value={effusionData.diaphragmaticNodules} onChange={e => handleEffusionChange(sideKey, 'diaphragmaticNodules', e.target.value)} type="select" options={[{value: 'no', label: 'No'}, {value: 'yes', label: 'Yes'}]} />
                                        <FormField label="Pleural Thickness" id={`${sideKey}_thick`} value={effusionData.pleuralThickness} onChange={e => handleEffusionChange(sideKey, 'pleuralThickness', e.target.value)} unit="cm" step={0.1} placeholder=">0.2cm is significant"/>
                                    
                                        <hr className="my-4 border-secondary-dark dark:border-gray-600" />
                                        
                                        <h4 className="font-semibold text-primary dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Volume Estimation</h4>
                                        <PleuralEffusionDiagram />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <FormField label="Lateral Height (H)" id={`${sideKey}_h`} value={effusionData.calcH} onChange={e => handleEffusionChange(sideKey, 'calcH', e.target.value)} unit="cm" />
                                            <FormField label="Diaphragm-Lung (D)" id={`${sideKey}_d`} value={effusionData.calcD} onChange={e => handleEffusionChange(sideKey, 'calcD', e.target.value)} unit="cm" />
                                            <FormField label="Chest-Lung (C)" id={`${sideKey}_c`} value={effusionData.calcC} onChange={e => handleEffusionChange(sideKey, 'calcC', e.target.value)} unit="cm" />
                                        </div>
                                        <div className="bg-secondary-light dark:bg-gray-800 p-3 rounded-lg">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Est. Volume (Dimension Method):</span>
                                                <span className="font-bold text-primary dark:text-blue-400">{volEst1} mL</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">Formula: 70 * (H + D)</p>

                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Est. Volume (Balik Method):</span>
                                                <span className="font-bold text-primary dark:text-blue-400">{volEst2} mL</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Formula: 20 * C (in mm)</p>
                                        </div>

                                        <hr className="my-4 border-secondary-dark dark:border-gray-600" />
                                        
                                        <h4 className="font-semibold text-primary dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">DUETS Score</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2 mb-2">
                                            Differentiation of Transudate vs Exudate. Checks adjacent {side === 'Right' ? 'R4' : 'L4'} zone.
                                        </p>
                                        <ResultDisplay
                                            label="Score"
                                            value={duetsResult.score ?? '-'}
                                            interpretation={duetsResult.interpretation}
                                        />
                                    </div>
                                )}
                            </CollapsibleCard>
                        )
                    })}
                </div>

                <CollapsibleCard title="Clinical Interpretation" icon={<UltrasoundIcon className="h-6 w-6" />} initialCollapsed={false}>
                    {interpretation.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {interpretation.map((finding, index) => <li key={index}>{finding}</li>)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Enter findings above to generate an interpretation.</p>
                    )}
                </CollapsibleCard>
            </div>
        </CollapsibleCard>
    );
};
