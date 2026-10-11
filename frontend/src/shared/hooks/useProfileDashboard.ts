import { useRef } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { uploadUserAvatar } from '../../store/auth/authSlice';
import type { User } from '../../api/auth-service/types/user.type';

export const useAvatarUpload = (user: User) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large! Please choose an image under 2MB.');
      return;
    }

    dispatch(uploadUserAvatar(file));
  };

  return { user, fileInputRef, triggerFileSelect, handleFileChange };
};