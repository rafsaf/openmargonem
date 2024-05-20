require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "public/bundle.js",
  target: ["es2020"],
});
