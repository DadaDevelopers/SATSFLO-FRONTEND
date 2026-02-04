/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      maxWidth: {
        'mobile': '480px',
        'tablet': '768px',
      },
      colors: {
        // Signup flow color palette from SignupColors
        signup: {
          bg: '#FF4081',
          'input-bg': '#FFD6E4',
          'input-border': '#FFB3CD',
          'button-bg': '#FFB9D1',
          'button-border': '#FF99BC',
          'title': '#FFFFFF',
          'placeholder': '#666666',
          'body': '#FAFAFA',
          'link': '#DDDDDD',
          'checkbox-border': '#FAFAFA',
          'selected-bg': '#FFB3CD',
          'picker-bg': '#FFD6E4',
          'picker-border': '#FFB3CD',
          'home-indicator-bg': '#FF3378',
          'home-indicator': '#FF99BC',
        },
      },
      fontFamily: {
        // Add custom fonts if needed
      },
      fontSize: {
        'title': ['24px', { lineHeight: '29px', fontWeight: '600' }],
        'subtitle': ['14px', { lineHeight: '17px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'button': ['15px', { lineHeight: '18px', fontWeight: '500' }],
      },
      spacing: {
        '4.5': '18px',
        '15': '60px',
        '18': '72px',
        '19': '76px',
      },
      borderRadius: {
        'input': '12px',
        'button': '1000px',
      },
    },
  },
  plugins: [],
};
