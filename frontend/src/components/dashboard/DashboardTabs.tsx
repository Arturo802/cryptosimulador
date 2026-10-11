

interface DashboardTabsProps {
    isAdmin: boolean;
    activeSection: string;
    setActiveSection: (section: any) => void;
}

export default function DashboardTabs({ isAdmin, activeSection, setActiveSection }: DashboardTabsProps) {
    return (
        <div className="nav-tabs">
            {!isAdmin && (
                <>
                    <button 
                        onClick={() => setActiveSection('history')}
                        className={`tab-nav-btn ${activeSection === 'history' ? 'active-tab' : ''}`}
                    >
                        Historial y Operaciones
                    </button>
                    <button 
                        onClick={() => setActiveSection('quant')}
                        className={`tab-nav-btn ${activeSection === 'quant' ? 'active-tab' : ''}`}
                    >
                        Estrategia Quant (Python)
                    </button>
                    <button 
                        onClick={() => setActiveSection('dapp')}
                        className={`tab-nav-btn ${activeSection === 'dapp' ? 'active-tab' : ''}`}
                    >
                        Tokens Regulados (DApp)
                    </button>
                </>
            )}

            {isAdmin && (
                <button 
                    onClick={() => setActiveSection('admin')}
                    className={`tab-nav-btn ${activeSection === 'admin' ? 'active-tab' : ''}`}
                >
                    Monitoreo y Listas Negras (Admin)
                </button>
            )}
        </div>
    );
}