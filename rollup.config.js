import commonjs from '@rollup/plugin-commonjs';
import url from 'url';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import summary from 'rollup-plugin-summary';
import terser from '@rollup/plugin-terser';
import rimraf from 'rimraf';
import fs from 'fs';
import path from "path";
import { minify as uglify } from 'uglify-js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __read_file__ = fs.readFileSync(path.join(__dirname, './package.json'), { encoding: "utf8" });
const pkg = JSON.parse(__read_file__);

const devMode = process.env.mode !== 'production';
const name = 'Neuroevolution';

/**
 * Terser cannot execute on Android Termux
 * */
const isTermuxEnv = /(com\.termux)/i.test(String(process.env.NODE));

console.log('Mode: ' + process.env.mode);
console.log('Termux Environment: ' + isTermuxEnv);

export default (cli_args) => {
  const output = [];

  const isUmd = cli_args.umd;
  const isNode = cli_args.node;

  if (isUmd) {
    delete cli_args.umd;
    output.push({
      file: pkg.unpkg,
      format: 'umd',
      sourcemap: devMode,
      name: name
    });
  }

  if (isNode) {
    delete cli_args.node;
    output.push({
      file: pkg.main,
      name: name,
      format: 'es',
      sourcemap: devMode
    });
  }

  return {
    input: './src/index.ts',
    output: output,
    treeshake: !devMode,
    plugins: [
      !devMode &&
      !isTermuxEnv &&
      terser({
        format: {
          comments: false
        },
        compress: false
      }),

      typescript(),
      json(),
      commonjs(),
      !devMode && summary(),
      resolve({
        preferBuiltins: false,
        browser: isUmd && !isNode,
        extensions: ['.ts']
      }),

      {
        writeBundle(rollupOptions, args) {
          if (devMode || !isTermuxEnv) return;

          const file = rollupOptions.file;

          if (!/\.((m|c)?js)$/.test(file)) return;

          const code = Object.values(args)[0].code;

          const minified = uglify(code, {});

          // Rewriting output file
          // May gave us inaccurate summary
          fs.writeFileSync(file, minified.code);
        },
        buildStart() {
          // Clean dist Folder before anything...
          rimraf.sync('dist');
        }
      }
    ]
  };
};
