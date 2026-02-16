import React from 'react';
import { useApp } from '../context/AppContext';

export const Resources = () => {
    const { resources } = useApp();

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background-dark relative h-full">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0"></div>

            {/* Header */}
            <header className="h-16 border-b border-border-main bg-background-dark/95 backdrop-blur-sm z-10 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl animate-pulse">hub</span>
                    <h2 className="text-white font-display text-xl font-bold tracking-tight">RESOURCE_ALLOCATION // MATRIX_04</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center h-10 w-64 border border-border-main bg-surface hover:border-primary/50 transition-colors group">
                        <div className="px-3 text-text-muted group-hover:text-primary">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input className="bg-transparent border-none text-white placeholder-text-muted text-xs font-mono w-full focus:ring-0 focus:outline-none h-full uppercase" placeholder="SEARCH_OPERATOR_ID" type="text"/>
                    </div>
                    <div className="flex gap-2">
                        <button className="h-10 px-4 border border-border-main bg-surface flex items-center justify-center text-text-main text-xs font-bold hover:bg-primary hover:text-black hover:border-primary transition-all gap-2 hover-glitch">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            ALLOCATE_NEW
                        </button>
                    </div>
                </div>
            </header>

            {/* Table Container */}
            <div className="flex-1 overflow-auto p-8 relative z-10">
                <div className="w-full border border-border-main bg-background-dark">
                    <div className="grid grid-cols-12 gap-4 border-b-2 border-white bg-surface px-4 py-3 sticky top-0 z-20">
                        <div className="col-span-1 text-xs font-bold text-text-muted uppercase tracking-wider">ID</div>
                        <div className="col-span-3 text-xs font-bold text-text-muted uppercase tracking-wider">OPERATOR / ROLE</div>
                        <div className="col-span-2 text-xs font-bold text-text-muted uppercase tracking-wider">MACHINE ID</div>
                        <div className="col-span-2 text-xs font-bold text-text-muted uppercase tracking-wider">STATUS</div>
                        <div className="col-span-2 text-xs font-bold text-text-muted uppercase tracking-wider">WORKLOAD (7D)</div>
                        <div className="col-span-1 text-xs font-bold text-text-muted uppercase tracking-wider text-right">EFF%</div>
                        <div className="col-span-1 text-xs font-bold text-text-muted uppercase tracking-wider text-right">ACTION</div>
                    </div>

                    <div className="flex flex-col font-mono text-sm">
                        {resources.map((res) => (
                            <div key={res.id} className="grid grid-cols-12 gap-4 items-center border-b border-border-main bg-[#111111] hover:border-primary hover:border-b hover:bg-[#151510] transition-colors px-4 py-3 group cursor-pointer relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className={`col-span-1 font-bold ${res.status === 'ERROR' ? 'text-critical' : res.status === 'BUSY' ? 'text-primary' : 'text-text-main'}`}>
                                    {res.operatorId}
                                </div>
                                
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className={`h-8 w-8 bg-surface border border-border-main grayscale overflow-hidden ${res.status === 'BUSY' && 'border-primary'}`}>
                                        <img src={res.avatar} alt="Avatar" className="object-cover w-full h-full opacity-80" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold leading-none">{res.name}</span>
                                        <span className="text-xs text-text-muted mt-1">{res.role}</span>
                                    </div>
                                </div>

                                <div className={`col-span-2 ${res.status === 'ERROR' ? 'text-critical font-bold' : 'text-text-muted group-hover:text-white'}`}>
                                    {res.machineId}
                                </div>

                                <div className="col-span-2 flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${res.status === 'BUSY' ? 'bg-primary animate-pulse' : res.status === 'ERROR' ? 'bg-critical' : 'border border-text-muted'}`}></div>
                                    <span className={`text-xs font-bold ${res.status === 'BUSY' ? 'text-primary' : res.status === 'ERROR' ? 'text-critical' : 'text-text-muted'}`}>
                                        {res.status}
                                    </span>
                                </div>

                                <div className="col-span-2 h-6 flex items-end gap-[2px]">
                                    {res.workload.map((val, i) => (
                                        <div key={i} className={`w-1 h-full relative ${res.status === 'ERROR' ? 'bg-border-main' : 'bg-primary/20'}`}>
                                            <div 
                                                className={`absolute bottom-0 w-full ${res.status === 'ERROR' ? 'bg-critical' : res.status === 'IDLE' ? 'bg-text-muted' : 'bg-primary'}`} 
                                                style={{ height: `${val}%` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-span-1 text-right text-white">{res.efficiency > 0 ? `${res.efficiency}%` : '--'}</div>

                                <div className="col-span-1 text-right">
                                    <button className="text-text-muted hover:text-white p-1">
                                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Bottom Status Bar */}
            <div className="px-8 pb-4 mt-auto flex gap-8 border-t border-border-main pt-4 text-xs font-mono text-text-muted bg-background-dark z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>SYSTEM: ONLINE</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>POWER: 98.4%</span>
                </div>
                <div className="ml-auto">LAST SYNC: 14:02:44</div>
            </div>
        </div>
    );
};
