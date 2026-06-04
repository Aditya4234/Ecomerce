import { toast } from 'sonner'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const toastStyles: Record<string, string> = {
  success:
    'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
  error:
    'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning:
    'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  info: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
}

function showToast(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }
  const Icon = icons[type]

  toast.custom(
    (id) => (
      <div
        className={`${toastStyles[type]} flex items-center gap-3 rounded-xl px-5 py-4 shadow-lg backdrop-blur-sm`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => toast.dismiss(id)}
          className="ml-auto rounded-lg p-0.5 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: 4000 }
  )
}

const toastHelpers = {
  success: (msg: string) => showToast(msg, 'success'),
  error: (msg: string) => showToast(msg, 'error'),
  warning: (msg: string) => showToast(msg, 'warning'),
  info: (msg: string) => showToast(msg, 'info'),
}

export { toast, toastHelpers, showToast }
