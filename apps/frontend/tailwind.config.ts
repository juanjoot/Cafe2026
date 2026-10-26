import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: '#6f4e37',
      },
    },
  },
  plugins: [],
};

export default config;
