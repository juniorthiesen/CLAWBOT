import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose }: Props) => {
    const { addTask, resources } = useApp();
    const [title, setTitle] = useState('');
    
    // Assignee State
    const [assigneeMode, setAssigneeMode] = useState<'RESOURCE' | 'MANUAL'>('RESOURCE');
    const [selectedResourceId, setSelectedResourceId] = useState<string>('');
    const [manualName, setManualName] = useState('');
    const [manualAvatar, setManualAvatar] = useState('');

    const [priority, setPriority] = useState<Task['priority']>('LOW');
    const [status, setStatus] = useState<TaskStatus>('BACKLOG');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalAssignee = 'UNASSIGNED';
        let finalAvatar = '';

        if (assigneeMode === 'RESOURCE' && selectedResourceId) {
            const res = resources.find(r => r.id === selectedResourceId);
            if (res) {
                finalAssignee = res.name;
                finalAvatar = res.avatar;
            }
        } else if (assigneeMode === 'MANUAL') {
            finalAssignee = manualName.toUpperCase() || 'UNASSIGNED';
            finalAvatar = manualAvatar;
        }

        const newTask: Task = {
            id: `T-${Math.floor(Math.random() * 10000)}`,
            title,
            status,
            priority,
            assignee: finalAssignee,
            assigneeAvatar: finalAvatar, 
            progress: 0,
            notes: ''
        };
        addTask(newTask);
        
        // Reset and close
        setTitle('');
        setSelectedResourceId('');
        setManualName('');
        setManualAvatar('');
        setPriority('LOW');
        setStatus('BACKLOG');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-border-main shadow-hard animate-in fade-in zoom-in-95 duration-200">
                <header className="bg-primary px-6 py-4 flex items-center justify-between">
                    <h2 className="font-display font-bold text-xl text-black uppercase tracking-tight">Initialize New Task</h2>
                    <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-none transition-colors">
                        <span className="material-symbols-outlined font-bold">close</span>
                    </button>
                </header>
                
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider">Task Title</label>
                        <input 
                            type="text" 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-black border border-border-main text-white font-mono text-sm p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-text-muted/50"
                            placeholder="ENTER_PROTOCOL_NAME..."
                        />
                    </div>

                    {/* Assignee Selection */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider">Assignee / Operator</label>
                            <div className="flex gap-1">
                                <button type="button" onClick={() => setAssigneeMode('RESOURCE')} className={`text-[10px] px-2 py-1 border font-bold transition-all ${assigneeMode === 'RESOURCE' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-text-muted hover:text-white'}`}>DATABASE</button>
                                <button type="button" onClick={() => setAssigneeMode('MANUAL')} className={`text-[10px] px-2 py-1 border font-bold transition-all ${assigneeMode === 'MANUAL' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-text-muted hover:text-white'}`}>MANUAL</button>
                            </div>
                        </div>

                        {assigneeMode === 'RESOURCE' ? (
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                {resources.map(res => (
                                    <button
                                        key={res.id}
                                        type="button"
                                        onClick={() => setSelectedResourceId(res.id)}
                                        className={`flex items-center gap-3 p-2 border text-left transition-all group ${selectedResourceId === res.id ? 'border-primary bg-primary/10' : 'border-border-main hover:border-white bg-black'}`}
                                    >
                                        <div className={`w-8 h-8 flex-shrink-0 border ${selectedResourceId === res.id ? 'border-primary' : 'border-border-main group-hover:border-white'} overflow-hidden`}>
                                            <img src={res.avatar} alt={res.operatorId} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden min-w-0">
                                            <span className={`text-[10px] font-bold leading-none truncate ${selectedResourceId === res.id ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>{res.operatorId}</span>
                                            <span className="text-[9px] text-text-muted truncate uppercase">{res.name}</span>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setSelectedResourceId('')}
                                    className={`flex items-center gap-3 p-2 border text-left transition-all group ${selectedResourceId === '' ? 'border-primary bg-primary/10' : 'border-border-main hover:border-white bg-black'}`}
                                >
                                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-border-main group-hover:border-white">
                                        <span className="material-symbols-outlined text-sm text-text-muted">person_off</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted group-hover:text-white uppercase">Unassigned</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                                <input 
                                    type="text" 
                                    value={manualName}
                                    onChange={(e) => setManualName(e.target.value)}
                                    className="bg-black border border-border-main text-white font-mono text-sm p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-text-muted/50"
                                    placeholder="OPERATOR NAME"
                                />
                                <input 
                                    type="url" 
                                    value={manualAvatar}
                                    onChange={(e) => setManualAvatar(e.target.value)}
                                    className="bg-black border border-border-main text-white font-mono text-sm p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-text-muted/50"
                                    placeholder="AVATAR URL (HTTPS://...)"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider">Priority</label>
                            <select 
                                value={priority} 
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="bg-black border border-border-main text-white font-mono text-sm p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="LOW">LOW</option>
                                <option value="MED">MED</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRIT">CRITICAL</option>
                                <option value="RDY">READY</option>
                            </select>
                        </div>

                         {/* Status */}
                         <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider">Status</label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="bg-black border border-border-main text-white font-mono text-sm p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="BACKLOG">BACKLOG</option>
                                <option value="FABRICATION">FABRICATION</option>
                                <option value="ASSEMBLY">ASSEMBLY</option>
                                <option value="DEPLOYMENT">DEPLOYMENT</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px bg-border-main w-full my-2"></div>

                    <div className="flex gap-3">
                         <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-transparent border border-border-main text-text-muted font-mono font-bold text-sm py-3 hover:text-white hover:border-white transition-colors"
                        >
                            ABORT
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-primary text-black border border-primary font-display font-bold text-sm py-3 tracking-wider hover:bg-white hover:border-white transition-colors shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            INITIATE TASK
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};