import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
const materials = () => ({
  silver: new T.MeshStandardMaterial({
    color: "#adb3b7",
    metalness: 0.8,
    roughness: 0.29,
  }),
  white: new T.MeshStandardMaterial({
    color: "#d7dadb",
    metalness: 0.45,
    roughness: 0.28,
  }),
  black: new T.MeshStandardMaterial({
    color: "#17191d",
    metalness: 0.65,
    roughness: 0.28,
  }),
  dark: new T.MeshStandardMaterial({
    color: "#06090c",
    metalness: 0.25,
    roughness: 0.18,
  }),
  red: new T.MeshStandardMaterial({
    color: "#ae0c22",
    metalness: 0.65,
    roughness: 0.25,
  }),
  glass: new T.MeshPhysicalMaterial({
    color: "#163941",
    metalness: 0.6,
    roughness: 0.07,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    iridescence: 0.8,
  }),
  led: new T.MeshStandardMaterial({
    color: "#b71122",
    emissive: "#e5122f",
    emissiveIntensity: 2,
  }),
});
function mesh(g, material, pos = [0, 0, 0], parent) {
  const m = new T.Mesh(g, material);
  m.position.set(...pos);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function box(parent, mat, size, pos, r = 0.08) {
  return mesh(new RoundedBoxGeometry(...size, 2, r), mat, pos, parent);
}
function cylinder(parent, mat, r, depth, pos, r2 = r) {
  const m = mesh(new T.CylinderGeometry(r, r2, depth, 64), mat, pos, parent);
  m.rotation.x = Math.PI / 2;
  return m;
}
function ring(parent, mat, r, t, z) {
  return mesh(new T.TorusGeometry(r, t, 12, 80), mat, [0, 0, z], parent);
}
function group(root, name) {
  const g = new T.Group();
  g.name = name;
  root.add(g);
  return g;
}
export function createCamera(kind = "bullet") {
  const root = new T.Group();
  root.name = kind;
  const m = materials();
  if (kind === "bullet") {
    const housing = group(root, "Housing"),
      lens = group(root, "Lens"),
      sensor = group(root, "Sensor"),
      mount = group(root, "Mount");
    box(housing, m.silver, [1.45, 1.24, 2.55], [0, 0, -0.05], 0.26);
    box(housing, m.black, [1.32, 1.1, 2.6], [0, -0.04, 0.02], 0.24);
    box(housing, m.white, [1.5, 0.24, 2.8], [0, 0.57, 0.1], 0.11);
    box(housing, m.silver, [0.09, 0.86, 2.25], [0.685, 0.03, -0.05], 0.04);
    box(housing, m.silver, [0.09, 0.86, 2.25], [-0.685, 0.03, -0.05], 0.04);
    box(housing, m.black, [1.55, 0.09, 2.9], [0, 0.68, 0.13], 0.04);
    for (let i = 0; i < 15; i++) {
      box(
        housing,
        m.dark,
        [0.025, 0.75, 0.025],
        [0.736, -0.01, -0.9 + i * 0.075],
        0.005,
      );
      box(
        housing,
        m.dark,
        [0.025, 0.75, 0.025],
        [-0.736, -0.01, -0.9 + i * 0.075],
        0.005,
      );
    }
    for (const x of [-0.57, 0.57])
      for (const y of [-0.42, 0.42]) {
        const screw = cylinder(housing, m.silver, 0.036, 0.025, [x, y, 1.32]);
        screw.rotation.z = 0.7;
      }
    cylinder(housing, m.dark, 0.63, 0.12, [0, -0.04, 1.31]);
    cylinder(lens, m.black, 0.55, 0.36, [0, -0.04, 1.52]);
    ring(lens, m.silver, 0.535, 0.02, 1.7);
    ring(lens, m.red, 0.487, 0.022, 1.725);
    cylinder(lens, m.dark, 0.46, 0.05, [0, -0.04, 1.72]);
    for (let j = 0; j < 5; j++)
      ring(lens, m.black, 0.44 - j * 0.025, 0.012, 1.75 + j * 0.007);
    const glass = mesh(
      new T.SphereGeometry(0.32, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
      m.glass,
      [0, -0.04, 1.68],
      lens,
    );
    glass.rotation.x = Math.PI / 2;
    glass.scale.y = 0.48;
    cylinder(lens, m.dark, 0.17, 0.01, [0, -0.04, 1.805]);
    ring(lens, m.glass, 0.205, 0.025, 1.81);
    ring(lens, m.glass, 0.1, 0.015, 1.812);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      cylinder(lens, m.silver, 0.028, 0.015, [
        Math.cos(a) * 0.59,
        Math.sin(a) * 0.59 - 0.04,
        1.397,
      ]);
    }
    cylinder(lens, m.led, 0.022, 0.018, [0.44, -0.39, 1.405]);
    box(sensor, m.black, [0.76, 0.68, 0.1], [0, 0, 0.75], 0.02);
    box(sensor, m.glass, [0.32, 0.26, 0.015], [0, 0, 0.81], 0.01);
    box(mount, m.black, [0.35, 0.26, 0.6], [0, -0.69, -0.77], 0.08);
    const joint = cylinder(mount, m.silver, 0.21, 0.42, [0, -0.84, -0.84]);
    joint.rotation.z = Math.PI / 2;
    const arm = box(
      mount,
      m.silver,
      [0.28, 0.88, 0.3],
      [0, -1.14, -1.02],
      0.07,
    );
    arm.rotation.x = -0.5;
    cylinder(mount, m.white, 0.42, 0.15, [0, -1.45, -1.45]);
    cylinder(mount, m.black, 0.32, 0.03, [0, -1.45, -1.36]);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.8;
      cylinder(mount, m.silver, 0.038, 0.02, [
        Math.cos(a) * 0.33,
        -1.45 + Math.sin(a) * 0.33,
        -1.36,
      ]);
    }
    box(housing, m.red, [0.014, 0.12, 0.3], [0.74, 0.22, 0.62], 0.005);
    return root;
  }
  if (kind === "dome" || kind === "ptz") {
    const housing = group(root, "Housing");
    const base = mesh(
      new T.CylinderGeometry(0.88, 0.93, 0.32, 64),
      m.white,
      [0, 0.55, 0],
      housing,
    );
    mesh(
      new T.TorusGeometry(0.89, 0.025, 12, 64),
      m.silver,
      [0, 0.43, 0],
      housing,
    ).rotation.x = Math.PI / 2;
    mesh(
      new T.SphereGeometry(
        0.76,
        64,
        32,
        0,
        Math.PI * 2,
        Math.PI / 2,
        Math.PI / 2,
      ),
      m.black,
      [0, 0.43, 0],
      housing,
    );
    const eye = group(root, "Lens");
    eye.position.set(0, 0.1, 0.47);
    eye.rotation.x = 0.25;
    cylinder(eye, m.silver, 0.43, 0.08, [0, 0, 0]);
    cylinder(eye, m.dark, 0.36, 0.12, [0, 0, 0.06]);
    cylinder(eye, m.glass, 0.24, 0.04, [0, 0, 0.14]);
    ring(eye, m.red, 0.3, 0.016, 0.14);
    if (kind === "ptz") {
      base.scale.y = 2;
      mesh(
        new T.CylinderGeometry(0.5, 0.5, 0.75, 48),
        m.white,
        [0, 1.15, 0],
        housing,
      );
      box(housing, m.white, [0.45, 0.28, 1.2], [0, 1.6, -0.4]);
      box(housing, m.silver, [0.7, 0.8, 0.12], [0, 1.3, -0.95]);
    }
    return root;
  }
  if (kind === "storage") {
    box(root, m.silver, [1.5, 0.32, 2.15], [0, 0, 0], 0.07);
    box(root, m.black, [1.36, 0.025, 2], [0, 0.175, 0], 0.02);
    mesh(
      new T.CylinderGeometry(0.52, 0.52, 0.045, 64),
      m.silver,
      [0, 0.205, -0.25],
      root,
    );
    box(root, m.white, [1.15, 0.01, 0.65], [0, 0.2, 0.63], 0.005);
    box(root, m.red, [0.5, 0.012, 0.12], [0, 0.212, 0.65], 0.003);
    return root;
  }
  if (kind === "accessories") {
    mesh(new T.CylinderGeometry(0.5, 0.5, 0.18, 48), m.white, [0, 0, 0], root);
    box(root, m.silver, [0.25, 1, 0.25], [0, 0.5, 0]);
    box(root, m.white, [0.9, 0.15, 0.75], [0, 1, 0.2]);
    return root;
  }
  box(root, m.black, [2.8, 0.48, 1.8], [0, 0, 0], 0.06);
  box(root, m.silver, [2.75, 0.06, 1.76], [0, 0.25, 0], 0.02);
  for (let i = 0; i < 12; i++)
    box(
      root,
      m.dark,
      [0.025, 0.012, 1.1],
      [-1.15 + i * 0.2, 0.286, -0.1],
      0.003,
    );
  if (kind === "network") {
    for (let i = 0; i < 8; i++) {
      box(root, m.dark, [0.23, 0.19, 0.04], [-1.04 + i * 0.3, 0, 0.92], 0.01);
      box(
        root,
        m.led,
        [0.018, 0.018, 0.01],
        [-0.97 + i * 0.3, 0.065, 0.951],
        0.003,
      );
    }
  } else {
    box(root, m.dark, [0.5, 0.12, 0.015], [0.85, 0, 0.91], 0.01);
    for (let i = 0; i < 3; i++)
      cylinder(root, i === 0 ? m.led : m.silver, 0.022, 0.01, [
        -1 + i * 0.12,
        0,
        0.917,
      ]);
  }
  return root;
}
export function createEmblem() {
  const group = new T.Group();
  const mat = new T.MeshStandardMaterial({
    color: "#b51124",
    metalness: 0.85,
    roughness: 0.28,
  });
  const contours = [
    [
      [0, 2],
      [1.6, 1.48],
      [1.38, -0.6],
      [0, -2],
      [-1.38, -0.6],
      [-1.6, 1.48],
      [0, 2],
    ],
    [
      [-0.83, 1.02],
      [0.57, 0.97],
      [1.09, 0.3],
      [0.1, -0.35],
      [0.87, -1.04],
      [0.39, -1.49],
      [-0.98, -0.22],
      [0.44, 0.45],
      [0.1, 0.74],
      [-0.84, 0.69],
      [-0.83, 1.02],
    ],
  ];
  contours.forEach((pts, i) => {
    const s = new T.Shape();
    pts.forEach(([x, y], j) => (j ? s.lineTo(x, y) : s.moveTo(x, y)));
    if (!i) {
      const hole = new T.Path();
      [
        [-1.32, 1.3],
        [-1.15, -0.48],
        [0, -1.66],
        [1.15, -0.48],
        [1.32, 1.3],
        [0, 1.7],
        [-1.32, 1.3],
      ].forEach(([x, y], j) => (j ? hole.lineTo(x, y) : hole.moveTo(x, y)));
      s.holes.push(hole);
    }
    const g = new T.ExtrudeGeometry(s, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      bevelSegments: 2,
      steps: 1,
    });
    mesh(g, mat, [0, 0, 0], group);
  });
  return group;
}
