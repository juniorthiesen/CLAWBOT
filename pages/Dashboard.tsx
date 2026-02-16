import React from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';

const Column = ({ title, count, tasks, onTaskClick, isAssembly = false }: { title: string, count: number, tasks: Task[], onTaskClick: (t: Task) => void, isAssembly?: boolean }) => {
    return (
        <div className={`min-w-[320px] flex-1 flex flex-col border-r border-border-main h-full group/col relative ${isAssembly ? 'bg-grid-pattern' : 'bg-hatch-pattern'}`}>
             {/* Assembly Column Overlay for aesthetics */}
            {isAssembly && <div className="absolute inset-0 bg-black opacity-10 pointer-events-none z-0"></div>}
            
            <div className={`h-12 flex items-center justify-between px-4 bg-background-dark/95 backdrop-blur border-b-2 sticky top-0 z-10 ${isAssembly ? 'border-primary' : 'border-text-muted'}`}>
                <h2 className={`font-display font-bold text-sm tracking-widest transition-colors ${isAssembly ? 'text-primary' : 'text-text-muted group-hover/col:text-white'}`}>
                    {title}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 font-bold font-mono ${isAssembly ? 'bg-primary text-black' : 'bg-border-main text-text-muted'}`}>
                    {count}
                </span>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto z-10 relative">
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        onClick={() => onTaskClick(task)}
                        className="card-cutout bg-surface border border-border-light p-4 shadow-hard hover:border-white transition-all cursor-pointer group/card relative hover:-translate-y-1 hover:translate-x-1"
                    >
                        <div className="flex justify-between items-start mb-3 pl-2">
                            <span className={`font-display font-bold text-sm tracking-wide group-hover/card:text-white ${task.status === 'DEPLOYMENT' ? 'text-success' : 'text-primary'}`}>#{task.id}</span>
                            <span className={`text-[10px] border border-border-main px-1 font-bold ${
                                task.priority === 'CRIT' ? 'bg-primary text-black' : 
                                task.priority === 'HIGH' ? 'bg-primary text-black' : 
                                task.priority === 'RDY' ? 'bg-success text-black' : 'text-text-muted'
                            }`}>
                                {task.priority}
                            </span>
                        </div>
                        <h3 className="text-white font-mono text-sm leading-tight mb-4 pl-2">{task.title}</h3>
                        <div className="flex items-center justify-between pl-2">
                            <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined text-sm ${task.status === 'DEPLOYMENT' ? 'text-success' : 'text-text-muted'}`}>
                                    {task.status === 'DEPLOYMENT' ? 'check_circle' : 'person'}
                                </span>
                                <span className={`text-[10px] ${task.status === 'DEPLOYMENT' ? 'text-success' : 'text-text-muted'}`}>
                                    {task.assignee}
                                </span>
                            </div>
                            {/* Block Progress */}
                            <div className="flex gap-[2px] w-16">
                                {[...Array(5)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1 flex-1 ${i < task.progress ? (task.status === 'DEPLOYMENT' ? 'bg-success' : 'bg-primary') : 'bg-border-main'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                
                {title === '01. BACKLOG' && (
                     <div className="border border-dashed border-primary/40 h-32 bg-primary/5 flex items-center justify-center">
                        <span className="text-primary/40 text-xs font-mono animate-pulse">DROP_TARGET_LOCKED</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const { tasks, setActiveModalTask } = useApp();

    const getTasks = (status: TaskStatus) => tasks.filter(t => t.status === status);

    return (
        <div className="flex h-full overflow-x-auto overflow-y-hidden bg-transparent relative">
            <Column title="01. BACKLOG" count={getTasks('BACKLOG').length} tasks={getTasks('BACKLOG')} onTaskClick={setActiveModalTask} />
            <Column title="02. FABRICATION" count={getTasks('FABRICATION').length} tasks={getTasks('FABRICATION')} onTaskClick={setActiveModalTask} />
            <Column title="03. ASSEMBLY" count={getTasks('ASSEMBLY').length} tasks={getTasks('ASSEMBLY')} onTaskClick={setActiveModalTask} isAssembly />
            <Column title="04. DEPLOYMENT" count={getTasks('DEPLOYMENT').length} tasks={getTasks('DEPLOYMENT')} onTaskClick={setActiveModalTask} />
            
            {/* FAB */}
            <button className="absolute bottom-8 right-8 bg-primary hover:bg-white text-black w-14 h-14 flex items-center justify-center border-2 border-black shadow-hard z-30 group transition-colors">
                <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-90 transition-transform duration-300">add</span>
            </button>
        </div>
    );
};
