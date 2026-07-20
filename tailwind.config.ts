import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)',
        panel: '0 16px 40px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        primary: {
          DEFAULT: '#0058be',
          hover: '#2563eb',
          container: '#DBEAFE',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#1E293B',
        background: '#f9f9ff',
        surface: {
          DEFAULT: '#f9f9ff',
          variant: '#F1F5F9',
          low: '#f2f3fd',
          high: '#e6e7f2',
          lowest: '#ffffff',
          highest: '#e1e2ec',
        },
        'on-surface': {
          DEFAULT: '#191b23',
          variant: '#475569',
          muted: '#64748B',
        },
        outline: {
          DEFAULT: '#E2E8F0',
          variant: '#CBD5E1',
        },
        success: {
          DEFAULT: '#22C55E',
          container: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          container: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          container: '#FEE2E2',
        },
        info: '#0EA5E9',
        'focus-ring': '#93C5FD',
        link: '#2563EB',
        disabled: '#94A3B8',
      },
    },
  },
  plugins: [],
};

export default config;
