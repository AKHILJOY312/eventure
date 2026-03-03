import { X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
export type UiAlertType = "error" | "success" | "info";

interface UiAlertProps {
  type: UiAlertType;
  message: string;
  onClose?: () => void;
  duration?: number; // auto close time (ms)
}

function UiAlert({ type, message, onClose, duration = 4000 }: UiAlertProps) {
  const styles = {
    error: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    success:
      "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  }[type];

  // Auto-dismiss logic
  useEffect(() => {
    if (!onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      role="alert"
      // Entrance Animation
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Exit Animation (requires AnimatePresence in the parent component)
      exit={{
        opacity: 0,
        y: -16,
        transition: { duration: 0.2, ease: "easeIn" },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} // power3.out equivalent
      className={`flex items-center justify-between gap-4 rounded-xl px-5 py-4 shadow-md ${styles}`}
    >
      <span className="text-sm font-medium">{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close alert"
          className="text-inherit opacity-70 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

export default UiAlert;
