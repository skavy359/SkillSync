import { useAuth } from "../auth/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl">Welcome, {user.name}</h1>
            <p>Role: {user.role}</p>
        </div>
    );
};

export default Dashboard;
