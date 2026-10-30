import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { registerUser, loginUser, fetchMe } from '../../store/auth/authSlice';
import { mergeGuestWishlist } from '../../store/wishlist/wishlistSlice';
import { validator } from '../utils/validator';
import type { RootState } from '../../store/store';

export interface UseRegisterFormProps {
  onClose: () => void;
}

export const useRegisterForm = ({ onClose }: UseRegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const agreedToTermsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const fullName = fullNameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';
    const agreedToTerms = agreedToTermsRef.current?.checked || false;

    const newErrors: Record<string, string> = {};

    const nameError = validator.validateName(fullName);
    if (nameError) newErrors.fullName = nameError;

    const emailError = validator.validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validator.validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms & Conditions.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(
        registerUser({
          email,
          password,
          confirmPassword,
          fullname: fullName,
        }),
      ).unwrap();

      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(fetchMe()).unwrap();
      await dispatch(mergeGuestWishlist()).unwrap();

      onClose();
      navigate('/profile');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return {
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    authError,
    handleSubmit,
    fullNameRef,
    emailRef,
    passwordRef,
    confirmPasswordRef,
    agreedToTermsRef,
  };
};