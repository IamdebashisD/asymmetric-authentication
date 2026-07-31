import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getConsentRequest } from '../services/auth.service'


export default function Consent() {
    const [searchParams] = useSearchParams()
    const requestId = searchParams.get('request_id') // Get the request_id from the query parameters

    const [consent, setConsent] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load the consent request data when the component mounts or when the requestId changes
    useEffect(() => {
        async function loadConsent() {
            try {
                const consent = await getConsentRequest(requestId)
                setConsent(consent.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        if (requestId) {
            loadConsent()
        }
    }, [requestId])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 px-4 py-16 text-center text-slate-100 sm:px-6 lg:px-8">
                <div className="mx-auto inline-flex max-w-xl items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-base font-semibold text-blue-200 shadow-2xl shadow-black/30 backdrop-blur-xl">
                    Loading consent request...
                </div>
            </div>
        )
    }

    if (!consent) {
        return (
            <div className="min-h-screen bg-slate-950 px-4 py-16 text-center text-slate-100 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-left shadow-2xl shadow-black/30 backdrop-blur-xl">
                    <h2 className="text-2xl font-semibold text-white">Authorization request not found</h2>
                    <p className="mt-3 text-sm text-slate-400">
                        We couldn&apos;t locate a consent request for this session. Please return to the application that initiated the authorization.
                    </p>
                </div>
            </div>
        )
    }

    const handleApprove = () => {
        window.location.href = `http://localhost:8080/api/consent/${requestId}/approve`
    }

    const handleDeny = () => {
        window.location.href = `http://localhost:8080/api/consent/${requestId}/deny`
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 lg:flex">
                    <div>
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                            Authorization request
                        </div>
                        <h1 className="mt-6 text-3xl font-semibold leading-tight text-white">
                            Grant access securely
                        </h1>
                        <p className="mt-3 max-w-sm text-sm text-blue-50/90">
                            Review the requested permissions and approve access only when you trust this client application.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-slate-950/20 p-4 text-sm text-blue-50/90">
                        <p className="font-medium text-white">What consent means</p>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li>• Allow only the access scopes that you trust.</li>
                            <li>• The client can only access what you approve.</li>
                            <li>• You can revoke this permission later from the client app.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex w-full items-center justify-center bg-slate-900/80 p-6 lg:w-1/2">
                    <div className="w-full max-w-sm">
                        <div className="mb-6">
                            <p className="text-xs font-medium uppercase tracking-[0.35em] text-blue-400">
                                Consent required
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">
                                {consent.client.name}
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                This client is requesting the following access scopes. Approve only if you recognize and trust the application.
                            </p>
                        </div>

                        <div className="space-y-5 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5 shadow-inner shadow-black/20">
                            <div className="rounded-2xl bg-slate-900/80 p-4">
                                <h3 className="text-sm font-semibold text-white">Requested access</h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    The client will be allowed to use these scopes during the authorization flow.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {consent.scope.map((scope) => (
                                    <div
                                        key={scope}
                                        className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                                    >
                                        {scope}
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 text-sm">
                                <p className="text-xs text-slate-400">Client ID</p>
                                <p className="mt-1 break-all text-sm font-medium text-white">{consent.client.clientId}</p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
                                >
                                    Allow access
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeny}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700/80"
                                >
                                    Deny access
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}