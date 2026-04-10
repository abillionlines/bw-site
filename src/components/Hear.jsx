import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import cover from "../assets/hero-images/Still Water Portrait 17.webp";
import bgVideo from "../assets/stillwater-assets/lakewater20.mp4";
import track1 from "../assets/stillwater-assets/Brian Wilkinson - No One Told You.mp3";
import track2 from "../assets/stillwater-assets/Brian WIlkinson - Not Yet.mp3";
import track3 from "../assets/stillwater-assets/Brian Wilkinson - I Think I Kinda Know Myself.mp3";

const tracks = [
  { title: "Not Yet", src: track2 },
  { title: "No One Told You", src: track1 },
  { title: "I Think I Kinda Know Myself", src: track3 },
];

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Hear() {
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const titleRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Flowing water wave effect on title characters
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const chars = Array.from(title.querySelectorAll(".hear__title-char"));
    if (!chars.length) return;

    // Start invisible — scroll timeline controls overall opacity
    gsap.set(title, { opacity: 0 });

    // Scroll-driven fade in as section enters, fade out as section leaves
    const pinSection = title.closest(".pin-section");
    let fadeTl;
    if (pinSection) {
      fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });
      fadeTl
        .to(title, { opacity: 1, duration: 0.3, ease: "none" })
        .to(title, { opacity: 1, duration: 0.4, ease: "none" })
        .to(title, { opacity: 0, duration: 0.3, ease: "none" });
    }

    // Continuous looping wave — each char bobs up/down with a phase offset
    const waveTweens = [];
    chars.forEach((char, i) => {
      waveTweens.push(
        gsap.to(char, {
          y: -14,
          skewX: 4,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.1,
          paused: true,
        }),
      );
      // Subtle opacity shimmer to mimic light on water
      waveTweens.push(
        gsap.to(char, {
          opacity: 0.55,
          duration: 2.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.12 + 0.4,
          paused: true,
        }),
      );
    });

    // Only run wave tweens while section is visible
    const waveST = ScrollTrigger.create({
      trigger: pinSection ?? sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => waveTweens.forEach((t) => t.play()),
      onLeave: () => waveTweens.forEach((t) => t.pause()),
      onEnterBack: () => waveTweens.forEach((t) => t.play()),
      onLeaveBack: () => waveTweens.forEach((t) => t.pause()),
    });

    return () => {
      waveTweens.forEach((t) => t.kill());
      waveST.kill();
      fadeTl?.scrollTrigger?.kill();
      fadeTl?.kill();
    };
  }, []);

  const playTrack = (idx) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 50);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    const idx = (activeIdx - 1 + tracks.length) % tracks.length;
    playTrack(idx);
  };

  const handleNext = () => {
    const idx = (activeIdx + 1) % tracks.length;
    playTrack(idx);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <section ref={sectionRef} id="hear" className="hear">
      {/* Video background */}
      <video
        ref={bgRef}
        className="hear__bg-video"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.target.playbackRate = 0.7;
        }}
      />
      {/* Flowing water title */}
      <h2 ref={titleRef} className="hear__title">
        {"Still Water".split("").map((char, i) => (
          <span key={i} className="hear__title-char">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
      <audio
        ref={audioRef}
        src={tracks[activeIdx].src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="hear__player">
        <img src={cover} alt="Stillwater album cover" className="hear__cover" />
        <div className="hear__tracks">
          {tracks.map((track, i) => (
            <motion.div
              key={i}
              className={`hear__track ${i === activeIdx ? "active" : ""}`}
              onClick={() => playTrack(i)}
              animate={
                i === activeIdx
                  ? { boxShadow: "0 0 0 1px #D1801E" }
                  : { boxShadow: "0 0 0 0px transparent" }
              }
              transition={{ duration: 0.3 }}
            >
              <span className="hear__track-num">{i + 1}</span>
              <span className="hear__track-name">{track.title}</span>
            </motion.div>
          ))}
          <div className="hear__controls">
            <button
              className="hear__play-btn"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <FaStepBackward />
            </button>
            <button
              className="hear__play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              className="hear__play-btn"
              onClick={handleNext}
              aria-label="Next"
            >
              <FaStepForward />
            </button>
            <div className="hear__progress-wrap">
              <input
                className="hear__progress"
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
              />
              <div className="hear__time">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
