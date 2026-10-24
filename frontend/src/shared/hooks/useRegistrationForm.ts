import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { registerUser, loginUser, fetchMe } from '../../store/auth/authSlice'; 

interface UseRegisterFormProps {
  onClose: () => void;
}

export const useRegisterForm = ({ onClose }: UseRegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include a letter and a number.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullname: formData.fullName,
        }),
      ).unwrap();

      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        }),
      ).unwrap();

      await dispatch(fetchMe()).unwrap();

      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false,
      });
      onClose();
      navigate('/profile');
    } catch (error) {
      console.error('Registration failed:', error);
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