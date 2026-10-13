import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Dumbbell, Loader2 } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión - Iron Borg" />

            <div className="min-h-screen flex">
                {/* Panel Izquierdo - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
                    {/* Efectos decorativos */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                        <div
                            className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                            style={{ animationDelay: "1s" }}
                        ></div>
                    </div>

                    {/* Patrón de fondo */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    ></div>

                    <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
                        <div className="mb-8 animate-fade-in">
                            <Dumbbell
                                className="w-24 h-24 text-blue-500 mb-6"
                                strokeWidth={1.5}
                            />
                        </div>

                        <h1 className="text-6xl font-black text-white mb-4 tracking-tight animate-fade-in-up">
                            IRON-BORG
                        </h1>

                        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 mb-6 rounded-full"></div>

                        <p
                            className="text-blue-400 text-xl font-semibold tracking-widest uppercase animate-fade-in-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            Gym Management System
                        </p>

                        <div
                            className="mt-16 text-gray-400 text-sm text-center max-w-md animate-fade-in-up"
                            style={{ animationDelay: "0.4s" }}
                        >
                            <p>
                                Sistema integral para la gestión de tu gimnasio
                            </p>
                            <p className="mt-2">
                                Miembros • Membresías • Asistencias • Ventas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho - Formulario */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">
                                INICIO DE SESIÓN
                            </h2>
                            <p className="text-gray-500">
                                Ingresa tus credenciales para continuar
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo Usuario */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Usuario
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    placeholder="Ingrese su usuario"
                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                        errors.username
                                            ? "border-red-400 focus:border-red-500"
                                            : "border-gray-200 focus:border-blue-500"
                                    }`}
                                    autoFocus
                                    autoComplete="username"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Ingrese su contraseña"
                                        className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.password
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-200 focus:border-blue-500"
                                        }`}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Recordarme y Olvidé contraseña */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Recordarme
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Botón Ingresar */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Ingresando...</span>
                                    </>
                                ) : (
                                    <span>INGRESAR</span>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-400">
                                © 2024 Iron Borg. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
