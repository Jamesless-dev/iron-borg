import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Clock,
    Receipt,
    LogOut,
    Menu,
    X,
    Dumbbell,
    Bell,
    Search,
} from "lucide-react";

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Actualizar hora cada segundo
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDateTime = (date) => {
        return (
            date.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) +
            " " +
            date.toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    };

    const menuItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            activeRoute: "dashboard",
        },
        {
            name: "Miembros",
            href: route("miembros.index"),
            icon: Users,
            activeRoute: "miembros.*",
        },
        {
            name: "Membresías",
            href: route("membresias.index"),
            icon: CreditCard,
            activeRoute: "membresias.*",
        },
        {
            name: "Asistencia",
            href: route("asistencia.index"),
            icon: Clock,
            activeRoute: "asistencia.*",
        },
        {
            name: "Pagos y Facturas",
            href: route("pagos.index"),
            icon: Receipt,
            activeRoute: "pagos.*",
        },
    ];

    const getRoleColor = (rol) => {
        const colors = {
            ADMIN: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            EMPLEADO: "bg-green-500/20 text-green-300 border-green-500/30",
            ENTRENADOR: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
        return colors[rol] || colors.EMPLEADO;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Overlay móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Logo */}
                <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]"></div>
                    </div>
                    <div className="relative text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Dumbbell
                                className="w-7 h-7 text-white"
                                strokeWidth={2.5}
                            />
                            <h1 className="text-2xl font-black text-white tracking-tight">
                                IRON-BORG
                            </h1>
                        </div>
                        <p className="text-[10px] text-blue-100 tracking-[0.3em] font-semibold mt-0.5">
                            GYM MANAGEMENT
                        </p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 lg:hidden text-white/80 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Info del usuario */}
                <div className="px-6 py-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {auth.user?.nombre?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">
                                {auth.user?.nombre || "Administrador"}
                            </p>
                            <span
                                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${getRoleColor(auth.user?.rol)}`}
                            >
                                {auth.user?.rol || "ADMIN"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Menú */}
                <nav className="px-4 py-5 flex-1 overflow-y-auto">
                    <p className="px-3 text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-3">
                        Operaciones
                    </p>
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                item.activeRoute &&
                                route().current(item.activeRoute);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                                            : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Cerrar sesión */}
                <div className="px-4 py-4 border-t border-slate-700/50">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-48"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="font-mono font-medium">
                                    {formatDateTime(currentTime)}
                                </span>
                            </div>
                            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Página */}
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
