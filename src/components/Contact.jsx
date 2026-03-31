import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { supabase } from "../supabaseClient";

const initialForm = { name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: sbError } = await supabase.from("contact_messages").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
      },
    ]);

    setLoading(false);

    if (sbError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
      setForm(initialForm);
    }
  };

  if (success) {
    return (
      <section id="contact" className="contact">
        <div className="contact__success">
          Message sent! Brian will be in touch soon.
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="contact"
      className="contact"
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <form className="contact__form" onSubmit={handleSubmit} noValidate>
        <div className="contact__field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="contact__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="contact__field">
          <label htmlFor="phone">Phone (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 000-0000"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="contact__field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="What's on your mind?"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="contact__error">{error}</div>}
        <button type="submit" className="contact__submit" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </button>
      </form>
    </motion.section>
  );
}
