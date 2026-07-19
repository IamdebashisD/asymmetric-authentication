import { useEffect, useState } from "react"
import axios from "axios"

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetUser() {
            try {
                const accessToken = sessionStorage.getItem("access_token")
                if (!accessToken) throw new Error('No access token')

                const response = await axios.get(
                    'http://localhost:8080/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )
                setUser(response.data.data)
            } catch (err) {
                setError(err.message || 'Failed to load user')
            } finally {
                setLoading(false)
            }
        }
        fetUser()
    }, [])

    function handleLogout() {
        sessionStorage.removeItem('access_token')
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl rounded-[28px] border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                    <aside className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-slate-950/90 p-8">
                        <div>
                            <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
                                Secure session
                            </span>
                            <h2 className="mt-8 text-3xl font-semibold text-white">Account overview</h2>
                            <p className="mt-4 text-sm leading-6 text-slate-400">
                                Access your profile data and manage your current login securely from one place.
                            </p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 text-sm text-slate-400">
                            <p className="font-semibold text-white">Dashboard quick info</p>
                            <ul className="mt-3 space-y-2">
                                <li>• Secure OIDC session</li>
                                <li>• Responsive dark theme</li>
                                <li>• Clean, consistent design</li>
                            </ul>
                        </div>
                    </aside>

                    <main className="p-6 sm:p-8">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
                                    <p className="mt-2 text-sm text-slate-400">Secure and consistent UI aligned with Login/Signup.</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex cursor-pointer items-center min-w-0 whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    Logout
                                </button>
                            </div>

                            {loading && (
                                <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-slate-300">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400"></div>
                                    <span>Loading profile…</span>
                                </div>
                            )}

                            {error && (
                                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">Error: {error}</div>
                            )}

                            {user && (
                                <div className="grid gap-6 md:grid-cols-[1fr_320px]">
                                    <section className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-sm shadow-black/10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-semibold text-white shadow-lg shadow-blue-500/20">
                                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-400">Signed in as</p>
                                                <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                                                <p className="text-sm text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <aside className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-sm shadow-black/10">
                                        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">Profile data</h3>
                                        <pre className="mt-4 max-h-65 overflow-auto rounded-3xl bg-slate-900/90 p-4 text-xs text-slate-200">{JSON.stringify(user, null, 2)}</pre>
                                    </aside>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}