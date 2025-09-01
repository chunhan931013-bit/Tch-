
import React, { useState, useMemo } from 'react';
import { CollapsibleCard } from './CollapsibleCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { HeartIcon } from './Icons';

interface EchoCalculatorsProps {
    bsa: string;
}

export const EchoCalculators: React.FC<EchoCalculatorsProps> = ({ bsa }) => {
    // Simpson's
    const [edv, setEdv] = useState('');
    const [esv, setEsv] = useState('');
    // Teicholz
    const [lvidd, setLvidd] = useState('');
    const [lvids, setLvids] = useState('');
    // LVOT
    const [lvotVti, setLvotVti] = useState('');
    const [lvotDiameter, setLvotDiameter] = useState('');
    const [heartRate, setHeartRate] = useState('');
    // EPSS
    const [epss, setEpss] = useState('');
    // Other metrics
    const [mapse, setMapse] = useState('');
    const [tapse, setTapse] = useState('');

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
        return { interpretation: '-', colorClass: '' };
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
                    interpretation: 'Suggests reduced RV systolic function (RV dysfunction)',
                    colorClass: 'text-warning',
                };
            }
        }
        return { interpretation: '', colorClass: '' };
    }, [tapse]);

    return (
        <CollapsibleCard title="Echocardiography" icon={<HeartIcon />}>
            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">LVEF (Simpson)</h3>
            <FormField label="EDV" id="edv" value={edv} onChange={e => setEdv(e.target.value)} unit="mL" />
            <FormField label="ESV" id="esv" value={esv} onChange={e => setEsv(e.target.value)} unit="mL" />
            <ResultDisplay label="LVEF" value={lvefSimpson} unit="%" formula="[(EDV-ESV)/EDV] * 100"/>

            <hr className="my-4 border-secondary-dark dark:border-gray-600" />
            
            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">LVEF (Teicholz)</h3>
            <FormField label="LVIDd" id="lvidd" value={lvidd} onChange={e => setLvidd(e.target.value)} unit="cm" />
            <FormField label="LVIDs" id="lvids" value={lvids} onChange={e => setLvids(e.target.value)} unit="cm" />
            <ResultDisplay label="LVEF" value={lvefTeicholz} unit="%" formula="Using Teicholz formula"/>

            <hr className="my-4 border-secondary-dark dark:border-gray-600" />

            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">Cardiac Output & Index (LVOT)</h3>
            <FormField label="LVOT VTI" id="lvot_vti" value={lvotVti} onChange={e => setLvotVti(e.target.value)} unit="cm" />
            <FormField label="LVOT Diameter" id="lvot_diameter" value={lvotDiameter} onChange={e => setLvotDiameter(e.target.value)} unit="cm" step={0.1} />
            <FormField label="Heart Rate" id="hr" value={heartRate} onChange={e => setHeartRate(e.target.value)} unit="bpm" />
            <div className="mb-4 p-3 bg-secondary-light dark:bg-gray-800 rounded-md flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BSA (from Patient Data)</span>
                <span className="font-bold text-text-light dark:text-text-dark">{bsa || '-'} m²</span>
            </div>
            <ResultDisplay label="LVOT Area" value={lvotCalculations.lvotArea} unit="cm²" formula="π * (diameter/2)²" />
            <ResultDisplay label="Stroke Volume" value={lvotCalculations.strokeVolume} unit="mL" formula="LVOT Area * LVOT VTI" />
            <ResultDisplay label="Cardiac Output" value={lvotCalculations.cardiacOutput} unit="L/min" formula="SV * HR / 1000" />
            <ResultDisplay label="Cardiac Index" value={lvotCalculations.cardiacIndex} unit="L/min/m²" formula="CO / BSA" />

            <hr className="my-4 border-secondary-dark dark:border-gray-600" />

            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">EPSS</h3>
            <FormField label="E-Point Septal Separation" id="epss" value={epss} onChange={e => setEpss(e.target.value)} unit="mm" />
            <ResultDisplay label="Interpretation" value={epssResult.interpretation} colorClass={epssResult.colorClass} />
            
            <hr className="my-4 border-secondary-dark dark:border-gray-600" />

            <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">Other Metrics</h3>
            <FormField label="MAPSE" id="mapse" value={mapse} onChange={e => setMapse(e.target.value)} unit="cm" step={0.1} />
            {mapseResult.interpretation && <ResultDisplay label="Interpretation" value={mapseResult.interpretation} colorClass={mapseResult.colorClass} />}
            <div className="mb-4"></div>
            <FormField label="TAPSE" id="tapse" value={tapse} onChange={e => setTapse(e.target.value)} unit="cm" step={0.1} />
            {tapseResult.interpretation && <ResultDisplay label="Interpretation" value={tapseResult.interpretation} colorClass={tapseResult.colorClass} />}

        </CollapsibleCard>
    );
};
