import Cropper from 'react-easy-crop';
import { useAvatarUpload } from '../../../../shared/hooks/useAvatarUpload';
import styles from './AvatarUploadModal.module.scss';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal = ({ isOpen, onClose }: AvatarUploadModalProps) => {
  const {
    imageSrc,
    crop, setCrop,
    zoom, setZoom,
    isUploading,
    dropzone: { getRootProps, getInputProps, isDragActive },
    onCropComplete,
    handleSave,
    handleClose,
  } = useAvatarUpload(onClose);

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
