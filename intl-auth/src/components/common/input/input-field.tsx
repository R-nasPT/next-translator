import { UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  name: "email" | "password";
  register: UseFormRegister<any>;
  error?: string;
}

export default function InputField({
  label,
  type,
  placeholder,
  name,
  register,
  error,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);
  const t = useTranslations("ERROR_MESSAGE");

  useEffect(() => {
    if (type === "password" && showPassword) {
      setInputType("text");
    } else {
      setInputType(type);
    }
  }, [showPassword, type]);

  const togglePasswordIcon = () => {
    setShowPassword(!showPassword);
  };

  return (
    <label htmlFor={name} className="relative">
      <h1 className="font-semibold text-base">{label}</h1>
      <input
        className="border border-[#B8D6BF] p-3 rounded-md w-full text-base text-[#355B3E] placeholder:text-[#B8D6BF] focus:outline-[#355B3E]"
        type={inputType}
        placeholder={placeholder}
        {...register(name)}
      />
      {type === "password" &&
        (showPassword ? (
          <span
            className="absolute right-2 top-[43%] cursor-pointer"
            onClick={togglePasswordIcon}
          >
            yes
          </span>
        ) : (
          <span
            className="absolute right-2 top-[43%] cursor-pointer"
            onClick={togglePasswordIcon}
          >
            no
          </span>
        ))}
      <p
        className={`text-red-500 text-sm transition-transform duration-300 h-3 ${
          error ? "scale-100" : "scale-0"
        }`}
      >
        {error ? t(error) : ""}
      </p>
    </label>
  );
}
