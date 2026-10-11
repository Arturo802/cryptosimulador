import React from 'react';

interface QuantPortfolioItem {
    ticker: string;
    price: number;
    shares_to_buy: number;
    allocated_investment: number;
}

interface QuantResponse {
    status: string;
    portfolio: QuantPortfolioItem[];
}

interface QuantStrategyTabProps {
    quantBudget: string;
    setQuantBudget: (val: string) => void;
    quantSymbols: string;
    setQuantSymbols: (val: string) => void;
    quantResult: QuantResponse | null;
    quantLoading: boolean;
    quantError: string;
    onRunQuantStrategy: (e: React.FormEvent) => void;
}

export default function QuantStrategyTab({
    quantBudget,
    setQuantBudget,
    quantSymbols,
    setQuantSymbols,
    quantResult,
    quantLoading,
    quantError,
    onRunQuantStrategy
}: QuantStrategyTabProps) {
    return (
        <section className="quant-section">
            <h4 className="quant-title">Simulador de Asignación Cuantitativa</h4>
            <p className="quant-desc">
                Conecta con el microservicio en Python para calcular la distribución inteligente de tu presupuesto basada en datos de mercado en tiempo real.
            </p>

            <form onSubmit={onRunQuantStrategy} className="quant-form">
                <div className="form-field">
                    <label>Presupuesto Total (USD)</label>
                    <input 
                        type="number" 
                        value={quantBudget} 
                        onChange={(e) => setQuantBudget(e.target.value)} 
                        required 
                        className="form-input-control"
                    />
                </div>

                <div className="form-field">
                    <label>Símbolos (separados por coma)</label>
                    <input 
                        type="text" 
                        value={quantSymbols} 
                        onChange={(e) => setQuantSymbols(e.target.value)} 
                        placeholder="BTC, ETH, SOL" 
                        required 
                        className="form-input-control"
                    />
                </div>

                <div className="form-field">
                    <button type="submit" disabled={quantLoading} className="quant-submit-btn">
                        {quantLoading ? 'Calculando...' : 'Calcular Estrategia'}
                    </button>
                </div>
            </form>

            {quantError && <p className="form-error-msg">{quantError}</p>}

            {quantResult && quantResult.portfolio && (
                <div className="quant-result-box">
                    <h5>Resultado de la Estrategia Cuantitativa:</h5>
                    <div className="table-responsive">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Activo</th>
                                    <th>Precio Actual (USD)</th>
                                    <th>Cantidad a Comprar</th>
                                    <th>Inversión Asignada (USD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quantResult.portfolio.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.ticker}</strong></td>
                                        <td>${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>{item.shares_to_buy}</td>
                                        <td className="tx-type type-compra">
                                            ${item.allocated_investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}