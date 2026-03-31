import { useEffect, useState } from "react";

export default function Header({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);

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
    if (id === "bio") {
      const stack = document.querySelector(".reveal-stack");
      if (stack) {
        const target = stack.offsetTop + stack.offsetHeight * 0.65;
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
    }
    if (id === "watch") {
      const stack = document.querySelector(".reveal-stack");
      if (stack) {
        window.scrollTo({ top: stack.offsetTop, behavior: "smooth" });
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
      <nav className="header__nav">
        <button onClick={() => scrollTo("hero")}>Home</button>
        <button onClick={() => scrollTo("hear")}>Hear</button>
        <button onClick={() => scrollTo("watch")}>Watch</button>
        <button onClick={() => scrollTo("bio")}>Bio</button>
        <button onClick={() => scrollTo("contact")}>Contact</button>
      </nav>
      <button className="header__login" onClick={onLoginClick}>
        Login
      </button>
    </header>
  );
}
