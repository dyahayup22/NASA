import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { ExploreMode, ScreenTab } from '../types/space';
import { SPACECRAFT_SUBSYSTEMS, VERIFIED_NASA_ASSETS } from '../data/nasaData';
import { ResilientNasaImage } from './NasaInsignia';

interface AboutScreenProps {
  selectedSubsystemId: string;
  onSelectSubsystemId: (id: string) => void;
  onNavigateExploreMode: (mode: ExploreMode) => void;
  onNavigateTab: (tab: ScreenTab) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  selectedSubsystemId,
  onSelectSubsystemId,
  onNavigateExploreMode,
  onNavigateTab,
}) => {
  const activeSubsystem = useMemo(
    () =>
      SPACECRAFT_SUBSYSTEMS.find((s) => s.id === selectedSubsystemId) ||
      SPACECRAFT_SUBSYSTEMS[0],
    [selectedSubsystemId]
  );

  return (
    <section className="flex-1 flex flex-col px-4 sm:px-8 lg:px-10 pt-3 pb-10 gap-8">
      {/* Header Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-blue-400/20 pb-7">
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="text-xs font-mono text-sky-300">
              NASA Medium-Class Explorer (MIDEX) · JPL-Caltech
            </div>
            <h1 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
              Mapping the Entire Sky in 102 Infrared Colors—From Cosmic Inflation to the Outer
              Solar System
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              NASA’s <strong>SPHEREx</strong> (Spectro-Photometer for the History of the Universe,
              Epoch of Reionization and Ices Explorer) surveys the complete celestial sphere every
              six months. Unlike narrow-field flagships that study single targets in isolation,
              SPHEREx captures spectra for over 450 million galaxies, 100 million Milky Way stars,
              and moving outer solar system worlds—providing an unprecedented multi-epoch infrared
              dragnet for distant trans-Neptunian candidates including hypothetical{' '}
              <strong>Planet X</strong>.
            </p>
          </div>

          {/* Quantitative Mission Proof Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-blue-400/15">
            <div>
              <div className="text-2xl font-mono font-bold tabular-nums text-white">102</div>
              <div className="text-xs text-slate-400 mt-0.5">Near-IR Color Channels</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold tabular-nums text-sky-300">4×</div>
              <div className="text-xs text-slate-400 mt-0.5">Complete All-Sky Maps</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold tabular-nums text-white">450M+</div>
              <div className="text-xs text-slate-400 mt-0.5">3D Galaxy Redshifts</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold tabular-nums text-emerald-300">
                &lt; 80 K
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Passive Cryo Optics</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl overflow-hidden border border-blue-400/30 bg-[#050d22] relative min-h-[250px]">
          <ResilientNasaImage
            src={VERIFIED_NASA_ASSETS.spherexPerspective}
            alt="NASA SPHEREx All-Sky Orbital Concept"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050d22] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-slate-200">
            NASA / JPL-Caltech · PIA26532 Orbital Survey Geometry
          </div>
        </div>
      </div>

      {/* Interactive Spacecraft Subsystem Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 rounded-xl border border-blue-400/25 bg-[#060f25]/90 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Interactive Observatory Anatomy
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Select a node on the diagram or subsystem list to inspect flight hardware parameters.
            </p>
          </div>

          <svg
            viewBox="0 0 500 370"
            className="w-full h-auto my-3 select-none"
            role="img"
            aria-label="SPHEREx Spacecraft Cross-Section Schematic"
          >
            {/* Outer, Middle, Inner Conical Shields */}
            <polygon
              points="85,82 415,82 325,248 175,248"
              fill="#1e293b"
              fillOpacity="0.65"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />
            <polygon
              points="122,95 378,95 308,236 192,236"
              fill="#0f172a"
              stroke="#94a3b8"
              strokeDasharray="4 3"
              strokeWidth="1.2"
            />
            <polygon
              points="160,108 340,108 292,226 208,226"
              fill="#040918"
              stroke="#f59e0b"
              strokeOpacity="0.75"
              strokeWidth="1.3"
            />

            {/* Central All-Aluminum Telescope & Focal Plane */}
            <rect
              x="222"
              y="148"
              width="56"
              height="94"
              rx="6"
              fill="#0b2559"
              stroke="#38bdf8"
              strokeWidth="1.6"
            />
            <line x1="228" y1="212" x2="272" y2="232" stroke="#fcd34d" strokeWidth="2" />

            {/* Lower Bus & Solar Wings */}
            <rect
              x="192"
              y="252"
              width="116"
              height="68"
              rx="6"
              fill="#78350f"
              fillOpacity="0.65"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <rect
              x="44"
              y="252"
              width="136"
              height="32"
              rx="3"
              fill="#08142c"
              stroke="#60a5fa"
              strokeWidth="1.4"
            />
            <rect
              x="320"
              y="252"
              width="136"
              height="32"
              rx="3"
              fill="#08142c"
              stroke="#60a5fa"
              strokeWidth="1.4"
            />

            {/* Interactive Subsystem Nodes */}
            {SPACECRAFT_SUBSYSTEMS.map((sub) => {
              const isSelected = sub.id === activeSubsystem.id;
              return (
                <g
                  key={sub.id}
                  onClick={() => onSelectSubsystemId(sub.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle
                      cx={sub.svgX}
                      cy={sub.svgY}
                      r="16"
                      fill="#38bdf8"
                      fillOpacity="0.25"
                      stroke="#7dd3fc"
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={sub.svgX}
                    cy={sub.svgY}
                    r="7.5"
                    fill={isSelected ? '#38bdf8' : '#1d4ed8'}
                    stroke="#ffffff"
                    strokeWidth="1.6"
                  />
                </g>
              );
            })}
          </svg>

          <div className="flex flex-wrap gap-1.5">
            {SPACECRAFT_SUBSYSTEMS.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubsystemId(sub.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  sub.id === activeSubsystem.id
                    ? 'bg-sky-500/30 text-white border border-sky-400/70'
                    : 'bg-[#081533] text-slate-300 hover:text-white border border-blue-400/20'
                }`}
              >
                {sub.code}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Subsystem Detail + Four Core Pillars */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="rounded-xl border border-blue-400/30 bg-[#071129]/90 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-sky-300">
              <span>SUBSYSTEM {activeSubsystem.code}</span>
              <span>OPERATING REGIME: {activeSubsystem.operatingTemp}</span>
            </div>
            <h3 className="mt-1.5 text-xl font-bold text-white">{activeSubsystem.name}</h3>
            <div className="mt-1 text-xs font-mono text-slate-400">
              {activeSubsystem.massOrSpec}
            </div>
            <p className="mt-3 text-sm text-slate-200 leading-relaxed">
              {activeSubsystem.summary}
            </p>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {activeSubsystem.engineeringDetail}
            </p>
          </div>

          {/* Editorial Numbered Science Chapters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-blue-400/20 bg-[#071129]/75 p-5">
              <h4 className="text-sm font-semibold text-white">01. Cosmic Inflation Physics</h4>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Maps 3D positions of 450M+ galaxies to test quantum fluctuations during the first
                billionth of a trillionth of a trillionth of a second after the Big Bang.
              </p>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#071129]/75 p-5">
              <h4 className="text-sm font-semibold text-white">02. Interstellar Water & Ices</h4>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Surveys over 9 million stellar sightlines in the Milky Way for frozen water, CO₂,
                CO, and methanol—the raw chemical ingredients of habitable planets.
              </p>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#071129]/75 p-5">
              <h4 className="text-sm font-semibold text-white">
                03. Planet X & Outer Kuiper Survey
              </h4>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Four full-sky infrared epochs separated by six-month parallax baselines reveal slow
                astrometric motion and methane features of ultra-distant solar system worlds.
              </p>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#071129]/75 p-5 flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  04. First Stars & Reionization
                </h4>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  Deep ecliptic pole mosaics measure the cumulative glow of every galaxy formed
                  since cosmic dawn.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigateExploreMode(ExploreMode.PlanetXOrbit)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-white cursor-pointer"
                >
                  <span>Launch Planet X Orbit Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab(ScreenTab.Data)}
                  className="text-xs font-semibold text-sky-300 hover:text-white cursor-pointer"
                >
                  Open Spectral Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
