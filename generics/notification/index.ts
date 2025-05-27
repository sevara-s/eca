import { toast } from "sonner";

type NotificationApiType =
  | "register"
  | "login"
  | "error_login"
  | "error_register";

export const NotificationApi = () => {
  const notify = (type: NotificationApiType) => {
    switch (type) {
      case "login":
        return toast.success("Tizimga muvaffaqiyatli kirdingiz !");
      case "error_login":
        return toast.error(
          "Tizimda xatolik email va parol to'g'riligini tekshiring !"
        );
      case "register":
        return toast.success("Tizimga muvaffaqiyatli kirdingiz !");
      case "error_register":
        return toast.error(
          "Tizimda xatolik email va parol to'g'riligini tekshiring !"
        );
      default:
        break;
    }
  };
  return notify;
};
