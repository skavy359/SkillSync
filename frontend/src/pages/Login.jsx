import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/auth/login", form);

            login(res.data.data); // token + user
            navigate("/dashboard"); // ✅ MUST EXIST
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Login</h2>
            <input name="email" placeholder="Email" onChange={handleChange} className="input" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" />
            <button className="btn mt-4">Login</button>
        </form>
    );
};

export default Login;
