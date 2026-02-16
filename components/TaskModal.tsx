import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus } from '../types';

export const TaskModal = () => {
    const { activeModalTask, setActiveModalTask, moveTask } = useApp();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveModalTask(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setActiveModalTask]);

    if (!activeModalTask) return null;

    const handleMove = () => {
        let nextStatus: TaskStatus = 'BACKLOG';
        if (activeModalTask.status === 'BACKLOG') nextStatus = 'FABRICATION';
        else if (activeModalTask.status === 'FABRICATION') nextStatus = 'ASSEMBLY';
        else if (activeModalTask.status === 'ASSEMBLY') nextStatus = 'DEPLOYMENT';
        
        moveTask(activeModalTask.id, nextStatus);
        setActiveModalTask(null);
    };

    return (
        <div className="absolute inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
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
                        <span>LAST UPDATE: 14:02:59</span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                    <div className="p-8 border-b border-border-main">
                        <div className="flex items-start justify-between mb-2">
                            <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Task Name</label>
                            <div className="px-2 py-0.5 border border-primary text-primary text-[10px] font-bold uppercase tracking-wider bg-primary/10">IN PROGRESS</div>
                        </div>
                        <h1 className="font-display font-bold text-3xl text-white tracking-wide leading-tight mb-6">{activeModalTask.title}</h1>

                        <div className="grid grid-cols-2 border border-border-main bg-[#111]">
                            <div className="p-4 border-b border-r border-border-main">
                                <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Assignee</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                        {activeModalTask.assigneeAvatar ? (
                                            <img src={activeModalTask.assigneeAvatar} alt="Assignee" className="w-full h-full object-cover grayscale opacity-80" />
                                        ) : (
                                            <span className="material-symbols-outlined text-xs">person</span>
                                        )}
                                    </div>
                                    <span className="text-white font-mono text-sm">{activeModalTask.assignee}</span>
                                </div>
                            </div>
                            <div className="p-4 border-b border-border-main">
                                <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Priority</label>
                                <span className={`font-display font-bold text-lg tracking-wider ${activeModalTask.priority === 'CRIT' ? 'text-critical' : 'text-primary'}`}>
                                    {activeModalTask.priority === 'CRIT' ? 'CRITICAL' : activeModalTask.priority}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-b border-border-main">
                        <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-3 flex justify-between">
                            <span>Technical Description</span>
                            <span className="text-success opacity-50">// EDIT MODE ACTIVE</span>
                        </label>
                        <div className="relative group">
                            <textarea 
                                className="w-full h-32 bg-black border border-border-main text-success font-mono text-sm p-4 focus:ring-0 focus:border-primary focus:border-2 transition-all resize-none outline-none leading-relaxed selection:bg-success selection:text-black" 
                                spellCheck={false}
                                defaultValue={`Align primary servo motors with chassis mount points.\n> Verify torque settings before locking.\n> Ensure hydraulic lines are clear of rotation path.`}
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-border-main group-hover:border-primary pointer-events-none"></div>
                        </div>
                    </div>

                    <div className="p-8 pb-32">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Sub-Routines</h3>
                            <span className="text-text-muted text-xs font-mono">1/3 COMPLETED</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="group flex items-center gap-4 p-3 hover:bg-[#161616] cursor-pointer border border-transparent hover:border-border-main transition-colors">
                                <div className="w-5 h-5 border border-border-main bg-primary flex items-center justify-center">
                                     <div className="w-3 h-3 bg-black"></div>
                                </div>
                                <span className="text-text-muted line-through decoration-text-muted font-mono text-sm">Calibrate Servo A sequence</span>
                            </div>
                             <div className="group flex items-center gap-4 p-3 hover:bg-[#161616] cursor-pointer border border-transparent hover:border-border-main transition-colors">
                                <div className="w-5 h-5 border border-border-main bg-[#111] group-hover:border-primary"></div>
                                <span className="text-white font-mono text-sm group-hover:text-primary transition-colors">Calibrate Servo B sequence</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-border-main bg-[#111] p-6 shrink-0 flex gap-4 mt-auto sticky bottom-0 z-20">
                    <button 
                        onClick={handleMove}
                        className="flex-1 h-12 flex items-center justify-center bg-primary text-black font-display font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <span className="material-symbols-outlined mr-2 text-lg">check_circle</span>
                        Advance Status
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center border border-critical text-critical bg-transparent hover:bg-critical hover:text-white transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};
