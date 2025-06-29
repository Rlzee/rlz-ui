import { useToastStore } from "@/src/ui/stores/toast.store";
import { nanoid } from "nanoid";
import { Toast } from "@/src/ui/stores/toast.store";

export function toast(params: Omit<Toast, "id">) {
  const id = nanoid();
  const { addToast, removeToast } = useToastStore.getState();

  addToast({ id, ...params });

  const { duration = 3000, persistent } = params;

  if (!persistent) {
    setTimeout(() => removeToast(id), duration);
  }
}
