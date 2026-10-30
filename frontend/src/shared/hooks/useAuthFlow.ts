import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  confirmPasswordReset,
  fetchMe,
  loginUser,
  requestPasswordReset,
} from '../../store/auth/authSlice';
import type { RootState } from '../../store/store';

export type AuthView =
  | 'login'
  | 'forgot_request'
  | 'forgot_sent'
  | 'code_verified'
  | 'reset_password'
  | 'reset_success'
  | 'reset_expired';

export const useAuthFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: RootState) => state.auth);

  const [authView, setAuthView] = useState<AuthView>(() => {
    return searchParams.get('reset_token') ? 'reset_password' : 'login';
  });

  // Refs
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const resetEmailRef = useRef<HTMLInputElement>(null);

  // UI States
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [submittedResetEmail, setSubmittedResetEmail] = useState('');

  // Password Reset States
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Visual password rules
  const passwordRules = {
    isLength: newPassword.length >= 8,
    isUpper: /[A-Z]/.test(newPassword),
    isLower: /[a-z]/.test(newPassword),
    isNumber: /[0-9]/.test(newPassword),
    isSpecial: /[!@#$%^&*_\-+=?]/.test(newPassword),
  };

  const isPasswordValid =
    passwordRules.isLength &&
    passwordRules.isUpper &&
    passwordRules.isLower &&
    passwordRules.isNumber &&
    passwordRules.isSpecial &&
    newPassword === confirmNewPassword &&
    newPassword !== '';

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const email = loginEmailRef.current?.value || '';
    const password = loginPasswordRef.current?.value || '';

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(fetchMe()).unwrap();
    } catch (error) {
      setLoginError(error as string);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const resetEmail = resetEmailRef.current?.value || '';

    try {
      await dispatch(requestPasswordReset(resetEmail)).unwrap();
      setSubmittedResetEmail(resetEmail);
      setAuthView('forgot_sent');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    const token = searchParams.get('reset_token');

    if (!token) {
      setAuthView('reset_expired');
      return;
    }

    try {
      await dispatch(confirmPasswordReset({ token, password: newPassword })).unwrap();
      setAuthView('reset_success');
      searchParams.delete('reset_token');
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
      setAuthView('reset_expired');
    }
  };

  // Focus Effect
  useEffect(() => {
    if (authView === 'login' && location.state?.autoFocusEmail) {
      setTimeout(() => {
        loginEmailRef.current?.focus();
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [authView, location.state]);

  return {
    state: {
      authView,
      loginError,
      showPassword,
      isVerifyModalOpen,
      submittedResetEmail,
      newPassword,
      confirmNewPassword,
      showNewPassword,
      showConfirmPassword,
      isLoading,
      isPasswordValid,
      passwordRules,
    },
    refs: {
      loginEmailRef,
      loginPasswordRef,
      resetEmailRef,
    },
    actions: {
      setAuthView,
      setLoginError,
      setShowPassword,
      setIsVerifyModalOpen,
      setNewPassword,
      setConfirmNewPassword,
      setShowNewPassword,
      setShowConfirmPassword,
      searchParams,
      setSearchParams,
    },
    handlers: {
      handleLogin,
      handleRequestReset,
      handleResetPassword,
    },
  };
};
