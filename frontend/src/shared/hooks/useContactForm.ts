import { useState, useRef } from 'react';

interface FieldRule {
  draftKey?: string;
  validator?: (value: string) => string | null;
  isTextarea?: boolean;
}

export type FormRules<T extends string> = Record<T, FieldRule>;

export const useFormValidation = <T extends string>(rules: FormRules<T>) => {
  const [errors, setErrors] = useState<Partial<Record<T, string>>>({});

  // Dynamic refs container for form elements
  const fieldRefs = useRef<Partial<Record<T, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  // Helper to bind DOM ref to input element
  const registerRef = (field: T) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    fieldRefs.current[field] = el;
  };

  // Input change handler (saves draft, handles textarea auto-resize, dynamically clears errors)
  const handleChange =
    (field: T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const config = rules[field];

      if (config?.draftKey) {
        localStorage.setItem(config.draftKey, value);
      }

      if (config?.isTextarea && fieldRefs.current[field]) {
        const textarea = fieldRefs.current[field] as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }

      // Clear error dynamically if user fixed it
      if (errors[field] && config?.validator) {
        const errorMsg = config.validator(value);
        if (!errorMsg) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      }
    };

  // Validate all fields using supplied validators
  const validate = (): boolean => {
    const newErrors: Partial<Record<T, string>> = {};

    (Object.keys(rules) as T[]).forEach((field) => {
      const config = rules[field];
      const val = fieldRefs.current[field]?.value || '';

      if (config?.validator) {
        const errorMsg = config.validator(val);
        if (errorMsg) newErrors[field] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get current values from DOM refs
  const getValues = (): Record<T, string> => {
    const values = {} as Record<T, string>;
    (Object.keys(rules) as T[]).forEach((field) => {
      values[field] = fieldRefs.current[field]?.value || '';
    });
    return values;
  };

  // Reset inputs, drafts, and errors
  const resetForm = () => {
    setErrors({});
    (Object.keys(rules) as T[]).forEach((field) => {
      const config = rules[field];
      if (config?.draftKey) {
        localStorage.removeItem(config.draftKey);
      }
      if (fieldRefs.current[field]) {
        fieldRefs.current[field]!.value = '';
      }
    });
  };

  return {
    registerRef,
    errors,
    handleChange,
    validate,
    getValues,
    resetForm,
    setErrors,
  };
};
