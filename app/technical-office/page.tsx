"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Briefcase, MapPin, UserCircle, Upload, FolderOpen, Loader2, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Client {
  id: string
  name: string
  code: string
  areaId: number
  filesCount: number
}

interface AreaData {
  id: number
  name: string
  clientsCount: number
  color: string
  image: string
  clients: Client[]
  driveLink?: string
}

const initialAreas: AreaData[] = [
  { 
    id: 1, 
    name: "العاصمة الإدارية", 
    clientsCount: 0, 
    color: "from-blue-500/10 to-blue-600/10",
    image: "/images/areas/العاصمه .png",
    clients: [],
    driveLink: "https://drive.google.com/drive/folders/1gbY2L__atgj4ldTAst5kt0MUk-UPECua?usp=drive_link"
  },
  { 
    id: 2, 
    name: "القاهرة الجديدة", 
    clientsCount: 0, 
    color: "from-green-500/10 to-green-600/10",
    image: "/images/areas/القاهره الجديده.jpeg",
    clients: [],
    driveLink: "https://drive.google.com/drive/folders/1FQx824rbptTI5XnerU1yL8jgr-exNJ28?usp=sharing"
  },
  { 
    id: 3, 
    name: "التجمع الخامس", 
    clientsCount: 0, 
    color: "from-purple-500/10 to-purple-600/10",
    image: "/images/areas/التجمع .jpeg",
    clients: [],
    driveLink: "https://drive.google.com/drive/folders/1rjRXzPYnBRvH781XMREKmT4a1lw4ksib?usp=sharing"
  },
  { 
    id: 4, 
    name: "وسط", 
    clientsCount: 0, 
    color: "from-orange-500/10 to-orange-600/10",
    image: "/images/areas/وسط.png",
    clients: [],
    driveLink: "https://drive.google.com/drive/folders/1PuuDkHNHADwikE14_cycaDjNeXJk3ia5?usp=sharing"
  },
  { 
    id: 5, 
    name: "أكتوبر", 
    clientsCount: 0, 
    color: "from-pink-500/10 to-pink-600/10",
    image: "/images/areas/اكتوبر.jpeg",
    clients: [],
    driveLink: "https://drive.google.com/drive/folders/16tr64CqiMXODWqet3foBkX3s5LUMu7Pj?usp=sharing"
  },
  { 
    id: 6, 
    name: "الأقاليم", 
    clientsCount: 0, 
    color: "from-teal-500/10 to-teal-600/10",
    image: "/images/areas/اقاليم .jpeg",
    clients: [],
    driveLink: "https://drive.google.com/drive/folders/14RA5_-P6fG06u39LRpoYy_H9kTA9Xr1d?usp=sharing"
  },
]

export default function TechnicalOfficePage() {
  const router = useRouter()
  const [areas, setAreas] = useState<AreaData[]>(initialAreas)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClientCounts = async () => {
      try {
        // Fetch all clients from Google Drive
        const response = await fetch('/api/drive-clients')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.clients) {
            const allClients = data.clients
            
            // Group clients by area
            const clientsByArea: Record<number, Client[]> = {}
            allClients.forEach((client: any) => {
              if (!clientsByArea[client.areaId]) {
                clientsByArea[client.areaId] = []
              }
              clientsByArea[client.areaId].push({
                id: client.id,
                name: client.name,
                code: client.code,
                areaId: client.areaId,
                filesCount: client.filesCount || 0
              })
            })

            // Update areas with real counts from Drive
            setAreas(prev => prev.map(area => ({
              ...area,
              clients: clientsByArea[area.id] || [],
              clientsCount: (clientsByArea[area.id] || []).length,
              driveLink: area.driveLink // Keep the original driveLink
            })))
          }
        } else {
          console.error('Failed to fetch from Drive, falling back to database')
          // Fallback to database if Drive API fails
          const dbResponse = await fetch('/api/clients')
          if (dbResponse.ok) {
            const dbData = await dbResponse.json()
            if (dbData.success && dbData.clients) {
              const allClients = dbData.clients
              const clientsByArea: Record<number, Client[]> = {}
              allClients.forEach((client: any) => {
                if (!clientsByArea[client.areaId]) {
                  clientsByArea[client.areaId] = []
                }
                clientsByArea[client.areaId].push({
                  id: client.id,
                  name: client.name,
                  code: client.code,
                  areaId: client.areaId,
                  filesCount: client.filesCount || 0
                })
              })
              setAreas(prev => prev.map(area => ({
                ...area,
                clients: clientsByArea[area.id] || [],
                clientsCount: (clientsByArea[area.id] || []).length,
                driveLink: area.driveLink
              })))
            }
          }
        }
      } catch (error) {
        console.error('Failed to load client counts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientCounts()
  }, [])

  const totalClients = areas.reduce((sum, area) => sum + area.clientsCount, 0)
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="المكتب الفني" 
        description={loading ? "جاري التحميل..." : `${totalClients} عميل في ${areas.length} مناطق`}
        icon={Briefcase} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              المناطق
            </h2>
            {!loading && (
              <p className="text-base text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                إجمالي العملاء: <span className="font-bold text-primary">{totalClients}</span>
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">جاري تحميل المناطق...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <Card key={area.id} className="group overflow-hidden bg-card border-2 border-border hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Area Image and Title */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={area.image || "/placeholder.svg"}
                    alt={area.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={area.id <= 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white drop-shadow-2xl">{area.name}</h3>
                      </div>
                      <div className="bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <span className="text-sm text-white font-bold">
                          {area.clientsCount} عميل
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clients Section */}
                <div className="p-6 bg-gradient-to-b from-card to-card/80 space-y-3">
                  {/* زر الدخول للمنطقة */}
                  <Button
                    onClick={() => router.push(`/technical-office/login?area=${area.id}`)}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105 duration-300 h-auto"
                  >
                    <FolderOpen className="w-6 h-6" />
                    <span className="text-lg">الدخول إلى ملفات المنطقة</span>
                  </Button>
                </div>
              </Card>
          ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </div>
  )
}
