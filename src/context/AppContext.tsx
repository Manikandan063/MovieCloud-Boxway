import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/services/api';
import type { Staff, Client, Project, PayrollRecord } from '@/types';

interface AppContextType {
    staff: Staff[];
    refreshStaff: () => Promise<void>;
    clients: Client[];
    refreshClients: () => Promise<void>;
    projects: Project[];
    refreshProjects: () => Promise<void>;
    payroll: PayrollRecord[];
    setPayroll: (payroll: PayrollRecord[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [payroll, setPayroll] = useState<PayrollRecord[]>([]);

    const refreshStaff = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.get('/users');
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedStaff = response.data.data.map((user: any) => ({
                    id: user._id,
                    name: user.name || '',
                    email: user.email || '',
                    role: (user.role || 'intern').toLowerCase(),
                    phone: user.contactInfo?.phone || '',
                    joiningDate: user.joiningDate ? user.joiningDate.split('T')[0] : new Date().toISOString().split('T')[0],
                    salary: user.salaryDetails?.basicSalary || 0,
                    assignedProjects: [],
                }));
                setStaff(mappedStaff);
            } else {
                setStaff([]);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            setStaff([]);
        }
    };

    const refreshClients = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get('/clients');
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedClients = response.data.data.map((client: any) => ({
                    id: client._id,
                    name: client.name || '',
                    email: client.email || '',
                    phone: client.phone || '',
                    company: client.company || '',
                    siteLocation: client.siteLocation || '',
                    contractValue: client.contractValue || 0,
                    contractDate: client.contractDate ? client.contractDate.split('T')[0] : '',
                    projects: client.assignedProjects || [],
                    paymentStatus: client.paymentStatus || 'pending',
                    totalPaid: client.totalPaid || 0,
                }));
                setClients(mappedClients);
            } else {
                setClients([]);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            setClients([]);
        }
    };

    const refreshProjects = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get('/projects');
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedProjects = response.data.data.map((project: any) => ({
                    id: project._id,
                    name: project.name || '',
                    description: project.description || '',
                    clientId: project.client?._id || project.client || '',
                    assignedStaff: project.assignedStaff?.map((s: any) => s._id || s) || [],
                    status: project.status || 'planning',
                    phases: project.phases || [],
                    startDate: project.startDate ? project.startDate.split('T')[0] : '',
                    deadline: project.deadline ? project.deadline.split('T')[0] : '',
                    budget: project.budget || 0,
                    progress: project.progress || 0,
                }));
                setProjects(mappedProjects);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refreshStaff();
            refreshClients();
            refreshProjects();
        }
    }, []);

    return (
        <AppContext.Provider value={{
            staff, refreshStaff,
            clients, refreshClients,
            projects, refreshProjects,
            payroll, setPayroll
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
