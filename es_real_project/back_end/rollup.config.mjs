import babel from "rollup-plugin-babel";

export default {
  input: "./src/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "umd",
  },
  treeshake: false,
  plugins: [
    babel({
      runtimeHelpers: true,
      extensions: [".js", ".ts"],
      exclude: "node_modules/**",
      externalHelpers: true,
    }),
  ],
};
