// Roadmap progress service — stores topic completion in localStorage

const STORAGE_KEY = 'skillsync_roadmap_progress';

function getProgressStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgressStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// Get completed topic IDs for a roadmap
export function getCompletedTopics(roadmapId) {
  const store = getProgressStore();
  return store[roadmapId] || [];
}

// Toggle topic completion
export function toggleTopicComplete(roadmapId, topicId) {
  const store = getProgressStore();
  if (!store[roadmapId]) store[roadmapId] = [];

  const idx = store[roadmapId].indexOf(topicId);
  if (idx >= 0) {
    store[roadmapId].splice(idx, 1);
  } else {
    store[roadmapId].push(topicId);
  }

  saveProgressStore(store);
  return store[roadmapId];
}

// Check if a topic is complete
export function isTopicComplete(roadmapId, topicId) {
  const completed = getCompletedTopics(roadmapId);
  return completed.includes(topicId);
}

// Get total topics count for a roadmap
export function getTotalTopics(roadmap) {
  if (!roadmap) return 0;
  return roadmap.sections.reduce((sum, s) => sum + s.topics.length, 0);
}

// Get progress percentage
export function getProgressPercent(roadmap) {
  if (!roadmap) return 0;
  const total = getTotalTopics(roadmap);
  if (total === 0) return 0;
  const completed = getCompletedTopics(roadmap.id).length;
  return Math.round((completed / total) * 100);
}

// Get completed count
export function getCompletedCount(roadmapId) {
  return getCompletedTopics(roadmapId).length;
}
