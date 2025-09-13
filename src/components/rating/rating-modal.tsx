'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Star,
  Truck,
  Clock,
  Shield,
  MessageCircle,
  CheckCircle,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentDetails: {
    id: string;
    route: string;
    trucker: string;
    company: string;
    amount: number;
    deliveryDate: string;
  };
  onRatingSubmit: (rating: RatingData) => void;
  isReadOnly?: boolean;
  existingRating?: RatingData;
  userType?: 'shipper' | 'truck-owner';
}

interface RatingData {
  overall: number;
  punctuality: number;
  cargoHandling: number;
  communication: number;
  professionalism: number;
  feedback: string;
  wouldRecommend: boolean;
}

export function RatingModal({
  isOpen,
  onClose,
  shipmentDetails,
  onRatingSubmit,
  isReadOnly = false,
  existingRating,
  userType = 'shipper',
}: RatingModalProps) {
  const [ratings, setRatings] = useState<RatingData>(
    existingRating || {
      overall: 0,
      punctuality: 0,
      cargoHandling: 0,
      communication: 0,
      professionalism: 0,
      feedback: '',
      wouldRecommend: false,
    },
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipperRatingCategories = [
    {
      key: 'overall',
      label: 'Overall Experience',
      icon: Star,
      description: 'Rate your overall experience',
    },
    {
      key: 'punctuality',
      label: 'Punctuality',
      icon: Clock,
      description: 'On-time pickup and delivery',
    },
    {
      key: 'cargoHandling',
      label: 'Cargo Handling',
      icon: Shield,
      description: 'Care taken with your cargo',
    },
    {
      key: 'communication',
      label: 'Communication',
      icon: MessageCircle,
      description: 'Responsiveness and updates',
    },
    {
      key: 'professionalism',
      label: 'Professionalism',
      icon: Truck,
      description: 'Professional behavior',
    },
  ];

  const truckOwnerRatingCategories = [
    {
      key: 'overall',
      label: 'Overall Experience',
      icon: Star,
      description: 'Rate your overall experience with this shipper',
    },
    {
      key: 'punctuality',
      label: 'Payment Promptness',
      icon: DollarSign,
      description: 'Timely payment processing',
    },
    {
      key: 'cargoHandling',
      label: 'Cargo Preparation',
      icon: Package,
      description: 'Proper packaging and documentation',
    },
    {
      key: 'communication',
      label: 'Communication',
      icon: MessageCircle,
      description: 'Clear instructions and responsiveness',
    },
    {
      key: 'professionalism',
      label: 'Cooperation',
      icon: Users,
      description: 'Loading/unloading assistance and professionalism',
    },
  ];

  const ratingCategories =
    userType === 'truck-owner'
      ? truckOwnerRatingCategories
      : shipperRatingCategories;

  const handleStarClick = (category: keyof RatingData, rating: number) => {
    if (isReadOnly) return;
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onRatingSubmit(ratings);
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (category: keyof RatingData, currentRating: number) => {
    return (
      <div className='flex gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => handleStarClick(category, star)}
            className={`transition-colors ${
              !isReadOnly ? 'hover:scale-110' : 'cursor-default'
            }`}
            disabled={isReadOnly}>
            <Star
              className={`h-6 w-6 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : isReadOnly
                  ? 'text-slate-300'
                  : 'text-slate-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating =
    Object.entries(ratings)
      .filter(([key]) => key !== 'feedback' && key !== 'wouldRecommend')
      .reduce((sum, [, value]) => sum + (value as number), 0) / 5;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5 text-yellow-500' />
            {isReadOnly
              ? 'Rating Details'
              : `Rate ${
                  userType === 'truck-owner' ? 'Shipper' : 'Truck Owner'
                }`}
          </DialogTitle>
          <DialogDescription>
            {isReadOnly
              ? 'View the rating details for this service'
              : `Help other ${
                  userType === 'truck-owner' ? 'truck owners' : 'shippers'
                } by sharing your experience with this ${
                  userType === 'truck-owner' ? 'shipper' : 'service'
                }`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Shipment Summary */}
          <div className='p-4 bg-slate-50 rounded-lg space-y-2'>
            <div className='font-medium'>Shipment Details</div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-slate-600'>Shipment ID:</span>
                <div className='font-medium'>{shipmentDetails.id}</div>
              </div>
              <div>
                <span className='text-slate-600'>Route:</span>
                <div className='font-medium'>{shipmentDetails.route}</div>
              </div>
              <div>
                <span className='text-slate-600'>
                  {userType === 'truck-owner' ? 'Shipper:' : 'Trucker:'}
                </span>
                <div className='font-medium'>{shipmentDetails.trucker}</div>
              </div>
              <div>
                <span className='text-slate-600'>Company:</span>
                <div className='font-medium'>{shipmentDetails.company}</div>
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium'>
                {isReadOnly ? 'Rating Breakdown' : 'Rate Different Aspects'}
              </h3>
              {averageRating > 0 && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-slate-600'>Average:</span>
                  <div className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                    <span className='font-medium'>
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {ratingCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.key} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <IconComponent className='h-5 w-5 text-slate-600' />
                      <div>
                        <div className='font-medium'>{category.label}</div>
                        <div className='text-sm text-slate-600'>
                          {category.description}
                        </div>
                      </div>
                    </div>
                    {renderStars(
                      category.key as keyof RatingData,
                      ratings[category.key as keyof RatingData] as number,
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendation - only show in read-only if there's a value */}
          {(!isReadOnly || ratings.overall > 0) && (
            <div className='space-y-3'>
              <Label>
                Would you recommend this{' '}
                {userType === 'truck-owner' ? 'shipper' : 'service'}?
              </Label>
              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant={ratings.wouldRecommend ? 'default' : 'outline'}
                  onClick={() =>
                    !isReadOnly &&
                    setRatings((prev) => ({ ...prev, wouldRecommend: true }))
                  }
                  className='flex-1'
                  disabled={isReadOnly}>
                  <CheckCircle className='h-4 w-4 mr-2' />
                  Yes, I recommend
                </Button>
                <Button
                  type='button'
                  variant={
                    !ratings.wouldRecommend && ratings.overall > 0
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() =>
                    !isReadOnly &&
                    setRatings((prev) => ({ ...prev, wouldRecommend: false }))
                  }
                  className='flex-1'
                  disabled={isReadOnly}>
                  No, I don't recommend
                </Button>
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className='space-y-2'>
            <Label htmlFor='feedback'>
              {isReadOnly ? 'Feedback' : 'Additional Feedback (Optional)'}
            </Label>
            <Textarea
              id='feedback'
              placeholder={
                isReadOnly
                  ? 'No feedback provided'
                  : `Share your detailed experience with this ${
                      userType === 'truck-owner' ? 'shipper' : 'service'
                    }, suggestions for improvement, or any specific comments...`
              }
              value={ratings.feedback}
              onChange={(e) =>
                !isReadOnly &&
                setRatings((prev) => ({ ...prev, feedback: e.target.value }))
              }
              rows={4}
              readOnly={isReadOnly}
              className={isReadOnly ? 'bg-slate-50' : ''}
            />
          </div>

          {/* Rating Summary */}
          {averageRating > 0 && (
            <div className='p-4 bg-blue-50 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>Rating Summary</span>
              </div>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                {ratingCategories.map((category) => (
                  <div key={category.key} className='flex justify-between'>
                    <span>{category.label}:</span>
                    <div className='flex items-center gap-1'>
                      <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      <span>{ratings[category.key as keyof RatingData]}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='flex-1 bg-transparent'>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isReadOnly && (
              <Button
                type='submit'
                disabled={isSubmitting || ratings.overall === 0}
                className='flex-1'>
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
