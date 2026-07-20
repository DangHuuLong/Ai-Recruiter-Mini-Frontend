import { z } from 'zod';

const emailField = z.string().trim().email('Invalid email address');
const passwordField = z.string().min(8, 'Password must be at least 8 characters');

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Please enter your password'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerOrganizationSchema = z.object({
  organizationName: z.string().trim().min(1, 'Organization name is required'),
  adminFullName: z.string().trim().min(1, 'Full name is required'),
  adminEmail: emailField,
  adminPassword: passwordField,
});

export type RegisterOrganizationFormValues = z.infer<typeof registerOrganizationSchema>;

export const resendVerificationSchema = z.object({
  email: emailField,
});

export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
