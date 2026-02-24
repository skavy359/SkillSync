import api from "./api"

export async function fetchSessions(skillId) {
    const res = await api.get(`/skills/${skillId}/sessions`)
    return res.data.data
}

export async function addSession(skillId, session) {
    const res = await api.post(`/skills/${skillId}/sessions`, session)
    return res.data.data
}

export async function updateSession(skillId, sessionId, session) {
    const res = await api.patch(`/skills/${skillId}/sessions/${sessionId}`, session)
    return res.data.data
}

export async function deleteSession(skillId, sessionId) {
    const res = await api.delete(`/skills/${skillId}/sessions/${sessionId}`)
    return res.data.data
}