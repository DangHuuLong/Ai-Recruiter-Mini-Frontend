import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      description: options?.description,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      description: options?.description,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      description: options?.description,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      description: options?.description,
    });
  },
};