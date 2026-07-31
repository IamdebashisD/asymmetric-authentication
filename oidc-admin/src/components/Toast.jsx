export default function Toast({ open, message, type = 'success' }) {
    if (!open) return null

    const styles = {
        success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
        error: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-md">
            <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${styles[type] || styles.success}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {type === 'error' ? '!' : '✓'}
                </div>
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    )
}