import { z } from 'zod';

export const requiredString = (fieldName: string) => {
  return z
    .string()
    .trim()
    .min(1, { message: `${fieldName} is required` });
};

export const optionalString = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''));

export const emailSchema = z.email({
  message: 'Invalid email address',
});

export const optionalEmailSchema = z
  .email({
    message: 'Invalid email address',
  })
  .optional()
  .or(z.literal(''));

export const positiveNumberSchema = (fieldName: string) => {
  return z.coerce
    .number()
    .positive({ message: `${fieldName} must be greater than 0` });
};