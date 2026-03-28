import { useMemo, useState } from "react";

const initialFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiBaseUrl = import.meta.env.DEV ? "" : configuredApiBase;

export default function ContactForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const canSubmit = useMemo(() => {
    const { name, email, subject, message } = formData;
    return name.trim() && email.trim() && subject.trim() && message.trim();
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send your message right now.");
      }

      setStatus({
        type: "success",
        message: "Message sent successfully. We will contact you soon.",
      });
      setFormData(initialFormState);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your message right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-wrapper">
      <h2>Contact Us</h2>
      <p>Have questions? Send us a message and we will get back to you.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="How can we help?"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
        />

        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status.message ? (
        <p className={`contact-form-status ${status.type}`}>{status.message}</p>
      ) : null}
    </div>
  );
}
