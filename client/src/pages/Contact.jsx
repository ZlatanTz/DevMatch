import { Form } from "react-router-dom";
import Logo from "../assets/devmatch.svg";
import emailjs from "@emailjs/browser";
import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceId = "service_u7hd7lb";
    const templateId = "template_kgiak4j";
    const publicKey = "rntMmVD6V03RmtyK5";

    const templateParms = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParms, publicKey)
      .then((response) => {
        console.log("Success", response);
        setName("");
        setEmail("");
        setMessage("");
        setSubject("");
      })
      .catch((error) => {
        console.log("Error sending mail:", error);
      });
  };

  return (
    <div className="max-w-5xl mx-auto mt-[50px] mb-[20px] grid grid-cols-1 md:grid-cols-2 items-center">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Contact Us</h1>

        <Form method="post" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              required
              className="w-full border rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="w-full border rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Message subject"
              required
              className="w-full border rounded-lg p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Message</label>
            <textarea
              name="message"
              placeholder="Write your message here..."
              rows="5"
              required
              className="w-full border rounded-lg p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="cursor-pointer bg-emerald text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Send Message
            </button>
          </div>
        </Form>
      </div>
      <div className="flex justify-center">
        <img
          src={Logo}
          alt="Contact illustration"
          className="w-full max-w-[200px] sm:max-w-[250px] mx-4 mt-4 md:max-w-[350px] mx-4 mt-4  lg:max-w-[450px] mx-4 mt-4 xl:max-w-[550px] mx-4 mt-4 rounded-xl p-2"
        />
      </div>
    </div>
  );
}

export default Contact;
