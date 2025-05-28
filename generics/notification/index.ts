import { toast } from "sonner";

type NotificationApiType =
  | "register"
  | "login"
  | "error_login"
  | "error_register"
  | "success_delete"
  | "error_delete"
  | "edit-admin"
  | "error-edit"
  | "add-employee"
  | "error"
  | "add-order"
  | "error-order";

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
      case "success_delete":
        return toast.success("Xodim muvaffaqiyatli o'chirildi");
      case "error_delete":
        return toast.error("Xodim o'chirilishida xatolik yuz berdi");
      case "edit-admin":
        return toast.success("Xodim tahrirlandi");
      case "error-edit":
        return toast.error("Tahrirlashda xatolik")
      case "add-employee":
        return toast.success("Xodim muvaffaqiyatli qo'shildi")
      case "error":
        return toast.error("Nimadadir xatolik ketdi , qayta urinib ko'ring")
      case "add-order":
        return toast.success("Buyurtma muvaffaqiyatli qo'shildi. 2 ish kuni davomida sizga qo'ng'iroq qilishadi")
      case "error-order":
        return toast.error("Buyurtma qo'shishda xatolik")
      default:
        break;
    }
  };
  return notify;
};
