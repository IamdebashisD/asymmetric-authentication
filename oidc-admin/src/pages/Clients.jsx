import { useState, useEffect } from "react";
import { getAllClients } from '../services/client.service'
import { Link } from "react-router-dom";

export default function Clients() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadClients() {
            try {
                const response = await getAllClients()
                setClients(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadClients()
    }, [])

    return (
        <div className="min-h-screen bg-slate-950 p-6 text-slate-100 sm:p-8 lg:p-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-4xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl lg:flex-row">
                <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 lg:w-[320px] lg:border-b-0 lg:border-r">
                    <div>
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-50">
                            Client registry
                        </span>
                        <h1 className="mt-8 text-3xl font-semibold text-white">
                            Manage your OAuth clients
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-blue-50/90">
                            Review registered applications, inspect their redirect settings, and keep your identity flow organized.
                        </p>
                    </div>

                    <div className="mt-8 rounded-3xl border border-white/20 bg-slate-950/20 p-5 text-sm text-blue-50/90">
                        <p className="font-semibold text-white">What you can do</p>
                        <ul className="mt-3 space-y-2">
                            <li>• Register new clients quickly</li>
                            <li>• Review redirect URIs and details</li>
                            <li>• Keep the admin experience polished</li>
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
                                Clients
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Secure and consistent UI aligned with the login, signup, and dashboard experience.
                            </p>
                        </div>

                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
                        >
                            + Register client
                        </Link>
                    </div>

                    {loading ? (
                        <div className="mt-8 flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-slate-300">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400"></div>
                            <span>Loading clients…</span>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="mt-8 rounded-[28px] border border-dashed border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
                            <p className="text-lg font-medium text-white">No clients registered yet</p>
                            <p className="mt-2">Create your first client to start issuing secure authentication requests.</p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-4 xl:grid-cols-2">
                            {clients.map((client) => (
                                <article
                                    key={client.clientId}
                                    className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-sm shadow-black/10"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                                                OAuth client
                                            </div>
                                            <h3 className="mt-4 text-xl font-semibold text-white">
                                                {client.name || "Unnamed client"}
                                            </h3>
                                        </div>
                                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                            Active
                                        </span>
                                    </div>

                                    <div className="mt-6 space-y-4 text-sm text-slate-400">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                                Client ID
                                            </p>
                                            <p className="mt-1 break-all font-mono text-slate-200">
                                                {client.clientId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                                Redirect URI
                                            </p>
                                            <p className="mt-1 break-all text-slate-200">
                                                {client.redirectUris?.[0] || "Not configured"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Link
                                            to={`/clients/${client.clientId}`}
                                            className="inline-flex items-center rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-slate-700/80"
                                        >
                                            View details
                                        </Link>
                                        {/* <button
                                            type="button"
                                            className="inline-flex items-center rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                                        >
                                            Delete
                                        </button> */}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}