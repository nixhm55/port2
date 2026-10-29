import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import {
  CanvasTexture,
  Color,
  MathUtils,
  type Group,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial
} from 'three';
import type { Pose } from './poses';
import type { Theme } from '../data/portfolioData';

export type SceneTier = 'high' | 'low';

interface SceneProps {
  pose: Pose;
  theme: Theme;
  tier: SceneTier;
  reduced: boolean;
  narrow: boolean;
  onReady: () => void;
}

/** Palette: the same two materials trade places between the two surfaces. */
const STONE = { ivory: new Color('#d9d3c6'), charcoal: new Color('#2d2c29') };
const INK = { ivory: new Color('#1f1e1c'), charcoal: new Color('#e6e1d5') };
const LINE = { ivory: new Color('#2a2926'), charcoal: new Color('#d8d3c7') };

function useShadowTexture(): CanvasTexture {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(0,0,0,0.85)');
      g.addColorStop(0.35, 'rgba(0,0,0,0.38)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

const FLOOR = -1.2;

const Sculpture: React.FC<SceneProps> = ({ pose, theme, tier, reduced, narrow, onReady }) => {
  const { viewport, invalidate } = useThree();
  const root = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const slab = useRef<Group>(null);
  const sphere = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const shadowMat = useRef<MeshStandardMaterial>(null);
  const stoneMats = useRef<Array<MeshPhysicalMaterial | null>>([]);
  const inkMat = useRef<MeshPhysicalMaterial>(null);
  const lineMat = useRef<MeshStandardMaterial>(null);
  const shadowTexture = useShadowTexture();

  const target = useRef(pose);
  const themeTarget = useRef(theme === 'charcoal' ? 1 : 0);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const cur = useRef({ ...pose, theme: themeTarget.current, started: false });
  const ambient = tier === 'high' && !reduced;
  const colorTmp = useMemo(() => new Color(), []);

  useEffect(() => {
    target.current = pose;
    invalidate();
  }, [pose, invalidate]);

  useEffect(() => {
    themeTarget.current = theme === 'charcoal' ? 1 : 0;
    invalidate();
  }, [theme, invalidate]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (reduced || tier !== 'high') return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, tier, invalidate]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const c = cur.current;
    const t = target.current;
    const p = pointer.current;

    // First frame: start slightly smaller and turned away, then settle into the pose.
    if (!c.started) {
      c.started = true;
      if (!reduced) {
        c.scale = t.scale * 0.8;
        c.ry = t.ry - 0.9;
        c.morph = Math.max(0, t.morph - 0.3);
      }
    }

    const lambda = reduced ? 30 : 2.6;
    let delta = 0;
    (['x', 'y', 'scale', 'rx', 'ry', 'rz', 'morph', 'ring'] as const).forEach((k) => {
      const next = MathUtils.damp(c[k], t[k], lambda, dt);
      delta = Math.max(delta, Math.abs(next - c[k]));
      c[k] = next;
    });
    const themeNext = MathUtils.damp(c.theme, themeTarget.current, reduced ? 30 : 3.4, dt);
    delta = Math.max(delta, Math.abs(themeNext - c.theme));
    c.theme = themeNext;

    const px = MathUtils.damp(p.x, p.tx, 3, dt);
    const py = MathUtils.damp(p.y, p.ty, 3, dt);
    delta = Math.max(delta, Math.abs(px - p.x), Math.abs(py - p.y));
    p.x = px;
    p.y = py;

    // Fit the sculpture to the viewport, then place it by fractions of the viewport.
    const fit = Math.min(
      (viewport.height * 0.62) / 2.1,
      (viewport.width * (narrow ? 0.95 : 0.6)) / 3.1
    );
    const s = fit * c.scale;
    const time = state.clock.elapsedTime;
    const sway = ambient ? Math.sin(time * 0.35) * 0.07 : 0;
    const breath = ambient ? Math.sin(time * 0.6) * 0.012 : 0;

    if (root.current) {
      root.current.position.set(c.x * viewport.width, c.y * viewport.height + 0.22 * s, 0);
      root.current.scale.setScalar(s * (1 + breath));
    }
    if (spin.current) spin.current.rotation.y = c.ry + sway + p.x * 0.3;
    if (tilt.current) {
      tilt.current.rotation.x = c.rx + p.y * -0.08;
      tilt.current.rotation.z = c.rz;
    }
    if (slab.current) {
      slab.current.position.x = MathUtils.lerp(-0.2, 0.32, c.morph);
      slab.current.rotation.y = MathUtils.lerp(-0.25, 0.55, c.morph);
      slab.current.rotation.z = MathUtils.lerp(0.05, -0.07, c.morph);
    }
    if (sphere.current) {
      sphere.current.position.x = MathUtils.lerp(1.45, -1.4, c.morph);
      sphere.current.position.z = MathUtils.lerp(0.45, 0.55, c.morph);
    }
    if (ring.current) {
      ring.current.rotation.x = Math.PI / 2 + c.ring * 0.6;
      ring.current.rotation.z = ambient ? time * 0.07 : 0.4;
    }

    // Colour: stone and ink swap places between the two surfaces.
    const stoneColor = colorTmp.copy(STONE.ivory).lerp(STONE.charcoal, c.theme);
    stoneMats.current.forEach((m) => m?.color.copy(stoneColor));
    inkMat.current?.color.copy(INK.ivory).lerp(INK.charcoal, c.theme);
    lineMat.current?.color.copy(LINE.ivory).lerp(LINE.charcoal, c.theme);
    if (shadowMat.current) shadowMat.current.opacity = MathUtils.lerp(0.34, 0.7, c.theme);

    if (!ambient && delta > 0.0004) invalidate();
  });

  const radial = tier === 'high' ? 48 : 24;
  const tubular = tier === 'high' ? 112 : 56;
  const high = tier === 'high';
  const stoneRef = (i: number) => (m: MeshPhysicalMaterial | null) => {
    stoneMats.current[i] = m;
  };

  return (
    <group ref={root}>
      {/* Soft contact shadow on an invisible floor */}
      <mesh position={[0.1, FLOOR + 0.002, 0.15]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <planeGeometry args={[4.4, 2.6]} />
        <meshStandardMaterial
          ref={shadowMat}
          map={shadowTexture}
          transparent
          depthWrite={false}
          color="#000000"
          opacity={0.34}
        />
      </mesh>

      <group ref={spin}>
        <group ref={tilt}>
          {/* Arch: half torus with two plain legs */}
          <group position={[0, -0.3, 0]}>
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.8, 0.26, radial, tubular, Math.PI]} />
              <meshPhysicalMaterial
                ref={stoneRef(0)}
                color="#d9d3c6"
                roughness={0.62}
                metalness={0}
                clearcoat={high ? 0.12 : 0}
                envMapIntensity={0.9}
              />
            </mesh>
            {[-0.8, 0.8].map((x, i) => (
              <mesh key={x} position={[x, -0.45, 0]}>
                <cylinderGeometry args={[0.26, 0.26, 0.9, radial]} />
                <meshPhysicalMaterial
                  ref={stoneRef(i + 1)}
                  color="#d9d3c6"
                  roughness={0.62}
                  metalness={0}
                  envMapIntensity={0.9}
                />
              </mesh>
            ))}
          </group>

          {/* Monolith slab */}
          <group ref={slab} position={[0.1, -0.35, 0]}>
            <RoundedBox args={[0.5, 1.7, 0.3]} radius={0.05} smoothness={high ? 5 : 2}>
              <meshPhysicalMaterial
                ref={inkMat}
                color="#1f1e1c"
                roughness={0.38}
                metalness={0}
                clearcoat={high ? 0.45 : 0}
                clearcoatRoughness={0.35}
                envMapIntensity={1}
              />
            </RoundedBox>
          </group>

          {/* Resting sphere */}
          <group ref={sphere} position={[1.45, FLOOR + 0.22, 0.45]}>
            <mesh>
              <sphereGeometry args={[0.22, high ? 48 : 24, high ? 32 : 16]} />
              <meshPhysicalMaterial
                ref={stoneRef(3)}
                color="#d9d3c6"
                roughness={0.5}
                metalness={0}
                envMapIntensity={0.9}
              />
            </mesh>
          </group>

          {/* Thin orbit ring */}
          <group ref={ring} position={[0, -0.2, 0]}>
            <mesh>
              <torusGeometry args={[1.4, 0.007, 6, high ? 160 : 80]} />
              <meshStandardMaterial ref={lineMat} color="#2a2926" roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

const Lighting: React.FC<{ high: boolean }> = ({ high }) => (
  <>
    <ambientLight intensity={high ? 0.28 : 0.55} />
    <directionalLight position={[3.5, 5, 4]} intensity={high ? 2.3 : 2.6} color="#fff3e2" />
    <directionalLight position={[-4, 2, -2.5]} intensity={0.55} color="#dfe6ee" />
    {high && (
      // Procedural studio: no HDR file is downloaded.
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[-5, 1, 1]} scale={[1.5, 6, 1]} />
        <Lightformer form="rect" intensity={0.5} position={[5, 0, -1]} scale={[1.5, 5, 1]} />
      </Environment>
    )}
  </>
);

const Scene: React.FC<SceneProps> = (props) => {
  const high = props.tier === 'high';
  const ambient = high && !props.reduced;
  return (
    <Canvas
      frameloop={ambient ? 'always' : 'demand'}
      dpr={high ? [1, 1.75] : 1}
      camera={{ position: [0, 0.55, 6.2], fov: 32, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: high, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <Lighting high={high} />
      <Sculpture {...props} />
    </Canvas>
  );
};

export default Scene;
