const getRequiredEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const envConfig = {
  apiBaseUrl: getRequiredEnv(
    'NEXT_PUBLIC_API_BASE_URL',
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
} as const;