import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import img1 from "../assets/transition-images/image.webp";
import img2 from "../assets/transition-images/StillWater2.webp";
import img3 from "../assets/transition-images/stillwater portrait.webp";
import img4 from "../assets/transition-images/CB787A7C-36DD-43DF-BEE5-09401B70F435_1_201_a.webp";
import img5 from "../assets/transition-images/IMG_0516.webp";
import img6 from "../assets/transition-images/902EB426-B075-440F-9A7C-DCC8368DFB53_1_105_c.webp";
import img7 from "../assets/transition-images/EF05DFC2-AC5E-49F2-B830-3194577C7D32_1_105_c.webp";
import img8 from "../assets/transition-images/74B92F53-F170-411C-9F38-AD28940CFDDA_1_105_c.webp";
import img9 from "../assets/transition-images/94D025A2-B193-4FA8-B33D-B59E815C457F_1_105_c.webp";

const ALL_IMGS = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

// Each scene gets 6 images, cycling through all 9
const SCENES = [
  // Hero → Hear
  [
    { img: ALL_IMGS[0], label: "Live at the Loft" },
    { img: ALL_IMGS[1], label: "Stillwater Sessions" },
    { img: ALL_IMGS[2], label: "New Americana" },
    { img: ALL_IMGS[3], label: "Stage Light" },
    { img: ALL_IMGS[4], label: "Pacific Coast" },
    { img: ALL_IMGS[5], label: "Desert Sky" },
  ],
  // Hear → Watch
  [
    { img: ALL_IMGS[6], label: "On the Road" },
    { img: ALL_IMGS[7], label: "Desert Light" },
    { img: ALL_IMGS[8], label: "Open Highway" },
    { img: ALL_IMGS[0], label: "Pacific Coast" },
    { img: ALL_IMGS[1], label: "Sunrise Set" },
    { img: ALL_IMGS[2], label: "Night Drive" },
  ],
  // Watch → Bio
  [
    { img: ALL_IMGS[3], label: "Studio A" },
    { img: ALL_IMGS[4], label: "The Sessions" },
    { img: ALL_IMGS[5], label: "Backstage" },
    { img: ALL_IMGS[6], label: "Sound Check" },
    { img: ALL_IMGS[7], label: "After Hours" },
    { img: ALL_IMGS[8], label: "Mixing Board" },
  ],
  // Bio → Contact
  [
    { img: ALL_IMGS[0], label: "Phoenix Nights" },
    { img: ALL_IMGS[3], label: "Acoustic Set" },
    { img: ALL_IMGS[6], label: "Brian Wilkinson" },
    { img: ALL_IMGS[2], label: "Songwriter" },
    { img: ALL_IMGS[5], label: "New Americana" },
    { img: ALL_IMGS[8], label: "Stillwater" },
  ],
];

export default function TransitionScene({ index }) {
  const sceneRef = useRef(null);
  const wrapperRef = useRef(null);
  const cells = SCENES[index] ?? SCENES[0];

  useEffect(() => {
    const scene = sceneRef.current;
    const wrapper = wrapperRef.current;
    const gridCells = scene.querySelectorAll(".ts-cell");
    const spacer = wrapper.closest(".ts-spacer") ?? wrapper;
    if (!scene || !wrapper) return;

    const vw = window.innerWidth;
    const cellArr = Array.from(gridCells);

    // Each cell starts off-screen left or right (alternating, deterministic)
    const xOrigins = cellArr.map((_, i) =>
      i % 2 === 0 ? -(vw * 0.55) : vw * 0.55,
    );

    gsap.set(scene, { autoAlpha: 0 });
    cellArr.forEach((cell, i) => {
      gsap.set(cell, { x: xOrigins[i], autoAlpha: 0 });
    });

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    tl.to(scene, { autoAlpha: 1, duration: 0.1 });
    tl.to(cellArr, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08 }, "<");
    tl.to({}, { duration: 0.2 });
    tl.to(cellArr, {
      x: (i) => xOrigins[i] * -0.4,
      autoAlpha: 0,
      duration: 0.4,
      stagger: 0.06,
    });
    tl.to(scene, { autoAlpha: 0, duration: 0.1 }, "-=0.1");

    const st = ScrollTrigger.create({
      trigger: spacer,
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
      animation: tl,
      onEnter: () =>
        cellArr.forEach((c) => (c.style.willChange = "transform, opacity")),
      onLeave: () => cellArr.forEach((c) => (c.style.willChange = "auto")),
      onEnterBack: () =>
        cellArr.forEach((c) => (c.style.willChange = "transform, opacity")),
      onLeaveBack: () => cellArr.forEach((c) => (c.style.willChange = "auto")),
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="ts-wrapper">
      <div ref={sceneRef} className="ts-scene">
        <div className="ts-depth-shadow" />
        <div className="ts-grid">
          <div className="ts-grain" />
          {cells.map((cell, i) => (
            <div key={i} className="ts-cell">
              <img
                src={cell.img}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div className="ts-cell__vignette" />
              <span className="ts-cell__label">{cell.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
