import { useEffect, useState } from 'react';
import API from '../api/client';
import './UserDashboard.css';

import DashboardHeader from './dashboard/DashboardHeader';
import DashboardTabs from './dashboard/DashboardTabs';
import ClientHistoryTab from './dashboard/ClientHistoryTab';
import QuantStrategyTab from './dashboard/QuantStrategyTab';
import RegulatedTokenTab from './dashboard/RegulatedTokenTab';
import AdminControlTab from './dashboard/AdminControlTab';

interface Transaction {
    ID: number;
    Type: string;
    CryptoSymbol: string;
    Amount: number;
    PriceUSD: number;
    CreatedAt: string;
}

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

interface ClientUser {
    ID: number;
    Email: string;
    Role: string;
    IsBlacklisted: boolean;
    CreatedAt: string;
}

export default function UserDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeSection, setActiveSection] = useState<'history' | 'quant' | 'dapp' | 'admin'>('history');

    const [type, setType] = useState('COMPRA');
    const [cryptoSymbol, setCryptoSymbol] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [priceUSD, setPriceUSD] = useState('');
    const [formError, setFormError] = useState('');

    const [quantBudget, setQuantBudget] = useState('1000');
    const [quantSymbols, setQuantSymbols] = useState('BTC, ETH, SOL');
    const [quantResult, setQuantResult] = useState<QuantResponse | null>(null);
    const [quantLoading, setQuantLoading] = useState(false);
    const [quantError, setQuantError] = useState('');

    const [accountAddress, setAccountAddress] = useState('');
    const [tokenBalance, setTokenBalance] = useState<string | null>(null);

    const [clients, setClients] = useState<ClientUser[]>([]);
    const [adminLoading, setAdminLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await API.get('/transactions');
            setTransactions(Array.isArray(response.data) ? response.data : []);
            setError('');
        } catch (err: any) {
            setError('No se pudieron cargar las transacciones.');
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            setAdminLoading(true);
            const response = await API.get('/admin/clients');
            setClients(Array.isArray(response.data) ? response.data : []);
            setIsAdmin(true);
            setActiveSection('admin');
        } catch (err: any) {
            setIsAdmin(false);
        } finally {
            setAdminLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
        fetchTransactions();
    }, []);

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        const parsedAmount = parseFloat(amount);
        const parsedPrice = parseFloat(priceUSD);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setFormError('Introduce una cantidad válida mayor a 0.');
            return;
        }
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            setFormError('Introduce un precio en USD válido.');
            return;
        }

        try {
            setSubmitting(true);
            await API.post('/transactions', {
                type: type,
                crypto_symbol: cryptoSymbol.toUpperCase(),
                amount: parsedAmount,
                price_usd: parsedPrice
            });
            setAmount('');
            setPriceUSD('');
            await fetchTransactions();
        } catch (err: any) {
            // Captura los errores personalizados del backend, incluyendo alertas de Sentinel-AI
            setFormError(err.response?.data?.error || 'Error al registrar la transacción.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRunQuantStrategy = async (e: React.FormEvent) => {
        e.preventDefault();
        setQuantError('');
        setQuantResult(null);

        const budgetNum = parseFloat(quantBudget);
        if (isNaN(budgetNum) || budgetNum <= 0) {
            setQuantError('Introduce un presupuesto válido.');
            return;
        }

        const symbolsArray = quantSymbols.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
        if (symbolsArray.length === 0) {
            setQuantError('Introduce al menos un símbolo válido.');
            return;
        }

        try {
            setQuantLoading(true);
            const response = await API.post('/quant/allocate', {
                budget: budgetNum,
                symbols: symbolsArray
            });
            setQuantResult(response.data);
        } catch (err: any) {
            setQuantError(err.response?.data?.error || 'No se pudo conectar con Python.');
        } finally {
            setQuantLoading(false);
        }
    };

    const handleCheckBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountAddress) return;
        try {
            const response = await API.get(`/blockchain/balance/${accountAddress}`);
            setTokenBalance(`${response.data.balance} ${response.data.token}`);
        } catch (err) {
            setTokenBalance('Error al consultar el saldo en el nodo.');
        }
    };

    const handleToggleBlacklist = async (userId: number, currentStatus: boolean) => {
        try {
            await API.post('/admin/blacklist', {
                user_id: userId,
                blacklist: !currentStatus
            });
            await fetchClients();
        } catch (err: any) {
            alert('Error al actualizar el estado en la lista negra.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container">
            <DashboardHeader onLogout={handleLogout} />

            <section className="stats-section">
                <h3>{isAdmin ? 'Panel de Supervisión y Cumplimiento Normativo (Admin)' : 'Bienvenido a tu Portafolio Descentralizado'}</h3>
                <p>
                    {isAdmin 
                        ? 'Supervisa la red de usuarios, controla las restricciones regulatorias y audita el cumplimiento de la plataforma.'
                        : 'Gestiona tus operaciones, ejecuta estrategias cuantitativas y consulta contratos de tokens regulados en tiempo real.'}
                </p>
            </section>

            <DashboardTabs 
                isAdmin={isAdmin} 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
            />

            {!isAdmin && activeSection === 'history' && (
                <ClientHistoryTab 
                    transactions={transactions}
                    loading={loading}
                    error={error}
                    submitting={submitting}
                    type={type}
                    setType={setType}
                    cryptoSymbol={cryptoSymbol}
                    setCryptoSymbol={setCryptoSymbol}
                    amount={amount}
                    setAmount={setAmount}
                    priceUSD={priceUSD}
                    setPriceUSD={setPriceUSD}
                    formError={formError}
                    onSubmitOrder={handleCreateTransaction}
                />
            )}

            {!isAdmin && activeSection === 'quant' && (
                <QuantStrategyTab 
                    quantBudget={quantBudget}
                    setQuantBudget={setQuantBudget}
                    quantSymbols={quantSymbols}
                    setQuantSymbols={setQuantSymbols}
                    quantResult={quantResult}
                    quantLoading={quantLoading}
                    quantError={quantError}
                    onRunQuantStrategy={handleRunQuantStrategy}
                />
            )}

            {!isAdmin && activeSection === 'dapp' && (
                <RegulatedTokenTab 
                    accountAddress={accountAddress}
                    setAccountAddress={setAccountAddress}
                    tokenBalance={tokenBalance}
                    onCheckBalance={handleCheckBalance}
                />
            )}

            {isAdmin && activeSection === 'admin' && (
                <AdminControlTab 
                    clients={clients}
                    adminLoading={adminLoading}
                    onToggleBlacklist={handleToggleBlacklist}
                />
            )}
        </div>
    );
}