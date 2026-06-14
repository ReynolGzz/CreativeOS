import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      productImages: { take: 1 },
      _count: { select: { adCreatives: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-zinc-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-7 h-7 text-zinc-600" />
          </div>
          <h3 className="text-white font-semibold mb-2">No projects yet</h3>
          <p className="text-zinc-500 text-sm mb-5">Create your first project to start generating ad creatives.</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group"
            >
              <div className="h-40 bg-zinc-800 flex items-center justify-center overflow-hidden">
                {project.productImages[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.productImages[0].url}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FolderOpen className="w-8 h-8 text-zinc-600" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-medium text-sm truncate">{project.name}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${
                    project.status === "COMPLETED"
                      ? "text-green-400 border-green-400/20 bg-green-400/10"
                      : project.status === "GENERATING"
                      ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                      : "text-zinc-500 border-zinc-700 bg-zinc-800"
                  }`}>
                    {project.status.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs">
                  {project._count.adCreatives} ads · {formatRelativeTime(project.createdAt)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">{project.platform}</span>
                  <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">{project.visualStyle}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
