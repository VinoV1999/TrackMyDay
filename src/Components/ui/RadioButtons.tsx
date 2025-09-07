import { Dispatch } from "react";

type RadioButtonsProps = {
  options: string[];
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({
  options,
  value,
  setValue,
}) => {
  return (
    <div className="flex gap-2">
      {options.map((option, index) => (
        <div
          key={`${option}_${index}`}
          onClick={() => setValue(option)}
          className={`flex items-center gap-2 ${
            option === value
              ? "bg-brand-200 text-brand-600"
              : "bg-gray-100 text-gray-600"
          } px-2 py-1 rounded-md cursor-pointer hover:bg-brand-200 hover:text-brand-600 transition-all}`}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
