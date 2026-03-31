import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { supabase } from "../supabaseClient";

export default function SiteGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const chars = Array.from(title.querySelectorAll(".gate__title-char"));
    if (!chars.length) return;

    chars.forEach((char, i) => {
      gsap.to(char, {
        y: -1.4,
        skewX: 0.4,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.1,
      });
      gsap.to(char, {
        opacity: 0.95,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.12 + 0.4,
      });
    });

    return () => gsap.killTweensOf(chars);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div className="site-gate">
      <div className="site-gate__box">
        <h1 className="site-gate__title">Brian Wilkinson</h1>
        <p ref={titleRef} className="site-gate__sub">
          {"Still Water".split("").map((char, i) => (
            <span key={i} className="gate__title-char">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
        <form className="site-gate__form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <div className="site-gate__error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
