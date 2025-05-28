import axios from "axios";
import Cookies from "js-cookie";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request dynamically
request.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically refresh token if expired
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      Cookies.get("token2")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("token2");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get-refresh-token`,
          {
            params: { token: refreshToken },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.content;

        // Save new tokens in cookies
        Cookies.set("token", accessToken, { expires: 1 / 24 });
        Cookies.set("token2", newRefreshToken, { expires: 7 });

        // Optional: update user object
        const user = Cookies.get("user");
        if (user) {
          const userData = JSON.parse(user);
          userData.accessToken = accessToken;
          userData.refreshToken = newRefreshToken;
          Cookies.set("user", JSON.stringify(userData), { expires: 1 / 24 });
        }

        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return request(originalRequest);
      } catch (err) {
        // Refresh failed – clear cookies and redirect to login
        Cookies.remove("token");
        Cookies.remove("token2");
        Cookies.remove("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
