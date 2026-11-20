import { AlertCircle, Check, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../context/StoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] sm:w-auto pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon =
            toast.variant === 'error'
              ? AlertCircle
              : toast.variant === 'info'
              ? Info
              : Check;

          const accentRing =
            toast.variant === 'error'
              ? 'text-[#FF626E] bg-[#FFF0F2] border-[#FF626E]/30'
              : toast.variant === 'info'
              ? 'text-[#713BDB] bg-[#F8F6FF] border-[#713BDB]/20'
              : 'text-[#166534] bg-emerald-50 border-emerald-200';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-start gap-3 bg-white border border-[#713BDB]/15 shadow-lg rounded-xl px-4 py-3 min-w-[280px]"
            >
              <span
                className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-lg border shrink-0 ${accentRing}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#24213A] leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-[#5C577A] mt-0.5 line-clamp-2">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="text-[#8E89A8] hover:text-[#24213A] p-1 rounded-lg transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
