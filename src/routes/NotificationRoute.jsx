import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";

import Loader from "../components/others/Loader";

const NotificationLog = lazy(
  () => import("../screens/notification/notificationLog/NotificationLog")
);
const PushNotification = lazy(
  () => import("../screens/notification/pushNotification/PushNotification")
);
const NotificationSetting = lazy(
  () =>
    import("../screens/notification/notificationSetting/NotificationSetting")
);
const AlertNotification = lazy(
  () => import("../screens/notification/alertNotification/AlertNotification")
);

const NotificationRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="logs" element={<NotificationLog />} />
      <Route
        path="push-notification"
        element={
          <ProtectedRoute requiredRole="Admin">
            <PushNotification />
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <ProtectedRoute requiredRole="Admin">
            <NotificationSetting />
          </ProtectedRoute>
        }
      />
      <Route
        path="alert-notification"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AlertNotification />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Suspense>
);

export default NotificationRoutes;
