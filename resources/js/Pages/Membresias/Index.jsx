import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Search,
    Plus,
    Edit3,
    Trash2,
    X,
    CreditCard,
    Calendar,
    DollarSign,
    FileText,
    Tag,
    AlertCircle,
    CheckCircle2,
    Clock,
    TrendingUp,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";

export default function MembresiasIndex({ membresias, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMembresia, setEditingMembresia] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        duracion_meses: 1,
        precio: "",
        descripcion: "",
        activa: true,
    });
    const [errors, setErrors] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("membresias.index"),
            { search },
            { preserveState: true },
        );
    };

    const openCreateModal = () => {
        setEditingMembresia(null);
        setFormData({
            nombre: "",
            duracion_meses: 1,
            precio: "",
            descripcion: "",
            activa: true,
        });
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (membresia) => {
        setEditingMembresia(membresia);
        setFormData({
            nombre: membresia.nombre,
            duracion_meses: membresia.duracion_meses,
            precio: membresia.precio,
            descripcion: membresia.descripcion || "",
            activa: membresia.activa,
        });
        setErrors({});
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingMembresia) {
            router.put(
                route("membresias.update", editingMembresia.id),
                formData,
                {
                    onError: (errs) => setErrors(errs),
                    onSuccess: () => setModalOpen(false),
                },
            );
        } else {
            router.post(route("membresias.store"), formData, {
                onError: (errs) => setErrors(errs),
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar esta membresía?")) {
            router.delete(route("membresias.destroy", id));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
            minimumFractionDigits: 2,
        }).format(price);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestión de Membresías - Iron Borg" />

            {/* Flash messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-700 font-medium">
                        {flash.success}
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Gestión de Membresías
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Administra los planes de membresía del gimnasio
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar membresía..."
                            className="pl-10 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Membresía
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Duración (meses)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Descripción
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
                            {membresias.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <CreditCard className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">
                                                Tabla sin contenido
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                Agrega tu primera membresía para
                                                comenzar
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                membresias.map((membresia) => (
                                    <tr
                                        key={membresia.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                            #{membresia.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <p className="font-semibold text-slate-900">
                                                    {membresia.nombre}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-700 font-medium">
                                                    {membresia.duracion_meses}{" "}
                                                    {membresia.duracion_meses ===
                                                    1
                                                        ? "mes"
                                                        : "meses"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-bold text-emerald-600">
                                                    {formatPrice(
                                                        membresia.precio,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 max-w-xs truncate">
                                                {membresia.descripcion || "-"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    membresia.activa
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        membresia.activa
                                                            ? "bg-emerald-500"
                                                            : "bg-red-500"
                                                    }`}
                                                ></span>
                                                {membresia.activa
                                                    ? "Activa"
                                                    : "Inactiva"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(membresia)
                                                    }
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            membresia.id,
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
                                ))
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
                    {/* Header del modal */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {editingMembresia ? (
                                    <>
                                        <Edit3 className="w-6 h-6 text-blue-600" />
                                        Editar Membresía
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                        Nueva Membresía
                                    </>
                                )}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {editingMembresia
                                    ? "Modifica la información de la membresía"
                                    : "Completa la información de la nueva membresía"}
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
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Nombre de la Membresía *
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nombre: e.target.value,
                                        })
                                    }
                                    placeholder="Ej: Plan Premium"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                        errors.nombre
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500"
                                    }`}
                                />
                            </div>
                            {errors.nombre && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Duración */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Duración (meses) *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.duracion_meses}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                duracion_meses:
                                                    parseInt(e.target.value) ||
                                                    1,
                                            })
                                        }
                                        placeholder="12"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.duracion_meses
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.duracion_meses && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.duracion_meses}
                                    </p>
                                )}
                            </div>

                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Precio (S/) *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.precio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                precio: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.precio
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.precio && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.precio}
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
                                    placeholder="Describe los beneficios de esta membresía..."
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
                                Estado
                            </label>
                            <select
                                value={formData.activa ? "activa" : "inactiva"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        activa: e.target.value === "activa",
                                    })
                                }
                                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                    errors.activa
                                        ? "border-red-400"
                                        : "border-slate-200 focus:border-blue-500"
                                }`}
                            >
                                <option value="activa">Activa</option>
                                <option value="inactiva">Inactiva</option>
                            </select>
                            {errors.activa && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.activa}
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
                                {editingMembresia ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
