import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { getClientById, updateClient, deleteClient } from "../services/client.service";

import ConfirmModal from "../components/ConfirmModal";

import Toast from "../components/Toast";


export default function ClientDetails() {
    const { clientId } = useParams()

    const navigate = useNavigate()

    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)

    const [isEditing, setIsEditing] = useState(false)
    const [serverError, setServerError] = useState('')

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'success'
    })

    const handleEditClick = (event) => {
        event.preventDefault()
        setIsEditing(true)
    }

    const handleCancel = (event) => {
        event.preventDefault()
        reset({
            name: client.name,
            redirectUris: client.redirectUris.join("\n")
        })
        setIsEditing(false)
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm()

    useEffect(() => {
        async function loadClient() {
            try {
                const response = await getClientById(clientId)

                setClient(response.data)

                reset({
                    name: response.data.name,
                    redirectUris: response.data.redirectUris.join('\n')
                })
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadClient()
    }, [clientId, reset])

    async function onSubmit(data) {
        setServerError('')

        try {
            const payload = {
                name: data.name,
                redirectUris: data.redirectUris
                    .split('\n')
                    .map(uri => uri.trim())
                    .filter(Boolean),

                grantTypes: client.grantTypes,
                responseTypes: client.responseTypes,
                scopes: client.scopes
            }

            const response = await updateClient(client.clientId, payload)

            setClient(response.data)

            reset({
                name: response.data.name,
                redirectUris: response.data.redirectUris.join('\n')
            })

            setIsEditing(false)
        } catch (error) {
            setServerError(error.response?.data?.message || 'Something went wrong')
        }
    }

    function showToast(message, type = 'success') {
        setToast({
            open: true,
            message,
            type
        })

        setTimeout(() => {
            setToast(prev => ({
                ...prev,
                open: false
            }))
        }, 3000)
    }

    async function handleDelete() {
        try {
            await deleteClient(client.clientId)

            setShowDeleteModal(false)
            showToast('Client deleted successfully.✅')

            setTimeout(() => {
                navigate('/')
            }, 2500)
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Failed to delete client.',
                'error'
            )
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400"></div>
                    <span>Loading client…</span>
                </div>
            </div>
        )
    }

    if (!client) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center">
                    <h2 className="text-2xl font-semibold text-white">Client not found.</h2>
                    <p className="mt-2 text-sm text-slate-400">The requested client could not be loaded.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-4xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="border-b border-white/10 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-50">
                                Client details
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold text-white">{client.name}</h1>
                            <p className="mt-2 text-sm text-blue-50/90">
                                Review and update your OAuth client configuration in a polished admin experience.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 lg:p-10">
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <section className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-sm shadow-black/10">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                                        Client overview
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-white">Configuration</h2>
                                </div>
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                    {client.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Client name
                                    </label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...register('name', {
                                                    required: 'Client name is required'
                                                })}
                                            />
                                            {errors.name && (
                                                <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                                            {client.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Client ID
                                    </label>
                                    <p className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm break-all text-slate-200 font-mono">
                                        {client.clientId}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Client secret
                                    </label>
                                    <p className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                                        •••••••••••••••
                                    </p>
                                </div>
                            </div>
                        </section>

                        <aside className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-sm shadow-black/10">
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Quick info</h3>
                                <div className="mt-4 space-y-3 text-sm text-slate-300">
                                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created at</p>
                                        <p className="mt-2 text-slate-200">{new Date(client.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Actions</h3>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save changes'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/80"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleEditClick}
                                                className="rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
                                            >
                                                Edit client
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteModal(true)}
                                                className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                                            >
                                                Delete client
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-sm shadow-black/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Redirect URIs</h3>
                                <span className="text-sm text-slate-400">{client.redirectUris?.length || 0}</span>
                            </div>

                            {isEditing ? (
                                <>
                                    <textarea
                                        rows={6}
                                        className="mt-4 w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        {...register('redirectUris', {
                                            required: 'At least one redirect URI is required'
                                        })}
                                    />
                                    {errors.redirectUris && (
                                        <p className="mt-2 text-sm text-rose-400">{errors.redirectUris.message}</p>
                                    )}
                                </>
                            ) : (
                                <ul className="mt-4 space-y-3">
                                    {client.redirectUris?.map((uri) => (
                                        <li key={uri} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm break-all text-slate-200">
                                            {uri}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-sm shadow-black/10">
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Grant types</h3>
                                    <ul className="mt-3 space-y-2">
                                        {client.grantTypes?.map((grant) => (
                                            <li key={grant} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                                                {grant}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white">Response types</h3>
                                    <ul className="mt-3 space-y-2">
                                        {client.responseTypes?.map((type) => (
                                            <li key={type} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                                                {type}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white">Scopes</h3>
                                    <ul className="mt-3 space-y-2">
                                        {client.scopes?.map((scope) => (
                                            <li key={scope} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                                                {scope}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    {serverError && (
                        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                            {serverError}
                        </div>
                    )}
                </form>
            </div>

            <ConfirmModal
                open={showDeleteModal}
                title="Delete Client"
                message={`Are you sure you want to delete "${client.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    setShowDeleteModal(false)
                    await handleDelete()
                }}
            />

            <Toast
                open={toast.open}
                message={toast.message}
                type={toast.type}
            />
        </div>
    )
}
