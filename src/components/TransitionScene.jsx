import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import coverImg from "../assets/stillwater-assets/stillwateroriginal.webp";

// Light leak sweep directions per scene
const SWEEP_DIRS = [
  { from: "-110%", to: "110%" }, // left → right
  { from: "110%", to: "-110%" }, // right → left
  { from: "-110%", to: "110%" }, // left → right
  { from: "110%", to: "-110%" }, // right → left
];

export default function TransitionScene({ index }) {
  const wrapperRef = useRef(null);
  const sceneRef = useRef(null);
  const imgRef = useRef(null);
  const burnRef = useRef(null);
  const washRef = useRef(null); // white overlay simulating blown-out exposure
  const dir = SWEEP_DIRS[index] ?? SWEEP_DIRS[0];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const scene = sceneRef.current;
    const img = imgRef.current;
    const burn = burnRef.current;
    const wash = washRef.current;
    const spacer = wrapper.closest(".ts-spacer") ?? wrapper;
    if (!scene || !wrapper || !img || !burn || !wash) return;

    // Initial state
    gsap.set(scene, { autoAlpha: 0 });
    gsap.set(img, { scale: 1.08, autoAlpha: 0 });
    gsap.set(burn, { autoAlpha: 0 });
    gsap.set(wash, { autoAlpha: 1 }); // starts fully white (blown-out look)

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    // Scene fades in
    tl.to(scene, { autoAlpha: 1, duration: 0.05 });

    // Burn glow flares up
    tl.to(burn, { autoAlpha: 0.8, duration: 0.2, ease: "power1.in" }, 0.05);

    // Image burns in: scale down + fade in image, fade out white wash
    tl.to(
      img,
      { autoAlpha: 1, scale: 1.0, duration: 0.4, ease: "power1.out" },
      0.1,
    );
    tl.to(wash, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, 0.1);

    // Burn glow fades away as image resolves
    tl.to(burn, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, 0.25);

    // Hold the full image
    tl.to({}, { duration: 0.15 });

    // Exit: burn glow flares back up, image burns out
    tl.to(burn, { autoAlpha: 0.5, duration: 0.2, ease: "power1.in" });
    tl.to(
      img,
      { autoAlpha: 0.3, scale: 1.04, duration: 0.35, ease: "power1.in" },
      "-=0.15",
    );
    tl.to(
      wash,
      { autoAlpha: 0.6, duration: 0.35, ease: "power1.in" },
      "-=0.35",
    );
    tl.to(burn, { autoAlpha: 0, duration: 0.15 });

    const st = ScrollTrigger.create({
      trigger: spacer,
      start: "top bottom",
      end: "bottom 20%",
      scrub: 1, // smooth 1s interpolation instead of raw scrub
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
          <div ref={washRef} className="ts-filmburn__wash" />
          <div ref={burnRef} className="ts-filmburn__leak" />
          <div className="ts-grain" />
        </div>
      </div>
    </div>
  );
}
