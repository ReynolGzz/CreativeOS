import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderOpen, Zap, TrendingUp, Coins } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [projects, balance, totalAds] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id },
      include: { productImages: { take: 1 }, _count: { select: { adCreatives: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.creditBalance.findUnique({ where: { userId: session.user.id } }),
    prisma.adCreative.count({ where: { projectId: { in: (await prisma.project.findMany({ where: { userId: session.user.id }, select: { id: true } })).map(p => p.id) }, status: "COMPLETED" } }),
  ]);

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "text-violet-400" },
    { label: "Ads Generated", value: totalAds, icon: Zap, color: "text-blue-400" },
    { label: "Credits Available", value: (balance?.balance ?? 0).toLocaleString(), icon: Coins, color: "text-yellow-400" },
    { label: "Credits Used", value: (balance?.lifetimeUsed ?? 0).toLocaleString(), icon: TrendingUp, color: "text-green-400" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Welcome back, {session.user.name ?? "there"}!</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-zinc-400 text-xs">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link href="/dashboard/projects" className="text-violet-400 hover:text-violet-300 text-sm">
            View all →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-white font-medium mb-2">No projects yet</h3>
            <p className="text-zinc-500 text-sm mb-4">Upload a product image and generate your first set of ads.</p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {project.productImages[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.productImages[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FolderOpen className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{project.name}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {project._count.adCreatives} ads · {formatRelativeTime(project.createdAt)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  project.status === "COMPLETED"
                    ? "text-green-400 border-green-400/20 bg-green-400/10"
                    : project.status === "GENERATING"
                    ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                    : project.status === "FAILED"
                    ? "text-red-400 border-red-400/20 bg-red-400/10"
                    : "text-zinc-400 border-zinc-700 bg-zinc-800"
                }`}>
                  {project.status.toLowerCase().replace("_", " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
