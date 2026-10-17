import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { updateProfile } from '../../store/auth/authSlice';

export const useEditProfileForm = (onClose: () => void) => {
  const { user, isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    email: user?.email || user?.username || '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    if (formData.password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters, include a letter and a number.';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: {
      full_name: string;
      email?: string;
      password?: string;
    } = {
      full_name: formData.fullName.trim(),
    };

    if (formData.email.trim()) {
      payload.email = formData.email.trim();
    }

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      await dispatch(updateProfile(payload)).unwrap();
      setFormData({
        fullName: user ? `${user.first_name} ${user.last_name}`.trim() : '',
        email: user?.email || user?.username || '',
        password: '',
        confirmPassword: '',
      });
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return {
    formData,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    authError,
    handleChange,
    handleSubmit,
  };
};