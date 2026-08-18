import { describe, expect, it } from 'vitest';

import {
  forgotPasswordSchema,
  loginSchema,
  registerOrganizationSchema,
  resendVerificationSchema,
  resetPasswordSchema,
} from './auth.validation';

describe('loginSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    const result = loginSchema.safeParse({ email: 'jane@example.com', password: 'anything' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email address', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'anything' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'jane@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerOrganizationSchema', () => {
  const VALID = {
    organizationName: 'Acme Inc',
    adminFullName: 'Jane Doe',
    adminEmail: 'jane@acme.com',
    adminPassword: 'password123',
  };

  it('accepts complete valid data', () => {
    expect(registerOrganizationSchema.safeParse(VALID).success).toBe(true);
  });

  it('rejects a missing organizationName', () => {
    const result = registerOrganizationSchema.safeParse({ ...VALID, organizationName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerOrganizationSchema.safeParse({ ...VALID, adminPassword: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('resendVerificationSchema / forgotPasswordSchema', () => {
  it('accepts a valid email for both schemas', () => {
    expect(resendVerificationSchema.safeParse({ email: 'jane@example.com' }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: 'jane@example.com' }).success).toBe(true);
  });

  it('rejects an invalid email for both schemas', () => {
    expect(resendVerificationSchema.safeParse({ email: 'nope' }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: 'nope' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('accepts matching passwords of sufficient length', () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords, attaching the error to confirmPassword', () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: 'password123',
      confirmPassword: 'different456',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    }
  });

  it('rejects a newPassword shorter than 8 characters even if confirmPassword matches', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'short', confirmPassword: 'short' });
    expect(result.success).toBe(false);
  });
});
