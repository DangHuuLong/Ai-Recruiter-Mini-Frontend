import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-foreground': 'var(--color-primary-foreground)',

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',

        'bg-base': 'var(--color-bg-base)',
        'bg-card': 'var(--color-bg-card)',
        'bg-sidebar': 'var(--color-bg-sidebar)',
        'bg-header': 'var(--color-bg-header)',
        'bg-muted': 'var(--color-bg-muted)',

        'border-default': 'var(--color-border-default)',
        'border-hover': 'var(--color-border-hover)',
        'border-focus': 'var(--color-border-focus)',
        divider: 'var(--color-divider)',

        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-on-primary': 'var(--color-text-on-primary)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        button: '6px',
        input: '6px',
        card: '8px',
        modal: '12px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.05)',
        dropdown:
          '0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)',
        modal:
          '0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)',
      },
      spacing: {
        sidebar: '240px',
        header: '56px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;