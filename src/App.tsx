import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
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
        
        {!userRole && <LoginPage onLogin={handleLogin} />}
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'student' && <StudentApp />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
