import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';
import { CreateTaskModal } from '../components/CreateTaskModal';

interface ColumnProps {
    title: string;
    status: TaskStatus;
    count: number;
    tasks: Task[];
    onTaskClick: (t: Task) => void;
    isAssembly?: boolean;
    onDropTask: (taskId: string, status: TaskStatus) => void;
}

const Column = ({ title, status, count, tasks, onTaskClick, isAssembly = false, onDropTask }: ColumnProps) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isOver) setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        // Only set isOver to false if moving out of the drop zone completely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(false);
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            onDropTask(taskId, status);
        }
    };

    return (
        <div 
            className={`min-w-[320px] flex-1 flex flex-col border-r border-border-main h-full group/col relative transition-all duration-200 
                ${isAssembly ? 'bg-grid-pattern' : 'bg-hatch-pattern'} 
                ${isOver ? 'bg-primary/5 ring-inset ring-2 ring-primary z-20' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
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
                        draggable="true" 
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', task.id);
                            e.dataTransfer.effectAllowed = 'move';
                            e.currentTarget.classList.add('opacity-50');
                        }}
                        onDragEnd={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                        }}
                        onClick={() => onTaskClick(task)}
                        className="card-cutout bg-surface border border-border-light p-4 shadow-hard hover:border-white transition-all cursor-move group/card relative hover:-translate-y-1 hover:translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0"
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
                
                {/* Dynamic Empty/Drop State */}
                {(tasks.length === 0 || isOver) && (
                     <div className={`border border-dashed h-32 flex items-center justify-center transition-all duration-300 pointer-events-none ${isOver ? 'border-primary bg-primary/10' : 'border-primary/20 bg-primary/5'}`}>
                        <span className={`text-xs font-mono animate-pulse ${isOver ? 'text-primary' : 'text-primary/40'}`}>
                            {isOver ? 'DROP_ZONE_ACTIVE' : 'AWAITING_TASKS'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const { tasks, setActiveModalTask, moveTask } = useApp();
    const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Extract unique assignees from current tasks for the filter list
    const assignees = ['ALL', ...Array.from(new Set(tasks.map(t => t.assignee))).sort()];
    const priorities = ['ALL', 'LOW', 'MED', 'HIGH', 'CRIT', 'RDY'];

    const getTasks = (status: TaskStatus) => {
        return tasks.filter(t => {
            const matchesStatus = t.status === status;
            const matchesAssignee = assigneeFilter === 'ALL' || t.assignee === assigneeFilter;
            const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
            return matchesStatus && matchesAssignee && matchesPriority;
        });
    };

    const onDropTask = (taskId: string, newStatus: TaskStatus) => {
        moveTask(taskId, newStatus);
    };

    return (
        <div className="flex flex-col h-full bg-transparent relative">
             {/* Filter Bar */}
            <div className="flex items-center gap-4 px-6 py-3 border-b border-border-main bg-background-dark z-20 shrink-0">
                <div className="flex items-center gap-2 text-text-muted mr-2">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    <span className="text-xs font-bold tracking-widest uppercase font-display">FILTERS</span>
                </div>
                
                {/* Assignee Filter */}
                <div className="relative group">
                    <select 
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        className="appearance-none bg-surface border border-border-main hover:border-primary text-[10px] font-mono font-bold text-white pl-3 pr-8 py-1.5 focus:outline-none focus:border-primary focus:ring-0 transition-colors cursor-pointer uppercase min-w-[140px]"
                    >
                        <option value="ALL">OPERATIVE: ALL</option>
                        {assignees.filter(a => a !== 'ALL').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-primary transition-colors">
                         <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    </div>
                </div>

                {/* Priority Filter */}
                <div className="relative group">
                    <select 
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="appearance-none bg-surface border border-border-main hover:border-primary text-[10px] font-mono font-bold text-white pl-3 pr-8 py-1.5 focus:outline-none focus:border-primary focus:ring-0 transition-colors cursor-pointer uppercase min-w-[140px]"
                    >
                         <option value="ALL">PRIORITY: ALL</option>
                         {priorities.filter(p => p !== 'ALL').map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-primary transition-colors">
                         <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    </div>
                </div>

                 {(assigneeFilter !== 'ALL' || priorityFilter !== 'ALL') && (
                    <button 
                        onClick={() => { setAssigneeFilter('ALL'); setPriorityFilter('ALL'); }}
                        className="flex items-center gap-1 text-[10px] text-critical hover:text-white uppercase font-bold tracking-wider ml-auto hover:bg-critical/20 px-2 py-1 transition-colors border border-transparent hover:border-critical"
                    >
                        <span className="material-symbols-outlined text-[12px]">close</span>
                        Clear Active Filters
                    </button>
                 )}
            </div>

            <div className="flex-1 flex overflow-x-auto overflow-y-hidden relative">
                <Column title="01. BACKLOG" status="BACKLOG" count={getTasks('BACKLOG').length} tasks={getTasks('BACKLOG')} onTaskClick={setActiveModalTask} onDropTask={onDropTask} />
                <Column title="02. FABRICATION" status="FABRICATION" count={getTasks('FABRICATION').length} tasks={getTasks('FABRICATION')} onTaskClick={setActiveModalTask} onDropTask={onDropTask} />
                <Column title="03. ASSEMBLY" status="ASSEMBLY" count={getTasks('ASSEMBLY').length} tasks={getTasks('ASSEMBLY')} onTaskClick={setActiveModalTask} onDropTask={onDropTask} isAssembly />
                <Column title="04. DEPLOYMENT" status="DEPLOYMENT" count={getTasks('DEPLOYMENT').length} tasks={getTasks('DEPLOYMENT')} onTaskClick={setActiveModalTask} onDropTask={onDropTask} />
                
                {/* FAB */}
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="absolute bottom-8 right-8 bg-primary hover:bg-white text-black w-14 h-14 flex items-center justify-center border-2 border-black shadow-hard z-30 group transition-colors"
                >
                    <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-90 transition-transform duration-300">add</span>
                </button>
            </div>

            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
};