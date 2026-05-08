import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import coverImg from "../assets/stillwater-assets/stillwateroriginal.webp";

export default function TransitionScene({ index }) {
  const wrapperRef = useRef(null);
  const sceneRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const scene = sceneRef.current;
    const img = imgRef.current;
    const spacer = wrapper.closest(".ts-spacer") ?? wrapper;
    if (!scene || !wrapper || !img) return;

    // Start invisible
    gsap.set(scene, { autoAlpha: 0 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    // Fade in as spacer enters viewport, hold, then fade out
    tl.to(scene, { autoAlpha: 1, duration: 0.3 });
    tl.to({}, { duration: 0.4 });
    tl.to(scene, { autoAlpha: 0, duration: 0.3 });

    const st = ScrollTrigger.create({
      trigger: spacer,
      start: "top bottom",
      end: "bottom 20%",
      scrub: true,
      animation: tl,
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="ts-wrapper">
      <div ref={sceneRef} className="ts-scene">
        <div className="ts-filmburn">
          <img
            ref={imgRef}
            className="ts-filmburn__img"
            src={coverImg}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
