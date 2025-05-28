import { NotificationApi } from "@/generics/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { request } from "..";
import type { UserData } from "@/@types";

interface NewOrderData {
  productName: string;
  productSeriaNumber: string;
  employeeId: number;
  address: {
    region: string;
    city: string;
    street: string;
    district?: string;
    home?: string;
  };
  productFileList?: Array<{
    contentUrl: string;
    originalName: string;
    generatedName: string;
    mimeType: string;
    size: number;
  }>;
}

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
      Cookies.set("token2", token2, { expires: 7 });
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
        console.log(res);
        return res.data.content;
      }),
    onSuccess: async (data) => {
      const token = data.accessToken;
      const token2 = data.refreshToken;
      // Get from token accountType and employeeId
      const tokenData = jwt.decode(token, { complete: true });
      console.log("tokenData", tokenData);
      // localStorage.setItem("token", token);
      // localStorage.setItem("token2",token2)
      Cookies.set("token", token, { expires: 1 / 24 });
      Cookies.set("token2", token2, { expires: 7 });
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
      request
        .get("/auth/get-refresh-token", {
          params: { token: refreshToken },
        })
        .then((res) => res.data.content),
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
    onError: () => {},
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const notify = NotificationApi();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      const response = await request.delete("/employee", {
        params: { employeeId },
      });
      return response.data;
    },

    onMutate: async (employeeId) => {
      await queryClient.cancelQueries({ queryKey: ["xodimlar"] });

      const previousEmployees = queryClient.getQueryData<UserData[]>([
        "xodimlar",
      ]);

      if (!Array.isArray(previousEmployees)) return;

      queryClient.setQueryData<UserData[]>(
        ["xodimlar"],
        previousEmployees.filter((employee) => employee.id !== employeeId)
      );

      return { previousEmployees };
    },

    onSuccess: () => {
      notify("success_delete");
    },

    onError: (error, employeeId, context) => {
      notify("error_delete");

      if (context?.previousEmployees) {
        queryClient.setQueryData(["xodimlar"], context.previousEmployees);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["xodimlar"] });
    },
  });
};
export const useEmployeeEdit = () => {
  const queryClient = useQueryClient();
  const notify = NotificationApi();

  return useMutation({
    mutationKey: ["edit-xodim"],
    mutationFn: async (data) => {
      const response = await request.put("/employee", data, {
        params: {
          employeeId: data.id,
        },
      });
      return response.data.content;
    },
    onMutate: async (updatedEmployee) => {
      await queryClient.cancelQueries({ queryKey: ["xodimlar"] });

      const previousEmployees = queryClient.getQueryData(["xodimlar"]);

      queryClient.setQueryData(["xodimlar"], (old) => ({
        ...old,
        content: old.content.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        ),
      }));

      return { previousEmployees };
    },
    onError: (err, newEmployee, context) => {
      queryClient.setQueryData(["xodimlar"], context?.previousEmployees);
      notify("error-edit");
    },
    onSuccess: () => {
      notify("edit-admin");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["xodimlar"] });
    },
  });
};

// export const useAddEmployee = () => {
//   const notify = NotificationApi();

//   return useMutation({
//     mutationKey: ["add-employee"],
//     mutationFn: async (data) => {
//       return (
//         await request.post("/employee/register".data),
//         then((res) => res.data.content)
//       );
//     },
//     onSuccess: () => {
//       notify("add-employee");
//     },
//     onError: () => [notify("error")],
//   });
// };

export const useAddNewOrder = () => {
  const queryClient = useQueryClient();
  const notify = NotificationApi();

  return useMutation({
    mutationKey: ["add-order"],
    mutationFn: async (orderData: NewOrderData) => {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication required");

      const response = await request.post(
        "/booking-product",
        {
          id: 0, // Server will generate
          ...orderData,
          address: {
            id: 0, // Server will generate
            ...orderData.address,
            bookingProductId: 0 // Will be set by server
          },
          productFileList: orderData.productFileList || []
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data.content;
    },
    onSuccess: () => {
      notify("add-order");
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });  
    },
    onError: (error: Error) => {
      console.error("Order creation failed:", error);
      notify("error-order");
    }
  });
};