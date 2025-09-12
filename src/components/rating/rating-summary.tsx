"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

interface RatingSummaryProps {
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function RatingSummary({ averageRating, totalRatings, ratingDistribution }: RatingSummaryProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-slate-300"}`} />
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Rating Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-2">{renderStars(Math.round(averageRating))}</div>
          <div className="text-sm text-slate-600">{totalRatings} total ratings</div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm">{stars}</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </div>
              <Progress
                value={totalRatings > 0 ? (ratingDistribution[stars] / totalRatings) * 100 : 0}
                className="flex-1 h-2"
              />
              <div className="text-sm text-slate-600 w-8 text-right">{ratingDistribution[stars]}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
