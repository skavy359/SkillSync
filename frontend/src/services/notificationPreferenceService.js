import api from './api';

const notificationPreferenceService = {
    async getPreferences() {
        try {
            const response = await api.get('/profile/me/notification-preferences');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
            throw error;
        }
    },

    async updatePreferences(preferences) {
        try {
            const response = await api.patch('/profile/me/notification-preferences', preferences);
            return response.data.data;
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            throw error;
        }
    }
};

export default notificationPreferenceService;
