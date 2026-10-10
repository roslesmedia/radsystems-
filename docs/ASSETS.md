# Asset Provenance and Limits

- `public/logo.svg`, `app/icon.svg`, `public/models/sentinel.glb`: original Sentinel R shield artwork authored for this project. The 3D treatment uses matching shield/R proportions with bevelled metal.
- All camera, recorder, storage, mount and networking GLBs: original procedural geometry in `lib/models.mjs`, exported by `scripts/generate-assets.mjs`. No proprietary manufacturer assets are included.
- Product WebP images: rendered from the authored GLBs with Three.js in Chromium. `scripts/render-assets.mjs` reproduces them.
- Camera internals are conceptual separable groups (Housing, Lens, Sensor, Mount). They do not describe exact manufacturer engineering.
- Vazirmatn Variable and Manrope Variable: installed from Fontsource, self-hosted by the build, SIL Open Font License. License texts remain in their npm packages.
- Icons: Lucide, ISC license, installed as a dependency.
- Studio environment: generated locally from Three.js RoomEnvironment; no remote HDR image is requested.

Poly Haven and external photo hosts were unavailable through this environment's network policy. No claim is made that the suggested Poly Haven URLs or model licenses were independently verified. Manufacturer product photography and professional installation imagery remain production asset gaps. There are no invented manufacturer partnerships.

The model viewer and hero dynamically load GLBs, cap device pixel ratio, stop rendering offscreen by unmounting the Canvas, and honor reduced-motion. Browsers without WebGL use local product images. Real low-power hardware still needs validation.
