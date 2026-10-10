import { mkdir, writeFile } from "node:fs/promises";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { createCamera, createEmblem } from "../lib/models.mjs";
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = `data:${blob.type};base64,${Buffer.from(b).toString("base64")}`;
      this.onloadend?.();
    });
  }
};
await mkdir("public/models", { recursive: true });
await mkdir("public/images", { recursive: true });
for (const kind of [
  "bullet",
  "dome",
  "ptz",
  "nvr",
  "storage",
  "accessories",
  "network",
  "sentinel",
]) {
  const model = kind === "sentinel" ? createEmblem() : createCamera(kind);
  const data = await new GLTFExporter().parseAsync(model, { binary: true });
  await writeFile(`public/models/${kind}.glb`, Buffer.from(data));
  console.log(`${kind}: ${(data.byteLength / 1024).toFixed(0)} KB`);
}
