import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      if (window.scrollY > 10) {
        clearTimeout(timeout);
        setScrolled(true);
      } else {
        timeout = setTimeout(() => setScrolled(false), 5000);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      const el = document.getElementById(id);
      if (el) {
        const offset = id === "hear" ? -40 : -120;
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
      return;
    }

    if (id === "bio") {
      const stack = document.querySelector(".reveal-stack");
      if (stack) {
        // The pinned reveal-stack is wrapped in a .pin-spacer by GSAP.
        // Scroll ~40% into the spacer to land on the bio phase of the timeline.
        const spacer = stack.closest(".pin-spacer") || stack;
        const target = spacer.offsetTop + spacer.offsetHeight * 0.40;
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
    }
    if (id === "watch") {
      const stack = document.querySelector(".reveal-stack");
      if (stack) {
        // Scroll to the top of the pin-spacer to land on Watch
        const spacer = stack.closest(".pin-spacer") || stack;
        window.scrollTo({ top: spacer.offsetTop, behavior: "smooth" });
        return;
      }
    }
    if (id === "hear") {
      const el = document.getElementById("hear");
      if (el) {
        const section = el.closest(".pin-section") ?? el;
        window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
        return;
      }
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : "at-top"}`}>
      <div className="header__logo">Brian Wilkinson</div>
      <nav className={`header__nav ${menuOpen ? "open" : ""}`}>
        <button onClick={() => scrollTo("hero")}>Home</button>
        <button onClick={() => scrollTo("hear")}>Hear</button>
        <button onClick={() => scrollTo("watch")}>Watch</button>
        <button onClick={() => scrollTo("bio")}>Bio</button>
        <button onClick={() => scrollTo("contact")}>Contact</button>
      </nav>
      <button
        className={`header__hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
