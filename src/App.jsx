import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
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
    // Progress bar: update on native scroll
    // Progress bar — throttled via rAF to avoid layout thrashing
    let progressTick = false;
    const onScroll = () => {
      if (progressTick) return;
      progressTick = true;
      requestAnimationFrame(() => {
        if (progressRef.current) {
          const progress =
            window.scrollY / (document.body.scrollHeight - window.innerHeight);
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        progressTick = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pin each section
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const sections = gsap.utils.toArray(".pin-section");
    sections.forEach((section) => {
      if (isMobile && section.classList.contains("pin-section--hear")) return;
      if (section.closest(".reveal-stack")) return;
      if (section.classList.contains("pin-section--contact")) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=600",
        pin: true,
        pinSpacing: true,
      });
    });

    // Recalculate after images/fonts have loaded — critical when mounting
    // after login gate since large images shifts page height significantly
    const refresh2 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    window.addEventListener("load", () => ScrollTrigger.refresh());

    return () => {
      clearTimeout(refresh2);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Still checking auth state
  if (session === undefined) return null;

  // Gate removal: April 10, 2026 at 6:00 AM ET (UTC-4)
  const GATE_EXPIRES = new Date("2026-04-10T10:00:00Z"); // 6 AM ET = 10:00 UTC
  const gateOpen = Date.now() >= GATE_EXPIRES.getTime();

  // Not logged in — show full-screen gate (unless timer has expired)
  if (!session && !gateOpen) return <SiteGate onLogin={() => {}} />;

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
      <Header />
      <main>
        <Hero />
        <div className="hero-gap" />
        <div className="ts-spacer">
          <TransitionScene index={0} />
        </div>
        <div className="pin-section pin-section--hear">
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
