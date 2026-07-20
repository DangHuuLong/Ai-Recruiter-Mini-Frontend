import { z } from 'zod';

const emailField = z.string().trim().email('Email không hợp lệ');
const passwordField = z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự');

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerOrganizationSchema = z.object({
  organizationName: z.string().trim().min(1, 'Tên tổ chức là bắt buộc'),
  adminFullName: z.string().trim().min(1, 'Họ tên là bắt buộc'),
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
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
