import React, { useState } from 'react';
import type { Staff, UserRole } from '@/types';

interface StaffFormProps {
  initialData?: Partial<Staff>;
  onSubmit: (data: Omit<Staff, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

import { FormGrid, FormField } from '@/components/ui/FormGrid';

const StaffForm: React.FC<StaffFormProps> = ({ initialData, onSubmit, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'architect' as UserRole,
    phone: initialData?.phone || '',
    joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0],
    salary: initialData?.salary || 50000,
    assignedProjects: initialData?.assignedProjects || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <FormGrid columns={2}>
          <FormField label="Full Name" required>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Karthik Raja"
            />
          </FormField>

          <FormField label="Email Address" required>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="e.g. karthik@boxway.in"
            />
          </FormField>

          <FormField label="Role / Department" required>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input-field"
            >
              <option value="admin">Administrator</option>
              <option value="architect">Architect</option>
              <option value="hr">HR Manager</option>
              <option value="accountant">Accountant</option>
              <option value="intern">Intern</option>
            </select>
          </FormField>

          <FormField label="Login Password" required={!initialData} helpText={initialData ? "Leave blank to keep current password." : "Set a secure password for the new member."}>
            <input
              type="text"
              required={!initialData}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="e.g. arch@123"
            />
          </FormField>

          <FormField label="Phone Number" required>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="e.g. +91 98765 43210"
            />
          </FormField>

          <FormField label="Joining Date" required>
            <input
              type="date"
              required
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              className="input-field"
            />
          </FormField>

          <FormField label="Annual Salary (₹)" required helpText="Gross annual salary excluding bonuses.">
            <input
              type="number"
              required
              min={0}
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              className="input-field tabular-nums"
              placeholder="50000"
            />
          </FormField>
        </FormGrid>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="btn-primary h-10 px-6 disabled:opacity-70">
          {isSaving ? 'Saving...' : (initialData ? 'Update Staff Member' : 'Add Staff Member')}
        </button>
      </div>
    </form>
  );
};

export default StaffForm;
