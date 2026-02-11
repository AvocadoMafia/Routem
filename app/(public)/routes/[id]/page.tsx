import { getPrisma } from "@/lib/config/server";
import { notFound } from "next/navigation";
import { MapPin, Navigation, Clock, Ruler, Footprints, TrainFront, Bus, Car, Sparkles } from "lucide-react";
import Image from "next/image";

export default async function RouteDetailPage({ params }: { params: { id: string } }) {
  const test = await params
  const prisma = getPrisma();
  const route = await prisma.route.findUnique({
    where: { id: test.id },
    include: {
      author: {
        include: { profileImage: true }
      },
      thumbnail: true,
      routeNodes: {
        orderBy: { order: 'asc' },
        include: {
          spot: true,
          images: true,
          transitSteps: true
        }
      }
    }
  });

  if (!route) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          {route.author.profileImage && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src={route.author.profileImage.url} alt={route.author.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <span className="font-bold text-foreground-0">{route.author.name}</span>
          <span className="text-sm text-foreground-1">{new Date(route.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className="text-5xl font-black text-foreground-0 mb-4">{route.title}</h1>
        <p className="text-lg text-foreground-1 leading-relaxed">{route.description}</p>
      </header>

      {route.thumbnail && (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16 shadow-xl">
          <Image src={route.thumbnail.url} alt={route.title} fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="space-y-0 relative">
        {/* Vertical line connecting nodes */}
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-accent-0/20" />

        {route.routeNodes.map((node, index) => (
          <div key={node.id} className="relative">
            {/* Node */}
            <div className="flex gap-8 mb-12 relative z-10">
              <div className="flex-shrink-0 w-12 h-12 bg-accent-0 rounded-full flex items-center justify-center text-white font-bold border-4 border-background-0">
                {index + 1}
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-accent-0" />
                  <h3 className="text-2xl font-bold text-foreground-0">{node.spot?.name || "Unknown Location"}</h3>
                </div>
                <p className="text-foreground-1 mb-4">{node.details}</p>

                {node.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {node.images.map(img => (
                      <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                        <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Segment / Transportation */}
            {node.transitSteps && node.transitSteps.length > 0 && (
              <div className="flex gap-8 mb-12 ml-6 pl-10 border-l-0">
                <div className="flex-1 bg-background-1/50 rounded-2xl p-6 border border-grass space-y-4">
                  {node.transitSteps.map(step => (
                    <div key={step.id} className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-accent-0/10 text-accent-0 rounded-full text-xs font-bold uppercase">
                        {step.mode === 'WALK' && <Footprints size={14} />}
                        {step.mode === 'TRAIN' && <TrainFront size={14} />}
                        {step.mode === 'BUS' && <Bus size={14} />}
                        {step.mode === 'CAR' && <Car size={14} />}
                        {step.mode === 'BIKE' && <Sparkles size={14} />}
                        {step.mode}
                      </div>
                      <p className="text-sm font-medium text-foreground-0">{step.memo}</p>
                      {(step.duration || step.distance) && (
                        <div className="flex gap-4 ml-auto text-xs text-foreground-1">
                          {step.duration && <span className="flex items-center gap-1"><Clock size={12}/>{step.duration}m</span>}
                          {step.distance && <span className="flex items-center gap-1"><Ruler size={12}/>{step.distance}m</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
