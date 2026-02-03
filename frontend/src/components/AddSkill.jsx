import { useState } from "react";
import api from "../api/axios";

const AddSkill = ({ onAdd }) => {
    const [form, setForm] = useState({
        name: "",
        level: "BEGINNER",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/skills", form);
            onAdd(res.data.data);
            setForm({ name: "", level: "BEGINNER" });
        } catch {
            alert("Failed to add skill");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 space-x-2">
            <input
                name="name"
                placeholder="Skill name"
                value={form.name}
                onChange={handleChange}
                className="input"
                required
            />

            <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="input"
            >
                <option>BEGINNER</option>
                <option>INTERMEDIATE</option>
                <option>ADVANCED</option>
            </select>

            <button className="btn">Add</button>
        </form>
    );
};

export default AddSkill;
