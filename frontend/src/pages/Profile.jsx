import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "" });
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile");
            setProfile(res.data.data);
            setForm({ name: res.data.data.name });
        } catch (err) {
            setError("Failed to load profile");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const res = await api.patch("/api/profile", form);
            setProfile(res.data.data);
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        }
    };

    if (!profile) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl mb-4">My Profile</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="space-y-3">
                <div>
                    <label className="block text-sm">Name</label>
                    {editing ? (
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input"
                        />
                    ) : (
                        <p>{profile.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm">Email</label>
                    <p>{profile.email}</p>
                </div>

                <div>
                    <label className="block text-sm">Role</label>
                    <p>{profile.role}</p>
                </div>

                {editing ? (
                    <button onClick={handleUpdate} className="btn mt-4">
                        Save
                    </button>
                ) : (
                    <button onClick={() => setEditing(true)} className="btn mt-4">
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
