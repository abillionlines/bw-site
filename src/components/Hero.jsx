import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaSpotify,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";

import img1 from "../assets/hero-images/BWStillWater.jpg";
import img2 from "../assets/hero-images/Still WAter Portrait 4.1.jpg";
import img3 from "../assets/hero-images/StillWater Post 2.jpg";
import img4 from "../assets/hero-images/Stillwater portrait 6.jpg";

const images = [img1, img2, img3, img4];

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
        <motion.div
          key={i}
          className={`hero__slide ${i === current ? "active" : ""}`}
        >
          <img src={src} alt={`Brian Wilkinson slide ${i + 1}`} />
        </motion.div>
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
          <span className="hero__release">Stillwater Out Now</span>
          <button className="hero__listen-btn" onClick={scrollToHear}>
            Listen Now
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
              href: "https://open.spotify.com/artist/6ITDabakKdMXcwDEz9Flej?si=7rCFlyQRTCS5bjE-vs3Kbw",
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
              whileHover={{ scale: 1.2, color: "#FAB95B" }}
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
