'use client';

import type React from 'react';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { Truck, LogOut, User, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-slate-50'>
        {/* Header */}
        <header className='bg-white border-b shadow-sm'>
          <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
            <Link href='/' className='flex items-center gap-2'>
              <Truck className='h-8 w-8 text-blue-600' />
              <h1 className='text-2xl font-bold text-slate-900'>
                FreightMatch
              </h1>
            </Link>

            <div className='flex items-center gap-4'>
              <Popover
                open={notificationOpen}
                onOpenChange={setNotificationOpen}>
                <PopoverTrigger asChild>
                  <Button variant='ghost' size='sm' className='relative'>
                    <Bell className='h-4 w-4' />
                    {/* Notification badge */}
                    <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                      3
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-96 p-0' align='end'>
                  <NotificationCenter />
                </PopoverContent>
              </Popover>

              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4' />
                <span className='font-medium'>{user?.name}</span>
                <span className='text-slate-500 capitalize'>
                  ({user?.role?.replace('-', ' ')})
                </span>
              </div>

              <Button variant='outline' size='sm' onClick={logout}>
                <LogOut className='h-4 w-4 mr-2' />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='container mx-auto px-4 py-8'>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
