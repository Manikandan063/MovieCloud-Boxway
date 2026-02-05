import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Layers,
    Clock,
    AlertCircle,
    MapPin,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatters';
import { projectPhaseLabels } from '@/utils/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { PageContainer } from '@/components/ui/Layout';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { projects, clients, staff } = useApp();

    const project = useMemo(() =>
        projects.find(p => p.id === id),
        [projects, id]);

    const client = useMemo(() =>
        clients.find(c => c.id === project?.clientId),
        [clients, project]);

    if (!project) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[2rem] shadow-sm">
                    <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-bold text-foreground">Project Not Found</h2>
                    <p className="text-sm text-muted-foreground mt-2">The blueprint you are looking for does not exist in our archives.</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="mt-8 btn-primary px-6 h-11"
                    >
                        Return to Portfolio
                    </button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Immersive Header */}
            <div className="mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Back to Portfolio</span>
                </button>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <StatusBadge variant={project.status === 'active' ? 'info' : 'default'} className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                {project.status}
                            </StatusBadge>
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                ID: {project.id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-display font-black text-foreground tracking-tighter leading-[0.9]">
                            {project.name}
                        </h1>
                        <p className="text-lg text-muted-foreground mt-6 leading-relaxed font-medium">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Primary Client</p>
                        <div className="flex items-center gap-3 bg-card border border-border/60 p-4 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-xs">
                                {client?.name[0]}
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-foreground leading-none">{client?.name}</h4>
                                <p className="text-[11px] text-muted-foreground mt-1.5">{client?.company || 'Private Client'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Roadmap & Phases */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card border border-border/60 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                            <Layers className="w-64 h-64" />
                        </div>

                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-2xl font-display font-black text-foreground tracking-tight">Project Roadmap</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-display font-black text-primary tabular-nums tracking-tighter">{project.progress}%</span>
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Complete</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {project.phases.map((phase, index) => (
                                <div
                                    key={index}
                                    className={`relative pl-10 pb-8 last:pb-0 border-l ${phase.status === 'completed' ? 'border-primary' : 'border-border'
                                        }`}
                                >
                                    <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-background shadow-sm transition-all duration-500 ${phase.status === 'completed' ? 'bg-primary scale-110' :
                                        phase.status === 'in-progress' ? 'bg-info animate-pulse' : 'bg-muted'
                                        }`} />

                                    <div className={`p-6 rounded-[1.5rem] border transition-all ${phase.status === 'in-progress'
                                        ? 'bg-info/5 border-info/30 shadow-md translate-x-2'
                                        : 'bg-muted/10 border-transparent hover:border-border/60'
                                        }`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className={`font-bold tracking-tight ${phase.status === 'completed' ? 'text-primary' :
                                                phase.status === 'in-progress' ? 'text-foreground text-lg' : 'text-muted-foreground'
                                                }`}>
                                                {index + 1}. {projectPhaseLabels[phase.phase]}
                                            </h4>
                                            <StatusBadge variant={
                                                phase.status === 'completed' ? 'success' :
                                                    phase.status === 'in-progress' ? 'info' : 'default'
                                            } className="text-[9px] font-black">
                                                {phase.status}
                                            </StatusBadge>
                                        </div>
                                        {phase.status === 'in-progress' && (
                                            <p className="text-sm text-foreground/70 leading-relaxed max-w-lg mb-4">
                                                Actively iterating on architectural visualizers and material selection.
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Start: {new Date().toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Est. Duration: 14 Days</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Metrics & Team */}
                <div className="space-y-8">
                    {/* Financials */}
                    <div className="bg-[#1F1F1F] text-white rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative">
                        <CreditCard className="absolute bottom-[-20%] right-[-10%] w-48 h-48 opacity-[0.05] -rotate-12" />
                        <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">Financial Overview</p>
                        <div className="space-y-1">
                            <h4 className="text-4xl font-display font-black tracking-tighter tabular-nums text-primary">
                                {formatCurrency(project.budget)}
                            </h4>
                            <p className="text-[13px] font-medium text-white/60">Allocated Project Budget</p>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Invoiced</span>
                                <span className="text-[14px] font-black tabular-nums">{formatCurrency(project.budget * 0.4)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Outstanding</span>
                                <span className="text-[14px] font-black tabular-nums">{formatCurrency(project.budget * 0.6)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Location & Meta */}
                    <div className="bg-card border border-border/60 rounded-[2.5rem] p-10 shadow-sm">
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">Site Metadata</p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Execution Location</h5>
                                    <p className="text-[14px] font-bold text-foreground mt-1">{client?.siteLocation || 'Confidential Site'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Launch Date</h5>
                                    <p className="text-[14px] font-bold text-foreground mt-1">
                                        {new Date(project.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Pulse */}
                    <div className="bg-card border border-border/60 rounded-[2.5rem] p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Team Pulse</p>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider rounded">Active</span>
                        </div>
                        <div className="space-y-4">
                            {(project.assignedStaff || []).map((staffId) => {
                                const member = staff.find(s => s.id === staffId);
                                return (
                                    <div key={staffId} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            {member?.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h6 className="text-[13px] font-bold text-foreground truncate">{member?.name}</h6>
                                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium opacity-60">{member?.role}</p>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </PageContainer>
    );
};

export default ProjectDetail;
