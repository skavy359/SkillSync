import { useEffect, useState } from "react";
import api from "../api/axios";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/admin/users");
            setUsers(res.data.data);
        } catch {
            alert("Failed to fetch users");
        }
    };

    const fetchUserSkills = async (userId) => {
        try {
            const res = await api.get(`/api/admin/users/${userId}/skills`);
            setSelectedUser(userId);
            setSkills(res.data.data);
        } catch {
            alert("Failed to fetch user skills");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl mb-4">Admin Panel</h1>

            <div className="grid grid-cols-2 gap-6">
                {/* USERS */}
                <div>
                    <h2 className="font-semibold mb-2">Users</h2>
                    <ul className="border rounded">
                        {users.map((u) => (
                            <li
                                key={u.id}
                                onClick={() => fetchUserSkills(u.id)}
                                className={`p-2 cursor-pointer border-b hover:bg-gray-100 ${
                                    selectedUser === u.id ? "bg-gray-200" : ""
                                }`}
                            >
                                {u.name} ({u.role})
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SKILLS */}
                <div>
                    <h2 className="font-semibold mb-2">User Skills</h2>
                    {skills.length === 0 ? (
                        <p className="text-gray-500">Select a user</p>
                    ) : (
                        <ul className="space-y-2">
                            {skills.map((s) => (
                                <li key={s.id} className="border p-2 rounded">
                                    <p className="font-medium">{s.name}</p>
                                    <p className="text-sm">
                                        {s.level} | {s.progress}% | {s.status}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
