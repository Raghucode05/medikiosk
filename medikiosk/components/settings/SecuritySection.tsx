'use client';

import * as React from 'react';
import { Key, ShieldCheck, Monitor, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function SecuritySection() {
  const [twoFA, setTwoFA] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [sessions, setSessions] = React.useState([
    { id: 's1', device: 'Current Session', details: 'Windows • Chrome • Ahmedabad, India', active: true },
    { id: 's2', device: 'Mobile App', details: 'Android • MediKiosk App • Last active 2h ago', active: false },
  ]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordModalOpen(false);
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success('Session revoked successfully');
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">Security</h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Manage your account security settings</p>
      </div>

      {/* Change Password */}
      <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B]">
            <Key className="h-3.5 w-3.5 text-[#1E3A8A] dark:text-[#60A5FA]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">Change Password</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Update your account password</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
          Change
        </Button>
      </div>

      {/* Password Change Dialog Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B]">
                  <Lock className="h-4 w-4 text-[#1E3A8A] dark:text-[#60A5FA]" />
                </div>
                <DialogTitle>Change Password</DialogTitle>
              </div>
              <DialogDescription>
                Choose a strong password with at least 8 characters.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 chars)"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Two-factor */}
      <div className="border-b border-[#E2E8F0] dark:border-[#1E293B] pb-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1E3A8A] dark:text-[#60A5FA]" />
          </div>
          <div className="flex-1">
            <Toggle
              checked={twoFA}
              onChange={(val) => {
                setTwoFA(val);
                toast.success(val ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
              }}
              label="Two-factor authentication"
              description="Add an extra layer of security to your account"
            />
          </div>
        </div>
      </div>

      {/* Active sessions */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B]">
            <Monitor className="h-3.5 w-3.5 text-[#1E3A8A] dark:text-[#60A5FA]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">Active Sessions</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Manage devices where you&apos;re signed in</p>
          </div>
        </div>

        <div className="ml-11 space-y-2">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/40 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]"
            >
              <div>
                <p className="text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9]">{sess.device}</p>
                <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">{sess.details}</p>
              </div>
              {sess.active ? (
                <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(sess.id)}
                  className="text-[10px] h-6 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
