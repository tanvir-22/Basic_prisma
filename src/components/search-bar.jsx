'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

export function SearchBar({ defaultValue = '' }) {
  // console.log("i am defaultValue:",defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  // Sync state if default value changes (e.g. cleared via filter chips)
  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    // Debounce search input changes by 300ms
    const delayDebounce = setTimeout(() => {
      if (searchTerm === defaultValue) return;
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
       
      });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pathname, searchParams, router, defaultValue]);

  return (
    <div className="relative flex-1 w-full">
      <Input
        name="search"
        placeholder="Search notes by title or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-12 h-14"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
        {isPending ? (
          <Loader2 className="h-6 w-6 animate-spin text-black" />
        ) : (
          <Search className="h-6 w-6 text-black stroke-[3]" />
        )}
      </div>
    </div>
  );
}
