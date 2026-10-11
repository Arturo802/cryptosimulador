import React, { useState } from 'react';
import API from '../../api/client';

interface RegulatedTokenTabProps {
    accountAddress: string;
    setAccountAddress: (val: string) => void;
    tokenBalance: string | null;
    onCheckBalance: (e: React.FormEvent) => void;
}

export default function RegulatedTokenTab({
    accountAddress,
    setAccountAddress,
    tokenBalance,
    onCheckBalance
}: RegulatedTokenTabProps) {
    const [auctionStatus, setAuctionStatus] = useState<string | null>(null);
    const [isBidding, setIsBidding] = useState(false);
    const [userTier, setUserTier] = useState<string>('Estándar ($50k máx)');

    const handleParticipateAuction = async () => {
        setIsBidding(true);
        setAuctionStatus(null);
        try {
            await API.post('/quant/allocate', {
                budget: 1500.0,
                symbols: ["REG-TOKEN"],
                strategy: 'REGULATED_AUCTION_BUMP'
            });
            // Actualizamos el estado visual del Tier y de los tokens acreditados
            setUserTier('Institucional 🚀 (Límite Ampliado a $250k)');
            setAuctionStatus('🎉 ¡Subasta ganada con éxito! Se han acreditado 150 REG-TOKEN a su cuenta.');
        } catch (error: any) {
            setAuctionStatus(error.response?.data?.error || 'Error al participar en la subasta bancaria.');
        } finally {
            setIsBidding(false);
        }
    };

    return (
        <section className="quant-section">
            <h4 className="quant-title">Tokens Regulados y Subasta Bancaria Institucional</h4>
            <p className="quant-desc">
                Adquiere tokens regulados (REG-TOKEN) mediante subasta bancaria para obtener privilegios de cumplimiento normativo (Tier Superior) y mayores umbrales operativos diarios.
            </p>

            {/* Tarjeta de Resumen del Tier Actual */}
            <div className="dapp-card-box" style={{ marginBottom: '20px', borderColor: '#10b981' }}>
                <h5 className="dapp-card-title">Estado de Cumplimiento (Compliance Tier)</h5>
                <p className="dapp-card-desc">
                    <strong>Nivel Actual:</strong> {userTier}
                </p>
                <p className="dapp-card-desc">
                    <strong>Protección Sentinel-AI:</strong> Umbral de alerta elevado contra falsos positivos.
                </p>
            </div>

            <div className="dapp-card-group">
                {/* 1. Consulta de Saldos en el Nodo Blockchain */}
                <form onSubmit={onCheckBalance} className="dapp-card-box">
                    <h5 className="dapp-card-title">Consulta On-Chain en Nodo</h5>
                    <div className="form-field">
                        <label>Dirección de la Cuenta (Ethereum / Hardhat)</label>
                        <input 
                            type="text" 
                            value={accountAddress}
                            onChange={(e) => setAccountAddress(e.target.value)}
                            placeholder="0x..." 
                            required
                            className="form-input-control"
                        />
                    </div>
                    <button type="submit" className="quant-submit-btn">
                        Consultar Saldo en Nodo
                    </button>

                    {tokenBalance && (
                        <div className="dapp-success-alert">
                            <strong>Saldo Actual en Blockchain:</strong> {tokenBalance} REG-TOKEN
                        </div>
                    )}
                </form>

                {/* 2. Sección de Subasta Bancaria y Beneficios */}
                <div className="dapp-card-box">
                    <h5 className="dapp-card-title">Subasta Activa de Activos Institucionales</h5>
                    <p className="dapp-card-desc">
                        Participa en la subasta de la entidad bancaria para adquirir liquidez institucional regulada. Poseer más de 100 REG-TOKEN eleva automáticamente el umbral de supervisión del <strong>Sentinel-AI</strong> hasta $250,000.
                    </p>

                    <button 
                        onClick={handleParticipateAuction} 
                        disabled={isBidding}
                        className="quant-submit-btn"
                    >
                        {isBidding ? 'Procesando Subasta...' : 'Participar en Subasta Bancaria (150 REG)'}
                    </button>

                    {auctionStatus && (
                        <div className="dapp-success-alert">
                            {auctionStatus}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}