import React from 'react';

interface DashboardHeaderProps {
    onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
    return (
        <header className="dashboard-header">
            <h2>Panel de Control - CryptoSimulador DApp</h2>
            <button onClick={onLogout} className="logout-btn">
                Cerrar Sesión
            </button>
        </header>
    );
}