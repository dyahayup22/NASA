import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { ExploreMode, ScreenTab, SearchResultItem } from '../types/space';
import { getGlobalSearchIndex } from '../data/nasaData';
// import { NasaMeatballLogo } from './NasaInsignia';

interface NavbarProps {
  activeTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onNavigateSearchResult: (item: SearchResultItem) => void;
  onQuickExploreMode?: (mode: ExploreMode) => void;
}

const NAV_TABS: ScreenTab[] = [
  ScreenTab.Home,
  ScreenTab.Explore,
  ScreenTab.Gallery,
  ScreenTab.Data,
  ScreenTab.About,
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onNavigateSearchResult,
}) => {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const searchIndex = useMemo(() => getGlobalSearchIndex(), []);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return searchIndex.slice(0, 6);
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.subtitle.toLowerCase().includes(trimmed) ||
          item.kind.toLowerCase().includes(trimmed)
      )
      .slice(0, 8);
  }, [query, searchIndex]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleSelectItem = (item: SearchResultItem) => {
    onNavigateSearchResult(item);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <header className="relative z-40 px-4 sm:px-7 lg:px-10 pt-3.5 pb-3">
      {/* Angled Aerospace Header Bezel Line Matching Screenshot */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 84"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full"
      >
        <path
          d="M 0 80 L 348 80 L 392 14 L 1440 14"
          fill="none"
          stroke="#2563eb"
          strokeOpacity="0.38"
          strokeWidth="1.3"
        />
        <path
          d="M 366 76 L 1440 76"
          fill="none"
          stroke="#3b82f6"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
        <line
          x1="418"
          y1="14"
          x2="585"
          y2="14"
          stroke="#60a5fa"
          strokeOpacity="0.65"
          strokeWidth="2"
        />
      </svg>

      <div className="relative flex flex-wrap items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Lockup */}
        <button
          type="button"
          onClick={() => onSelectTab(ScreenTab.Home)}
          className="group flex items-center gap-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg shrink-0 cursor-pointer"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#022e7a] p-1 overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <img
              src="/assets/logo/logo.png"
              alt="NASA Space Apps Challenge"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span aria-hidden="true" className="h-9 w-px bg-blue-300/25" />
          <span className="font-sans text-base sm:text-lg font-semibold leading-snug tracking-tight text-white">
            Planet X
            <br />
            and SPHEREx
          </span>
        </button>

        {/* Zone 2: Primary Navigation Tabs */}
        <nav
          aria-label="Primary Navigation"
          className="order-3 lg:order-2 w-full lg:w-auto flex items-center justify-center gap-1.5 sm:gap-4 lg:gap-6 pt-1 lg:pt-2 overflow-x-auto"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onSelectTab(tab)}
                className={`px-4 sm:px-5 py-1.5 text-sm sm:text-[15px] font-medium whitespace-nowrap shrink-0 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-500/45 via-blue-600/35 to-blue-800/55 text-white border border-blue-300/75 shadow-[0_0_22px_rgba(59,130,246,0.65),inset_0_1px_8px_rgba(147,197,253,0.45)]'
                    : 'text-slate-300 hover:text-white border border-transparent hover:border-blue-400/25 hover:bg-blue-950/35'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Search Control */}
        <div
          ref={searchContainerRef}
          className="order-2 lg:order-3 relative w-48 sm:w-60 lg:w-64 shrink-0 lg:pt-2"
        >
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Search.."
              aria-label="Search celestial objects, NASA gallery, and spectral datasets"
              className="w-full rounded-full bg-[#060f24]/90 border border-blue-300/30 pl-9 pr-8 py-1.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-400/80 focus:shadow-[0_0_16px_rgba(59,130,246,0.35)] transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-blue-400/35 bg-[#071128]/98 shadow-[0_18px_48px_rgba(2,6,23,0.9)] overflow-hidden z-50">
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-blue-400/15 text-xs text-slate-400">
                <span>
                  {query.trim()
                    ? `Matches (${filteredResults.length})`
                    : 'Suggested Mission Targets'}
                </span>
                <span className="font-mono text-[11px] text-slate-500">ESC to close</span>
              </div>

              {filteredResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No targets matching &ldquo;{query}&rdquo;. Try &ldquo;Planet X&rdquo;,
                  &ldquo;Andromeda&rdquo;, or &ldquo;Ice&rdquo;.
                </div>
              ) : (
                <ul className="max-h-72 overflow-y-auto divide-y divide-blue-400/10">
                  {filteredResults.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectItem(item)}
                        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-blue-600/20 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-100 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {item.kind} · {item.subtitle}
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-blue-400 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
