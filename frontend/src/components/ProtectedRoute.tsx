import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem('token');

    // Si no hay token en el almacenamiento local, bloqueamos el acceso y enviamos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}