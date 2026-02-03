import React, { useState, useMemo } from 'react';
import { Download, CheckCircle, Clock, IndianRupee } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import StatCard from '@/components/ui/StatCard';
import type { PayrollRecord } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import { SectionHeader } from '@/components/ui/SectionHeader';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Payroll: React.FC = () => {
  const { payroll, setPayroll, staff } = useApp();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2025);

  const isAdmin = user?.role === 'admin' || user?.role === 'accountant';

  const filteredPayroll = useMemo(() => {
    return payroll.filter(p => p.month === selectedMonth && p.year === selectedYear);
  }, [payroll, selectedMonth, selectedYear]);

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'Unknown';
  };

  const getStaffRole = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.role || 'Unknown';
  };

  const handleApprove = (recordId: string) => {
    setPayroll(payroll.map(p =>
      p.id === recordId ? { ...p, status: 'approved' } : p
    ));
  };

  const handleMarkPaid = (recordId: string) => {
    setPayroll(payroll.map(p =>
      p.id === recordId ? { ...p, status: 'paid' } : p
    ));
  };

  const totalPending = filteredPayroll.filter(p => p.status === 'pending').length;
  const totalApproved = filteredPayroll.filter(p => p.status === 'approved').length;
  const totalPaid = filteredPayroll.filter(p => p.status === 'paid').length;
  const totalPayrollAmount = filteredPayroll.reduce((sum, p) => sum + p.netSalary, 0);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'staff',
      header: 'Staff Member',
      render: (item: PayrollRecord) => (
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">{getStaffName(item.staffId)}</p>
          <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider font-medium">{getStaffRole(item.staffId)}</p>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      align: 'center' as const,
      render: (item: PayrollRecord) => (
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-bold text-foreground tabular-nums">
            {item.attendance} <span className="text-[11px] font-normal text-muted-foreground mr-1">/</span> {item.totalDays}
          </span>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide font-medium">Days Present</p>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      header: 'Gross Salary',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <span className="text-[13px] font-medium text-foreground tabular-nums">{formatCurrency(item.baseSalary)}</span>
      ),
    },
    {
      key: 'adjustments',
      header: 'Adjustments',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <div className="flex flex-col items-end gap-1">
          {item.bonus > 0 && (
            <span className="text-[11px] font-bold text-success tabular-nums">+{formatCurrency(item.bonus)}</span>
          )}
          {item.deductions > 0 && (
            <span className="text-[11px] font-bold text-destructive tabular-nums">-{formatCurrency(item.deductions)}</span>
          )}
          {item.bonus === 0 && item.deductions === 0 && (
            <span className="text-[11px] text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'netSalary',
      header: 'Net Payable',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <div className="flex flex-col items-end">
          <span className="text-[14px] font-bold text-foreground tabular-nums">{formatCurrency(item.netSalary)}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">Monthly Payout</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Phase',
      align: 'center' as const,
      render: (item: PayrollRecord) => (
        <StatusBadge variant={getStatusBadgeVariant(item.status)}>
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <div className="flex items-center justify-end gap-1">
          {isAdmin && item.status === 'pending' && (
            <button
              onClick={() => handleApprove(item.id)}
              className="p-1.5 rounded-md hover:bg-success/10 transition-colors text-success"
              title="Approve Record"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {isAdmin && item.status === 'approved' && (
            <button
              onClick={() => handleMarkPaid(item.id)}
              className="p-1.5 rounded-md hover:bg-info/10 transition-colors text-info"
              title="Confirm Payment"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Export Payslip"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer variant="dashboard">
      <SectionHeader
        title="Payroll Intelligence"
        description="Overseeing staff compensation, attendance-based deductions, and performance bonuses."
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field w-36 h-10"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field w-24 h-10"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Monthly Payroll"
          value={formatCurrency(totalPayrollAmount)}
          icon={IndianRupee}
          subtitle="Gross payable for selected period"
        />
        <StatCard
          title="Pending Approval"
          value={totalPending}
          icon={Clock}
          subtitle="Records awaiting confirmation"
        />
        <StatCard
          title="Approved Records"
          value={totalApproved}
          icon={CheckCircle}
          subtitle="Ready for disbursement"
        />
        <StatCard
          title="Disbursed"
          value={totalPaid}
          icon={CheckCircle}
          subtitle="Successfully paid to staff"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredPayroll}
        emptyMessage="No payroll records generated for the selected period."
      />

      {isAdmin && totalPending > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              filteredPayroll
                .filter(p => p.status === 'pending')
                .forEach(p => handleApprove(p.id));
            }}
            className="btn-primary gap-2 h-10 px-6"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve All Pending ({totalPending})</span>
          </button>
        </div>
      )}
    </PageContainer>
  );
};

export default Payroll;
