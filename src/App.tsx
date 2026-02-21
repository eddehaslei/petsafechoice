import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import i18n from "./i18n";
import { GeoLanguageDetector } from "./components/GeoLanguageDetector";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { useConnectionTest } from "./hooks/useConnectionTest";
import Index from "./pages/Index";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import SafeFoods from "./pages/SafeFoods";
import Emergency from "./pages/Emergency";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import FoodResult from "./pages/FoodResult";
import FoodArticle from "./pages/FoodArticle";
// SEO Food Safety Pages
import FoodsIndex from "./pages/foods/FoodsIndex";
import ChocolatePage from "./pages/foods/ChocolatePage";
import GrapesPage from "./pages/foods/GrapesPage";
import ChickenPage from "./pages/foods/ChickenPage";
import AvocadoPage from "./pages/foods/AvocadoPage";
import PeanutButterPage from "./pages/foods/PeanutButterPage";
import BananasPage from "./pages/foods/BananasPage";
import OnionsPage from "./pages/foods/OnionsPage";
import StrawberriesPage from "./pages/foods/StrawberriesPage";
import MilkPage from "./pages/foods/MilkPage";
import WatermelonPage from "./pages/foods/WatermelonPage";

const queryClient = new QueryClient();

function AppInner() {
  useConnectionTest();
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:lang/food/:foodName" element={<FoodResult />} />
        <Route path="/can-dogs-eat/:foodSlug" element={<FoodArticle />} />
        <Route path="/can-cats-eat/:foodSlug" element={<FoodArticle />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/safe-foods" element={<SafeFoods />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/auth" element={<Auth />} />
        {/* SEO Food Safety Guide Pages */}
        <Route path="/foods" element={<FoodsIndex />} />
        <Route path="/foods/chocolate" element={<ChocolatePage />} />
        <Route path="/foods/grapes" element={<GrapesPage />} />
        <Route path="/foods/chicken" element={<ChickenPage />} />
        <Route path="/foods/avocado" element={<AvocadoPage />} />
        <Route path="/foods/peanut-butter" element={<PeanutButterPage />} />
        <Route path="/foods/bananas" element={<BananasPage />} />
        <Route path="/foods/onions" element={<OnionsPage />} />
        <Route path="/foods/strawberries" element={<StrawberriesPage />} />
        <Route path="/foods/milk" element={<MilkPage />} />
        <Route path="/foods/watermelon" element={<WatermelonPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <GeoLanguageDetector />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppInner />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
