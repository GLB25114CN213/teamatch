'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Plus, Search } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data);
      })
      .catch(() => {});

    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});
  };

  const markNotificationsRead = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      }).then(() => setUnreadCount(0));
    }
  };

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Teammates', href: '/students' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Projects', href: '/projects' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#051A14]/95 backdrop-blur-md border-b border-[#B7F34A]/15 text-[#F8F7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 gap-4">
          
          {/* Left Navigation Links */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 text-xs font-semibold tracking-wide transition-colors ${
                      isActive ? 'text-[#B7F34A]' : 'text-[#9BB0A6] hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B7F34A] rounded-full animate-fade-in-up" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Upper Center Logo Branding */}
          <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center space-x-3 shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#B7F34A] text-[#051A14] flex items-center justify-center font-extrabold text-sm tracking-tighter shadow-md">
                TM
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#B7F34A] transition-colors">
                  TeamMatch
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider bg-[#0A2B22] text-[#B7F34A] rounded border border-[#B7F34A]/20 uppercase">
                  GLBITM
                </span>
              </div>
            </Link>
          </div>

          {/* Right Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Box */}
            <div className="hidden lg:flex items-center w-44 xl:w-56 relative">
              <Search className="w-3.5 h-3.5 text-[#9BB0A6] absolute left-3" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/students?query=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0A2B22]/80 border border-[#B7F34A]/15 rounded-lg text-xs text-[#F8F7F5] placeholder-[#9BB0A6]/60 focus:outline-none focus:border-[#B7F34A]/40 transition-colors"
              />
            </div>

            <Link
              href="/opportunities/new"
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-extrabold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post Opportunity</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={markNotificationsRead}
                className="relative p-2 rounded-lg bg-[#0A2B22] border border-[#B7F34A]/20 text-[#F8F7F5] hover:bg-[#0E3A2E] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#B7F34A] rounded-full ring-2 ring-[#051A14]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A2B22] rounded-xl shadow-2xl border border-[#B7F34A]/20 py-2 z-50 text-[#F8F7F5]">
                  <div className="px-4 py-2 border-b border-[#B7F34A]/10 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs tracking-wider uppercase text-[#B7F34A]">Notifications</h3>
                    <span className="text-[10px] text-[#9BB0A6]">{notifications.length} total</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#B7F34A]/10">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#9BB0A6]">No notifications right now</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-[#0E3A2E] transition-colors">
                          <p className="font-bold text-xs text-white">{n.title}</p>
                          <p className="text-xs text-[#9BB0A6] mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-[#9BB0A6]/60 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            {currentUser?.user ? (
              <Link href="/students" className="flex items-center space-x-2 p-1 bg-[#0A2B22] rounded-lg border border-[#B7F34A]/20 hover:border-[#B7F34A]/40 transition-colors">
                <img
                  src={currentUser.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt="Avatar"
                  className="w-7 h-7 rounded object-cover"
                />
                <span className="hidden lg:inline text-xs font-bold text-[#F8F7F5] pr-1">
                  {currentUser.user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="px-3.5 py-1.5 text-xs font-extrabold text-[#051A14] bg-[#B7F34A] hover:bg-[#A6E239] rounded-lg transition-colors"
              >
                Join GLBITM
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
