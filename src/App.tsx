


import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ScholarshipManagement from "./pages/admin/ScholarshipManagement";
import VendorManagement from "./pages/admin/VendorManagement";
import VendorProfile from "./pages/admin/VendorProfile";
import RatingsPage from "./pages/admin/RatingsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import UserManagement from "./pages/admin/UserManagement";
import StudentApp from "./pages/StudentApp";
import StudentTapin from "./pages/StudentTapin";
import StudentDashboard from "./pages/StudentDashboard";
import TransactionSimulator from "./components/transaction/TransactionSimulator";

const queryClient = new QueryClient();

// Usuarios predefinidos
const DEMO_USERS = [
  {
    id: 'admin',
    email: 'admin@udd.cl',
    password: 'admin123',
    name: 'Administrador UDD',
    role: 'admin'
  },
  {
    id: 'invitado',
    email: 'invitado@udd.cl', 
    password: 'invitado-udd',
    name: 'Usuario Invitado',
    role: 'admin'
  }
];

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const userSession = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      setCurrentUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login route */}
            <Route 
              path="/login" 
              element={
                currentUser ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />

            {/* Protected Admin routes */}
            {currentUser ? (
              <Route path="/admin" element={<AdminLayout onLogout={handleLogout} currentUser={currentUser} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="becas" element={<ScholarshipManagement />} />
                <Route path="locales" element={<VendorManagement />} />
                <Route path="locales/:vendorId" element={<VendorProfile />} />
                <Route path="ratings" element={<RatingsPage />} />
                <Route path="reportes" element={
                  <ErrorBoundary>
                    <ReportsPage />
                  </ErrorBoundary>
                } />
                <Route path="usuarios" element={<UserManagement />} />
              </Route>
            ) : (
              <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            )}

            {/* Public routes */}
            <Route path="/simulator" element={<TransactionSimulator />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/tapin" element={<StudentTapin />} />
            <Route path="/student/app" element={<StudentApp />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
