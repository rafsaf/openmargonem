require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minifyWhitespace: true,
  outfile: "public/bundle.js",
  target: ["es2018"],
  format: "cjs",
  globalName: "OpenMargonemRun",
  keepNames: true,
  legalComments: "eof",
});
