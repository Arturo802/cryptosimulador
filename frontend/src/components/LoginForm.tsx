import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/client';
import './LoginForm.css';

const API_LOGIN_ENDPOINT = '/auth/login';
const LOCAL_STORAGE_TOKEN_KEY = 'token';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const response = await API.post(API_LOGIN_ENDPOINT, { email, password });
            
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, response.data.token);
            setSuccessMsg('¡Login exitoso! Token JWT guardado correctamente.');

            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMsg(err.response.data.error);
            } else {
                setErrorMsg('Ocurrió un error al conectar con el servidor.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Entrar
                </button>
            </form>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {successMsg && <p className="success-message">{successMsg}</p>}

            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
                ¿No tienes una cuenta? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>Regístrate aquí</Link>
            </div>
        </div>
    );
}