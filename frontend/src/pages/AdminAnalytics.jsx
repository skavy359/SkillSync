import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Activity, Award, AlertCircle, Flame, Clock, Crown } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
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
      setMetrics(response);
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
            <div>
              <h2 className="text-2xl font-bold text-[#cdd6f4] mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                User Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Total Users</h4>
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{metrics.totalUsers}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Active (30 Days)</h4>
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">{metrics.activeUsers}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Inactive (30 Days)</h4>
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-red-400">{metrics.inactiveUsers}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Never Active</h4>
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{metrics.usersWithoutActivity}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Retention Rate</h4>
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{metrics.userRetentionRate?.toFixed(1)}%</p>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#cdd6f4] mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-400" />
                Learning Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Total Skills Learned</h4>
                      <Award className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{metrics.totalSkillsLearned}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Sessions Completed</h4>
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{metrics.totalSessionsCompleted}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Avg Skills per User</h4>
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">{metrics.averageSkillsPerUser?.toFixed(1)}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Avg Sessions per User</h4>
                      <Activity className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-3xl font-bold text-indigo-400">{metrics.averageSessionsPerUser?.toFixed(1)}</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#a6adc8]">Categories Used</h4>
                      <Award className="w-5 h-5 text-pink-400" />
                    </div>
                    <p className="text-3xl font-bold text-pink-400">{metrics.totalCategoriesUsed}</p>
                  </div>
                </Card>
              </div>
            </div>

            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#cdd6f4] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#89b4fa]" />
                  Average Session Duration
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#89b4fa]">
                    {metrics.averageSessionDuration?.toFixed(1)}
                  </span>
                  <span className="text-[#7f849c]">minutes</span>
                </div>
              </div>
            </Card>

            <div>
              <h2 className="text-2xl font-bold text-[#cdd6f4] mb-4 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                Most Popular Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.mostPopularSkills && metrics.mostPopularSkills.length > 0 ? (
                  metrics.mostPopularSkills.map((skill, idx) => (
                    <Card key={idx}>
                      <div className="p-4 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">
                              {idx + 1}
                            </div>
                            <h4 className="font-semibold text-[#cdd6f4] truncate">{skill.skillName}</h4>
                          </div>
                        </div>
                        <div>
                          <div className="w-full h-2 bg-[#45475a] rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-orange-400 rounded-full"
                              style={{
                                width: `${(skill.userCount / metrics.totalUsers) * 100}%`
                              }}
                            ></div>
                          </div>
                          <p className="text-sm text-[#7f849c]">{skill.userCount} users</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#7f849c]">No skill data available</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#cdd6f4] mb-4 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                Top Users by Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.topUsers && metrics.topUsers.length > 0 ? (
                  metrics.topUsers.map((user, idx) => (
                    <Card key={idx}>
                      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-[#89b4fa] flex items-center justify-center text-[#1e1e2e] font-bold text-lg mb-3">
                          {idx + 1}
                        </div>
                        <h4 className="font-semibold text-[#cdd6f4] mb-2 truncate w-full">{user.userName}</h4>
                        <p className="text-sm text-[#7f849c]">{user.skillCount}</p>
                        <p className="text-xs text-[#6c7086]">Skills</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#7f849c]">No user data available</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#cdd6f4] mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-400" />
                Top Users by Session Minutes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.topUsersBySessionMinutes && metrics.topUsersBySessionMinutes.length > 0 ? (
                  metrics.topUsersBySessionMinutes.map((user, idx) => (
                    <Card key={idx}>
                      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mb-3">
                          {idx + 1}
                        </div>
                        <h4 className="font-semibold text-[#cdd6f4] mb-2 truncate w-full">{user.userName}</h4>
                        <p className="text-sm text-green-400">{user.totalSessionMinutes}</p>
                        <p className="text-xs text-[#6c7086]">Minutes</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#7f849c]">No session data available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;