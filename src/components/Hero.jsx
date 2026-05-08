import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaSpotify,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";

import img1 from "../assets/hero-images/BWStillWater.webp";
import img2 from "../assets/hero-images/Still WAter Portrait 4.1.webp";
import img3 from "../assets/hero-images/StillWater Post 2.webp";
import img4 from "../assets/hero-images/Still Water Portrait 21.webp";
import img5 from "../assets/hero-images/Still Water Portrait 16.webp";
import img6 from "../assets/hero-images/Still Water Portrait 18.webp";
import img8 from "../assets/hero-images/Still Water Dock Silhouette.webp";

const allImages = [img1, img2, img3, img4, img5, img6, img8];
const mobileImages = [img2, img3, img4, img5, img6, img8];

// Shuffle array using Fisher-Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const isMobile =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 768px)").matches;
const images = shuffle(isMobile ? mobileImages : allImages);

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToHear = () => {
    document.getElementById("hear")?.scrollIntoView();
  };

  return (
    <section id="hero" className="hero" ref={containerRef}>
      {images.map((src, i) => (
        <div key={i} className={`hero__slide ${i === current ? "active" : ""}`}>
          <img src={src} alt={`Brian Wilkinson slide ${i + 1}`} />
        </div>
      ))}

      <div className="hero__overlay">
        <motion.h1
          className="hero__name"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Brian Wilkinson
        </motion.h1>
        <motion.div
          className="hero__release-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        >
          <span className="hero__release">
            <em>Still Water</em>&nbsp;&nbsp;&nbsp;
            <span style={{ color: "#888" }}>Out Now</span>
          </span>
          <button className="hero__listen-btn" onClick={scrollToHear}>
            Listen
          </button>
        </motion.div>
        <motion.div
          className="hero__socials"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.7 },
            },
          }}
        >
          {[
            {
              href: "https://www.instagram.com/brianwilkinsonmusic",
              label: "Instagram",
              icon: <FaInstagram />,
            },
            {
              href: "https://open.spotify.com/album/2vSnyXQVHIOg5fSQCfMkyd?si=DgkFtN7WSfOopotfUs9PWg",
              label: "Spotify",
              icon: <FaSpotify />,
            },
            {
              href: "mailto:brian@brianwilkinson.net",
              label: "Email",
              icon: <FaEnvelope />,
            },
            {
              href: "https://www.linkedin.com/in/brianwilkinsoninc",
              label: "LinkedIn",
              icon: <FaLinkedin />,
            },
            {
              href: "https://www.facebook.com/brianwilkinsonmusic",
              label: "Facebook",
              icon: <FaFacebook />,
            },
          ].map(({ href, label, icon }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto") ? undefined : "noopener noreferrer"
              }
              aria-label={label}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.2, color: "#D1801E" }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
