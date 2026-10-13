import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Search,
    Plus,
    Edit3,
    Trash2,
    Eye,
    X,
    UserPlus,
    Calendar,
    Mail,
    Phone,
    CreditCard,
    Hash,
    User,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";

export default function MiembrosIndex({ miembros, membresias, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMiembro, setEditingMiembro] = useState(null);
    const [formData, setFormData] = useState({
        dni: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fecha_nacimiento: "",
        tipo_membresia: "",
        membresia_activa: true,
    });
    const [errors, setErrors] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("miembros.index"),
            { search },
            { preserveState: true },
        );
    };

    const openCreateModal = () => {
        setEditingMiembro(null);
        setFormData({
            dni: "",
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
            fecha_nacimiento: "",
            tipo_membresia: "",
            membresia_activa: true,
        });
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (miembro) => {
        setEditingMiembro(miembro);
        setFormData({
            dni: miembro.dni || "",
            nombre: miembro.nombre,
            apellido: miembro.apellido,
            email: miembro.email || "",
            telefono: miembro.telefono || "",
            fecha_nacimiento: miembro.fecha_nacimiento || "",
            tipo_membresia: miembro.tipo_membresia || "",
            membresia_activa: miembro.membresia_activa,
        });
        setErrors({});
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingMiembro) {
            router.put(route("miembros.update", editingMiembro.id), formData, {
                onError: (errs) => setErrors(errs),
                onSuccess: () => setModalOpen(false),
            });
        } else {
            router.post(route("miembros.store"), formData, {
                onError: (errs) => setErrors(errs),
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este miembro?")) {
            router.delete(route("miembros.destroy", id));
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestión de Miembros - Iron Borg" />

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
                        Gestión de Miembros
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Administra los miembros registrados en el gimnasio
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre o email..."
                            className="pl-10 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Miembro
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
                                    Nombre Completo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Membresía
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
                            {miembros.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">
                                                Tabla sin contenido
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                Agrega tu primer miembro para
                                                comenzar
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                miembros.map((miembro) => (
                                    <tr
                                        key={miembro.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                            #{miembro.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {miembro.nombre.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {miembro.nombre}{" "}
                                                        {miembro.apellido}
                                                    </p>
                                                    {miembro.dni && (
                                                        <p className="text-xs text-slate-500">
                                                            DNI: {miembro.dni}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {miembro.email || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {miembro.telefono || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {miembro.tipo_membresia ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                                                    {miembro.tipo_membresia}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    miembro.membresia_activa
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        miembro.membresia_activa
                                                            ? "bg-emerald-500"
                                                            : "bg-red-500"
                                                    }`}
                                                ></span>
                                                {miembro.membresia_activa
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(miembro)
                                                    }
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(miembro.id)
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
                maxWidth="2xl"
            >
                <div className="p-6 lg:p-8">
                    {/* Header del modal */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {editingMiembro ? (
                                    <>
                                        <Edit3 className="w-6 h-6 text-blue-600" />
                                        Editar Miembro
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-6 h-6 text-blue-600" />
                                        Nuevo Miembro
                                    </>
                                )}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {editingMiembro
                                    ? "Modifica la información del miembro"
                                    : "Completa la información del miembro"}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* DNI */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    DNI
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.dni}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                dni: e.target.value,
                                            })
                                        }
                                        placeholder="12345678"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.dni
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.dni && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.dni}
                                    </p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Nombre *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nombre: e.target.value,
                                            })
                                        }
                                        placeholder="Ingrese el nombre"
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

                            {/* Apellido */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Apellido *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.apellido}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                apellido: e.target.value,
                                            })
                                        }
                                        placeholder="Ingrese el apellido"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.apellido
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.apellido && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.apellido}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="correo@ejemplo.com"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.email
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Teléfono
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.telefono}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                telefono: e.target.value,
                                            })
                                        }
                                        placeholder="+51 999 999 999"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.telefono
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.telefono && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.telefono}
                                    </p>
                                )}
                            </div>

                            {/* Fecha de nacimiento */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Fecha de Nacimiento
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={formData.fecha_nacimiento}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fecha_nacimiento:
                                                    e.target.value,
                                            })
                                        }
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.fecha_nacimiento
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    />
                                </div>
                                {errors.fecha_nacimiento && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.fecha_nacimiento}
                                    </p>
                                )}
                            </div>

                            {/* Tipo de membresía */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Tipo de Membresía
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={formData.tipo_membresia}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tipo_membresia: e.target.value,
                                            })
                                        }
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none ${
                                            errors.tipo_membresia
                                                ? "border-red-400"
                                                : "border-slate-200 focus:border-blue-500"
                                        }`}
                                    >
                                        <option value="">
                                            Seleccionar membresía
                                        </option>
                                        {membresias.map((m) => (
                                            <option key={m.id} value={m.nombre}>
                                                {m.nombre} - S/{m.precio} (
                                                {m.duracion_meses} meses)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.tipo_membresia && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.tipo_membresia}
                                    </p>
                                )}
                            </div>

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Estado
                                </label>
                                <select
                                    value={
                                        formData.membresia_activa
                                            ? "activo"
                                            : "inactivo"
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            membresia_activa:
                                                e.target.value === "activo",
                                        })
                                    }
                                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                        errors.membresia_activa
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500"
                                    }`}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                                {errors.membresia_activa && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.membresia_activa}
                                    </p>
                                )}
                            </div>
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
                                {editingMiembro ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
