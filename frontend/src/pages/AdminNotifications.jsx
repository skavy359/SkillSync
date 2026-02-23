import React, { useState } from 'react';
import { Bell, Send, Check, AlertCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Textarea from '../components/ui/Textarea';
import adminService from '../services/adminService';

const AdminNotifications = () => {
  const [form, setForm] = useState({
    title: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      setError('Please fill in both title and message');
      return;
    }

    try {
      setSending(true);
      const payload = {
        title: form.title,
        message: form.message,
        targetUserIds: null
      };
      
      await adminService.broadcastNotification(payload);
      
      setSuccessMessage('Notification sent successfully!');
      setForm({ title: '', message: '' });
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8 max-w-4xl">
        <PageHeader 
          title="Broadcast Notifications" 
          description="Send important announcements to users"
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

        <div className="space-y-6">
          {/* Notification Content */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Content
              </h3>

              <div className="space-y-4">
                <div>
                  <Label>Notification Title</Label>
                  <Input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., System Maintenance Notice"
                    maxLength={100}
                  />
                  <p className="text-xs text-[#7f849c] mt-1">{form.title.length}/100 characters</p>
                </div>

                <div>
                  <Label>Notification Message</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Enter your notification message here..."
                    maxLength={500}
                    rows={6}
                  />
                  <p className="text-xs text-[#7f849c] mt-1">{form.message.length}/500 characters</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4">Preview</h3>
              <div className="p-4 bg-gray-50 dark:bg-[#181825] rounded-lg border border-gray-200 dark:border-[#313244]">
                <p className="font-semibold text-gray-900 dark:text-[#cdd6f4]">{form.title || 'Notification Title'}</p>
                <p className="text-sm text-gray-600 dark:text-[#a6adc8] mt-2">
                  {form.message || 'Your notification message will appear here...'}
                </p>
              </div>
            </div>
          </Card>

          {/* Send Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>

          {/* Usage Tips */}
          <Card>
            <div className="p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>Send important announcements and system updates</li>
                <li>Remind users about ongoing events or challenges</li>
                <li>Notify about maintenance or downtime</li>
                <li>Broadcast feature announcements</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
