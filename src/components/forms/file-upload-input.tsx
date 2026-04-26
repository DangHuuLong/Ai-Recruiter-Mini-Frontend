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
  const [isDragActive, setIsDragActive] = useState(false);

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
    setIsDragActive(false);

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;

    handleFileChange(file);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const currentError = error || internalError;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="text-sm font-bold text-text-primary"
        >
          {label}
        </label>

        {description ? (
          <p className="text-sm leading-6 text-text-muted">{description}</p>
        ) : null}
      </div>

      <label
        htmlFor={inputId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed bg-white/80 p-6 text-center shadow-card backdrop-blur transition-all duration-200',
          isDragActive && 'scale-[1.01] border-primary bg-primary-soft',
          !isDragActive && 'border-border-default hover:border-primary hover:bg-primary-soft/70',
          disabled && 'cursor-not-allowed opacity-60',
          currentError && 'border-error bg-red-50/70',
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

        <div className="space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-sm transition group-hover:scale-105">
            <span className="text-xl font-bold">↑</span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-text-primary">
              Click to upload or drag and drop
            </p>

            <p className="text-xs font-medium text-text-muted">
              PDF or DOCX, up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </label>

      {value ? (
        <div className="flex items-center justify-between rounded-card border border-border-default bg-white px-4 py-3 shadow-card">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
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
            className="ml-3 rounded-button px-3 py-1.5 text-sm font-semibold text-error transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      ) : null}

      {currentError ? (
        <p className="text-sm font-semibold text-error">{currentError}</p>
      ) : null}
    </div>
  );
}
