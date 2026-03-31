import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Hear from "./components/Hear";
import Watch from "./components/Watch";
import Bio from "./components/Bio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SiteGate from "./components/SiteGate";
import TransitionScene from "./components/TransitionScene";
import { supabase } from "./supabaseClient";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [showLogin, setShowLogin] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    // Progress bar: update on native scroll
    const onScroll = () => {
      if (progressRef.current) {
        const progress =
          window.scrollY / (document.body.scrollHeight - window.innerHeight);
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pin each section
    const sections = gsap.utils.toArray(".pin-section");
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=700",
        pin: true,
        pinSpacing: true,
      });
    });

    // Ensure ScrollTrigger recalculates all positions after full paint
    // (needed in production where styles load differently than dev)
    ScrollTrigger.refresh();
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Still checking auth state
  if (session === undefined) return null;

  // Not logged in — show full-screen gate
  if (!session) return <SiteGate onLogin={() => {}} />;

  return (
    <>
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ transformOrigin: "left", transform: "scaleX(0)" }}
      />
      <motion.div
        className="curtain"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      />
      <Header onLoginClick={() => setShowLogin(true)} />
      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
      <main>
        <Hero />
        <div className="ts-spacer">
          <TransitionScene index={0} />
        </div>
        <div className="pin-section">
          <Hear />
        </div>
        <div className="reveal-stack">
          <div className="pin-section reveal-stack__watch">
            <Watch />
          </div>
          <div className="pin-section reveal-stack__bio">
            <Bio />
          </div>
        </div>
        <div className="pin-section pin-section--contact">
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
