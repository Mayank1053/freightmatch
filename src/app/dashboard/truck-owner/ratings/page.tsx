'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { RatingModal } from '@/components/rating/rating-modal';
import {
  ArrowLeft,
  Search,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

// Mock ratings data
const mockRatings = [
  {
    id: '1',
    shipper: {
      name: 'ABC Industries',
      company: 'ABC Industries Pvt Ltd',
    },
    route: 'Mumbai → Pune',
    rating: 5,
    comment:
      'Excellent service! Very professional and delivered on time. Highly recommended for future shipments.',
    date: '2024-01-15',
    bookingId: 'SH001',
  },
  {
    id: '2',
    shipper: {
      name: 'XYZ Corporation',
      company: 'XYZ Corporation Ltd',
    },
    route: 'Delhi → Gurgaon',
    rating: 4,
    comment:
      'Good service overall. Minor delay but kept us informed throughout the journey.',
    date: '2024-01-12',
    bookingId: 'SH002',
  },
  {
    id: '3',
    shipper: {
      name: 'PQR Industries',
      company: 'PQR Industries Ltd',
    },
    route: 'Bangalore → Chennai',
    rating: 5,
    comment:
      'Outstanding experience! Professional handling and excellent communication.',
    date: '2024-01-10',
    bookingId: 'SH003',
  },
  {
    id: '4',
    shipper: {
      name: 'LMN Logistics',
      company: 'LMN Logistics Pvt Ltd',
    },
    route: 'Kolkata → Bhubaneswar',
    rating: 3,
    comment: 'Average service. Could improve on punctuality.',
    date: '2024-01-08',
    bookingId: 'SH004',
  },
];

export default function RatingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [viewRatingModal, setViewRatingModal] = useState<{
    isOpen: boolean;
    rating: (typeof mockRatings)[0] | null;
  }>({
    isOpen: false,
    rating: null,
  });

  const filteredRatings = mockRatings.filter((rating) => {
    const matchesSearch =
      rating.shipper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === 'all' || rating.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  // Calculate rating statistics
  const totalRatings = mockRatings.length;
  const averageRating =
    mockRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
  const ratingDistribution = {
    5: mockRatings.filter((r) => r.rating === 5).length,
    4: mockRatings.filter((r) => r.rating === 4).length,
    3: mockRatings.filter((r) => r.rating === 3).length,
    2: mockRatings.filter((r) => r.rating === 2).length,
    1: mockRatings.filter((r) => r.rating === 1).length,
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-slate-300'
        }`}
      />
    ));
  };

  const handleViewRating = (rating: (typeof mockRatings)[0]) => {
    setViewRatingModal({
      isOpen: true,
      rating,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['truck-owner']}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <Link href='/dashboard/truck-owner'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>
              Ratings & Reviews
            </h1>
            <p className='text-slate-600'>
              Track your service ratings and feedback
            </p>
          </div>
        </div>

        {/* Rating Overview */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Average Rating
              </CardTitle>
              <Star className='h-4 w-4 text-yellow-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {averageRating.toFixed(1)}
              </div>
              <div className='flex items-center gap-1 mt-1'>
                {renderStars(Math.round(averageRating))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Reviews
              </CardTitle>
              <MessageSquare className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalRatings}</div>
              <p className='text-xs text-slate-600'>All time reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                5-Star Ratings
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{ratingDistribution[5]}</div>
              <p className='text-xs text-slate-600'>
                {Math.round((ratingDistribution[5] / totalRatings) * 100)}% of
                total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Happy Customers
              </CardTitle>
              <Users className='h-4 w-4 text-purple-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {ratingDistribution[4] + ratingDistribution[5]}
              </div>
              <p className='text-xs text-slate-600'>4+ star ratings</p>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of your ratings by star count
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className='flex items-center gap-4'>
                <div className='flex items-center gap-1 w-16'>
                  <span className='text-sm font-medium'>{stars}</span>
                  <Star className='h-4 w-4 text-yellow-500 fill-current' />
                </div>
                <Progress
                  value={(ratingDistribution[stars as keyof typeof ratingDistribution] / totalRatings) * 100}
                  className='flex-1 h-2'
                />
                <div className='text-sm text-slate-600 w-12 text-right'>
                  {ratingDistribution[stars as keyof typeof ratingDistribution]}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                  <Input
                    placeholder='Search by shipper, route, or comment...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className='w-full sm:w-48'>
                  <SelectValue placeholder='Filter by rating' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Ratings</SelectItem>
                  <SelectItem value='5'>5 Stars</SelectItem>
                  <SelectItem value='4'>4 Stars</SelectItem>
                  <SelectItem value='3'>3 Stars</SelectItem>
                  <SelectItem value='2'>2 Stars</SelectItem>
                  <SelectItem value='1'>1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className='space-y-4'>
          {filteredRatings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {/* Header */}
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold'>{rating.shipper.name}</h3>
                        <Badge variant='secondary'>{rating.route}</Badge>
                      </div>
                      <div className='text-sm text-slate-600'>
                        {rating.shipper.company}
                      </div>
                      <div className='text-sm text-slate-600'>
                        Booking: {rating.bookingId}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='flex items-center gap-1 mb-1'>
                        {renderStars(rating.rating)}
                      </div>
                      <div className='text-sm text-slate-600'>
                        {rating.date}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className='p-4 bg-slate-50 rounded-lg'>
                    <p className='text-sm leading-relaxed'>{rating.comment}</p>
                  </div>

                  {/* View Details Button */}
                  <div className='flex justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleViewRating(rating)}>
                      <Eye className='h-4 w-4 mr-2' />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Ratings Found */}
        {filteredRatings.length === 0 && (
          <Card>
            <CardContent className='text-center py-12'>
              <Star className='h-12 w-12 text-slate-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-slate-900 mb-2'>
                No ratings found
              </h3>
              <p className='text-slate-600 mb-4'>
                {searchTerm || ratingFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : "You haven't received any ratings yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Rating Details Modal */}
        {viewRatingModal.rating && (
          <RatingModal
            isOpen={viewRatingModal.isOpen}
            onClose={() => setViewRatingModal({ isOpen: false, rating: null })}
            shipmentDetails={{
              id: viewRatingModal.rating.bookingId,
              route: viewRatingModal.rating.route,
              trucker: 'You',
              company: 'Your Company',
              amount: 0, // Not relevant for viewing
              deliveryDate: viewRatingModal.rating.date,
            }}
            onRatingSubmit={() => {}} // Read-only mode
            isReadOnly={true}
            existingRating={{
              overall: viewRatingModal.rating.rating,
              punctuality: viewRatingModal.rating.rating,
              cargoHandling: viewRatingModal.rating.rating,
              communication: viewRatingModal.rating.rating,
              professionalism: viewRatingModal.rating.rating,
              feedback: viewRatingModal.rating.comment,
              wouldRecommend: true,
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
