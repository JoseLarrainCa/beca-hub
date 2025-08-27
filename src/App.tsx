import React, { useState } from "react";
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
import ReportsPage from "./pages/admin/ReportsPage";
import UserManagement from "./pages/admin/UserManagement";
import StudentApp from "./pages/StudentApp";

const queryClient = new QueryClient();

const App = () => {
  const [userRole, setUserRole] = useState<'admin' | 'student' | null>(null);

  const handleLogin = (role: 'admin' | 'student') => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!userRole && (
              <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
            )}
            
            {userRole === 'admin' && (
              <>
                <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="becas" element={<ScholarshipManagement />} />
                  <Route path="locales" element={<VendorManagement />} />
                  <Route path="reportes" element={<ReportsPage />} />
                  <Route path="usuarios" element={<UserManagement />} />
                </Route>
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </>
            )}
            
            {userRole === 'student' && (
              <>
                <Route path="/student" element={<StudentApp />} />
                <Route path="*" element={<Navigate to="/student" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
