import { nanoid } from "nanoid";
import { Toast, useToastStore } from "@/src/ui/stores/toast.store";

export function toast(params: Omit<Toast, "id">) {
  const id = nanoid();
  const { addToast, removeToast } = useToastStore.getState();

  addToast({ id, ...params });

  // Remove automatically after duration
  const duration = params.duration ?? 3000;
  setTimeout(() => removeToast(id), duration);
}
