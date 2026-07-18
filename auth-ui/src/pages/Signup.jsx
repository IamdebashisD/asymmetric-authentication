import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"

import { signUp } from '../services/auth.service.js'

export default function Signup() {
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })

    const navigate = useNavigate()

    async function onSubmit(data) {
        try {
            const response = await signUp(data)
            
            console.log(response)

            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 lg:flex">
                    <div>
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
                            Create your account
                        </div>
                        <h1 className="mt-8 text-4xl font-semibold leading-tight text-white">
                            OIDC Authorization Server
                        </h1>
                        <p className="mt-4 max-w-md text-base text-blue-50/90">
                            Join securely and start accessing protected resources with a modern sign-up experience.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-slate-950/20 p-5 text-sm text-blue-50/90">
                        <p className="font-medium text-white">Why teams use it</p>
                        <ul className="mt-3 space-y-2">
                            <li>• Fast and secure Signin flow</li>
                            <li>• Built-in support for modern identity standards</li>
                            <li>• Clean, professional user experience</li>
                        </ul>
                    </div>
                </div>

                <div className="flex w-full items-center justify-center bg-slate-900/80 p-8 lg:w-1/2">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                                New here
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-white">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Set up your profile and get started in minutes.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="name">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Alex Morgan"
                                    className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('name', {
                                        required: 'This is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Name must be at least 3 characters'
                                        }
                                    })}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="john.doe123@gmail.com"
                                    className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('email', {
                                        required: 'Email is required',
                                    })}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    className="w-full rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 1,
                                            message: 'Password must not be empty',
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
                            >
                                Sign Up
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-400 transition hover:text-blue-300">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}