
import React, { useState, useEffect, useMemo } from 'react';
import { PatientData } from './components/PatientData';
import { EchoCalculators } from './components/EchoCalculators';
import { HemoCalculators } from './components/HemoCalculators';
import { RenalCalculator } from './components/RenalCalculator';
import { EspenCalculator } from './components/EspenCalculator';
import { LungUltrasound } from './components/LungUltrasound';
import { VasopressorCalculator } from './components/VasopressorCalculator';
import { DayCalculator } from './components/DayCalculator';
import { SunIcon, MoonIcon, TrashIcon } from './components/Icons';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Lifted state for shared patient data
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [serumCreatinine, setSerumCreatinine] = useState('');
  const [gender, setGender] = useState('male');

  const { bmi, bsa, interpretation, colorClass, ibw, abw } = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const g = gender;

    let bmiValue = NaN;
    let bsaValue = NaN;
    let ibwValue = NaN;
    let abwValue = NaN;
    let interp = '';
    let color = '';

    if (h > 0 && w > 0) {
        const heightInMeters = h / 100;
        bmiValue = w / (heightInMeters * heightInMeters);
        bsaValue = Math.sqrt((h * w) / 3600);
        
        if (bmiValue < 18.5) {
            interp = 'Underweight';
            color = 'text-warning';
        } else if (bmiValue < 25) {
            interp = 'Normal weight';
            color = 'text-success';
        } else if (bmiValue < 30) {
            interp = 'Overweight';
            color = 'text-warning';
        } else {
            interp = 'Obese';
            color = 'text-danger';
        }

        // Ideal Body Weight (Devine Formula)
        const heightInInches = h / 2.54;
        if (heightInInches > 60) {
            const inchesOver5Feet = heightInInches - 60;
            if (g === 'male') {
                ibwValue = 50 + (2.3 * inchesOver5Feet);
            } else { // female
                ibwValue = 45.5 + (2.3 * inchesOver5Feet);
            }
        }

        // Adjusted Body Weight
        // Calculated if Actual Weight > Ideal Body Weight
        if (ibwValue > 0 && w > ibwValue) {
            abwValue = ibwValue + 0.4 * (w - ibwValue);
        }
    }
    
    return {
        bmi: !isNaN(bmiValue) ? bmiValue.toFixed(2) : '-',
        bsa: !isNaN(bsaValue) ? bsaValue.toFixed(2) : '-',
        interpretation: interp,
        colorClass: color,
        ibw: !isNaN(ibwValue) ? ibwValue.toFixed(1) : '-',
        abw: !isNaN(abwValue) ? abwValue.toFixed(1) : '-',
    };
  }, [height, weight, gender]);

  const handleClearAll = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setSerumCreatinine('');
    setGender('male');
    setClearKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen text-text-light dark:text-text-dark transition-colors duration-300 flex flex-col bg-background-light dark:bg-background-dark">
        <header className="bg-surface-light dark:bg-surface-dark shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
             <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary dark:text-blue-400">
                  Clinical Companion
                </h1>
            </div>
            <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearAll}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                  aria-label="Clear all inputs"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 flex-1" key={clearKey}>
           <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
              <PatientData
                height={height} setHeight={setHeight}
                weight={weight} setWeight={setWeight}
                age={age} setAge={setAge}
                serumCreatinine={serumCreatinine} setSerumCreatinine={setSerumCreatinine}
                gender={gender} setGender={setGender}
                bmi={bmi}
                bsa={bsa}
                bmiInterpretation={interpretation}
                bmiColorClass={colorClass}
                ibw={ibw}
                abw={abw}
              />
            </div>
            <div className="w-full lg:w-2/3 xl:w-3/4">
                <DayCalculator />
                <VasopressorCalculator weight={weight} />
                <EchoCalculators bsa={bsa} />
                <LungUltrasound />
                <RenalCalculator 
                  age={age}
                  weight={weight}
                  serumCreatinine={serumCreatinine}
                  gender={gender}
                />
                <HemoCalculators />
                <EspenCalculator 
                  weight={weight}
                  height={height}
                  age={age}
                  gender={gender}
                  ibw={ibw}
                  abw={abw}
                  bmi={bmi}
                />
            </div>
          </div>
        </main>

        <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
          <p>Disclaimer: This tool is for educational purposes only and not a substitute for professional medical advice.</p>
          <p>&copy; {new Date().getFullYear()} Clinical Companion. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default App;
