import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { supabase } from "../supabaseClient";

export default function LoginModal({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (isSignUp) {
      setSuccess("Check your email to confirm your account.");
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 className="modal__title">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email address"
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
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          {error && <div className="modal__error">{error}</div>}
          {success && <div className="modal__success">{success}</div>}
          <button type="submit" className="modal__submit" disabled={loading}>
            {loading ? "…" : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        <button
          className="modal__toggle"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setSuccess("");
          }}
        >
          {isSignUp
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </motion.div>
    </motion.div>
  );
}
