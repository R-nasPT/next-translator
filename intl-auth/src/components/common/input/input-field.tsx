import { UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("ERROR_MESSAGE");
  return (
    <label htmlFor={name}>
      <h1 className="font-semibold text-base">{label}</h1>
      <input
        className="border border-[#B8D6BF] p-3 rounded-md w-full text-base text-[#355B3E] placeholder:text-[#B8D6BF] focus:outline-[#355B3E]"
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      <p
        className={`text-red-500 text-sm transition-transform duration-300 ${
          error ? "scale-100" : "scale-0"
        }`}
      >
        {error ? t(error) : ""}
      </p>
    </label>
  );
}
