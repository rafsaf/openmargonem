require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "public/openmargonem.bundle.js",
  target: ["es2020"],
});
