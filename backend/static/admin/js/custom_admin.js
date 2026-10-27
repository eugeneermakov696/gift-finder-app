// Custom Giftly Admin dynamic behaviors
document.addEventListener('DOMContentLoaded', () => {
  const imageUrlInput = document.querySelector('#id_image_url');
  const previewImg = document.querySelector('#admin-preview-img');
  const placeholder = document.querySelector('#admin-preview-img-placeholder');
  const previewLink = previewImg ? previewImg.closest('a') : null;

  if (imageUrlInput && previewImg) {
    const updatePreview = () => {
      const val = imageUrlInput.value.trim();

      if (val) {
        previewImg.src = val;
        previewImg.style.display = 'block';

        if (previewLink) {
          previewLink.href = val;
        }

        if (placeholder) {
          placeholder.style.display = 'none';
        }
      } else {
        previewImg.style.display = 'none';

        if (placeholder) {
          placeholder.style.display = 'inline-flex';
        }
      }
    };

    imageUrlInput.addEventListener('input', updatePreview);
    imageUrlInput.addEventListener('change', updatePreview);
  }
});
