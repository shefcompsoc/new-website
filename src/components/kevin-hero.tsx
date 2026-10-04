"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

const Scene = dynamic(() => import("./kevin-scene"), { ssr: false });

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function KevinHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => {
    setReady(false);
    setEnabled(false);
  }, []);
  const start = useCallback(() => setEnabled(true), []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    const updateMotion = () => {
      clearTimeout(timer);
      if (motion.matches) {
        setEnabled(false);
        setReady(false);
      }
      else if (matchMedia("(min-width: 761px)").matches) timer = setTimeout(start, 1800);
    };
    updateMotion();
    motion.addEventListener("change", updateMotion);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    if (ref.current) observer.observe(ref.current);
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [start]);

  return (
    <>
      <div className="kevin-stage" ref={ref} aria-hidden="true">
        <Image
          className={ready && enabled ? "kevin-poster is-ready" : "kevin-poster"}
          src="/brand/kevin-poster.svg"
          alt=""
          width={600}
          height={600}
          loading="eager"
          fetchPriority="high"
        />
        {enabled && (
          <div className={`kevin-canvas ${ready ? "is-ready" : ""}`}>
            <SceneBoundary onError={markFailed}>
              <Scene active={visible && tabVisible} onReady={markReady} />
            </SceneBoundary>
          </div>
        )}
      </div>
    </>
  );
}
