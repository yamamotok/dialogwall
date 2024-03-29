import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  external: ['react', 'classnames', 'highwall'],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    postcss({
      extensions: ['.css'],
    }),
    terser(),
  ],
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  preserveModules: true,
};
