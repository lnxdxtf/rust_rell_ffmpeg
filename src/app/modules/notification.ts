import { useToast } from "vue-toastification";

export default (msg: string, type_notification: TypeNotification | number) => {
    const toast = useToast()
    switch (type_notification) {
        case TypeNotification.Success: toast.success(msg); break;
        case TypeNotification.Info: toast.info(msg); break;
        case TypeNotification.Warning: toast.warning(msg); break;
        case TypeNotification.Error: toast.error(msg); break;
        default: toast.info(msg); break;
    }
}

enum TypeNotification {
    Success = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}