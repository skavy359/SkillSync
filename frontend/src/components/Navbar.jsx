import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex justify-between p-4 bg-slate-800 text-white">
            <span>SkillSync</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                Logout
            </button>
            <button onClick={() => navigate("/profile")} className="mr-4">
                Profile
            </button>
            <button onClick={() => navigate("/skills")} className="mr-4">
                Skills
            </button>
            {user?.role === "ADMIN" && (
                <button onClick={() => navigate("/admin")}>
                    Admin
                </button>
            )}

        </div>
    );
};

export default Navbar;
