import { defineConfig, type IPluginGenerator, type PluginGeneratorContext } from "ng-openapi";
import { readdir } from "node:fs/promises";

export class TsNoCheckPlugin implements IPluginGenerator {
  private readonly context: PluginGeneratorContext;

  constructor(context: PluginGeneratorContext) {
    this.context = context;
  }

  async generate(outputRoot: string): Promise<void> {
    for (const dir of this.context.project.getRootDirectories()) {
      const paths = await readdir(dir.getPath(), { recursive: true }).then((paths) =>
        paths.filter((p) => p.endsWith(".ts")).map((file) => dir.getPath() + "/" + file),
      );
      for (const path of paths) {
        const f = this.context.project.addSourceFileAtPath(path);
        f.insertText(0, "// @ts-nocheck\n");
      }
    }
    return this.context.project.save();
  }
}
export default defineConfig({
  input: "../anno-t-api.yaml",
  output: "./src/generated-openapi",
  options: { dateType: "Date", enumStyle: "union" },
  plugins: [TsNoCheckPlugin],
});
