import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import YieldPrediction from "./pages/YieldPrediction";
import Weather from "./pages/Weather";
import SoilGuide from "./pages/SoilGuide";
import PestDetection from "./pages/PestDetection";
import MarketPrices from "./pages/MarketPrices";
import TranslationDemo from "./pages/TranslationDemo";
import MultilingualDashboard from "./pages/MultilingualDashboard";
import PunjabiDemo from "./pages/PunjabiDemo";
import NotFound from "./pages/NotFound";
import FeedbackWidget from "./components/FeedbackWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/multilingual" element={<MultilingualDashboard />} />
            <Route path="/translation-demo" element={<TranslationDemo />} />
            <Route path="/punjabi-demo" element={<PunjabiDemo />} />
            <Route path="/yield-prediction" element={<YieldPrediction language="en" />} />
            <Route path="/weather" element={<Weather language="en" />} />
            <Route path="/soil-guide" element={<SoilGuide language="en" />} />
            <Route path="/pest-detection" element={<PestDetection language="en" />} />
            <Route path="/market-prices" element={<MarketPrices language="en" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <FeedbackWidget />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
