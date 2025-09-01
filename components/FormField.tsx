import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  unit?: string;
  type?: 'number' | 'text' | 'select';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  value,
  onChange,
  unit,
  type = 'number',
  options = [],
  placeholder,
  min = 0,
  max,
  step = 'any',
}) => {
  const inputProps = {
    id,
    value,
    onChange,
    placeholder,
    className: "w-full bg-secondary-light dark:bg-gray-800 border border-secondary-dark dark:border-gray-600 rounded-md py-2 px-3 focus:ring-primary focus:border-primary transition",
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {type === 'select' ? (
          <select {...inputProps}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : (
          <input
            type={type}
            min={min}
            max={max}
            step={step}
            {...inputProps}
          />
        )}
        {unit && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
