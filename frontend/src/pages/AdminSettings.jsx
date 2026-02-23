import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Check } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import adminService from '../services/adminService';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemSettings();
      setSettings(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminService.updateSystemSettings(settings);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e2e]">
        <p className="text-[#7f849c]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8 max-w-4xl">
        <PageHeader 
          title="System Settings" 
          description="Configure platform-wide settings and preferences"
        />

        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg mb-6 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {settings && (
          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#89b4fa] rounded"></div>
                  General Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Site Name</Label>
                    <Input
                      type="text"
                      value={settings.siteName || ''}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                      placeholder="Enter site name"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature Toggles */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#a6e3a1] rounded"></div>
                  Feature Toggles
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#45475a]/50 rounded">
                    <div>
                      <p className="font-medium text-[#cdd6f4]">Maintenance Mode</p>
                      <p className="text-sm text-[#7f849c]">Temporarily disable access for all users</p>
                    </div>
                    <button
                      onClick={() => handleToggle('maintenanceMode')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        settings.maintenanceMode ? 'bg-red-500' : 'bg-[#6c7086]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.maintenanceMode ? 'right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#45475a]/50 rounded">
                    <div>
                      <p className="font-medium text-[#cdd6f4]">Allow New Registrations</p>
                      <p className="text-sm text-[#7f849c]">Allow new users to register</p>
                    </div>
                    <button
                      onClick={() => handleToggle('allowNewRegistrations')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        settings.allowNewRegistrations ? 'bg-[#a6e3a1]' : 'bg-[#6c7086]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.allowNewRegistrations ? 'right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#45475a]/50 rounded">
                    <div>
                      <p className="font-medium text-[#cdd6f4]">Enable Leaderboards</p>
                      <p className="text-sm text-[#7f849c]">Show user leaderboards</p>
                    </div>
                    <button
                      onClick={() => handleToggle('enableLeaderboards')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        settings.enableLeaderboards ? 'bg-[#a6e3a1]' : 'bg-[#6c7086]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.enableLeaderboards ? 'right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#45475a]/50 rounded">
                    <div>
                      <p className="font-medium text-[#cdd6f4]">Enable Badges</p>
                      <p className="text-sm text-[#7f849c]">Award badges to users</p>
                    </div>
                    <button
                      onClick={() => handleToggle('enableBadges')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        settings.enableBadges ? 'bg-[#a6e3a1]' : 'bg-[#6c7086]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.enableBadges ? 'right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#f38ba8] rounded"></div>
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label>Session Reminder Hours</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.sessionReminderHours || 24}
                      onChange={(e) => handleChange('sessionReminderHours', parseInt(e.target.value))}
                      placeholder="Hours"
                    />
                  </div>

                  <div>
                    <Label>Inactivity Warning Days</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.inactivityWarningDays || 30}
                      onChange={(e) => handleChange('inactivityWarningDays', parseInt(e.target.value))}
                      placeholder="Days"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Session Settings */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#fab387] rounded"></div>
                  Session Settings
                </h3>

                <div>
                  <Label>Max Session Duration (Minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.maxSessionDurationMinutes || 120}
                    onChange={(e) => handleChange('maxSessionDurationMinutes', parseInt(e.target.value))}
                    placeholder="Minutes"
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
