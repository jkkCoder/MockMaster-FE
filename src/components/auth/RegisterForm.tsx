import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { RegisterDto } from '../../utils/types';

interface RegisterFormProps {
  onSubmit: (data: RegisterDto) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>();

  const [localError, setLocalError] = useState<string | null>(null);

  const handleFormSubmit = async (data: RegisterDto) => {
    try {
      setLocalError(null);
      await onSubmit(data);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {(error || localError) && (
        <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error || localError}</span>
        </div>
      )}

      <Input
        label="Username"
        type="text"
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' },
        })}
        error={errors.username?.message}
      />

      <Input
        label="Full Name"
        type="text"
        {...register('fullName', {
          required: 'Full name is required',
          minLength: { value: 2, message: 'Full name must be at least 2 characters' },
        })}
        error={errors.fullName?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('mail', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.mail?.message}
      />

      <Input
        label="Password"
        type="password"
        showPasswordToggle={true}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' },
        })}
        error={errors.password?.message}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Register
      </Button>
    </form>
  );
};
