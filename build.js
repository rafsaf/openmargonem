require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  outfile: "public/bundle.js",
  target: ["chrome58", "firefox57", "safari11", "edge16"],
  platform: "node",
  //   legalComments: "inline",
});
