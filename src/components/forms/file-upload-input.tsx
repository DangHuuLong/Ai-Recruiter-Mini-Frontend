'use client';

import { ChangeEvent, DragEvent, useId, useState } from 'react';

import {
  ACCEPTED_RESUME_FILE_TYPES,
  DEFAULT_MAX_FILE_SIZE,
} from '@/lib/constants/file.constants';
import { cn } from '@/lib/utils/cn';
import { formatFileSize } from '@/lib/utils/format-file-size';

type FileUploadInputProps = {
  label?: string;
  description?: string;
  value?: File | null;
  error?: string;
  accept?: readonly string[];
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  onChange: (file: File | null) => void;
};

export function FileUploadInput({
  label = 'Upload file',
  description = 'PDF or DOCX file only.',
  value,
  error,
  accept = ACCEPTED_RESUME_FILE_TYPES,
  maxSize = DEFAULT_MAX_FILE_SIZE,
  disabled = false,
  className,
  onChange,
}: FileUploadInputProps) {
  const inputId = useId();
  const [internalError, setInternalError] = useState<string | null>(null);

  const acceptedFileTypes = accept.join(',');

  const validateFile = (file: File): string | null => {
    if (!accept.includes(file.type)) {
      return 'File type is not supported. Only PDF and DOCX are allowed.';
    }

    if (file.size > maxSize) {
      return `File size must not exceed ${formatFileSize(maxSize)}.`;
    }

    return null;
  };

  const handleFileChange = (file: File | null) => {
    setInternalError(null);

    if (!file) {
      onChange(null);
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setInternalError(validationError);
      onChange(null);
      return;
    }

    onChange(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    handleFileChange(file);

    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;

    handleFileChange(file);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const currentError = error || internalError;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>

        {description ? (
          <p className="text-sm text-text-muted">{description}</p>
        ) : null}
      </div>

      <label
        htmlFor={inputId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          'flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg-card p-6 text-center transition hover:bg-bg-muted',
          disabled && 'cursor-not-allowed opacity-60',
          currentError && 'border-danger',
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={acceptedFileTypes}
          disabled={disabled}
          className="sr-only"
          onChange={handleInputChange}
        />

        <div className="space-y-1">
          <p className="text-sm font-medium text-text-primary">
            Click to upload or drag and drop
          </p>

          <p className="text-sm text-text-muted">
            PDF or DOCX, up to {formatFileSize(maxSize)}
          </p>
        </div>
      </label>

      {value ? (
        <div className="flex items-center justify-between rounded-md border border-border bg-bg-card px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {value.name}
            </p>

            <p className="text-xs text-text-muted">
              {formatFileSize(value.size)}
            </p>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFileChange(null)}
            className="text-sm font-medium text-danger disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      ) : null}

      {currentError ? (
        <p className="text-sm text-danger">{currentError}</p>
      ) : null}
    </div>
  );
}