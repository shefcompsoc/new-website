"use client";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL = "/brand/kevin.glb";

function Kevin({ active, onReady }: { active: boolean; onReady: () => void }) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const elapsed = useRef(0);
  const { scene } = useLoader(GLTFLoader, MODEL);
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [active, invalidate]);
  useEffect(() => {
    const frame = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(frame);
  }, [onReady]);
  useFrame((_state, delta) => {
    if (!group.current || !active) return;
    elapsed.current += Math.min(delta, 0.05);
    group.current.rotation.set(
      0.22 + Math.sin(elapsed.current * 0.35) * 0.08,
      -0.42 + Math.sin(elapsed.current * 0.25) * 0.15,
      -0.12,
    );
    group.current.position.y = 0.18 + Math.sin(elapsed.current * 0.6) * 0.1;
  });
  return (
    <group ref={group} rotation={[0.22, -0.42, -0.12]} position={[0, 0.18, 0]} scale={1.1}>
      <primitive object={scene} />
    </group>
  );
}

export default function KevinScene(props: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.3], fov: 37 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback={null}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 5, 5]} intensity={4} />
      <directionalLight position={[-4, 1, 2]} intensity={2} />
      <Suspense fallback={null}>
        <Kevin {...props} />
      </Suspense>
    </Canvas>
  );
}
