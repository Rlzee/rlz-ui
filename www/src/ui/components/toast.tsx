"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/src/ui/stores/toast.store";
import { Button } from "@/src/ui/components/button";
import { cn } from "@/src/lib/utils";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const variantDetails = {
  success: {
    title: "Success",
    icon: <CheckCircle className="text-emerald-500 w-5 h-5" />,
  },
  error: {
    title: "Error",
    icon: <AlertCircle className="text-destructive w-5 h-5" />,
  },
  info: {
    title: "Info",
    icon: <Info className="text-primary w-5 h-5" />,
  },
  warning: {
    title: "Warning",
    icon: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
  },
};

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
                  {!toast.type ? (
                    <h3 className="text-sm font-bold">{toast.title}</h3>
                  ) : (
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
                      {variantDetails[toast.type]?.icon}
                      {toast.title || variantDetails[toast.type]?.title}
                    </h3>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {toast.message}
                  </p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  {toast.action?.slice(0, 2).map((action, idx) => (
                    <Button
                      key={idx}
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
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export { Toast };
