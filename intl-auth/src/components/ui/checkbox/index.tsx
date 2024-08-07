interface CheckboxProps {
  id: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function Checkbox({ id, checked, onChange, label, size = "md", disabled = false }: CheckboxProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const labelSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="inline-flex items-center">
      <label
        className="relative flex items-center p-3 rounded-full cursor-pointer"
        htmlFor={id}
      >
        <input
          type="checkbox"
          className={`peer relative ${sizeClasses[size]} cursor-pointer appearance-none rounded-md border-2 border-[#7a6eaa] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-purple-700 checked:bg-purple-700 before:bg-purple-900 hover:before:opacity-10`}
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span
          className={`absolute ${sizeClasses[size]} text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full p-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </label>
      {label && (
        <span className={`ml-2 ${labelSizeClasses[size]}`}>{label}</span>
      )}
    </div>
  );
};
