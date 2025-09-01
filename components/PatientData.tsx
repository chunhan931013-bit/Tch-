
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
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <CalculatorCard title="Patient Data" icon={<BodyIcon />}>
      <FormField label="Height" id="height" value={height} onChange={e => setHeight(e.target.value)} unit="cm" />
      <FormField label="Weight" id="weight" value={weight} onChange={e => setWeight(e.target.value)} unit="kg" />
      <FormField label="Age" id="age" value={age} onChange={e => setAge(e.target.value)} unit="yrs" />
      <FormField label="Serum Creatinine" id="scr" value={serumCreatinine} onChange={e => setSerumCreatinine(e.target.value)} unit="umol/L" step={1}/>
      <FormField label="Gender" id="gender" value={gender} onChange={e => setGender(e.target.value)} type="select" options={genderOptions} />
      
      <hr className="my-4 border-secondary-dark dark:border-gray-600" />
      
      <ResultDisplay label="BMI" value={bmi} unit="kg/m²" interpretation={bmiInterpretation} colorClass={bmiColorClass} formula="weight (kg) / [height (m)]²" />
      <ResultDisplay label="BSA (Mosteller)" value={bsa} unit="m²" formula="√([height(cm) * weight(kg)] / 3600)" />
      <ResultDisplay label="Ideal Body Weight" value={ibw} unit="kg" formula="Devine Formula" />
      {abw !== '-' && (
        <ResultDisplay label="Adjusted Body Weight" value={abw} unit="kg" formula="IBW + 0.4 * (Actual - IBW)" />
      )}
    </CalculatorCard>
  );
};
