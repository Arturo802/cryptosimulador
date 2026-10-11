import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/client';
import './RegisterForm.css';

const API_REGISTER_ENDPOINT = '/auth/register';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cliente');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (password.length < 6) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            setSubmitting(true);
            await API.post(API_REGISTER_ENDPOINT, { 
                email, 
                password,
                role 
            });
            
            setSuccessMsg('¡Usuario registrado con éxito! Redirigiendo al login...');

            setTimeout(() => {
                navigate('/login');
            }, 1200);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMsg(err.response.data.error);
            } else {
                setErrorMsg('Ocurrió un error al registrar el usuario.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Crear Cuenta</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                        placeholder="tu@correo.com"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña (mín. 6 caracteres):</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                        placeholder="••••••"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Tipo de Cuenta:</label>
                    <select 
                        id="role"
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="form-input"
                    >
                        <option value="cliente">Cliente / Usuario</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>
                <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {successMsg && <p className="success-message">{successMsg}</p>}

            <div className="auth-link">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </div>
        </div>
    );
}