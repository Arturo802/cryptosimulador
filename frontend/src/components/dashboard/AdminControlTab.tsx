

interface ClientUser {
    ID: number;
    Email: string;
    Role: string;
    IsBlacklisted: boolean;
    CreatedAt: string;
}

interface AdminControlTabProps {
    clients: ClientUser[];
    adminLoading: boolean;
    onToggleBlacklist: (userId: number, currentStatus: boolean) => void;
}

export default function AdminControlTab({
    clients,
    adminLoading,
    onToggleBlacklist
}: AdminControlTabProps) {
    return (
        <section className="admin-section">
            <h4 className="admin-title">Panel de Control de Cumplimiento (AML / KYC)</h4>
            <p className="admin-desc">
                Como administrador, supervisa las cuentas de la plataforma y aplica restricciones regulatorias (congelamiento de tokens regulados).
            </p>

            {adminLoading && <p className="loading-text">Cargando registros de usuarios...</p>}
            {clients.length === 0 && !adminLoading && (
                <p className="empty-text">No hay clientes registrados en la plataforma en este momento.</p>
            )}

            {clients.length > 0 && (
                <div className="table-responsive">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Correo Electrónico</th>
                                <th>Rol del Sistema</th>
                                <th>Estado Regulatorio</th>
                                <th>Acción Administrativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.ID}>
                                    <td>{client.ID}</td>
                                    <td><strong>{client.Email}</strong></td>
                                    <td>{client.Role}</td>
                                    <td>
                                        {client.IsBlacklisted ? (
                                            <span className="badge-blocked">Congelado (Blacklist)</span>
                                        ) : (
                                            <span className="badge-active">Activo (Whitelisted)</span>
                                        )}
                                    </td>
                                    <td>
                                        {client.IsBlacklisted ? (
                                            <button 
                                                onClick={() => onToggleBlacklist(client.ID, client.IsBlacklisted)}
                                                className="action-btn-unblock"
                                            >
                                                Desbloquear Cuenta
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => onToggleBlacklist(client.ID, client.IsBlacklisted)}
                                                className="action-btn-block"
                                            >
                                                Congelar Cuenta
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}