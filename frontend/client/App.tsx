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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/member/dashboard" element={<EnhancedMemberDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/donate" element={<Donation />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/dummy-data" element={<DummyDataSender />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ToastProvider>
  </ReduxProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
