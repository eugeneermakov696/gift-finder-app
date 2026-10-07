import { useState, useRef } from 'react';

export interface UserProfile {
  avatar?: string;
  fullName: string;
  location: string;
  email: string;
}

export const useAvatarUpload = (initialUser: UserProfile) => {
  const [user, setUser] = useState(initialUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedUser = { ...user, avatar: base64String };
      
      setUser(updatedUser);
      localStorage.setItem('giftly_user', JSON.stringify(updatedUser));
    };
    
    reader.readAsDataURL(file);
  };

  return { user, fileInputRef, triggerFileSelect, handleFileChange };
};