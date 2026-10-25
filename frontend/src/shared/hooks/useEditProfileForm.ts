import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import { clearError, updateProfile, type UpdateProfilePayload } from '../../store/auth/authSlice';
import { validator } from '../utils/validator';
import type { RootState } from '../../store/store';

export const useEditProfileForm = (onClose: () => void) => {
  const { user, isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const fullName = fullNameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const oldPassword = oldPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';

    const newErrors: Record<string, string> = {};

    const nameError = validator.validateName(fullName);
    if (nameError) newErrors.fullName = nameError;

    const hasOld = Boolean(oldPassword);
    const hasNew = Boolean(newPassword);

    if (hasOld || hasNew) {
      if (!hasOld) {
        newErrors.oldPassword = 'Enter your current password.';
      }

      if (!hasNew) {
        newErrors.newPassword = 'Enter a new password.';
      } else {
        const passwordError = validator.validatePassword(newPassword);
        if (passwordError) newErrors.newPassword = passwordError;
        else if (hasOld && oldPassword === newPassword) {
          newErrors.newPassword = 'New password must be different from the old one.';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: UpdateProfilePayload = {
      full_name: fullName.trim(),
    };

    if (email.trim()) {
      payload.email = email.trim();
    }

    if (oldPassword && newPassword) {
      payload.old_password = oldPassword;
      payload.new_password = newPassword;
    }

    try {
      await dispatch(updateProfile(payload)).unwrap();
      if (oldPasswordRef.current) oldPasswordRef.current.value = '';
      if (newPasswordRef.current) newPasswordRef.current.value = '';
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return {
    errors,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    isLoading,
    authError,
    handleSubmit,
    fullNameRef,
    emailRef,
    oldPasswordRef,
    newPasswordRef,
    user,
  };
};