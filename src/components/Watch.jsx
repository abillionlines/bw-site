import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const videos = [
  { id: "3J7mOZnI22U", title: "Video 1" },
  { id: "ul2oGP2Pzuc", title: "Video 2" },
  { id: "3PwGCcXX4fg", title: "Video 3" },
];

const looped = [...videos, ...videos, ...videos, ...videos];

export default function Watch() {
  const trackRef = useRef(null);
  const rowRef = useRef(null);
  const sectionRef = useRef(null);
  const featuredRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [featuredIdx] = useState(() =>
    Math.floor(Math.random() * videos.length),
  );
  const featured = videos[featuredIdx];

  // Populate-on-scroll animation
  useEffect(() => {
    const section = sectionRef.current;
    const featured = featuredRef.current;
    const cards = trackRef.current?.querySelectorAll(".watch__video-card");
    const arrows = section?.querySelectorAll(".watch__arrow");
    if (!section || !featured || !cards?.length) return;

    // Start everything hidden
    gsap.set(featured, { opacity: 0, y: 60, scale: 0.92 });
    gsap.set(cards, { opacity: 0, y: 40, scale: 0.85 });
    gsap.set(arrows, { opacity: 0, x: (i) => (i === 0 ? -20 : 20) });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 10%",
        once: true,
      },
    });

    // Featured slides up and fades in
    tl.to(featured, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: "power3.out",
    })
      // Cards stagger in from below
      .to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.04,
        },
        "-=0.4",
      )
      // Arrows fade in
      .to(
        arrows,
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.3",
      );

    return () => tl.scrollTrigger?.kill();
  }, []);

  // Infinite scroll row
  useEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row) return;

    const singleSetWidth = track.scrollWidth / 4;
    let xPos = 0;

    let lastDragX = 0;
    let isDragging = false;
    let dragDistance = 0;
    let velocity = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      dragDistance = 0;
      velocity = 0;
      lastDragX = e.clientX;
      row.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastDragX;
      dragDistance += Math.abs(dx);
      lastDragX = e.clientX;
      velocity = dx;
      xPos += dx;
    };
    const onPointerUp = (e) => {
      row.releasePointerCapture(e.pointerId);
      if (dragDistance < 5) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const card = el?.closest("[data-video-id]");
        if (card)
          setActiveId(`${card.dataset.videoId}-${card.dataset.videoIdx}`);
      }
      isDragging = false;
      dragDistance = 0;
    };
    row.addEventListener("pointerdown", onPointerDown);
    row.addEventListener("pointermove", onPointerMove);
    row.addEventListener("pointerup", onPointerUp);
    row.addEventListener("pointercancel", onPointerUp);
    row.style.cursor = "grab";

    const tick = () => {
      if (!isDragging) {
        velocity *= 0.92;
        xPos += velocity;
      }
      if (xPos <= -singleSetWidth) xPos += singleSetWidth;
      if (xPos > 0) xPos -= singleSetWidth;
      gsap.set(track, { x: xPos });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      row.removeEventListener("pointerdown", onPointerDown);
      row.removeEventListener("pointermove", onPointerMove);
      row.removeEventListener("pointerup", onPointerUp);
      row.removeEventListener("pointercancel", onPointerUp);
      row.style.cursor = "";
    };
  }, []);

  const shiftRow = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth =
      track.querySelector(".watch__video-card")?.offsetWidth ?? 300;
    gsap.to(track, {
      x: `+=${dir * -(cardWidth + 24)}`,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section id="watch" className="watch" ref={sectionRef}>
      {/* Fullscreen video modal */}
      {activeId && (
        <div className="watch__modal" onClick={() => setActiveId(null)}>
          <div
            className="watch__modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="watch__modal-close"
              onClick={() => setActiveId(null)}
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeId.split("-")[0]}?autoplay=1&rel=0`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Featured video */}
      <div className="watch__featured" ref={featuredRef}>
        <div
          className="watch__featured-thumb"
          onClick={() => setActiveId(`${featured.id}-featured`)}
        >
          <img
            src={`https://i.ytimg.com/vi/${featured.id}/maxresdefault.jpg`}
            alt={featured.title}
          />
          <div className="watch__featured-play">&#9654;</div>
        </div>
      </div>

      {/* Thumbnail row with arrows */}
      <div className="watch__row-wrap">
        <button
          className="watch__arrow watch__arrow--left"
          onClick={() => shiftRow(-1)}
        >
          &#8592;
        </button>
        <div className="watch__row" ref={rowRef}>
          <div ref={trackRef} className="watch__marquee-track">
            {looped.map((v, i) => (
              <div
                key={i}
                className="watch__video-card"
                data-video-id={v.id}
                data-video-idx={i}
              >
                <div className="watch__thumb">
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="watch__arrow watch__arrow--right"
          onClick={() => shiftRow(1)}
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
