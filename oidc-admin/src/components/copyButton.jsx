import { useState } from "react";

export default function CopyButton({ value }) {
    const [copied, setCopied] = useState(false)

    async function copy() {
        await navigator.clipboard.writeText(value)

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <button
            type="button"
            onClick={copy}
            className="inline-flex min-w-20 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    )
}