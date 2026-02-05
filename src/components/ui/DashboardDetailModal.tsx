import React from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '@/utils/formatters';
import type { Project, Staff, Client, PayrollRecord } from '@/types';
import { Briefcase, Building2, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: 'projects' | 'staff' | 'clients' | 'payroll' | null;
    data: any[];
}

const DashboardDetailModal: React.FC<DashboardDetailModalProps> = ({ isOpen, onClose, title, type, data }) => {
    const navigate = useNavigate();

    const renderContent = () => {
        if (!data || data.length === 0) {
            return (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground font-medium">No active records found in this category.</p>
                </div>
            );
        }

        switch (type) {
            case 'projects':
                return (
                    <div className="space-y-4">
                        {data.map((p: Project) => (
                            <div
                                key={p.id}
                                onClick={() => { onClose(); navigate(`/projects/${p.id}`); }}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/50 hover:bg-muted hover:border-primary/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground leading-none">{p.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <StatusBadge variant={p.status === 'active' ? 'info' : 'default'}>{p.status}</StatusBadge>
                                            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{p.progress}% Complete</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        ))}
                    </div>
                );

            case 'staff':
                return (
                    <div className="space-y-4">
                        {data.map((s: Staff) => (
                            <div
                                key={s.id}
                                onClick={() => { onClose(); navigate('/staff'); }}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/50 hover:bg-muted hover:border-primary/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                                        {s.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground leading-none">{s.name}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-widest font-bold font-display">{s.role}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                            </div>
                        ))}
                    </div>
                );

            case 'clients':
                return (
                    <div className="space-y-4">
                        {data.map((c: Client) => (
                            <div
                                key={c.id}
                                onClick={() => { onClose(); navigate('/clients'); }}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/50 hover:bg-muted hover:border-accent/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground leading-none">{c.name}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1.5">{c.email}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            </div>
                        ))}
                    </div>
                );

            case 'payroll':
                return (
                    <div className="space-y-4">
                        {data.map((pr: PayrollRecord) => (
                            <div
                                key={pr.id}
                                onClick={() => { onClose(); navigate('/payroll'); }}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/50 hover:bg-muted hover:border-warning/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground leading-none">{pr.month} {pr.year}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <StatusBadge variant={pr.status === 'paid' ? 'success' : 'warning'}>{pr.status}</StatusBadge>
                                            <span className="text-[11px] text-muted-foreground font-bold tabular-nums tracking-wider">{formatCurrency(pr.netSalary)}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-warning transition-colors" />
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
            <div className="p-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {renderContent()}
            </div>
        </Modal>
    );
};

export default DashboardDetailModal;
