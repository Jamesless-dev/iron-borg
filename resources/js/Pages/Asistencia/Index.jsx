import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Search,
    Filter,
    Calendar,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    UserCheck,
    AlertCircle,
    LogIn,
    LogOut,
    Loader2,
    X,
    Mail,
    Phone,
    CreditCard,
    CalendarDays,
    Info,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AsistenciaIndex({
    stats,
    asistencias,
    filters,
    miembro,
    asistenciaActiva,
    errorBusqueda,
}) {
    const { flash } = usePage().props;
    const [busqueda, setBusqueda] = useState("");
    const [fecha, setFecha] = useState(
        filters.fecha || new Date().toISOString().split("T")[0],
    );
    const [loading, setLoading] = useState(false);
    const [miembroEncontrado, setMiembroEncontrado] = useState(
        miembro ? { miembro, asistenciaActiva } : null,
    );
    const [error, setError] = useState(errorBusqueda || "");

    // ✅ Búsqueda con router.get (GET, no POST)
    const handleBuscar = (e) => {
        e.preventDefault();

        if (busqueda.trim().length < 1) {
            setError("Ingresa al menos 1 carácter para buscar");
            return;
        }

        setLoading(true);
        setError("");

        router.get(
            route("asistencia.buscar"),
            { busqueda: busqueda.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    if (page.props.miembro) {
                        setMiembroEncontrado({
                            miembro: page.props.miembro,
                            asistenciaActiva: page.props.asistenciaActiva,
                        });
                        setError("");
                    } else if (page.props.errorBusqueda) {
                        setError(page.props.errorBusqueda);
                        setMiembroEncontrado(null);
                    }
                    setLoading(false);
                },
                onError: () => {
                    setError("Error al buscar el miembro");
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleCheckIn = () => {
        if (!miembroEncontrado) return;
        router.post(
            route("asistencia.checkin"),
            {
                miembro_id: miembroEncontrado.miembro.id,
            },
            {
                onSuccess: () => {
                    setMiembroEncontrado(null);
                    setBusqueda("");
                },
            },
        );
    };

    const handleCheckOut = (asistenciaId) => {
        if (confirm("¿Confirmar check-out de este miembro?")) {
            router.post(route("asistencia.checkout"), {
                asistencia_id: asistenciaId,
            });
        }
    };

    const handleFiltrar = () => {
        router.get(
            route("asistencia.index"),
            { fecha },
            { preserveState: true },
        );
    };

    const handleHoy = () => {
        const hoy = new Date().toISOString().split("T")[0];
        setFecha(hoy);
        router.get(
            route("asistencia.index"),
            { fecha: hoy },
            { preserveState: true },
        );
    };

    const handleExportar = () => {
        window.location.href = route("asistencia.exportar", { fecha });
    };

    const formatTime = (datetime) => {
        if (!datetime) return "-";
        return new Date(datetime).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (minutos) => {
        if (!minutos) return "-";
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Control de Asistencia - Iron Borg" />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-700 font-medium">
                        {flash.success}
                    </p>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-medium">{flash.error}</p>
                </div>
            )}

            <div className="mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-slate-900">
                    Control de Asistencia
                </h1>
                <p className="text-slate-500 mt-1">
                    Registro de entrada y salida de miembros
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up">
                    <div className="p-3 rounded-xl bg-blue-50 w-fit mb-4">
                        <Users
                            className="w-6 h-6 text-blue-600"
                            strokeWidth={2}
                        />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">
                        Asistencias Hoy
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                        {stats?.asistenciasHoy ?? 0}
                    </p>
                </div>

                <div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="p-3 rounded-xl bg-emerald-50 w-fit mb-4">
                        <UserCheck
                            className="w-6 h-6 text-emerald-600"
                            strokeWidth={2}
                        />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">
                        Miembros Dentro
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                        {stats?.miembrosDentro ?? 0}
                    </p>
                </div>
            </div>

            {/* Check-in Rápido */}
            <div
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 mb-6 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
            >
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Check-in Rápido
                </h2>

                <form
                    onSubmit={handleBuscar}
                    className="flex flex-col md:flex-row gap-3"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setError("");
                            }}
                            placeholder="Buscar por nombre, apellido o DNI..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                        Buscar
                    </button>
                </form>

                <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                        <strong>Tip:</strong> Puedes buscar por nombre, apellido
                        o DNI. La búsqueda no distingue mayúsculas. Ej:
                        "donato", "DONATO" o "DoNaTo" funcionan igual.
                    </p>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-red-700 font-medium">
                                {error}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Verifica que el miembro esté registrado y tenga
                                membresía activa.
                            </p>
                        </div>
                    </div>
                )}

                {miembroEncontrado && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl animate-fade-in">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {miembroEncontrado.miembro.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {miembroEncontrado.miembro.nombre}{" "}
                                        {miembroEncontrado.miembro.apellido}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        DNI:{" "}
                                        {miembroEncontrado.miembro.dni ||
                                            "No registrado"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMiembroEncontrado(null)}
                                className="p-2 rounded-lg hover:bg-white/50 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {miembroEncontrado.miembro.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">
                                        {miembroEncontrado.miembro.email}
                                    </span>
                                </div>
                            )}
                            {miembroEncontrado.miembro.telefono && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>
                                        {miembroEncontrado.miembro.telefono}
                                    </span>
                                </div>
                            )}
                            {miembroEncontrado.miembro.tipo_membresia && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                    <span>
                                        {
                                            miembroEncontrado.miembro
                                                .tipo_membresia
                                        }
                                    </span>
                                </div>
                            )}
                            {miembroEncontrado.miembro
                                .fecha_vencimiento_membresia && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CalendarDays className="w-4 h-4 text-slate-400" />
                                    <span>
                                        Vence:{" "}
                                        {new Date(
                                            miembroEncontrado.miembro
                                                .fecha_vencimiento_membresia,
                                        ).toLocaleDateString("es-PE")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {miembroEncontrado.asistenciaActiva ? (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800 font-medium mb-2">
                                    ⚠️ Este miembro ya está registrado dentro
                                    del gimnasio
                                </p>
                                <p className="text-xs text-amber-700">
                                    Entrada:{" "}
                                    {formatTime(
                                        miembroEncontrado.asistenciaActiva
                                            .fecha_entrada,
                                    )}
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleCheckIn}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <LogIn className="w-5 h-5" />
                                Registrar Check-in
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Historial */}
            <div
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
            >
                <div className="p-6 lg:p-8 border-b border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Historial de Asistencias
                        </h2>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Fecha:
                                </label>
                                <input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleFiltrar}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                <Filter className="w-4 h-4" />
                                Filtrar
                            </button>
                            <button
                                onClick={handleHoy}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                            >
                                <Calendar className="w-4 h-4" />
                                Hoy
                            </button>
                            <button
                                onClick={handleExportar}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Exportar a Excel
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Miembro
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Hora Entrada
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Hora Salida
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Duración
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {asistencias.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <Clock className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">
                                                Tabla sin contenido
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                No hay asistencias registradas
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                asistencias.map((asistencia) => (
                                    <tr
                                        key={asistencia.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {asistencia.miembro?.nombre?.charAt(
                                                        0,
                                                    ) || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {
                                                            asistencia.miembro
                                                                ?.nombre
                                                        }{" "}
                                                        {
                                                            asistencia.miembro
                                                                ?.apellido
                                                        }
                                                    </p>
                                                    {asistencia.miembro
                                                        ?.dni && (
                                                        <p className="text-xs text-slate-500">
                                                            DNI:{" "}
                                                            {
                                                                asistencia
                                                                    .miembro.dni
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <LogIn className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm text-slate-700 font-medium">
                                                    {formatTime(
                                                        asistencia.fecha_entrada,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-slate-700 font-medium">
                                                    {asistencia.fecha_salida
                                                        ? formatTime(
                                                              asistencia.fecha_salida,
                                                          )
                                                        : "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-700 font-medium">
                                                    {formatDuration(
                                                        asistencia.duracion_minutos,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    asistencia.estado ===
                                                    "dentro"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        asistencia.estado ===
                                                        "dentro"
                                                            ? "bg-emerald-500 animate-pulse"
                                                            : "bg-slate-500"
                                                    }`}
                                                ></span>
                                                {asistencia.estado === "dentro"
                                                    ? "Dentro"
                                                    : "Completado"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                {asistencia.estado ===
                                                    "dentro" && (
                                                    <button
                                                        onClick={() =>
                                                            handleCheckOut(
                                                                asistencia.id,
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors"
                                                    >
                                                        <LogOut className="w-3.5 h-3.5" />
                                                        Check-out
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
