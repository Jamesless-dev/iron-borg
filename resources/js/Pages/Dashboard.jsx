import { Head } from "@inertiajs/react";
import {
    Users,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ stats, chartData }) {
    const statCards = [
        {
            title: "Miembros Activos",
            value: stats?.miembrosActivos ?? 0,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Ingresos del Mes",
            value: `S/${stats?.ingresosMes?.toFixed(2) ?? "0.00"}`,
            icon: DollarSign,
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            trend: "+8.2%",
            trendUp: true,
        },
        {
            title: "Por Vencer (7 días)",
            value: stats?.porVencer ?? 0,
            icon: AlertTriangle,
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-amber-50",
            iconColor: "text-amber-600",
            trend: "-3",
            trendUp: false,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Principal - Iron Borg" />

            {/* Header de la página */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Dashboard Principal
                </h1>
                <p className="text-slate-500">Resumen general del gimnasio</p>
            </div>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${stat.iconColor}`}
                                        strokeWidth={2}
                                    />
                                </div>
                                <div
                                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                                        stat.trendUp
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-600"
                                    }`}
                                >
                                    {stat.trendUp ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-1">
                                {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-slate-900">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Gráfico de ingresos */}
            <div
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Ingresos Últimos 6 Meses
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Evolución de ingresos mensuales
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-semibold">
                        <ArrowUpRight className="w-4 h-4" />
                        +15.3% vs mes anterior
                    </div>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData || []}>
                            <defs>
                                <linearGradient
                                    id="colorIngresos"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="mes"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `S/${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                                formatter={(value) => [
                                    `S/${value.toFixed(2)}`,
                                    "Ingresos",
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="ingresos"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fill="url(#colorIngresos)"
                                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                                activeDot={{
                                    r: 7,
                                    fill: "#3b82f6",
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
