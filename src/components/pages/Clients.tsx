import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import api from '@/services/api';
import { useApp } from '@/context/AppContext';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import ClientForm from '@/components/forms/ClientForm';
import type { Client } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import SearchInput from '@/components/ui/SearchInput';

const Clients: React.FC = () => {
  const { clients, refreshClients, projects } = useApp();
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshClients();
    setIsRefreshing(false);
  };

  const filteredClients = useMemo(() => {
    if (!Array.isArray(clients)) return [];
    return clients.filter((c) => {
      const name = c?.name || '';
      const email = c?.email || '';
      const location = c?.siteLocation || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        location.toLowerCase().includes(search.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || c?.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [clients, search, paymentFilter]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/clients/${id}`);
        refreshClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client.');
      }
    }
  };

  const handleSaveClient = async (data: Omit<Client, 'id'>) => {
    setIsSaving(true);
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, data);
      } else {
        await api.post('/clients', data);
      }
      refreshClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to save client details.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'partial': return 'warning';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Client / Company',
      render: (item: Client) => (
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">{item?.name || 'Unknown Client'}</p>
          {item?.company && (
            <p className="text-[11px] text-muted-foreground mt-1.5">{item.company}</p>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Details',
      render: (item: Client) => (
        <div className="space-y-1">
          <p className="text-[13px] text-foreground font-medium">{item.email}</p>
          <p className="text-[11px] text-muted-foreground tabular-nums">{item.phone}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Site Location',
      render: (item: Client) => (
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/60" />
          <span className="truncate max-w-[180px]">{item.siteLocation}</span>
        </div>
      ),
    },
    {
      key: 'contract',
      header: 'Contract Value',
      align: 'right' as const,
      render: (item: Client) => (
        <div className="flex flex-col items-end">
          <div className="text-[13px] font-bold text-foreground tabular-nums">
            {formatCurrency(item.contractValue)}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">Total Project Value</p>
        </div>
      ),
    },
    {
      key: 'projects',
      header: 'Projects',
      align: 'center' as const,
      render: (item: Client) => {
        const clientProjects = projects.filter(p => p.clientId === item.id);
        return (
          <span className="text-[13px] font-bold text-foreground tabular-nums">{clientProjects.length}</span>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      align: 'right' as const,
      render: (item: Client) => (
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge variant={getPaymentBadgeVariant(item.paymentStatus)}>
            {item.paymentStatus}
          </StatusBadge>
          <p className="text-[11px] font-medium text-muted-foreground tabular-nums">
            {formatCurrency(item.totalPaid)} <span className="opacity-60">paid</span>
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (item: Client) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClient(item);
            }}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit Client"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClient(item.id);
            }}
            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Client Directory"
        description={`Managing ${clients?.length || 0} active client accounts and their respective sites.`}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        actions={
          <button onClick={handleAddClient} className="btn-primary gap-2 h-10 px-4">
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        }
      />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, company, or site..."
            className="flex-1"
          />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="input-field w-full md:w-52 h-10"
          >
            <option value="all">All Payment Status</option>
            <option value="completed">Fully Paid</option>
            <option value="partial">Partial Payment</option>
            <option value="pending">Payment Pending</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        emptyMessage="No clients found matching your search"
        onRowClick={handleEditClient}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Edit Client Details' : 'Onboard New Client'}
        size="lg"
      >
        <ClientForm
          initialData={editingClient || undefined}
          onSubmit={handleSaveClient}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
        />
      </Modal>
    </PageContainer>
  );
};

export default Clients;
