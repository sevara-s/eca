import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { NotificationApi } from "@/generics/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      }
    ),
    onSuccess: async (data) => {
      const token = data.accessToken;
      Cookies.set("token", token, { expires: 1 / 24 });     
      Cookies.set("user", JSON.stringify(data), { expires: 1 / 24 });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/dashboard");
      notify("register");
    },
    onError: () => {
      // notify("error_register");
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
        console.log(res);
       return res.data.content}),
    onSuccess: async (data) => {
      const token = data.accessToken;
      localStorage.setItem("token",token)
      Cookies.set("token", token, { expires: 1 / 24 });
      Cookies.set("user", JSON.stringify(data), { expires: 1 / 24 });
      router.push("/dashboard");
      notify("login");
    },
    onError: () => {
      notify("error_login")
    },
  });
};
