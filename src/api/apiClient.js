import axios from "axios";
import { EncryptStorage } from "encrypt-storage";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const secretKey = import.meta.env.VITE_APP_LOCALSTORAGE_KEY;

const encryptStorage = new EncryptStorage(secretKey, {
  prefix: "FAMTO",
});

const refreshAccessToken = async () => {
  try {
    const refreshToken = encryptStorage.getItem("refreshToken");

    if (!refreshToken) {
      await clearStorage();
      return null;
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { newToken } = response.data;

    encryptStorage.setItem("token", newToken);

    return newToken;
  } catch (error) {
    await clearStorage();
    return null;
  }
};

const clearStorage = async () => {
  await encryptStorage.removeItem("token");
  await encryptStorage.removeItem("role");
  await encryptStorage.removeItem("userId");
  await encryptStorage.removeItem("fcmToken");
  await encryptStorage.removeItem("username");
  await encryptStorage.removeItem("refreshToken");
};

const useApiClient = (navigate) => {
  const token = encryptStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        try {
          error.config._retry = true;
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(error.config);
          } else {
            await clearStorage();
            navigate("/auth/sign-in");
            return Promise.reject("Session expired. Please log in again.");
          }
        } catch (refreshError) {
          await clearStorage();
          navigate("/auth/sign-in");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useApiClient;
