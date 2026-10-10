"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import * as THREE from "three";
import { RotateCcw, Expand, Minus, Plus } from "lucide-react";
import type { OrbitControls as OrbitType } from "three-stdlib";
function StudioLighting() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.85;
    return () => {
      scene.environment = null;
      room.dispose();
      target.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={4} color="#f3f5ff" />
      <directionalLight position={[-5, 2, -2]} intensity={4} color="#bac9d5" />
      <pointLight position={[-2, -1, 3]} intensity={7} color="#d7192d" />
      <pointLight position={[2, 1, 5]} intensity={10} color="white" />
    </>
  );
}
function Model({
  kind,
  progress = 0,
  interactive = false,
  reduced = false,
  hero = false,
}: {
  kind: string;
  progress?: number;
  interactive?: boolean;
  reduced?: boolean;
  hero?: boolean;
}) {
  const { scene } = useGLTF(`/models/${kind}.glb`);
  const [model] = useState(() => scene.clone(true));
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame(({ pointer, clock }, delta) => {
    if (!ref.current) return;
    const p = reduced ? 0 : progress;
    const explode =
      Math.max(
        0,
        Math.sin(Math.max(0, Math.min(1, (p - 0.2) / 0.65)) * Math.PI),
      ) * 0.95;
    const lens = model.getObjectByName("Lens"),
      housing = model.getObjectByName("Housing"),
      sensor = model.getObjectByName("Sensor"),
      mount = model.getObjectByName("Mount");
    if (kind === "bullet" && hero) {
      if (lens) lens.position.z = explode * 1.3;
      if (housing) housing.position.z = -explode * 0.5;
      if (sensor) sensor.position.z = explode * 0.7;
      if (mount) mount.position.y = -explode * 0.4;
      ref.current.scale.setScalar(scale * (1 - explode * 0.28));
      ref.current.position.z = -explode * 1.1;
      ref.current.position.x = (viewport.width > 7 ? -0.65 : 0) + explode * 0.3;
    }
    if (!interactive) {
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        -0.62 - Math.sin(p * Math.PI) * 0.45 + (reduced ? 0 : pointer.x * 0.12),
        1 - Math.exp(-5 * delta),
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        0.12 + (reduced ? 0 : pointer.y * 0.06),
        1 - Math.exp(-5 * delta),
      );
      ref.current.rotation.z = -0.1 + p * 0.1;
      ref.current.position.y = reduced
        ? 0.05
        : Math.sin(clock.elapsedTime * 0.6) * 0.035 + 0.05;
    }
  });
  const scale = hero ? (viewport.width < 6 ? 1.03 : 1.3) : 1;
  return (
    <group
      ref={ref}
      scale={scale}
      position={[hero && viewport.width > 7 ? -0.65 : 0, 0, 0]}
      rotation={[0.12, -0.62, -0.1]}
    >
      <primitive object={model} />
    </group>
  );
}
function Emblem() {
  const { scene } = useGLTF("/models/sentinel.glb");
  const { viewport } = useThree();
  const [model] = useState(() => {
    const copy = scene.clone(true);
    copy.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = obj.material.clone();
        obj.material.color.set("#4e0913");
        obj.material.roughness = 0.4;
        obj.material.envMapIntensity = 0.35;
      }
    });
    return copy;
  });
  return (
    <primitive
      object={model}
      position={[-0.25, viewport.width < 6 ? -0.1 : 0.35, -3.5]}
      scale={viewport.width < 6 ? 1.12 : 1.25}
      rotation={[0, -0.12, 0]}
    />
  );
}
function SceneCanvas({
  kind = "bullet",
  progress = 0,
  hero = false,
  interactive = false,
  reduced = false,
  controls,
  asset = false,
}: {
  kind?: string;
  progress?: number;
  hero?: boolean;
  interactive?: boolean;
  reduced?: boolean;
  controls?: React.RefObject<OrbitType | null>;
  asset?: boolean;
}) {
  return (
    <Canvas
      dpr={asset ? 2 : [1, 1.6]}
      camera={{ position: [0, 0.3, 7.8], fov: 36 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      frameloop={reduced && !interactive ? "demand" : "always"}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        {hero && <Emblem />}
        <Model
          kind={kind}
          progress={progress}
          interactive={interactive}
          reduced={reduced}
          hero={hero}
        />
        {!hero && (
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.32}
            blur={2.8}
            scale={12}
            far={5}
          />
        )}
      </Suspense>
      {interactive && (
        <OrbitControls
          ref={controls}
          enablePan={false}
          minDistance={4}
          maxDistance={11}
          minPolarAngle={0.4}
          maxPolarAngle={2.5}
        />
      )}
    </Canvas>
  );
}
export default function CameraScene({
  hero = false,
  progress = 0,
  kind = "bullet",
  interactive = false,
  asset = false,
}: {
  hero?: boolean;
  progress?: number;
  kind?: string;
  interactive?: boolean;
  asset?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null),
    controls = useRef<OrbitType>(null);
  const [supported, setSupported] = useState<boolean | null>(null),
    [visible, setVisible] = useState(true),
    [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(mq.matches);
    change();
    mq.addEventListener("change", change);
    const c = document.createElement("canvas");
    const context = c.getContext("webgl2") || c.getContext("webgl");
    setSupported(!!context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    if (container.current) obs.observe(container.current);
    return () => {
      obs.disconnect();
      mq.removeEventListener("change", change);
    };
  }, []);
  return (
    <div
      ref={container}
      className={`camera-scene ${hero ? "hero-scene" : ""}`}
      aria-label="مدل سه‌بعدی مفهومی دوربین راد سیستم"
      role={interactive ? "group" : "img"}
    >
      {supported && visible ? (
        <SceneCanvas
          kind={kind}
          progress={progress}
          hero={hero}
          interactive={interactive}
          reduced={reduced}
          controls={controls}
          asset={asset}
        />
      ) : (
        !asset && (
          <img
            className="scene-fallback"
            src={`/images/${kind}.webp`}
            alt="دوربین مفهومی راد سیستم"
          />
        )
      )}
      {interactive && (
        <div className="viewer-tools">
          <button
            className="icon-button"
            title="بازنشانی نما"
            aria-label="بازنشانی نما"
            onClick={() => controls.current?.reset()}
          >
            <RotateCcw size={18} />
          </button>
          <button
            className="icon-button"
            title="بزرگ‌نمایی"
            aria-label="بزرگ‌نمایی"
            onClick={() => {
              controls.current?.dollyIn(1.2);
              controls.current?.update();
            }}
          >
            <Plus size={18} />
          </button>
          <button
            className="icon-button"
            title="کوچک‌نمایی"
            aria-label="کوچک‌نمایی"
            onClick={() => {
              controls.current?.dollyOut(1.2);
              controls.current?.update();
            }}
          >
            <Minus size={18} />
          </button>
          <button
            className="icon-button"
            title="تمام صفحه"
            aria-label="تمام صفحه"
            onClick={() => container.current?.requestFullscreen?.()}
          >
            <Expand size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
