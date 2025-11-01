import React, { useState } from "react";
import Footer from "../components/Reusable/Footer";
import Sidebar from "../components/Reusable/Sidebar";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="flex flex-1 items-center justify-center min-w-96">
                <div className="w-fit max-w-lg flex justify-center items-center bg-base-200">
                    <Sidebar/>
                    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-2 text-center text-primary">Contact Us</h2>
                        <p className="mb-6 text-center text-gray-600">
                            Have questions or feedback? Fill out the form below and we'll get back to you soon.
                        </p>
                        {submitted ? (
                            <div className="text-green-600 text-center mt-8 font-semibold">
                                Thank you for contacting us!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block mb-1 font-medium">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-1 font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block mb-1 font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="textarea textarea-bordered w-full"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
