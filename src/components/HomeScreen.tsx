import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { ExploreMode, GalleryCategory, ScreenTab } from '../types/space';
import { VERIFIED_NASA_ASSETS } from '../data/nasaData';
import {
  CosmicStarburstCardIcon,
  GalaxySpiralCardIcon,
  NasaDataBarsCardIcon,
  RingedPlanetCardIcon,
} from './NasaInsignia';

interface HomeScreenProps {
  onStartExploring: () => void;
  onNavigateExploreMode: (mode: ExploreMode, objectId?: string) => void;
  onNavigateGalleryCategory: (cat: GalleryCategory) => void;
  onNavigateTab: (tab: ScreenTab) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartExploring,
  onNavigateExploreMode,
  onNavigateGalleryCategory,
  onNavigateTab,
}) => {
  const [earthImgError, setEarthImgError] = useState(false);

  return (
    <section className="relative flex-1 flex flex-col justify-between px-5 sm:px-9 lg:px-14 pt-6 pb-8 overflow-hidden min-h-[680px] lg:min-h-[760px]">
      {/* Cosmic & Orbital Background Stage */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#030716]">
        {/* Full-Screen NASA Artemis I Earth Observation Background */}
        {!earthImgError && (
          <img
            src={VERIFIED_NASA_ASSETS.earthLimbBlue}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setEarthImgError(true)}
            className="w-full h-full object-cover object-center opacity-85"
          />
        )}

        {/* Measured Contrast Scrims for Headline, Spacecraft & Card Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030716]/92 via-[#040b21]/40 to-[#030716]/65" />
        <div className="absolute inset-y-0 left-0 w-full lg:w-[62%] bg-gradient-to-r from-[#030716]/92 via-[#04091a]/70 to-transparent" />
      </div>

      {/* Main Hero Copy */}
      <div className="relative z-20 flex items-center my-auto py-4 lg:py-6">
        <div className="max-w-xl">
          <h1 className="font-display italic font-extrabold text-4xl sm:text-6xl lg:text-[66px] leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(3,7,18,0.9)]">
            Planet X and
            <br />
            SPHEREx
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-[19px] leading-relaxed text-slate-200/95 max-w-lg drop-shadow-[0_2px_12px_rgba(3,7,18,0.95)]">
            Explore the mysteries of the universe through advanced space observation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStartExploring}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-blue-400/85 bg-gradient-to-r from-[#07183d]/95 via-[#133a8a]/80 to-[#07183d]/95 text-white font-semibold text-base sm:text-[17px] whitespace-nowrap shrink-0 shadow-[0_0_28px_rgba(37,99,235,0.65),inset_0_0_18px_rgba(96,165,250,0.38)] hover:border-sky-300 hover:shadow-[0_0_38px_rgba(59,130,246,0.9),inset_0_0_24px_rgba(147,197,253,0.55)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-5 h-5 text-sky-300 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab(ScreenTab.About)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-200/90 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Mission Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 4 Interactive Feature Cards Matching Reference Screenshot */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 pt-4">
        <button
          type="button"
          onClick={() => onNavigateExploreMode(ExploreMode.PlanetXOrbit, 'planet-x-candidate')}
          className="group flex items-center gap-4 rounded-2xl border border-blue-400/40 bg-[#06112b]/82 hover:bg-[#0a1c44]/90 hover:border-sky-400/80 px-5 py-4 sm:py-5 text-left shadow-[0_8px_30px_rgba(2,8,28,0.75),inset_0_1px_12px_rgba(59,130,246,0.16)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <div className="transition-transform duration-150 group-hover:scale-105">
            <RingedPlanetCardIcon />
          </div>
          <span className="text-[15px] sm:text-base font-medium leading-snug text-slate-100 group-hover:text-white">
            Discover
            <br />
            Celestial Objects
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateGalleryCategory('Galaxies')}
          className="group flex items-center gap-4 rounded-2xl border border-blue-400/40 bg-[#06112b]/82 hover:bg-[#0a1c44]/90 hover:border-sky-400/80 px-5 py-4 sm:py-5 text-left shadow-[0_8px_30px_rgba(2,8,28,0.75),inset_0_1px_12px_rgba(59,130,246,0.16)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <div className="transition-transform duration-150 group-hover:scale-105">
            <GalaxySpiralCardIcon />
          </div>
          <span className="text-[15px] sm:text-base font-medium leading-snug text-slate-100 group-hover:text-white">
            Explore Galaxy
            <br />
            in High Detail
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateExploreMode(ExploreMode.Phenomena)}
          className="group flex items-center gap-4 rounded-2xl border border-blue-400/40 bg-[#06112b]/82 hover:bg-[#0a1c44]/90 hover:border-sky-400/80 px-5 py-4 sm:py-5 text-left shadow-[0_8px_30px_rgba(2,8,28,0.75),inset_0_1px_12px_rgba(59,130,246,0.16)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <div className="transition-transform duration-150 group-hover:scale-105">
            <CosmicStarburstCardIcon />
          </div>
          <span className="text-[15px] sm:text-base font-medium leading-snug text-slate-100 group-hover:text-white">
            Track Cosmic
            <br />
            Phenomena
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab(ScreenTab.Data)}
          className="group flex items-center gap-4 rounded-2xl border border-blue-400/40 bg-[#06112b]/82 hover:bg-[#0a1c44]/90 hover:border-sky-400/80 px-5 py-4 sm:py-5 text-left shadow-[0_8px_30px_rgba(2,8,28,0.75),inset_0_1px_12px_rgba(59,130,246,0.16)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <div className="transition-transform duration-150 group-hover:scale-105">
            <NasaDataBarsCardIcon />
          </div>
          <span className="text-[15px] sm:text-base font-medium leading-snug text-slate-100 group-hover:text-white">
            Learn with
            <br />
            NASA Data
          </span>
        </button>
      </div>
    </section>
  );
};
