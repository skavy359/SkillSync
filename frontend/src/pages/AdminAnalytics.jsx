import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Activity, Award, AlertCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import adminService from '../services/adminService';

const AdminAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getEngagementMetrics();
      setMetrics(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load metrics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e2e]">
        <p className="text-[#7f849c]">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8">
        <PageHeader 
          title="Analytics & Metrics" 
          description="Platform engagement and performance metrics"
        />

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {metrics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={metrics.totalUsers}
                icon={Users}
                color="blue"
              />
              <StatCard
                label="Active Users"
                value={metrics.activeUsers}
                icon={Activity}
                color="green"
              />
              <StatCard
                label="Inactive Users"
                value={metrics.inactiveUsers}
                icon={AlertCircle}
                color="red"
              />
              <StatCard
                label="Retention Rate"
                value={`${metrics.userRetentionRate?.toFixed(1)}%`}
                icon={TrendingUp}
                color="purple"
              />
            </div>

            {/* Learning Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Total Skills Learned"
                value={metrics.totalSkillsLearned}
                icon={Award}
                color="cyan"
              />
              <StatCard
                label="Sessions Completed"
                value={metrics.totalSessionsCompleted}
                icon={Activity}
                color="blue"
              />
              <StatCard
                label="Avg Skills per User"
                value={metrics.averageSkillsPerUser?.toFixed(1)}
                icon={Users}
                color="green"
              />
            </div>

            {/* Session Duration */}
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#cdd6f4] mb-4">Average Session Duration</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#89b4fa]">
                    {metrics.averageSessionDuration?.toFixed(1)}
                  </span>
                  <span className="text-[#7f849c]">minutes</span>
                </div>
              </div>
            </Card>

            {/* Most Popular Skills */}
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#cdd6f4] mb-4">Most Popular Skills</h3>
                <div className="space-y-3">
                  {metrics.mostPopularSkills && metrics.mostPopularSkills.length > 0 ? (
                    metrics.mostPopularSkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-[#cdd6f4]">{idx + 1}. {skill.skillName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[#45475a] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#89b4fa] rounded-full"
                              style={{
                                width: `${(skill.userCount / metrics.totalUsers) * 100}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-[#7f849c] w-12 text-right">
                            {skill.userCount} users
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#7f849c]">No skill data available</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Top Users */}
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#cdd6f4] mb-4">Top Users by Skills</h3>
                <div className="space-y-3">
                  {metrics.topUsers && metrics.topUsers.length > 0 ? (
                    metrics.topUsers.map((user, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#45475a]/50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#89b4fa] flex items-center justify-center text-[#1e1e2e] font-bold text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-medium text-[#cdd6f4]">{user.userName}</span>
                        </div>
                        <span className="text-[#89b4fa] font-semibold">{user.skillCount} skills</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#7f849c]">No user data available</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
