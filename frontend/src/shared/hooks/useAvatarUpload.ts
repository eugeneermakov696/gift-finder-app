import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '../../store/hooks';
import type { Area } from 'react-easy-crop';
import getCroppedImg from '../utils/cropUtils';
import { uploadUserAvatar } from '../../store/auth/authSlice';

export const useAvatarUpload = (onClose: () => void) => {
  const dispatch = useAppDispatch();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  }, []);

  const dropzone = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleClose = () => {
    setImageSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setZoom(1);
    onClose();
  };

  useEffect(() => {
    return () => {
      setImageSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

      if (croppedFile) {
        await dispatch(uploadUserAvatar(croppedFile)).unwrap();
        handleClose();
      }
    } catch (error) {
      console.error('Crop/Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageSrc,
    crop, setCrop,
    zoom, setZoom,
    isUploading,
    dropzone,
    onCropComplete,
    handleSave,
    handleClose,
  };
};