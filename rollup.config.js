import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'zs-wizard-clock-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};
