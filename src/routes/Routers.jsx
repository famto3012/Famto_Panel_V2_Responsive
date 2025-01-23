import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useContext, useEffect, useState } from "react";

import ProtectedRoute from "./ProtectedRoutes";

import Loader from "@/components/others/Loader";
import AuthContext from "@/context/AuthContext";
import Maintenance from "@/screens/other/Maintenance";
import WhatsappRoutes from "./WhatsappRoute";
import { fetchAllowedRoutes } from "@/hooks/manager/useManager";
import { allowedMerchantRouteOptions } from "@/utils/defaultData";
import { useQuery } from "@tanstack/react-query";

// Lazy load each route component
const AuthRoutes = lazy(() => import("./AuthRoute"));
const HomeRoutes = lazy(() => import("./HomeRoute"));
const OrderRoutes = lazy(() => import("./OrderRoute"));
const MerchantRoutes = lazy(() => import("./MerchantRoute"));
const ProductRoutes = lazy(() => import("./ProductRoute"));
const CustomerRoutes = lazy(() => import("./CustomerRoute"));
const AgentRoutes = lazy(() => import("./AgentRoute"));
const DeliveryRoutes = lazy(() => import("./DeliveryRoute"));
const CommAndSubsRoutes = lazy(() => import("./CommAndSubsRoute"));
const MarketingRoutes = lazy(() => import("./MarketingRoute"));
const NotificationRoutes = lazy(() => import("./NotificationRoute"));
const ConfigureRoutes = lazy(() => import("./ConfigureRoute"));
const CustomizeRoutes = lazy(() => import("./CustomizeRoute"));
const AccountRoutes = lazy(() => import("./AccountRoute"));

const Routers = () => {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [allowedRoutes, setAllowedRoutes] = useState([]);

  useEffect(() => {
    if (!token && !location.pathname.startsWith("/auth")) {
      navigate("/auth/sign-in");
    } else if (token && location.pathname.startsWith("/auth")) {
      navigate("/home");
    }

    // navigate("/maintenance");
  }, [token, location.pathname, navigate]);

  const { data } = useQuery({
    queryKey: ["allowed-routes"],
    queryFn: () => fetchAllowedRoutes(navigate),
    enabled: token && role === "Manager" ? true : false,
  });

  useEffect(() => {
    if (role === "Merchant") {
      setAllowedRoutes(allowedMerchantRouteOptions);
    } else if (role === "Manager" && data) {
      setAllowedRoutes(data);
    }
  }, [data]);

  const canAccessRoute = (route) => {
    console.log(route, role);

    if (role === "Admin") {
      return true;
    } else {
      allowedRoutes.some((r) => r.route === route);
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/home/*" element={<HomeRoutes />} />
        {canAccessRoute("/order") && (
          <Route path="/order/*" element={<OrderRoutes />} />
        )}
        {canAccessRoute("/merchant") && (
          <Route
            path="/merchant/*"
            element={
              <ProtectedRoute requiredRole="Admin">
                <MerchantRoutes />
              </ProtectedRoute>
            }
          />
        )}
        {canAccessRoute("/product") && (
          <Route path="/product/*" element={<ProductRoutes />} />
        )}
        <Route path="/customer/*" element={<CustomerRoutes />} />
        {canAccessRoute("/agent") && (
          <Route
            path="/agent/*"
            element={
              <ProtectedRoute>
                <AgentRoutes />
              </ProtectedRoute>
            }
          />
        )}
        {canAccessRoute("/delivery-management") && (
          <Route
            path="/delivery-management/*"
            element={
              <ProtectedRoute>
                <DeliveryRoutes />
              </ProtectedRoute>
            }
          />
        )}
        <Route path="/comm-and-subs/*" element={<CommAndSubsRoutes />} />
        <Route path="/chat/*" element={<WhatsappRoutes />} />
        <Route path="/marketing/*" element={<MarketingRoutes />} />
        <Route path="/notification/*" element={<NotificationRoutes />} />
        <Route
          path="/configure/*"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ConfigureRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customize/*"
          element={
            <ProtectedRoute requiredRole="Admin">
              <CustomizeRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="/account/*" element={<AccountRoutes />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Routers;
