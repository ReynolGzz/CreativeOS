import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, BarChart3 } from "lucide-react";
import { AD_TYPE_LABELS } from "@/lib/utils";
import ProjectActions from "@/components/projects/ProjectActions";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      productImages: true,
      productAnalysis: true,
      adStrategy: true,
      adCreatives: {
        include: { generatedImage: true },
        orderBy: { index: "asc" },
      },
    },
  });

  if (!project) notFound();

  const completedAds = project.adCreatives.filter((a) => a.status === "COMPLETED").length;
  const productImage = project.productImages[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {project.platform} · {project.visualStyle}
          </p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
          project.status === "COMPLETED" ? "text-green-400 border-green-400/20 bg-green-400/10" :
          project.status === "GENERATING" ? "text-blue-400 border-blue-400/20 bg-blue-400/10" :
          "text-zinc-400 border-zinc-700 bg-zinc-800"
        }`}>
          {project.status.toLowerCase().replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="h-48 bg-zinc-800 flex items-center justify-center">
              {productImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={productImage.url} alt={project.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500 text-xs">No image</p>
                </div>
              )}
            </div>
            {project.productAnalysis && (
              <div className="p-4 space-y-2">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Analysis</p>
                <p className="text-white text-sm font-medium">{project.productAnalysis.productType}</p>
                <p className="text-zinc-400 text-xs">{project.productAnalysis.category}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.productAnalysis.colors.slice(0, 4).map((c) => (
                    <span key={c} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Ads Generated</span>
              <span className="text-white font-medium">{completedAds}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Has Analysis</span>
              <span className={project.productAnalysis ? "text-green-400" : "text-zinc-500"}>
                {project.productAnalysis ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Has Strategy</span>
              <span className={project.adStrategy ? "text-green-400" : "text-zinc-500"}>
                {project.adStrategy ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <ProjectActions
            project={{
              id: project.id,
              status: project.status,
              hasAnalysis: !!project.productAnalysis,
              hasStrategy: !!project.adStrategy,
              hasImage: !!productImage,
              imageUrl: productImage?.url ?? null,
              completedAds,
              totalAds: project.adCreatives.length,
            }}
          />

          {project.adCreatives.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  Ad Creatives
                </h3>
                {completedAds > 0 && (
                  <Link
                    href={`/dashboard/projects/${project.id}/gallery`}
                    className="text-violet-400 hover:text-violet-300 text-sm"
                  >
                    View Gallery →
                  </Link>
                )}
              </div>
              <div className="space-y-2">
                {project.adCreatives.map((ad) => (
                  <div key={ad.id} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      ad.status === "COMPLETED" ? "bg-green-400" :
                      ad.status === "PROCESSING" ? "bg-blue-400 animate-pulse" :
                      ad.status === "FAILED" ? "bg-red-400" : "bg-zinc-600"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-200 text-xs font-medium truncate">
                        {AD_TYPE_LABELS[ad.adType]} — {ad.headline}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 shrink-0">{ad.status.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
