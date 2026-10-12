import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { useAppDispatch } from '../../../../store/hooks';
import getCroppedImg from '../../../../shared/utils/cropUtils';
import { uploadUserAvatar } from '../../../../store/auth/authSlice';
import type { Area } from 'react-easy-crop';
import styles from './AvatarUploadModal.module.scss';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal = ({ isOpen, onClose }: AvatarUploadModalProps) => {
  const dispatch = useAppDispatch();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- DROPZONE LOGIC ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  // --- CROPPER LOGIC ---
  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
  setCroppedAreaPixels(croppedAreaPixels);
}, []);

  // --- SAVE ---
  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      // Get cropped file
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

      if (croppedFile) {
        // sending to backend
        await dispatch(uploadUserAvatar(croppedFile)).unwrap();
        handleClose(); // close if success
      }
    } catch (error) {
      console.error('Помилка обрізки/завантаження:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setZoom(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          &times;
        </button>

        <div className={styles.header}>
          <h2>Upload & Crop Avatar</h2>
          <p>Drag and drop or upload an image, then adjust and crop</p>
        </div>

        <div className={styles.content}>
          {!imageSrc ? (
            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${isDragActive ? styles.activeDropzone : ''}`}
            >
              <input {...getInputProps()} />
              <div className={styles.uploadIcon} />
              <p>
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag and drop your image here, or click to browse.'}
              </p>
              <span className={styles.hint}>Supports JPG, PNG up to 5MB.</span>
            </div>
          ) : (
            <div className={styles.cropperWrapper}>
              <div className={styles.cropperContainer}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className={styles.controls}>
                <label htmlFor="zoom-slider">Zoom</label>
                <input
                  id="zoom-slider"
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose} disabled={isUploading}>
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            disabled={!imageSrc || isUploading}
            onClick={handleSave}
          >
            {isUploading ? 'Saving...' : 'Upload & Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
