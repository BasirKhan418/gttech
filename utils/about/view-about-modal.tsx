"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface Partner {
  name: string
  logo: string
  description: string
  website: string
  partnership_type: string
}

interface AboutData {
  _id: string
  title: string
  ourstory: string
  card1title: string
  card1subtitle: string
  card1desc: string
  card1features: string[]
  card2title: string
  card2subtitle: string
  card2desc: string
  card2features: string[]
  foundationdesc: string[]
  partners: Partner[]
  createdAt: string
  updatedAt: string
}

interface ViewAboutModalProps {
  isOpen: boolean
  onClose: () => void
  data: AboutData | null
}

export function ViewAboutModal({ isOpen, onClose, data }: ViewAboutModalProps) {
  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>
            Created: {new Date(data.createdAt).toLocaleDateString()} | Last Updated:{" "}
            {new Date(data.updatedAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Our Story */}
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{data.ourstory}</p>
            </CardContent>
          </Card>

          {/* Mission and Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{data.card1title}</CardTitle>
                <p className="text-sm text-muted-foreground">{data.card1subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{data.card1desc}</p>
                <div>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <div className="space-y-1">
                    {data.card1features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{data.card2title}</CardTitle>
                <p className="text-sm text-muted-foreground">{data.card2subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{data.card2desc}</p>
                <div>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <div className="space-y-1">
                    {data.card2features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Foundation Values */}
          <Card>
            <CardHeader>
              <CardTitle>Foundation Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.foundationdesc.map((desc, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Partners ({data.partners.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.partners.map((partner, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    {partner.logo && (
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="w-12 h-12 object-contain flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{partner.name}</h4>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{partner.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {partner.partnership_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
