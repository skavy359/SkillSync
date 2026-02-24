import React, { useState, useEffect } from 'react';
import { Unlock, RotateCw, Search, AlertCircle, Check } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Table from '../components/ui/Table';
import TableRow from '../components/ui/TableRow';
import TableCell from '../components/ui/TableCell';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import adminService from '../services/adminService';

const AdminAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [search, setSearch] = useState('');
  const [resetModal, setResetModal] = useState({ open: false, userId: null, password: '' });
  const [activating, setActivating] = useState(null);
  const [resetting, setResetting] = useState(null);

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getInactiveUsers(30);
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccount = async (userId, isActive) => {
    try {
      setActivating(userId);
      await adminService.toggleAccountStatus(userId, !isActive);
      setSuccessMessage(`Account ${isActive ? 'deactivated' : 'activated'} successfully`);
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchInactiveUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle account status');
    } finally {
      setActivating(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetModal.password) {
      setError('Please enter a password');
      return;
    }

    try {
      setResetting(true);
      await adminService.resetUserPassword(resetModal.userId, resetModal.password);
      setSuccessMessage('Password reset successfully');
      setTimeout(() => setSuccessMessage(''), 4000);
      setResetModal({ open: false, userId: null, password: '' });
      fetchInactiveUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8">
        <PageHeader 
          title="Account Management" 
          description="Manage user accounts and permissions"
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

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-[#7f849c]" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#313244] border border-[#6c7086] rounded-lg text-[#cdd6f4] placeholder-[#7f849c] focus:outline-none focus:border-[#89b4fa]"
            />
          </div>
        </div>

        <div className="bg-[#313244] rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#7f849c]">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-[#7f849c]">No users found</div>
          ) : (
            <>
              <Table>
                <thead>
                  <tr className="border-b border-[#6c7086]">
                    <TableCell className="text-[#cdd6f4] font-semibold">Name</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Email</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Status</TableCell>
                    <TableCell className="text-[#cdd6f4] font-semibold">Actions</TableCell>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-[#cdd6f4]">{user.name}</TableCell>
                      <TableCell className="text-[#7f849c]">{user.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                          Inactive
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleToggleAccount(user.id, false)}
                            disabled={activating === user.id}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400"
                            title="Activate account"
                          >
                            <Unlock className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setResetModal({ open: true, userId: user.id, password: '' })}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                            title="Reset password"
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>

        <Modal
          isOpen={resetModal.open}
          onClose={() => setResetModal({ open: false, userId: null, password: '' })}
          title="Reset User Password"
        >
          <div className="space-y-4">
            <p className="text-[#cdd6f4]">
              Enter a new password for this user:
            </p>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={resetModal.password}
                onChange={(e) => setResetModal(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setResetModal({ open: false, userId: null, password: '' })}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={resetting || !resetModal.password}
              >
                {resetting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminAccounts;