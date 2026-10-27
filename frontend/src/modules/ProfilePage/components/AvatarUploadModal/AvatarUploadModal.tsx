import Cropper from 'react-easy-crop';
import { useAvatarUpload } from '../../../../shared/hooks/useAvatarUpload';
import { Button } from '../../../../shared/components/Button';
import styles from './AvatarUploadModal.module.scss';
interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal = ({ isOpen, onClose }: AvatarUploadModalProps) => {
  const {
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    isUploading,
    dropzone: { getRootProps, getInputProps, isDragActive },
    onCropComplete,
    handleSave,
    handleClose,
    //handleRemove,
  } = useAvatarUpload(onClose);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Upload & Crop Avatar</h2>
          <p className={styles.subtitle}>Drag and drop or upload an image, then adjust and crop</p>
        </div>

        <div className={styles.content}>
          {!imageSrc ? (
            <div className={styles.dropzoneWrapper}>
              <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.activeDropzone : ''}`}
              >
                <input {...getInputProps()} />
                <span className={styles.repeatIcon} />
                <p className={styles.dropzoneText}>
                  {isDragActive ? 'Drop the file here...' : 'Upload a profile photo'}
                </p>
              </div>
              <p className={styles.supportedFormats}>
                File formats supported: .jpeg, .jpg, .png, .webp
              </p>
            </div>
          ) : (
            <div className={styles.cropperWrapper}>
              <div className={styles.cropperContainer}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
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
          <button
            type="button"
            className={styles.removeBtn}
            //onClick={handleRemove || handleClose}
            disabled={isUploading}
          >
            Remove
          </button>

          <Button
            size="default"
            variant="select"
            className={styles.saveBtn}
            disabled={!imageSrc || isUploading}
            onClick={handleSave}
          >
            {isUploading ? 'Updating...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};
