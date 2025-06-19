import '@testing-library/jest-dom';

export default {
  test: {
    coverage: {
      provider: "v8",
      include: ["src/components/**/*.{js,jsx,ts,tsx}"],
      reporter: ["text", "html"],
    },
  },
};
