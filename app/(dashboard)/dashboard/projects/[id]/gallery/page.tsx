import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdCard from "@/components/ads/AdCard";

export default async function GalleryPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      adCreatives: {
        include: { generatedImage: true },
        orderBy: { index: "asc" },
      },
    },
  });

  if (!project) notFound();

  const completedAds = project.adCreatives.filter((a) => a.status === "COMPLETED");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/projects/${project.id}`} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name} — Ad Gallery</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{completedAds.length} of {project.adCreatives.length} ads ready</p>
        </div>
      </div>

      {project.adCreatives.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No ads generated yet. Go back to the project and run the generation pipeline.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {project.adCreatives.map((ad) => (
            <AdCard key={ad.id} ad={ad} projectId={project.id} />
          ))}
        </div>
      )}
    </div>
  );
}
