import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import img1 from "../assets/transition-images/image.jpg";
import img2 from "../assets/transition-images/StillWater2.jpg";
import img3 from "../assets/transition-images/stillwater portrait.jpg";
import img4 from "../assets/transition-images/CB787A7C-36DD-43DF-BEE5-09401B70F435_1_201_a.jpeg";
import img5 from "../assets/transition-images/IMG_0516.jpg";
import img6 from "../assets/transition-images/902EB426-B075-440F-9A7C-DCC8368DFB53_1_105_c.jpeg";
import img7 from "../assets/transition-images/EF05DFC2-AC5E-49F2-B830-3194577C7D32_1_105_c.jpeg";
import img8 from "../assets/transition-images/74B92F53-F170-411C-9F38-AD28940CFDDA_1_105_c.jpeg";
import img9 from "../assets/transition-images/94D025A2-B193-4FA8-B33D-B59E815C457F_1_105_c.jpeg";

gsap.registerPlugin(ScrollTrigger);

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
    // Trigger off the next sibling (the Hear pin-section)
    // The wrapper is now inside .ts-spacer, so climb up to find the next section
    const spacer = wrapper.closest(".ts-spacer") ?? wrapper;
    const nextSection = spacer.nextElementSibling;
    if (!scene || !wrapper || !nextSection) return;

    const speeds = [0.6, 1.0, 0.75, 0.9, 0.55, 0.85];
    const vw = window.innerWidth;

    // Assign each cell a random off-screen x start: left or right outside viewport
    const cellArr = Array.from(gridCells);
    const xOrigins = cellArr.map(() =>
      Math.random() < 0.5 ? -(vw * 1.4) : vw * 1.4,
    );

    gsap.set(scene, { opacity: 0 });
    cellArr.forEach((cell, i) => {
      gsap.set(cell, { x: xOrigins[i], opacity: 0, scale: 0.25 });
    });

    // Shuffle indices for random arrival order
    const order = cellArr.map((_, i) => i).sort(() => Math.random() - 0.5);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: nextSection,
        start: "top 100%",
        end: "top 15%",
        scrub: 2,
      },
    });

    tl.to(scene, { opacity: 1, duration: 0.05, ease: "none" });

    // Cells slide in from their random side one by one in shuffled order
    order.forEach((idx, i) => {
      tl.to(
        cellArr[idx],
        { x: 0, opacity: 1, scale: 1, duration: 0.08, ease: "power4.out" },
        `<${i * 0.015}`,
      );
    });

    // Hold — most of the timeline sits here before fade-out
    tl.to({}, { duration: 0.35 });

    // Cells disperse upward and fade out
    cellArr.forEach((cell, i) => {
      tl.to(
        cell,
        { y: -65 * speeds[i], opacity: 0, duration: 0.3, ease: "power2.in" },
        "<0.03",
      );
    });

    tl.to(scene, { opacity: 0, duration: 0.08, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
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
