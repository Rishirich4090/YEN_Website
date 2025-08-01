import "./global.css";
import "react-toastify/dist/ReactToastify.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Redux Providers
import { ReduxProvider } from "../src/components/providers/ReduxProvider";
import { ToastProvider } from "../src/components/providers/ToastProvider";
import { AuthProvider } from "../src/contexts/AuthContext";

// Route Protection
import ProtectedRoute, { AdminRoute, MemberRoute, PublicRoute } from "../src/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Membership from "./pages/Membership";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EnhancedMemberDashboard from "./pages/EnhancedMemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import Donation from "./pages/Donation";
import NotFound from "./pages/NotFound";
import DummyDataSender from "./pages/DummyDataSender";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider>
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
                <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
                <Route path="/projects" element={<PublicRoute><Projects /></PublicRoute>} />
                <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
                <Route path="/membership" element={<PublicRoute><Membership /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/donate" element={<ProtectedRoute><Donation /></ProtectedRoute>} />
                
                {/* Member-Only Routes */}
                <Route path="/member/dashboard" element={<MemberRoute><EnhancedMemberDashboard /></MemberRoute>} />
                
                {/* Admin-Only Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
                
                {/* Development/Testing Routes */}
                <Route path="/dummy-data" element={<DummyDataSender />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ToastProvider>
  </ReduxProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
