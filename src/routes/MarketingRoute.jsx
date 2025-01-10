import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";

import Loader from "../components/others/Loader";

const Discount = lazy(() => import("../screens/marketing/discount/Discount"));
const AdBanner = lazy(() => import("../screens/marketing/adBanner/AdBanner"));
const LoyaltyPoint = lazy(
  () => import("../screens/marketing/loyaltyPoint/LoyaltyPoint")
);
const PromoCode = lazy(
  () => import("../screens/marketing/promoCode/PromoCode")
);
const Referral = lazy(() => import("../screens/marketing/referral/Referral"));

const MarketingRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="discount" element={<Discount />} />
      <Route
        path="ad-banner"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdBanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="loyalty-point"
        element={
          <ProtectedRoute requiredRole="Admin">
            <LoyaltyPoint />
          </ProtectedRoute>
        }
      />
      <Route
        path="promo-code"
        element={
          <ProtectedRoute requiredRole="Admin">
            <PromoCode />
          </ProtectedRoute>
        }
      />
      <Route
        path="referral"
        element={
          <ProtectedRoute requiredRole="Admin">
            <Referral />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Suspense>
);

export default MarketingRoutes;
