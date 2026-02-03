import { useEffect, useState } from "react";
import api from "../api/axios";
import AddSkill from "../components/AddSkill";

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await api.get("/api/skills");
            setSkills(res.data.data);
        } catch (err) {
            alert("Failed to load skills");
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (id, progress) => {
        try {
            const res = await api.patch(`/api/skills/${id}/progress`, {
                progress,
            });

            setSkills((prev) =>
                prev.map((s) => (s.id === id ? res.data.data : s))
            );
        } catch {
            alert("Failed to update progress");
        }
    };

    const deleteSkill = async (id) => {
        if (!window.confirm("Delete this skill?")) return;

        try {
            await api.delete(`/api/skills/${id}`);
            setSkills((prev) => prev.filter((s) => s.id !== id));
        } catch {
            alert("Failed to delete skill");
        }
    };

    if (loading) return <p className="p-6">Loading skills...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl mb-4">My Skills</h1>

            <AddSkill
                onAdd={(newSkill) =>
                    setSkills((prev) => [...prev, newSkill])
                }
            />

            {skills.length === 0 && (
                <p className="text-gray-500">No skills added yet.</p>
            )}

            <div className="space-y-4">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="border p-4 rounded flex justify-between items-center"
                    >
                        {/* LEFT SIDE: SKILL INFO */}
                        <div>
                            <h2 className="font-semibold">{skill.name}</h2>
                            <p className="text-sm">
                                Level: {skill.level} | Status: {skill.status}
                            </p>
                            <p className="text-sm mb-2">
                                Progress: {skill.progress}%
                            </p>

                            {/* ✅ PROGRESS SLIDER — ADD HERE */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={skill.progress}
                                onChange={(e) =>
                                    updateProgress(skill.id, Number(e.target.value))
                                }
                                className="w-48"
                            />
                        </div>

                        {/* RIGHT SIDE: DELETE BUTTON */}
                        <button
                            onClick={() => deleteSkill(skill.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Skills;
