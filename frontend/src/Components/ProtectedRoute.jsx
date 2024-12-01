import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
  
    console.log("ProtectedRoute - Token:", token);
    console.log("ProtectedRoute - UserRole:", userRole);
    console.log("ProtectedRoute - Required Role:", requiredRole);
  
    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/home" replace />;
    }
  
    // If role is specified and doesn't match, redirect
    if (requiredRole && userRole !== requiredRole) {
        console.warn(`Access denied. Required: ${requiredRole}, Current: ${userRole}`);
        return <Navigate to="/unauthorized" replace />;
    }
  
    return children;
};

export default ProtectedRoute;