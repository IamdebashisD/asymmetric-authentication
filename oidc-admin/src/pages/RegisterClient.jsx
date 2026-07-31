import { useForm } from 'react-hook-form'
import { registerClient } from '../services/client.service'
import { useState } from 'react'
import CopyButton from '../components/copyButton'
import { Link } from 'react-router-dom'

export default function RegisterClient() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
            name: '',
            redirectUri: ''
        }
    })

    const [client, setClient] = useState(null)
    const [serverError, setServerError] = useState('')

    async function onSubmit(data) {
        setServerError('')
        setClient(null)

        try {
            const payload = {
                name: data.name,
                redirectUris: [data.redirectUri]
            }
            const response = await registerClient(payload)

            setClient(response.data)
            reset()
        } catch (error) {
            setServerError(error.response?.data?.message || 'Something went wrong')
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-4xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl lg:flex-row">
                <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 lg:w-[320px] lg:border-b-0 lg:border-r">
                    <div>
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-50">
                            New client
                        </span>
                        <h1 className="mt-8 text-3xl font-semibold text-white">
                            Register a new OAuth client
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-blue-50/90">
                            Create a secure application registration with a redirect URI and keep your OIDC flow organized.
                        </p>
                    </div>

                    <div className="mt-8 rounded-3xl border border-white/20 bg-slate-950/20 p-5 text-sm text-blue-50/90">
                        <p className="font-semibold text-white">Before you continue</p>
                        <ul className="mt-3 space-y-2">
                            <li>• Use a valid redirect URL</li>
                            <li>• Keep the client name descriptive</li>
                            <li>• Save the secret immediately</li>
                        </ul>
                    </div>
                </aside>

                <main className="flex-1 p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                                Admin console
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-white">
                                Register Client
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                The form is styled to match the rest of the experience perfectly.
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-slate-700/80"
                        >
                            Back to clients
                        </Link>
                    </div>

                    <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-sm shadow-black/10 sm:p-8">
                        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="name">
                                    Client name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Restaurant App"
                                    className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('name', {
                                        required: 'Client name is required'
                                    })}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="redirectUri">
                                    Redirect URI
                                </label>
                                <input
                                    id="redirectUri"
                                    type="url"
                                    placeholder="http://localhost:3000/callback"
                                    className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('redirectUri', {
                                        required: 'Redirect URI is required',
                                        pattern: {
                                            value: /^http?:\/\/.+/,
                                            message: 'Please enter a valid URL'
                                        }
                                    })}
                                />
                                {errors.redirectUri && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.redirectUri.message}</p>
                                )}
                            </div>

                            {serverError && (
                                <p className="text-sm text-red-400">{serverError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Registering...' : 'Register Client'}
                            </button>
                        </form>
                    </div>

                    {client && (
                        <div className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 p-6 shadow-sm shadow-emerald-950/20">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-xl">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Client registered successfully</h3>
                                    <p className="mt-1 text-sm text-emerald-200/90">
                                        Save the client secret now. It will not be shown again.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                        Client ID
                                    </label>
                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            readOnly
                                            value={client.clientId}
                                            className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-3 py-2 text-sm text-slate-100"
                                        />
                                        <CopyButton value={client.clientId} />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                        Client Secret
                                    </label>
                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            readOnly
                                            value={client.clientSecret}
                                            className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-3 py-2 text-sm text-slate-100"
                                        />
                                        <CopyButton value={client.clientSecret} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}