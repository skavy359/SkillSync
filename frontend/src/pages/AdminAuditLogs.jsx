import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Download, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import adminService from '../services/adminService';

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getActionColor = (action) => {
    const colorMap = {
      'LOGIN': 'bg-blue-500/20 text-blue-400',
      'LOGOUT': 'bg-gray-500/20 text-gray-400',
      'USER_CREATED': 'bg-green-500/20 text-green-400',
      'USER_DELETED': 'bg-red-500/20 text-red-400',
      'ROLE_CHANGED': 'bg-purple-500/20 text-purple-400',
      'PASSWORD_RESET': 'bg-orange-500/20 text-orange-400',
      'ACCOUNT_STATUS_CHANGED': 'bg-yellow-500/20 text-yellow-400',
      'SKILL_CREATED': 'bg-cyan-500/20 text-cyan-400',
      'SKILL_UPDATED': 'bg-cyan-500/20 text-cyan-400',
      'SKILL_DELETED': 'bg-red-500/20 text-red-400',
    };
    return colorMap[action] || 'bg-blue-500/20 text-blue-400';
  };

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (filterAction) {
        const response = await adminService.getAuditLogsByAction(filterAction);
        const logs = Array.isArray(response) ? response : [];
        setAuditLogs(logs);
        setTotalPages(1);
      } else if (filterEntity) {
        const response = await adminService.getAuditLogsByEntityType(filterEntity);
        const logs = Array.isArray(response) ? response : [];
        setAuditLogs(logs);
        setTotalPages(1);
      } else {
        const response = await adminService.getAuditLogs(page, 100);
        const logsArray = response?.content || [];
        setAuditLogs(logsArray);
        setTotalPages(response?.totalPages || 1);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch audit logs';
      setError(errorMsg);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, filterAction, filterEntity]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleDownloadCSV = () => {
    if (auditLogs.length === 0) return;

    const headers = ['ID', 'User', 'Action', 'Entity Type', 'Entity ID', 'Date'];
    const rows = auditLogs.map(log => [
      log.id,
      log.userName,
      log.action,
      log.entityType,
      log.entityId,
      new Date(log.createdAt).toLocaleString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleClearFilters = () => {
    setFilterAction('');
    setFilterEntity('');
    setPage(0);
  };

  const hasActiveFilters = filterAction || filterEntity;

  // Get unique actions and entities from ALL logs (not just current page)
  const [allAuditLogs, setAllAuditLogs] = useState([]);
  
  const getUniqueActionsAndEntities = useCallback(async () => {
    try {
      const response = await adminService.getAuditLogs(0, 1000);
      const logs = response?.content || [];
      const allActions = [...new Set(logs.map(log => log.action))].sort();
      const allEntities = [...new Set(logs.map(log => log.entityType))].sort();
      setAllAuditLogs(logs);
      return { allActions, allEntities };
    } catch (err) {
      console.error('Error loading actions/entities:', err);
      return { allActions: [], allEntities: [] };
    }
  }, []);

  const [uniqueFilters, setUniqueFilters] = useState({ allActions: [], allEntities: [] });

  useEffect(() => {
    getUniqueActionsAndEntities().then(filters => setUniqueFilters(filters));
  }, [getUniqueActionsAndEntities]);

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <PageHeader title="Audit Logs" description="View all system activity and changes" />
          </div>
          <Button onClick={handleDownloadCSV} disabled={auditLogs.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters Card */}
        <div className="bg-[#313244] rounded-lg p-6 mb-6 border border-[#6c7086]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#cdd6f4]">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs text-[#89b4fa] hover:text-[#a6adc8] transition-colors"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a6adc8] mb-2 uppercase tracking-wide">
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-[#181825] border border-[#313244] dark:border-[#313244] rounded-lg px-3 py-2.5 text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-colors hover:border-[#45475a]"
              >
                <option value="">All Actions</option>
                {uniqueFilters.allActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#a6adc8] mb-2 uppercase tracking-wide">
                Entity Type
              </label>
              <select
                value={filterEntity}
                onChange={(e) => {
                  setFilterEntity(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-[#181825] border border-[#313244] dark:border-[#313244] rounded-lg px-3 py-2.5 text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-colors hover:border-[#45475a]"
              >
                <option value="">All Entities</option>
                {uniqueFilters.allEntities.map(entity => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Audit Logs List */}
        <div className="space-y-3">
          {loading && (
            <div className="p-12 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#89b4fa]"></div>
              </div>
              <p className="text-[#7f849c] text-sm mt-3">Loading audit logs...</p>
            </div>
          )}
          {!loading && auditLogs.length === 0 && (
            <div className="p-12 text-center bg-[#313244] rounded-lg border border-[#6c7086]">
              <p className="text-[#7f849c] text-sm">No audit logs found</p>
            </div>
          )}
          {!loading && auditLogs.length > 0 && (
            <>
              <div className="text-xs text-[#7f849c] mb-4">
                Showing {auditLogs.length} {filterAction || filterEntity ? 'filtered' : ''} log{auditLogs.length !== 1 ? 's' : ''}
              </div>
              
              {auditLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-[#1f1f2e] p-4 rounded-lg border border-[#45475a] hover:border-[#89b4fa] hover:bg-[#252535] transition-all group"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* User */}
                    <div>
                      <p className="text-xs font-semibold text-[#a6adc8] mb-1.5 uppercase tracking-wide">User</p>
                      <p className="text-sm font-medium text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors">{log.userName}</p>
                    </div>

                    {/* Action */}
                    <div>
                      <p className="text-xs font-semibold text-[#a6adc8] mb-1.5 uppercase tracking-wide">Action</p>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Entity Type */}
                    <div>
                      <p className="text-xs font-semibold text-[#a6adc8] mb-1.5 uppercase tracking-wide">Entity</p>
                      <p className="text-sm text-[#cdd6f4]">{log.entityType}</p>
                    </div>

                    {/* Entity ID */}
                    <div>
                      <p className="text-xs font-semibold text-[#a6adc8] mb-1.5 uppercase tracking-wide">ID</p>
                      <p className="text-sm font-mono text-[#7f849c]">#{log.entityId}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs font-semibold text-[#a6adc8] mb-1.5 uppercase tracking-wide">Date</p>
                      <p className="text-sm text-[#7f849c]">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && !filterAction && !filterEntity && (
                <div className="flex justify-between items-center p-4 bg-[#313244] rounded-lg border border-[#6c7086] mt-6">
                  <span className="text-sm text-[#7f849c]">
                    Page {page + 1} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="p-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page === totalPages - 1}
                      className="p-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
