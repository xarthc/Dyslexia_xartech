import { useState } from "react";
import contactImg from "../assets/contact.jpg"; 
// replace with your image name if you paste locally

const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiBaseUrl = import.meta.env.DEV ? "" : configuredApiBase;

const Therapist = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    symptom: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const therapists = [
    {
      img: "https://images.jdmagicbox.com/v2/comp/delhi/e2/011pxx11.xx11.160108115000.w5e2/catalogue/dr-owais-a-farooqui-psycare-jasola-vihar-delhi-3k1q77u.jpg",
      name: "Dr.Owais Akram Farooqui (PhD)",
      location: "New Friend Colony, Delhi",
    },
    {
      img: "https://assets.lybrate.com/img/documents/doctor/dp/a83a2fd256f01509cd219495a018f756/Psychology-RashiAnandLaskari-Mumbai-26694b.jpg",
      name: "Dr.Rashi Laskari",
      location: "Inner Light Counselling Centre, Mumbai",
    },
    {
      img: "https://www.fortishealthcare.com/drupal-data/doctors/dr-priyanka-sharma-10400.jpg",
      name: "Dr.Priyanka Sharma",
      location: "Fortis Hospital, Delhi",
    },
    {
      img: "https://assets.lybrate.com/img/documents/doctor/dp/41a8964843c26e9b7d88e546ac6b76ea/Psychology-VikasKhanna-Gurgaon-b925ef.png",
      name: "Dr.Vikas Khanna",
      location: "Rajouri Garden, Delhi",
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloEvIboHUN0oLt8aL_8WeABFUrHGAic2N0A&s",
      name: "Ms.Khyati Malik",
      location: "Ashok Vihar, Delhi",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      subject: "Therapist Contact Request",
      message: `Phone: ${formData.phone}\nSymptoms: ${formData.symptom}`,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || "Unable to submit your request right now.");
      }

      setStatus({
        type: "success",
        message: "Submitted successfully. A therapist will contact you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        symptom: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to submit your request right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="therapist-section"
      // style={{
      //   backgroundImage:
      //     "url('https://img.freepik.com/premium-photo/navy-blue-background-images-background-copy-space_1179130-728432.jpg')",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <h1>Meet Our Therapists</h1>

      {/* Therapist Cards */}
      <div className="therapist-cards">
        {therapists.map((t, index) => (
          <div className="card" key={index}>
            <img src={t.img} alt={t.name} />
            <p>
              {t.name}
              <br />
              {t.location}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="contact-wrapper">
        <img
          src={contactImg}
          alt="Therapist Support"
          className="contact-image"
        />

        <div className="form-container">
          <h3>Contact Form</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="symptom"
              placeholder="What is your symptom?"
              rows="4"
              value={formData.symptom}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {status.message ? (
              <p className={`therapist-contact-status ${status.type}`}>{status.message}</p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Therapist;
