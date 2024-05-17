require("esbuild").build({
  entryPoints: ["src/*.ts"],
  minify: true,
  target: ["es2017"],
  platform: "node",
  outdir: "public",
  legalComments: "inline",
});
