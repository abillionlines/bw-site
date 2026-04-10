import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import stillwater7 from "../assets/stillwater-assets/stillwater7.webp";

const videos = [
  { id: "isamiCq-5yc", title: "Not Yet" },
  { id: "8S-9pohkXwg", title: "I Think I Kinda Know Myself" },
  { id: "vgQZBNZHpdE", title: "No One Told You" },
];

const looped = [...videos, ...videos, ...videos, ...videos];

export default function Watch() {
  const trackRef = useRef(null);
  const rowRef = useRef(null);
  const sectionRef = useRef(null);
  const featuredRef = useRef(null);
  const bgRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const featured = videos[0];

  // Parallax background
  useEffect(() => {
    const bg = bgRef.current;
    const section = sectionRef.current;
    if (!bg || !section) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Skip parallax on desktop inside the pinned reveal-stack to avoid jank
    if (!isMobile && section.closest(".reveal-stack")) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    tl.fromTo(bg, { y: "15%" }, { y: "-15%", ease: "none" });
    return () => tl.scrollTrigger?.kill();
  }, []);

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

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: isMobile
          ? section
          : section.closest(".reveal-stack") || section,
        start: isMobile ? "top 85%" : "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Featured slides up and fades in
    tl.to(featured, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isMobile ? 0.9 : 3.2,
      ease: "power3.out",
    })
      // Cards stagger in from below
      .to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isMobile ? 0.5 : 1.9,
          ease: "power2.out",
          stagger: isMobile ? 0.04 : 0.1,
        },
        isMobile ? "-=0.4" : "-=1.3",
      )
      // Arrows fade in
      .to(
        arrows,
        {
          opacity: 1,
          x: 0,
          duration: isMobile ? 0.4 : 1.3,
          ease: "power2.out",
          stagger: 0.1,
        },
        isMobile ? "-=0.3" : "-=0.9",
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
        if (card) setActiveId(card.dataset.videoId);
      }
      isDragging = false;
      dragDistance = 0;
    };

    const onWheel = (e) => {
      // Horizontal trackpad scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        xPos -= e.deltaX;
        velocity = -e.deltaX * 0.3;
      }
    };

    row.addEventListener("pointerdown", onPointerDown);
    row.addEventListener("pointermove", onPointerMove);
    row.addEventListener("pointerup", onPointerUp);
    row.addEventListener("pointercancel", onPointerUp);
    row.addEventListener("wheel", onWheel, { passive: false });
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

    // Expose shift function via ref so arrow buttons can nudge xPos directly
    row._shiftRow = (dir) => {
      const cardWidth =
        track.querySelector(".watch__video-card")?.offsetWidth ?? 300;
      velocity = dir * -(cardWidth + 24) * 0.3;
      xPos += dir * -(cardWidth + 24);
    };

    return () => {
      gsap.ticker.remove(tick);
      row.removeEventListener("pointerdown", onPointerDown);
      row.removeEventListener("pointermove", onPointerMove);
      row.removeEventListener("pointerup", onPointerUp);
      row.removeEventListener("pointercancel", onPointerUp);
      row.removeEventListener("wheel", onWheel);
      row.style.cursor = "";
    };
  }, []);

  const shiftRow = (dir) => {
    if (rowRef.current?._shiftRow) rowRef.current._shiftRow(dir);
  };

  return (
    <section id="watch" className="watch" ref={sectionRef}>
      {/* Parallax background */}
      <div className="watch__bg" ref={bgRef}>
        <img src={stillwater7} alt="" />
      </div>
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
              src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0`}
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
          onClick={() => setActiveId(featured.id)}
        >
          <img
            src={`https://i.ytimg.com/vi/${featured.id}/maxresdefault.jpg`}
            alt={featured.title}
          />
          <div className="watch__featured-play">&#9654;</div>
          <span className="watch__thumb-title">{featured.title}</span>
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
                  <span className="watch__thumb-title">{v.title}</span>
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
