"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/src/ui/stores/toast.store";
import { Button } from "@/src/ui/components/button";
import { cn } from "@/src/lib/utils";

const getToastAnimation = (orientation: string) => {
  if (orientation.includes("left"))
    return { initial: { x: -50 }, animate: { x: 0 }, exit: { x: -50 } };
  if (orientation.includes("right"))
    return { initial: { x: 50 }, animate: { x: 0 }, exit: { x: 50 } };
  if (orientation.includes("top"))
    return { initial: { y: -50 }, animate: { y: 0 }, exit: { y: -50 } };
  return { initial: { y: 50 }, animate: { y: 0 }, exit: { y: 50 } };
};

const orientationClasses: Record<string, string> = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 transform -translate-x-1/2",
};

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed z-50 inset-0 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const orientation = toast.orientation || "bottom-right";
          const anim = getToastAnimation(orientation);
          const classes = orientationClasses[orientation];

          return (
            <motion.div
              key={toast.id}
              role="alert"
              data-slot="toast"
              initial={{ opacity: 0, ...anim.initial }}
              animate={{ opacity: 1, ...anim.animate }}
              exit={{ opacity: 0, ...anim.exit }}
              transition={{ duration: 0.3 }}
              className={cn(
                "absolute pointer-events-auto bg-popover border border-border p-4 rounded-md",
                "min-w-[260px] max-w-sm",
                classes
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold" data-slot="toast-title">{toast.title}</h3>
                  <p className="text-sm text-muted-foreground" data-slot="toast-message">
                    {toast.message}
                  </p>
                </div>
                {toast.action?.slice(0, 2).map((action, idx) => (
                  <Button
                    key={idx}
                    data-slot="toast-action"
                    variant={action.variant || "primary"}
                    size="sm"
                    onClick={() => {
                      action.onClick();
                      removeToast(toast.id);
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export { Toast };
