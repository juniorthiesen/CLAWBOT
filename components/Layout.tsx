import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Layout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-text-main font-mono selection:bg-primary selection:text-black">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 relative">
                 <Header />
                 <main className="flex-1 overflow-hidden relative">
                    <Outlet />
                 </main>
            </div>
        </div>
    );
};

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: 'dashboard', label: 'DASHBOARD' },
        { path: '/tasks', icon: 'description', label: 'SCHEMATICS' }, // Placeholder route
        { path: '/resources', icon: 'precision_manufacturing', label: 'RESOURCES' },
        { path: '/logs', icon: 'terminal', label: 'LOGS' }, // Placeholder route
        { path: '/calibration', icon: 'tune', label: 'CALIBRATION' },
    ];

    return (
        <nav className="w-60 flex-none bg-background-dark border-r border-border-main flex flex-col z-10">
            <div className="flex flex-col py-6 gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `
                            group flex items-center gap-4 px-6 py-3 border-l-4 transition-colors
                            ${isActive 
                                ? 'bg-primary text-black border-black' 
                                : 'text-text-muted hover:text-white hover:bg-surface border-transparent hover:border-primary'}
                        `}
                    >
                        <span className={`material-symbols-outlined ${item.label === 'DASHBOARD' ? '' : 'group-hover:text-primary transition-colors'}`}>
                            {item.icon}
                        </span>
                        <span className="font-display font-bold text-sm tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto p-6 border-t border-border-main">
                <div className="border border-border-main bg-surface p-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-text-muted font-bold">CPU LOAD</span>
                        <span className="text-[10px] text-primary font-bold">42%</span>
                    </div>
                    {/* Blocky Progress Bar */}
                    <div className="flex gap-[2px] h-2 w-full">
                        <div className="flex-1 bg-primary"></div>
                        <div className="flex-1 bg-primary"></div>
                        <div className="flex-1 bg-primary"></div>
                        <div className="flex-1 bg-primary"></div>
                        <div className="flex-1 bg-border-main"></div>
                        <div className="flex-1 bg-border-main"></div>
                        <div className="flex-1 bg-border-main"></div>
                        <div className="flex-1 bg-border-main"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const Header = () => {
    return (
        <header className="h-16 flex-none bg-background-dark border-b border-border-main flex items-center justify-between px-6 z-20 relative">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-black font-bold">diamond</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="font-display font-bold text-xl tracking-wider text-white leading-none">
                        CLAWBOT <span className="text-primary text-xs align-top">V.4.0</span>
                    </h1>
                    <div className="text-[10px] text-text-muted tracking-[2px] mt-1">SYSTEM ONLINE</div>
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                {/* Search */}
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="SEARCH_TICKET_ID..." 
                        className="bg-surface border border-border-main pl-10 pr-4 py-2 w-64 text-sm font-mono text-white focus:outline-none focus:border-primary focus:ring-0 placeholder-text-muted transition-colors"
                    />
                </div>
                
                {/* Global Status Indicators */}
                <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success animate-pulse"></div>
                        <span className="text-text-muted">SERVER: <span className="text-white">OK</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary"></div>
                        <span className="text-text-muted">UPTIME: <span className="text-white">99.9%</span></span>
                    </div>
                </div>
                
                {/* User */}
                <div className="flex items-center gap-3 border-l border-border-main pl-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-white">OPr. K.O.</div>
                        <div className="text-[10px] text-primary">LEVEL 5 ACCESS</div>
                    </div>
                    <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFHulUhpX8QWI0Nm8Tb3UJjPtk2kRbmDvC1ZstIz3XPCo1kHmjPE0Ny5ozGWLuTTzO3dhM0_jgrNhz6eckOWmL4bKyZfWxzhbufOPX337sVDjL2eVQ7PvlmtAHnJuflkh9WfzI5jmkgQ7nLZwq_MH-5xoNcQ5vOMrcSs_9vWZBDg9vh7gJHzQ7T-bvjnW6YVCX3XpVmN_LAEThctccEY0iv_jPvWpUimINuzmjTnX6VNQi9nb4s6Hz87eXrPuGdsTtO8hsNJ8EBwjX" 
                        data-alt="Operator Avatar" 
                        className="w-10 h-10 border border-border-main grayscale filter object-cover"
                        alt="User"
                    />
                </div>
            </div>
        </header>
    );
};
