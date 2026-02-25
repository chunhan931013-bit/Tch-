
import React from 'react';
import { CalculatorCard } from './CalculatorCard';
import { FormField } from './FormField';
import { ResultDisplay } from './ResultDisplay';
import { BodyIcon } from './Icons';

interface PatientDataProps {
  height: string;
  setHeight: (val: string) => void;
  weight: string;
  setWeight: (val: string) => void;
  age: string;
  setAge: (val: string) => void;
  serumCreatinine: string;
  setSerumCreatinine: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  bmi: string;
  bsa: string;
  bmiInterpretation: string;
  bmiColorClass: string;
  ibw: string;
  abw: string;
}

export const PatientData: React.FC<PatientDataProps> = ({
  height, setHeight,
  weight, setWeight,
  age, setAge,
  serumCreatinine, setSerumCreatinine,
  gender, setGender,
  bmi, bsa, bmiInterpretation, bmiColorClass,
  ibw, abw,
}) => {
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <CalculatorCard title="Patient Data" icon={<BodyIcon />}>
      <FormField label="Height" id="height" value={height} onChange={e => setHeight(e.target.value)} unit="cm" />
      <FormField label="Weight (Actual)" id="weight" value={weight} onChange={e => setWeight(e.target.value)} unit="kg" />
      <FormField label="Age" id="age" value={age} onChange={e => setAge(e.target.value)} unit="yrs" />
      <FormField label="Serum Creatinine" id="scr" value={serumCreatinine} onChange={e => setSerumCreatinine(e.target.value)} unit="umol/L" step={1}/>
      <FormField label="Gender" id="gender" value={gender} onChange={e => setGender(e.target.value)} type="select" options={genderOptions} />
      
      {!gender && (height || weight) && (
        <p className="text-xs text-danger mt-1 font-medium animate-pulse">
          * Please select gender for IBW/ABW calculations
        </p>
      )}

      <hr className="my-4 border-secondary-dark dark:border-gray-600" />
      
      <ResultDisplay label="BMI" value={bmi} unit="kg/m²" interpretation={bmiInterpretation} colorClass={bmiColorClass} formula="weight (kg) / [height (m)]²" />
      <ResultDisplay label="BSA (Mosteller)" value={bsa} unit="m²" formula="√([height(cm) * weight(kg)] / 3600)" />
      <ResultDisplay label="Ideal Body Weight" value={ibw} unit="kg" formula="Devine Formula" />
      {abw !== '-' && (
        <div className="mt-2">
          <ResultDisplay label="Adjusted Body Weight" value={abw} unit="kg" formula="IBW + 0.4 * (Actual - IBW)" />
          <div className="mt-2 p-2 bg-warning/10 border-l-4 border-warning rounded text-xs text-warning-dark dark:text-warning font-medium">
            ⚠️ Patient is above Ideal Body Weight. Consider using Adjusted Body Weight for medication dosing and renal calculations.
          </div>
        </div>
      )}
    </CalculatorCard>
  );
};
