import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useApp } from '@/context/AppContext';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import StaffForm from '@/components/forms/StaffForm';
import { roleLabels } from '@/utils/mockData';
import type { Staff as StaffType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import SearchInput from '@/components/ui/SearchInput';
import StatCard from '@/components/ui/StatCard';
import { Users, UserCheck, Briefcase } from 'lucide-react';

const Staff: React.FC = () => {
  const { staff, refreshStaff, projects } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter(s => projects.some(p => p.assignedStaff?.includes(s.id))).length,
      totalAssigned: projects.reduce((sum, p) => sum + (p.assignedStaff?.length || 0), 0)
    };
  }, [staff, projects]);

  React.useEffect(() => {
    if (location.state?.openRegister) {
      setIsModalOpen(true);
      // Clear the state to prevent reopening on refresh/re-render logic quirks
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);


  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staff)) return [];
    return staff.filter((s) => {
      const name = s?.name || '';
      const email = s?.email || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || s?.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember: StaffType) => {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await api.delete(`/users/${id}`);
        if (response.data.success) {
          refreshStaff();
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member');
      }
    }
  };

  const handleSaveStaff = async (data: any) => {
    setIsSaving(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role.charAt(0).toUpperCase() + data.role.slice(1), // Backend expects 'Admin', 'Architect', etc.
        contactInfo: { phone: data.phone },
        salaryDetails: { basicSalary: data.salary },
        joiningDate: data.joiningDate,
        password: data.password || 'Boxway@123'
      };

      if (editingStaff) {
        const response = await api.put(`/users/${editingStaff.id}`, payload);
        if (response.data.success) {
          refreshStaff();
        }
      } else {
        const response = await api.post('/users/register', payload);
        if (response.data.success) {
          refreshStaff();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member. Ensure you are an Admin/HR and the email is unique.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (item: StaffType) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {item.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">{item?.name || 'Unknown'}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{item?.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: StaffType) => (
        <StatusBadge variant="info">{roleLabels[item.role]}</StatusBadge>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      render: (item: StaffType) => (
        <span className="text-muted-foreground">
          {new Date(item.joiningDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'projects',
      header: 'Projects',
      align: 'center' as const,
      render: (item: StaffType) => {
        const assignedCount = (projects || []).filter(p =>
          (p.assignedStaff || []).includes(item.id)
        ).length;
        return (
          <span className="text-foreground font-semibold tabular-nums">{assignedCount}</span>
        );
      },
    },
    {
      key: 'salary',
      header: 'Salary (Annual)',
      align: 'right' as const,
      render: (item: StaffType) => (
        <span className="text-foreground font-semibold tabular-nums">
          {formatCurrency(item.salary)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (item: StaffType) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditStaff(item);
            }}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteStaff(item.id);
            }}
            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer variant="dashboard">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-foreground tracking-tighter leading-tight">Personnel Directory</h2>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
            {staff?.length || 0} professional team members across all departments.
          </p>
        </div>
        <button onClick={handleAddStaff} className="btn-primary gap-2 h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          <span className="font-black text-[11px] uppercase tracking-[0.2em]">Add Staff</span>
        </button>
      </div>

      {/* Extreme Stats Grid */}
      <div className="bg-card border border-border/60 rounded-[2rem] shadow-xl overflow-hidden mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
          <StatCard
            title="Active Workforce"
            value={stats.total}
            icon={Users}
            isSeamless
          />
          <StatCard
            title="Deployed Staff"
            value={stats.active}
            icon={UserCheck}
            variant="primary"
            isSeamless
          />
          <StatCard
            title="Venture Allocation"
            value={stats.totalAssigned}
            icon={Briefcase}
            variant="accent"
            isSeamless
          />
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
            className="flex-1"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field w-full md:w-56 h-10"
          >
            <option value="all">All Roles & Departments</option>
            <option value="admin">Administrator</option>
            <option value="architect">Architect</option>
            <option value="hr">HR Manager</option>
            <option value="accountant">Accountant</option>
            <option value="intern">Intern</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredStaff}
        emptyMessage="No staff members match your criteria"
        onRowClick={handleEditStaff}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="lg"
      >
        <StaffForm
          initialData={editingStaff || undefined}
          onSubmit={handleSaveStaff}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
        />
      </Modal>
    </PageContainer>
  );
};

export default Staff;
