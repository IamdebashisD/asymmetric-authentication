export default function ConfirmModal({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-black/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/15 text-xl text-rose-300">
                        !
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-slate-400">This action cannot be undone.</p>
                    </div>
                </div>

                <p className="mt-6 text-sm leading-6 text-slate-300">{message}</p>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/80"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-linear-to-r from-rose-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-rose-500 hover:to-red-500"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}