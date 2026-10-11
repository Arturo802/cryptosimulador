import React from 'react';

interface Transaction {
    ID: number;
    Type: string;
    CryptoSymbol: string;
    Amount: number;
    PriceUSD: number;
    CreatedAt: string;
}

interface ClientHistoryTabProps {
    transactions: Transaction[];
    loading: boolean;
    error: string;
    submitting: boolean;
    type: string;
    setType: (val: string) => void;
    cryptoSymbol: string;
    setCryptoSymbol: (val: string) => void;
    amount: string;
    setAmount: (val: string) => void;
    priceUSD: string;
    setPriceUSD: (val: string) => void;
    formError: string;
    onSubmitOrder: (e: React.FormEvent) => void;
}

export default function ClientHistoryTab({
    transactions,
    loading,
    error,
    submitting,
    type,
    setType,
    cryptoSymbol,
    setCryptoSymbol,
    amount,
    setAmount,
    priceUSD,
    setPriceUSD,
    formError,
    onSubmitOrder
}: ClientHistoryTabProps) {
    return (
        <>
            <section className="trading-form-section">
                <h4>Ejecutar Nueva Operación</h4>
                <form onSubmit={onSubmitOrder} className="trading-form">
                    <div className="form-field">
                        <label>Tipo</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="form-input-control">
                            <option value="COMPRA">COMPRA</option>
                            <option value="VENTA">VENTA</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Símbolo Cripto</label>
                        <input 
                            type="text" 
                            value={cryptoSymbol} 
                            onChange={(e) => setCryptoSymbol(e.target.value)} 
                            placeholder="Ej: BTC, ETH" 
                            required 
                            className="form-input-control"
                        />
                    </div>

                    <div className="form-field">
                        <label>Cantidad</label>
                        <input 
                            type="number" 
                            step="any" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="0.00" 
                            required 
                            className="form-input-control"
                        />
                    </div>

                    <div className="form-field">
                        <label>Precio USD</label>
                        <input 
                            type="number" 
                            step="any" 
                            value={priceUSD} 
                            onChange={(e) => setPriceUSD(e.target.value)} 
                            placeholder="0.00" 
                            required 
                            className="form-input-control"
                        />
                    </div>

                    <div className="form-field">
                        <button type="submit" disabled={submitting} className="submit-order-btn">
                            {submitting ? 'Ejecutando...' : 'Ejecutar Orden'}
                        </button>
                    </div>
                </form>
                {formError && (
                    <div className="dapp-success-alert" style={{ backgroundColor: '#7f1d1d', borderColor: '#991b1b', color: '#fca5a5', marginTop: '15px' }}>
                        {formError}
                    </div>
                )}
            </section>

            <section className="transactions-section">
                <h4>Tus Transacciones Recientes</h4>
                {loading && <p className="loading-text">Cargando transacciones...</p>}
                {error && <p className="error-text">{error}</p>}
                {!loading && !error && transactions.length === 0 && (
                    <p className="empty-text">Aún no tienes operaciones registradas. Utiliza el formulario superior para realizar tu primera simulación.</p>
                )}
                {!loading && transactions.length > 0 && (
                    <div className="table-responsive">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Símbolo</th>
                                    <th>Cantidad</th>
                                    <th>Precio (USD)</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.ID}>
                                        <td className={`tx-type ${tx.Type === 'COMPRA' ? 'type-compra' : 'type-venta'}`}>
                                            {tx.Type}
                                        </td>
                                        <td>{tx.CryptoSymbol}</td>
                                        <td>{tx.Amount}</td>
                                        <td>${tx.PriceUSD.toFixed(2)}</td>
                                        <td>{new Date(tx.CreatedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}