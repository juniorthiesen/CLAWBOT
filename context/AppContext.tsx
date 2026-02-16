import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';
import { Task, Resource, SystemConfig, TaskStatus } from '../types';

interface AppContextType {
    tasks: Task[];
    moveTask: (taskId: string, newStatus: TaskStatus) => void;
    addTask: (task: Task) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    resources: Resource[];
    config: SystemConfig;
    updateConfig: (key: keyof SystemConfig, value: any) => void;
    activeModalTask: Task | null;
    setActiveModalTask: (task: Task | null) => void;
}

const initialTasks: Task[] = [
    { id: 'A-242', title: 'Servo Calibration sequence mismatch', status: 'BACKLOG', priority: 'LOW', assignee: 'UNASSIGNED', assigneeAvatar: '', progress: 0, notes: 'Standard calibration procedure failed at step 3. Suspect encoder drift.' },
    { id: 'B-105', title: 'Hydraulic fluid pressure sensor error', status: 'BACKLOG', priority: 'MED', assignee: 'UNASSIGNED', assigneeAvatar: '', progress: 0, notes: 'Sensor reading fluctuates wildly. Check wiring harness.' },
    { id: 'C-882', title: 'Chassis reinforcement plating (Titanium)', status: 'FABRICATION', priority: 'HIGH', assignee: 'FAB-04', assigneeAvatar: '', progress: 2, notes: 'Material arrived. Plasma cutter configured for 12mm Ti-6Al-4V.' },
    { id: 'A-201', title: 'Armature Assembly: Joint 3 & 4', status: 'ASSEMBLY', priority: 'MED', assignee: 'K. OLSEN', assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRRe6ew2klHdm4gB641Cisjijjp-56Rve6b_FeDWkN2ggnd7uDkhcrei0a7ix98sSFiCOFvqBNHBW_kagYSX1qvgEeTTKNbT1t6DoMdVLmImY6F8zam_ctShdC5UUIuVIX7dFG7JsO1FxdLzY77Hz3WkaOBJwjPIPuBctsLGHUiUapGMtnamckNDwEklfib1ti-HxeMltpGXeQHD2AdaPh6Pophs-XFhwcLADLz1ao9yNBzosqeuM4xfs38WLZU5gclglVyTbJfv7E', progress: 4, notes: 'Align primary servo motors with chassis mount points.\n> Verify torque settings before locking.\n> Ensure hydraulic lines are clear of rotation path.' },
    { id: 'A-249', title: 'Logic Board Wiring Loom Install', status: 'ASSEMBLY', priority: 'CRIT', assignee: 'J.D.', assigneeAvatar: '', progress: 3, notes: 'Schematic ref: E-202-B. Ensure ground loops are minimized.' },
    { id: 'F-002', title: 'Firmware Flash V4.0.1 (Beta)', status: 'DEPLOYMENT', priority: 'RDY', assignee: 'SYS', assigneeAvatar: '', progress: 5, notes: 'CRC check passed. Ready for deployment.' },
];

const initialResources: Resource[] = [
    { id: '1', operatorId: 'OP-092', name: 'J. MAVERIC', role: 'SR. WELDER', machineId: 'KUKA-ARM-04', status: 'BUSY', workload: [40, 60, 85, 90, 75, 50, 80], efficiency: 98, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmxlHU8US8FnNe-vnzbTcTjbKjTJWRhtThlvSlbic93BzhyUbtwbFucdmELZ31LXSSxRXF6ywmm5nsd7MUiJMurKGmGo_G94yrXhzKveh8j6YQJpgKM67OY0uMFAIip0wOdOHNaKm79AA6MHip7Fsjyfqd19H8UlUfm-eL_ot12WPysXODoSs_rnCM15RRFDgDA_6X_g7IMq2T9dA-_16-KELfiZKr5mzERGCxjepk863yQdpVcT-1eo0c2nXRkS8gQn27GTNykdsy' },
    { id: '2', operatorId: 'OP-114', name: 'A. CHEN', role: 'QA LEAD', machineId: '--', status: 'IDLE', workload: [20, 10, 0, 0, 0, 30, 10], efficiency: 0, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_uejsKRJB-STQmxQO2GAQZRJxkdW23Z8nqEnjdqXYQVSVmFTxd21nIDbh1k24FJLHZypAOnVEYuMABsZ0J5fM7OMSGlnjBPjFoQOHdNY8JcFyTsz7O36sp_npvX-GeLbJ15EvkOb75UlyIje9y0fBp8WC8D57MhWQNfEo4t8Md8evj6pm_76JXvi_SgngZGDmqIMhCVH3X_51Mi79cBcpwfw6B9x4VcgWW8inT-Knunyxy3kg03DcbX2qtZPj-XuG2R8VYa2Bi-Rg' },
    { id: '3', operatorId: 'OP-088', name: 'M. KOWALSKI', role: 'MACHINIST', machineId: 'HAAS-VF2-ERROR', status: 'ERROR', workload: [90, 90, 0, 0, 0, 0, 0], efficiency: 0, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTLRq4aZ8nZv5qb1EcLGKb8OpwUa-QqOffLW8HoSvnCPOENlQleElzx4LXA40TH7gPFX2pUcnXHerC5gZnAIe5RN4NihdLrdmjFPaz_AfhiUswUaYyvnKvfRRp8dwm2JmAN9kW70nqEWf_5uHx4_E8ramEf5prwkeSLSwh_xjmUdPD_UTipXlPaERWU9OxTTd19uuFb0TjBHU74spW9G7uPEp0PEjWedFXj2MU4MEER9pbL6no2i9X0DTH_x6t2OWsZLj2kzSoTVom' },
    { id: '4', operatorId: 'OP-102', name: 'S. CONNOR', role: 'SYS ADMIN', machineId: 'MAINFRAME-A', status: 'BUSY', workload: [65, 70, 60, 80, 90, 85, 75], efficiency: 100, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH-KEswMBpnGc3wSXx6UdMSqar-BAtX_-fnueuD8xC1PRhvgAH_lhanbDb73-ZwtZnXrZjv1xduL3T5_jv1LBV8AQAJToBKZHUV1cVVGqoocosptJZ3PEFHDL9pWN4Igs-Icju65HPIQQDzv1eYBGPtiWiJ0o6T8qzfMo38NpraPwbXB82niNlzjCQgeEEIjViX9TsBmig07qapWnnjju5tnsenvoZbetPbMEuvxtWM-KqTD8vGxa3UVCtJl0FJtN9ygEoWMwj2W5r' },
    { id: '5', operatorId: 'OP-145', name: 'D. VADER', role: 'ASSEMBLY', machineId: 'ARM-DELTA-3', status: 'BUSY', workload: [40, 45, 30, 50, 60, 55, 65], efficiency: 92, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjtx0GDfYkUftL3mE8PTQjXUUfROA1ps28RyNW9rd0Lvv56Js1sZdlReNTLhZ1rZmEHti-nZfv1QHMmnXlHFqbV1tos89jXox04dQRLmFz3jt2IKJDHoI5el2Gxf9eL7IULBtXMx13_Hqk9UKyLfUZCyw9R3Z64-XlFrWctXhLQCwrrg2xLNsNgYywLs0-4N3elG2OFbhKgOblXKyeds0q-pESj7peXOxCk2fXsQA_SNT60YV2CLyTi2XNH01Ctyemdy7bbto3ZN1l' },
    { id: '6', operatorId: 'OP-210', name: 'K. REESE', role: 'TECH LEAD', machineId: 'UNIT-01', status: 'BUSY', workload: [85, 90, 88, 92, 85, 70, 80], efficiency: 99, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiiPO_HsFqHN8lEaczNUf5LEHVPO-wW04VjMaFcYqf71T3n2N6ZQ_wBBD_E0KudzYi44wkwaFxfoz5jqPpRk_gCqZReE2QBVNo0f31r6ZrhplEJ03mcTvfpGhURz1JM0ElE9ZAaX7rXmUxpjhHxEnvBY2JQMrPgqWAO2A-POgQGvfP77ScFavOjc0H83SNQ2HBwqVYcBbYcWSr5EIudmx3xgNiq_chnVZi9bYDY_soNXVR7UZu5gvXropHo2MjVq2jHSAqXxHfuJ-' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [resources] = useState<Resource[]>(initialResources);
    const [activeModalTask, setActiveModalTask] = useState<Task | null>(null);
    const [config, setConfig] = useState<SystemConfig>({
        highContrast: false,
        hapticFeedback: true,
        refreshRate: 60,
        maxTorque: 4500,
        tempCeiling: 85.0,
        gridDensity: 8,
        calibrationNotes: 'Reviewed thermal limits on sector 7. Increased buffer by 5%.'
    });

    const updateConfig = (key: keyof SystemConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const moveTask = (taskId: string, newStatus: TaskStatus) => {
        setTasks(prev => {
            const updated = prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
            // Sync with modal if open
            if (activeModalTask && activeModalTask.id === taskId) {
                setActiveModalTask(updated.find(t => t.id === taskId) || null);
            }
            return updated;
        });
    };

    const addTask = (task: Task) => {
        setTasks(prev => [...prev, task]);
    };

    const updateTask = (taskId: string, updates: Partial<Task>) => {
        setTasks(prev => {
            const updated = prev.map(t => t.id === taskId ? { ...t, ...updates } : t);
            if (activeModalTask && activeModalTask.id === taskId) {
                // We need to be careful not to cause loops if updateTask is called during render, but it shouldn't be.
                setActiveModalTask(updated.find(t => t.id === taskId) || null);
            }
            return updated;
        });
    };

    return (
        <AppContext.Provider value={{ tasks, moveTask, addTask, updateTask, resources, config, updateConfig, activeModalTask, setActiveModalTask }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};