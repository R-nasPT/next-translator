import type { UseFormRegister } from 'react-hook-form';
import { useTranslations, type Messages } from 'next-intl';
import { useEffect, useState } from 'react';
import { MdEmail, MdOutlineKey, RiEyeCloseLine, RiEyeLine } from '@/lib/icons';
import { getCurrentTheme } from '@/config/theme-config';

interface AuthFormValues {
  emailOrUsername: string;
  password: string;
}

interface InputFieldProps {
  type: string;
  placeholder: string;
  name: 'emailOrUsername' | 'password';
  register: UseFormRegister<AuthFormValues>;
  error?: string;
}

export default function AuthInputField({
  type,
  placeholder,
  name,
  register,
  error,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);
  const t = useTranslations('ERROR_MESSAGE');
  const theme = getCurrentTheme();

  useEffect(() => {
    if (type === 'password' && showPassword) {
      setInputType('text');
    } else {
      setInputType(type);
    }
  }, [showPassword, type]);

  const togglePasswordIcon = () => {
    setShowPassword(!showPassword);
  };

  const iconMap = {
    emailOrUsername: MdEmail,
    password: MdOutlineKey,
  };

  const IconComponent = iconMap[name];

  return (
    <label htmlFor={name} className="relative">
      <IconComponent
        className={`pointer-events-none absolute top-2 left-3 h-8 w-8 ${
          error ? 'text-red-500' : theme.login.icon
        }`}
      />
      <input
        className={`w-full rounded-full border py-3 pl-14 text-base focus:outline-hidden ${theme.login.shadow} ${
          error
            ? 'border-red-500 text-red-700 placeholder:text-red-500'
            : `border-none ${theme.login.input}`
        }`}
        type={inputType}
        placeholder={placeholder}
        {...register(name)}
      />
      {type === 'password' &&
        (showPassword ? (
          <RiEyeCloseLine
            className={`absolute top-[30%] right-4 ${theme.login.icon} h-6 w-6 cursor-pointer`}
            onClick={togglePasswordIcon}
          />
        ) : (
          <RiEyeLine
            className={`absolute top-[20%] right-4 ${theme.login.icon} h-6 w-6 cursor-pointer`}
            onClick={togglePasswordIcon}
          />
        ))}
      <p
        className={`h-3 text-sm text-red-500 transition-transform duration-300 ${
          error ? 'scale-100' : 'scale-0'
        }`}
      >
        {error ? t(error as keyof Messages['ERROR_MESSAGE']) : ''}
      </p>
    </label>
  );
}
