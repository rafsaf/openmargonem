require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minifyWhitespace: true,
  outfile: "public/bundle.js",
  target: ["es2020"],
  format: "cjs",
  keepNames: true,
  legalComments: "eof",
});
