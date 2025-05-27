import { NotificationApi } from "@/generics/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { request } from "..";

export const useRegisterMutation = () => {
  const router = useRouter();
  const notify = NotificationApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: object) =>
      request.post("/employee/register", data).then((res) => {
        console.log(res);
        return res.data.content;
      }),
    onSuccess: async (data) => {
      const token = data.accessToken;
      const token2 = data.refreshToken;
      Cookies.set("token", token, { expires: 1 / 24 });
      Cookies.set("token2",token2,{expires:7})
      Cookies.set("user", JSON.stringify(data), { expires: 1 / 24 });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/login");
      notify("register");
    },
    onError: () => {
      notify("error_register");
    },
  });
};

export const useLoginMutation = () => {
  const router = useRouter();
  const notify = NotificationApi();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: object) =>
      request.post("/auth/get-token", data).then((res) => {
        return res.data.content;
      }),
    onSuccess: async (data) => {
      const token = data.accessToken;
      const token2 = data.refreshToken;
      // Get from token accountType and employeeId
      const tokenData = jwt.decode(token, { complete: true });
      console.log("tokenData", tokenData);
      localStorage.setItem("token", token);
      localStorage.setItem("token2",token2)
      Cookies.set("token", token, { expires: 1 / 24 });
      Cookies.set("token2",token2,{expires:7})
      Cookies.set("user", JSON.stringify(data), { expires: 1 / 24 });
      router.push("/dashboard");
      notify("login");
    },
    onError: () => {
      notify("error_login");
    },
  });
};
export const useRefreshTokenMutation = () => {

  return useMutation({
    mutationKey: ["refreshToken"],
    mutationFn: (refreshToken: string) =>
      request.get("/auth/get-refresh-token", {
        params: { token: refreshToken }
      }).then((res) => res.data.content),
    onSuccess: async (data) => {
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;
      
      localStorage.setItem("token", newAccessToken);
      localStorage.setItem("token2", newRefreshToken);
      Cookies.set("token", newAccessToken, { expires: 1 / 24 });
      Cookies.set("token2", newRefreshToken, { expires: 7 });
      
      // Update user data if needed
      const userData = Cookies.get("user");
      if (userData) {
        const user = JSON.parse(userData);
        user.accessToken = newAccessToken;
        user.refreshToken = newRefreshToken;
        Cookies.set("user", JSON.stringify(user), { expires: 1 / 24 });
      }
      
    },
    onError: () => {
  
    },
  });
};