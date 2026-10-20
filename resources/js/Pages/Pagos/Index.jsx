import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Search,
    Plus,
    Edit3,
    Trash2,
    X,
    DollarSign,
    CreditCard,
    FileText,
    Calendar,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    Receipt,
    TrendingUp,
    Banknote,
    Smartphone,
    AlertCircle,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";

export default function PagosIndex({ pagos, stats, miembros, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPago, setEditingPago] = useState(null);
    const [formData, setFormData] = useState({
        miembro_id: "",
        monto: "",
        metodo_pago: "Efectivo",
        descripcion: "",
        estado: "completado",
    });
    const [errors, setErrors] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("pagos.index"), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingPago(null);
        setFormData({
            miembro_id: "",
            monto: "",
            metodo_pago: "Efectivo",
            descripcion: "",
            estado: "completado",
        });
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (pago) => {
        setEditingPago(pago);
        setFormData({
            miembro_id: pago.miembro_id,
            monto: pago.monto,
            metodo_pago: pago.metodo_pago,
            descripcion: pago.descripcion || "",
            estado: pago.estado,
        });
        setErrors({});
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingPago) {
            router.put(route("pagos.update", editingPago.id), formData, {
                onError: (errs) => setErrors(errs),
                onSuccess: () => setModalOpen(false),
            });
        } else {
            router.post(route("pagos.store"), formData, {
                onError: (errs) => setErrors(errs),
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este pago?")) {
            router.delete(route("pagos.destroy", id));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
            minimumFractionDigits: 2,
        }).format(price);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getMetodoIcon = (metodo) => {
        const icons = {
            Efectivo: Banknote,
            Tarjeta: CreditCard,
            Yape: Smartphone,
            Plin: Smartphone,
            Transferencia: CreditCard,
        };
        return icons[metodo] || DollarSign;
    };

    const getMetodoColor = (metodo) => {
        const colors = {
            Efectivo: "bg-emerald-50 text-emerald-700",
            Tarjeta: "bg-blue-50 text-blue-700",
            Yape: "bg-purple-50 text-purple-700",
            Plin: "bg-cyan-50 text-cyan-700",
            Transferencia: "bg-indigo-50 text-indigo-700",
        };
        return colors[metodo] || "bg-slate-50 text-slate-700";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pagos y Facturas - Iron Borg" />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-700 font-medium">
                        {flash.success}
                    </p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Pagos y Facturas
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona los pagos y genera facturas
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por miembro, factura..."
                            className="pl-10 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Pago
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-emerald-50">
                            <TrendingUp
                                className="w-6 h-6 text-emerald-600"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Total del Mes</p>
                    <p className="text-3xl font-bold text-slate-900">
                        {formatPrice(stats?.totalMes ?? 0)}
                    </p>
                </div>

                <div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-blue-50">
                            <DollarSign
                                className="w-6 h-6 text-blue-600"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Pagos del Mes</p>
                    <p className="text-3xl font-bold text-slate-900">
                        {stats?.pagosMes ?? 0}
                    </p>
                </div>

                <div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-50">
                            <Receipt
                                className="w-6 h-6 text-purple-600"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">
                        Facturas Emitidas
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                        {stats?.facturasEmitidas ?? 0}
                    </p>
                </div>
            </div>

            {/* Tabla */}
            <div
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Factura
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Miembro
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Método
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
                            {pagos.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <Receipt className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">
                                                Tabla sin contenido
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                Registra tu primer pago para
                                                comenzar
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pagos.map((pago) => {
                                    const MetodoIcon = getMetodoIcon(
                                        pago.metodo_pago,
                                    );
                                    return (
                                        <tr
                                            key={pago.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm font-mono font-semibold text-slate-900">
                                                        {pago.numero_factura ||
                                                            "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {pago.miembro?.nombre?.charAt(
                                                            0,
                                                        ) || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {
                                                                pago.miembro
                                                                    ?.nombre
                                                            }{" "}
                                                            {
                                                                pago.miembro
                                                                    ?.apellido
                                                            }
                                                        </p>
                                                        {pago.miembro?.dni && (
                                                            <p className="text-xs text-slate-500">
                                                                DNI:{" "}
                                                                {
                                                                    pago.miembro
                                                                        .dni
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-emerald-600">
                                                    {formatPrice(pago.monto)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-700">
                                                        {formatDate(
                                                            pago.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${getMetodoColor(pago.metodo_pago)}`}
                                                >
                                                    <MetodoIcon className="w-3.5 h-3.5" />
                                                    {pago.metodo_pago}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        pago.estado ===
                                                        "completado"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : pago.estado ===
                                                                "pendiente"
                                                              ? "bg-amber-50 text-amber-700"
                                                              : "bg-red-50 text-red-700"
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            pago.estado ===
                                                            "completado"
                                                                ? "bg-emerald-500"
                                                                : pago.estado ===
                                                                    "pendiente"
                                                                  ? "bg-amber-500"
                                                                  : "bg-red-500"
                                                        }`}
                                                    ></span>
                                                    {pago.estado
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        pago.estado.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(pago)
                                                        }
                                                        className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                pago.id,
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth="lg"
            >
                <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {editingPago ? (
                                    <>
                                        <Edit3 className="w-6 h-6 text-blue-600" />
                                        Editar Pago
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="w-6 h-6 text-blue-600" />
                                        Nuevo Pago
                                    </>
                                )}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {editingPago
                                    ? "Modifica la información del pago"
                                    : "Registra un nuevo pago"}
                            </p>
                        </div>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Miembro */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Miembro *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={formData.miembro_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            miembro_id: e.target.value,
                                        })
                                    }
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none ${
                                        errors.miembro_id
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500"
                                    }`}
                                >
                                    <option value="">
                                        Seleccionar miembro
                                    </option>
                                    {miembros.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre} {m.apellido}{" "}
                                            {m.dni ? `(${m.dni})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.miembro_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.miembro_id}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Monto */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Monto (S/) *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.monto}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                monto: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.monto
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.monto && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.monto}
                                    </p>
                                )}
                            </div>

                            {/* Método de pago */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Método de Pago *
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={formData.metodo_pago}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                metodo_pago: e.target.value,
                                            })
                                        }
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none ${
                                            errors.metodo_pago
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    >
                                        <option value="Efectivo">
                                            Efectivo
                                        </option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Yape">Yape</option>
                                        <option value="Plin">Plin</option>
                                        <option value="Transferencia">
                                            Transferencia
                                        </option>
                                    </select>
                                </div>
                                {errors.metodo_pago && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.metodo_pago}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Descripción
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    placeholder="Descripción del pago..."
                                    rows="3"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none ${
                                        errors.descripcion
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500"
                                    }`}
                                />
                            </div>
                            {errors.descripcion && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.descripcion}
                                </p>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Estado *
                            </label>
                            <select
                                value={formData.estado}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        estado: e.target.value,
                                    })
                                }
                                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                    errors.estado
                                        ? "border-red-400"
                                        : "border-slate-200 focus:border-blue-500"
                                }`}
                            >
                                <option value="completado">Completado</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="anulado">Anulado</option>
                            </select>
                            {errors.estado && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.estado}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-5 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {editingPago ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
