import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";

import Loader from "../components/others/Loader";

const ActivityLog = lazy(
  () => import("../screens/account/activityLog/ActivityLog")
);
const AccountLog = lazy(
  () => import("../screens/account/accountLog/AccountLog")
);
const Setting = lazy(() => import("../screens/account/setting/Setting"));

const AccountRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route
        path="activity-logs"
        element={
          <ProtectedRoute requiredRole="Admin">
            <ActivityLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="account-logs"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AccountLog />
          </ProtectedRoute>
        }
      />
      <Route path="settings" element={<Setting />} />
    </Routes>
  </Suspense>
);

export default AccountRoutes;
