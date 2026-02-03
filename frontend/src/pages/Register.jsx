import { useState } from "react";
import api from "../api/axios";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/users", form);

            if (res.data.success) {
                alert("Registration successful. Please login.");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                alert(err.response.data.message);
            } else {
                alert("Server error. Try again later.");
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Register</h2>
            <input name="name" placeholder="Name" onChange={handleChange} className="input" />
            <input name="email" placeholder="Email" onChange={handleChange} className="input" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" />
            <button className="btn mt-4">Register</button>
        </form>
    );
};

export default Register;
