export type TaskStatus = 'BACKLOG' | 'FABRICATION' | 'ASSEMBLY' | 'DEPLOYMENT';

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    priority: 'LOW' | 'MED' | 'HIGH' | 'CRIT' | 'RDY';
    assignee: string;
    assigneeAvatar: string;
    progress: number; // 0-5
    notes?: string;
}

export interface Resource {
    id: string;
    operatorId: string;
    name: string;
    role: string;
    machineId: string;
    status: 'BUSY' | 'IDLE' | 'ERROR';
    workload: number[]; // Array for sparkline (last 7 days)
    efficiency: number;
    avatar: string;
}

export interface SystemConfig {
    highContrast: boolean;
    hapticFeedback: boolean;
    refreshRate: number;
    maxTorque: number;
    tempCeiling: number;
    gridDensity: number;
    calibrationNotes: string;
}