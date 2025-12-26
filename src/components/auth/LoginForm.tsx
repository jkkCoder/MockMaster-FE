import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { LoginDto } from '../../utils/types';

interface LoginFormProps {
  onSubmit: (data: LoginDto) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>();

  const [localError, setLocalError] = useState<string | null>(null);

  const handleFormSubmit = async (data: LoginDto) => {
    try {
      setLocalError(null);
      await onSubmit(data);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {(error || localError) && (
        <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error || localError}</span>
        </div>
      )}

      <Input
        label="Username or Email"
        type="text"
        {...register('usernameOrEmail', { required: 'Username or email is required' })}
        error={errors.usernameOrEmail?.message}
      />

      <Input
        label="Password"
        type="password"
        showPasswordToggle={true}
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Login
      </Button>
    </form>
  );
};
