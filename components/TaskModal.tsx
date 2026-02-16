import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus, Task } from '../types';

export const TaskModal = () => {
    const { activeModalTask, setActiveModalTask, moveTask, updateTask } = useApp();
    
    // Local state for smooth editing without layout shift
    const [localNote, setLocalNote] = useState('');
    const [localTitle, setLocalTitle] = useState('');
    const [localAssignee, setLocalAssignee] = useState('');
    const [localPriority, setLocalPriority] = useState<Task['priority']>('LOW');

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveModalTask(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setActiveModalTask]);
    
    // Sync local state when the active task changes
    useEffect(() => {
        if(activeModalTask) {
            setLocalNote(activeModalTask.notes || '');
            setLocalTitle(activeModalTask.title);
            setLocalAssignee(activeModalTask.assignee);
            setLocalPriority(activeModalTask.priority);
        }
    }, [activeModalTask?.id]);

    // Handlers
    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalNote(e.target.value);
        if (activeModalTask) updateTask(activeModalTask.id, { notes: e.target.value });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.target.value);
        if (activeModalTask) updateTask(activeModalTask.id, { title: e.target.value });
    };

    const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalAssignee(e.target.value);
        if (activeModalTask) updateTask(activeModalTask.id, { assignee: e.target.value });
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value as Task['priority'];
        setLocalPriority(newPriority);
        if (activeModalTask) updateTask(activeModalTask.id, { priority: newPriority });
    };

    const handleProgressClick = (level: number) => {
        if (activeModalTask) updateTask(activeModalTask.id, { progress: level });
    };

    if (!activeModalTask) return null;

    const handleMove = () => {
        let nextStatus: TaskStatus = 'BACKLOG';
        if (activeModalTask.status === 'BACKLOG') nextStatus = 'FABRICATION';
        else if (activeModalTask.status === 'FABRICATION') nextStatus = 'ASSEMBLY';
        else if (activeModalTask.status === 'ASSEMBLY') nextStatus = 'DEPLOYMENT';
        
        moveTask(activeModalTask.id, nextStatus);
        setActiveModalTask(null);
    };

    const getStatusColor = (s: TaskStatus) => {
        if (s === 'DEPLOYMENT') return 'text-success border-success bg-success/10';
        if (s === 'ASSEMBLY') return 'text-primary border-primary bg-primary/10';
        return 'text-text-muted border-text-muted bg-white/5';
    };

    const getPriorityColor = (p: string) => {
        if (p === 'CRIT') return 'text-critical';
        if (p === 'RDY') return 'text-success';
        return 'text-primary';
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm" onClick={(e) => {
            if(e.target === e.currentTarget) setActiveModalTask(null);
        }}>
            <div className="w-full max-w-[600px] h-full bg-surface border-l border-border-main flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <header className="bg-primary h-16 px-6 flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center gap-3 text-black">
                        <span className="font-display font-bold text-2xl tracking-tight">TASK INSPECTOR // {activeModalTask.id}</span>
                    </div>
                    <button 
                        onClick={() => setActiveModalTask(null)}
                        className="group flex items-center justify-center h-10 px-4 bg-black text-primary hover:bg-white hover:text-black transition-colors font-bold text-sm tracking-wide border border-black shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <span className="mr-2">CLOSE</span>
                        <span className="font-mono">[ESC]</span>
                    </button>
                </header>

                {/* Status Bar */}
                <div className="h-10 bg-[#0f0f0f] border-b border-border-main flex items-center justify-between px-6">
                    <div className="flex items-center gap-6 text-xs text-text-muted font-bold tracking-widest">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary animate-pulse"></span>
                            LIVE CONNECTION
                        </span>
                        <span>LAST UPDATE: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                    <div className="p-8 border-b border-border-main">
                        <div className="flex items-start justify-between mb-4">
                            <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest block">Current Status</label>
                            <div className={`px-2 py-1 border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(activeModalTask.status)}`}>
                                {activeModalTask.status}
                            </div>
                        </div>
                        
                        {/* Editable Title */}
                        <div className="mb-6 group relative">
                             <input 
                                type="text"
                                value={localTitle}
                                onChange={handleTitleChange}
                                className="font-display font-bold text-3xl text-white tracking-wide leading-tight bg-transparent border-b border-transparent hover:border-border-light focus:border-primary focus:ring-0 w-full p-0 py-1 transition-all placeholder-text-muted/20"
                            />
                            <span className="material-symbols-outlined absolute right-0 top-2 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">edit</span>
                        </div>

                        <div className="grid grid-cols-2 border border-border-main bg-[#111]">
                            {/* Editable Assignee */}
                            <div className="p-4 border-b border-r border-border-main relative group">
                                <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Assignee</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-800 border border-border-main flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shrink-0">
                                        {activeModalTask.assigneeAvatar ? (
                                            <img src={activeModalTask.assigneeAvatar} alt="Assignee" className="w-full h-full object-cover grayscale opacity-80" />
                                        ) : (
                                            <span className="material-symbols-outlined text-sm text-text-muted">person</span>
                                        )}
                                    </div>
                                    <input 
                                        type="text"
                                        value={localAssignee}
                                        onChange={handleAssigneeChange}
                                        className="bg-transparent border-none text-white font-mono text-sm p-0 w-full focus:ring-0 focus:bg-[#222] transition-colors"
                                    />
                                    <span className="material-symbols-outlined text-[14px] text-text-muted absolute right-2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">edit</span>
                                </div>
                            </div>
                            
                            {/* Editable Priority */}
                            <div className="p-4 border-b border-border-main relative group">
                                <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Priority</label>
                                <div className="relative">
                                    <select 
                                        value={localPriority}
                                        onChange={handlePriorityChange}
                                        className={`font-display font-bold text-lg tracking-wider bg-transparent border-none p-0 pr-8 w-full focus:ring-0 cursor-pointer appearance-none ${getPriorityColor(localPriority)}`}
                                    >
                                        <option value="LOW" className="text-white bg-background-dark">LOW</option>
                                        <option value="MED" className="text-primary bg-background-dark">MED</option>
                                        <option value="HIGH" className="text-primary bg-background-dark">HIGH</option>
                                        <option value="CRIT" className="text-critical bg-background-dark">CRITICAL</option>
                                        <option value="RDY" className="text-success bg-background-dark">READY</option>
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                         <span className="material-symbols-outlined text-sm text-text-muted">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-b border-border-main">
                        <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-3 flex justify-between">
                            <span>Technical Description / Notes</span>
                            <span className="text-success opacity-50 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">edit</span>
                                EDITABLE
                            </span>
                        </label>
                        <div className="relative group">
                            <textarea 
                                className="w-full h-32 bg-black border border-border-main text-success font-mono text-sm p-4 focus:ring-0 focus:border-primary focus:border-2 transition-all resize-none outline-none leading-relaxed selection:bg-success selection:text-black placeholder-white/20" 
                                spellCheck={false}
                                value={localNote}
                                onChange={handleNoteChange}
                                placeholder="ENTER TECHNICAL DETAILS..."
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-border-main group-hover:border-primary pointer-events-none"></div>
                        </div>
                    </div>

                    <div className="p-8 pb-32">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Completion Progress</h3>
                            <span className="text-primary text-xs font-mono font-bold">{activeModalTask.progress} / 5 STAGES</span>
                        </div>
                        
                        {/* Interactive Progress Bar Visual */}
                        <div className="flex gap-1 h-6 mb-6 group/progress">
                             {[...Array(5)].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleProgressClick(i + 1)}
                                    className={`flex-1 transition-all duration-200 border border-transparent hover:scale-105 active:scale-95
                                        ${i < activeModalTask.progress 
                                            ? 'bg-primary shadow-[0_0_10px_rgba(255,255,0,0.3)] hover:bg-white' 
                                            : 'bg-border-main hover:bg-border-light'
                                        }`}
                                >
                                </button>
                            ))}
                             {/* Reset Button (Hidden usually, useful for testing/reset) */}
                             <button onClick={() => handleProgressClick(0)} className="w-4 ml-2 flex items-center justify-center text-text-muted hover:text-critical">
                                <span className="material-symbols-outlined text-xs">restart_alt</span>
                             </button>
                        </div>

                        <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
                            <p className="font-mono text-xs text-text-muted">Click segments to manually override progress level.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-border-main bg-[#111] p-6 shrink-0 flex gap-4 mt-auto sticky bottom-0 z-20">
                    <button 
                        onClick={handleMove}
                        disabled={activeModalTask.status === 'DEPLOYMENT'}
                        className={`flex-1 h-12 flex items-center justify-center font-display font-bold uppercase tracking-wider text-sm transition-colors shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                            ${activeModalTask.status === 'DEPLOYMENT' 
                                ? 'bg-surface border border-border-main text-text-muted cursor-not-allowed shadow-none' 
                                : 'bg-primary text-black hover:bg-white'
                            }
                        `}
                    >
                        <span className="material-symbols-outlined mr-2 text-lg">
                            {activeModalTask.status === 'DEPLOYMENT' ? 'lock' : 'check_circle'}
                        </span>
                        {activeModalTask.status === 'DEPLOYMENT' ? 'COMPLETED' : 'ADVANCE STATUS'}
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center border border-critical text-critical bg-transparent hover:bg-critical hover:text-white transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};