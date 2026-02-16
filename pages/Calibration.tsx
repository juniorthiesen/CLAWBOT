import React from 'react';
import { useApp } from '../context/AppContext';

export const Calibration = () => {
    const { config, updateConfig } = useApp();

    return (
        <div className="h-full overflow-y-auto relative bg-grid-pattern bg-[length:40px_40px]">
            {/* Header */}
            <header className="h-16 border-b border-border-main bg-background-dark/95 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-text-muted">04 //</span>
                    <h2 className="text-xl font-bold tracking-tight text-white">SYSTEM CONFIGURATION</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 border border-border-main bg-surface">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        <span className="font-mono text-xs text-success">SYSTEM ONLINE</span>
                    </div>
                </div>
            </header>

            <div className="p-6 lg:p-12 flex justify-center pb-24">
                <div className="w-full max-w-[800px] flex flex-col gap-8">
                    
                    <div className="border-l-4 border-primary pl-4 py-1">
                        <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">Global Parameters</h3>
                        <p className="font-mono text-text-muted text-sm mt-1">ADJUST CORE KERNEL SETTINGS AND INTERFACE BEHAVIOR.</p>
                    </div>

                    {/* INTERFACE_IO */}
                    <section className="border border-border-main bg-surface p-1 relative">
                        <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-primary"></div>
                        <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-primary"></div>
                        
                        <div className="bg-background-dark border-b border-border-main px-4 py-3 flex justify-between items-center">
                            <h4 className="font-mono font-bold text-primary tracking-widest text-sm uppercase">/// INTERFACE_IO</h4>
                            <span className="material-symbols-outlined text-text-muted text-lg">tune</span>
                        </div>
                        <div className="p-6 grid gap-8">
                            {/* High Contrast */}
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col gap-1">
                                    <span className="font-display font-bold text-white tracking-wide text-lg">HIGH CONTRAST MODE</span>
                                    <span className="font-mono text-xs text-text-muted">Forces max brightness on data layers.</span>
                                </div>
                                <div className="relative inline-block w-[40px] align-middle select-none">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only" 
                                        checked={config.highContrast} 
                                        onChange={(e) => updateConfig('highContrast', e.target.checked)}
                                        id="highContrast"
                                    />
                                    <label htmlFor="highContrast" className="block overflow-hidden h-[20px] w-[40px] bg-[#333] cursor-pointer peer-checked:bg-primary transition-colors duration-75 ease-linear">
                                        <span className="block h-[20px] w-[20px] bg-black shadow-md transform translate-x-0 peer-checked:translate-x-[20px] transition-transform duration-75 ease-linear border-r border-[#555] peer-checked:border-l peer-checked:border-r-0"></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="h-px bg-border-main w-full"></div>

                             {/* Refresh Rate */}
                             <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-display font-bold text-white tracking-wide text-lg">REFRESH RATE</span>
                                        <span className="font-mono text-xs text-text-muted">Set dashboard polling frequency.</span>
                                    </div>
                                    <div className="border border-primary px-2 py-1 bg-black">
                                        <span className="font-mono text-primary font-bold text-sm">{config.refreshRate} Hz</span>
                                    </div>
                                </div>
                                <div className="relative pt-6 pb-2">
                                    <input 
                                        type="range" 
                                        min="30" max="144" 
                                        value={config.refreshRate} 
                                        onChange={(e) => updateConfig('refreshRate', parseInt(e.target.value))}
                                        className="w-full bg-transparent focus:outline-none focus:ring-0" 
                                    />
                                    <div className="flex justify-between mt-2 font-mono text-[10px] text-text-muted">
                                        <span>30 Hz</span>
                                        <span>144 Hz</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SAFETY_LIMITS */}
                    <section className="border border-border-main bg-surface p-1 relative">
                         <div className="bg-background-dark border-b border-border-main px-4 py-3 flex justify-between items-center">
                            <h4 className="font-mono font-bold text-primary tracking-widest text-sm uppercase">/// SAFETY_LIMITS</h4>
                            <span className="material-symbols-outlined text-text-muted text-lg">security</span>
                        </div>
                        <div className="p-6 grid gap-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="font-mono text-xs text-text-muted uppercase font-bold tracking-wider">Max Torque (Nm)</label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            value={config.maxTorque}
                                            onChange={(e) => updateConfig('maxTorque', e.target.value)}
                                            className="w-full bg-black border border-border-main text-success font-mono p-3 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                                        />
                                        <div className="absolute right-0 top-0 h-full w-8 flex items-center justify-center border-l border-border-main bg-surface/50 text-text-muted font-mono text-xs">Nm</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="font-mono text-xs text-text-muted uppercase font-bold tracking-wider">Temp Ceiling (C)</label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            value={config.tempCeiling}
                                            onChange={(e) => updateConfig('tempCeiling', e.target.value)}
                                            className="w-full bg-black border border-border-main text-success font-mono p-3 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                                        />
                                        <div className="absolute right-0 top-0 h-full w-8 flex items-center justify-center border-l border-border-main bg-surface/50 text-text-muted font-mono text-xs">C°</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <label className="font-mono text-xs text-text-muted uppercase font-bold tracking-wider">Calibration Notes</label>
                                <textarea 
                                    rows={3}
                                    value={config.calibrationNotes}
                                    onChange={(e) => updateConfig('calibrationNotes', e.target.value)}
                                    className="w-full bg-black border border-border-main text-success font-mono p-3 text-sm focus:outline-none focus:border-primary focus:ring-0 resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-border-main">
                        <button className="flex-1 bg-primary text-black font-display font-bold text-lg py-4 px-6 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none shadow-hard transition-all uppercase tracking-wider flex items-center justify-center gap-3 active:shadow-none">
                            <span className="material-symbols-outlined">save</span>
                            Calibrate & Save
                        </button>
                        <button className="flex-initial border border-text-muted text-text-muted hover:text-white hover:border-white font-mono font-bold text-sm py-4 px-8 bg-transparent transition-colors uppercase tracking-wider">
                            Revert
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
