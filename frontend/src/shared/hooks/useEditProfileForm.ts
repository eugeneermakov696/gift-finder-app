import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { clearError, updateProfile, type UpdateProfilePayload } from '../../store/auth/authSlice';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const useEditProfileForm = (onClose: () => void) => {
  const { user, isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const getInitialData = () => ({
    fullName: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    email: user?.email || user?.username || '',
    oldPassword: '',
    newPassword: '',
  });

  const [formData, setFormData] = useState(getInitialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    const hasOld = Boolean(formData.oldPassword);
    const hasNew = Boolean(formData.newPassword);

    if (hasOld || hasNew) {
      if (!hasOld) {
        newErrors.oldPassword = 'Enter your current password.';
      }

      if (!hasNew) {
        newErrors.newPassword = 'Enter a new password.';
      } else if (!PASSWORD_REGEX.test(formData.newPassword)) {
        newErrors.newPassword =
          'Password must be at least 8 characters, include a letter and a number.';
      } else if (hasOld && formData.oldPassword === formData.newPassword) {
        newErrors.newPassword = 'New password must be different from the old one.';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: UpdateProfilePayload = {
      full_name: formData.fullName.trim(),
    };

    if (formData.email.trim()) {
      payload.email = formData.email.trim();
    }

    if (formData.oldPassword && formData.newPassword) {
      payload.old_password = formData.oldPassword;
      payload.new_password = formData.newPassword;
    }

    try {
      await dispatch(updateProfile(payload)).unwrap();
      setFormData(getInitialData());
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return {
    formData,
    errors,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    isLoading,
    authError,
    handleChange,
    handleSubmit,
  };
};
