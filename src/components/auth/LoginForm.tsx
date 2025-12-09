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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || localError}
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
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Login
      </Button>
    </form>
  );
};
