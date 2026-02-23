import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Table from '../components/ui/Table';
import TableRow from '../components/ui/TableRow';
import TableCell from '../components/ui/TableCell';
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

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (filterAction) {
        const response = await adminService.getAuditLogsByAction(filterAction);
        setAuditLogs(response.data || []);
        setTotalPages(1);
      } else if (filterEntity) {
        const response = await adminService.getAuditLogsByEntityType(filterEntity);
        setAuditLogs(response.data || []);
        setTotalPages(1);
      } else {
        const response = await adminService.getAuditLogs(page, 20);
        setAuditLogs(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, filterAction, filterEntity]);

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

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e] dark:bg-[#1e1e2e]">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <PageHeader title="Audit Logs" description="View all system activity and changes" />
          <Button onClick={handleDownloadCSV} disabled={auditLogs.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-[#313244] dark:bg-[#313244] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#cdd6f4] dark:text-[#cdd6f4] mb-2">
                Filter by Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-[#45475a] dark:bg-[#45475a] border border-[#6c7086] dark:border-[#6c7086] rounded px-3 py-2 text-[#cdd6f4] dark:text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa]"
              >
                <option value="">All Actions</option>
                <option value="USER_CREATED">User Created</option>
                <option value="USER_DELETED">User Deleted</option>
                <option value="ROLE_CHANGED">Role Changed</option>
                <option value="PASSWORD_RESET">Password Reset</option>
                <option value="ACCOUNT_STATUS_CHANGED">Status Changed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#cdd6f4] dark:text-[#cdd6f4] mb-2">
                Filter by Entity Type
              </label>
              <select
                value={filterEntity}
                onChange={(e) => {
                  setFilterEntity(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-[#45475a] dark:bg-[#45475a] border border-[#6c7086] dark:border-[#6c7086] rounded px-3 py-2 text-[#cdd6f4] dark:text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa]"
              >
                <option value="">All Entity Types</option>
                <option value="USER">User</option>
                <option value="SKILL">Skill</option>
                <option value="CATEGORY">Category</option>
                <option value="NOTIFICATION">Notification</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg mb-6">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-[#313244] dark:bg-[#313244] rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#7f849c]">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center text-[#7f849c]">No audit logs found</div>
          ) : (
            <>
              <Table>
                <thead>
                  <tr className="border-b border-[#6c7086]">
                    <TableCell className="text-[#cdd6f4] font-semibold">User</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Action</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Entity Type</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Entity ID</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Date</TableCell>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-[#cdd6f4]">{log.userName}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#cdd6f4]">{log.entityType}</TableCell>
                      <TableCell className="text-[#7f849c]">#{log.entityId}</TableCell>
                      <TableCell className="text-[#7f849c]">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && !filterAction && !filterEntity && (
                <div className="flex justify-between items-center p-4 border-t border-[#6c7086]">
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
