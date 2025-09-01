


import React from "react";
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public demo routes */}
            <Route path="/login" element={<LoginPage onLogin={() => {}} />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout onLogout={() => {}} />}>
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

            {/* Transaction Simulator */}
            <Route path="/simulator" element={<TransactionSimulator />} />

            {/* Student */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/tapin" element={<StudentTapin />} />
            <Route path="/student/app" element={<StudentApp />} />

            {/* Default */}
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
