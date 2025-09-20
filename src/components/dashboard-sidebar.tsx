'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, LineChart, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: QrCode, label: 'QR Generator' },
  { href: '/dashboard/analytics', icon: LineChart, label: 'Analytics' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
      <div className="flex items-center gap-3 p-2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          className="text-primary"
        >
          <path
            fill="currentColor"
            d="M10 10h30v30H10z m5 5v20h20V15z m35-5h30v30H50z m5 5v20h20V15z M10 50h30v30H10z m5 5v20h20V55z m42.5 12.5h20v20h-20z m22.5 10h5v2.5h-5z m-5-5h2.5v5h-5v-2.5h2.5z m-2.5-5h5v5h-5z m-2.5 12.5h2.5v2.5h-2.5z m-12.5-17.5h5v5h-5z m10 2.5h2.5v5h-2.5z m-5-10h2.5v5h-2.5z m15 5h2.5v2.5h-2.5z m-10 12.5h5v2.5h-5z m5 5h2.5v2.5h-2.5z m10-2.5h2.5v5h-2.5z m2.5 5h2.5v2.5h-2.5z m-2.5 2.5h-2.5v5h5v-2.5h-2.5z m-12.5 0h-2.5v2.5h5v-2.5h-2.5z m-5-10h-2.5v2.5h2.5z m-2.5-2.5v-2.5h-5v5h2.5v-2.5h2.5z M50 50h2.5v2.5H50V50zm5 0h2.5v2.5H55V50zm-5 5h2.5v2.5H50v-2.5zm5 0h2.5v2.5H55v-2.5z"
          />
        </svg>
        <h1 className="text-xl font-bold tracking-tighter">QRify</h1>
      </div>
      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-11 text-base"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        {/* Placeholder for future user menu */}
      </div>
    </aside>
  );
}
