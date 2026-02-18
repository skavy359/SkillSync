import api from "./api";

export const fetchDashboardStats = async () => {
    const res= await api.get("/profile/me/learning-stats");
    return res.data.data;
}

export const fetchBurnout= async () => {
    const res= await api.get("/profile/me/burnout-risk");
    return res.data.data;
}
export const fetchRecentSkills = async () => {
    const res= await api.get("/skills?size=3&sort=updatedAt,desc");
    return res.data.data;
}
// export const fetchRecentSessions = async () => {
//     const res= await api.get("/profile/me/recent-sessions");
//     return res.data.data;
// }