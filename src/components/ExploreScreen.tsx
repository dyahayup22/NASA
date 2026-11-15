import React, { useMemo, useState } from "react";
import { Crosshair, LineChart, RotateCcw } from "lucide-react";
import { CelestialObject, ExploreMode } from "../types/space";
import {
  CELESTIAL_OBJECTS,
  COSMIC_PHENOMENA,
  DETECTOR_BANDS,
} from "../data/nasaData";
import { ResilientNasaImage } from "./NasaInsignia";

interface ExploreScreenProps {
  mode: ExploreMode;
  onChangeMode: (mode: ExploreMode) => void;
  selectedObjectId: string;
  onSelectObjectId: (id: string) => void;
  onOpenSpectrum: (spectralTargetId: string) => void;
  onOpenGalleryItem: (nasaId: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  mode,
  onChangeMode,
  selectedObjectId,
  onSelectObjectId,
  onOpenSpectrum,
  onOpenGalleryItem,
}) => {
  const [activeBand, setActiveBand] = useState<number>(0); // 0 = All Bands, 1..6 = LVF Band
  const [cursorCoords, setCursorCoords] = useState<{ ra: string; dec: string }>(
    {
      ra: "12h 00m",
      dec: "+00° 00′",
    },
  );
  const [orbitEpochYr, setOrbitEpochYr] = useState<number>(2026.8);

  const selectedObject: CelestialObject = useMemo(
    () =>
      CELESTIAL_OBJECTS.find((o) => o.id === selectedObjectId) ||
      CELESTIAL_OBJECTS[0],
    [selectedObjectId],
  );

  const visibleObjects = useMemo(() => {
    if (activeBand === 0) return CELESTIAL_OBJECTS;
    const band = DETECTOR_BANDS.find((b) => b.bandNumber === activeBand);
    if (!band) return CELESTIAL_OBJECTS;
    return CELESTIAL_OBJECTS.filter(
      (obj) =>
        obj.peakBandMicrons >= band.minUm - 0.65 &&
        obj.peakBandMicrons <= band.maxUm + 0.65,
    );
  }, [activeBand]);

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const raHours = (24 * (1 - relX)).toFixed(2);
    const hrs = Math.floor(Number(raHours));
    const mins = Math.floor((Number(raHours) - hrs) * 60);
    const decDeg = Math.round((0.5 - relY) * 180);
    const sign = decDeg >= 0 ? "+" : "";
    setCursorCoords({
      ra: `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`,
      dec: `${sign}${decDeg}°`,
    });
  };

  return (
    <section className="flex-1 flex flex-col px-4 sm:px-8 lg:px-10 pt-3 pb-10 gap-5">
      {/* Workspace Mode Bar & Calibration Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-400/20 pb-3.5">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#07122b] border border-blue-400/25">
          <button
            type="button"
            onClick={() => onChangeMode(ExploreMode.SkySurvey)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              mode === ExploreMode.SkySurvey
                ? "bg-blue-600/50 text-white border border-blue-300/60"
                : "text-slate-300 hover:text-white"
            }`}
          >
            All-Sky Infrared Atlas
          </button>
          <button
            type="button"
            onClick={() => onChangeMode(ExploreMode.PlanetXOrbit)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              mode === ExploreMode.PlanetXOrbit
                ? "bg-blue-600/50 text-white border border-blue-300/60"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Planet X Orbital Search
          </button>
          <button
            type="button"
            onClick={() => onChangeMode(ExploreMode.Phenomena)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              mode === ExploreMode.Phenomena
                ? "bg-blue-600/50 text-white border border-blue-300/60"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Cosmic Phenomena Tracker
          </button>
        </div>

        {/* Live Telemetry Readout */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-300">
          <span>
            FOV: <strong className="text-sky-300">3.5° × 11.3°</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            BANDS: <strong className="text-sky-300">0.75 – 5.00 μm</strong>
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="hidden sm:inline text-emerald-400">
            ● Survey Nominal
          </span>
        </div>
      </div>

      {mode === ExploreMode.Phenomena ? (
        /* Cosmic Phenomena View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {COSMIC_PHENOMENA.map((phenom) => (
            <article
              key={phenom.id}
              className="flex flex-col justify-between rounded-xl border border-blue-400/25 bg-[#071129]/85 p-6 gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400 font-mono">
                  <span>{phenom.epochOrScale}</span>
                  <span
                    className={
                      phenom.statusLabel === "Active Survey"
                        ? "text-emerald-400"
                        : phenom.statusLabel === "Candidate Signal"
                          ? "text-amber-300"
                          : "text-sky-300"
                    }
                  >
                    {phenom.statusLabel === "Active Survey" &&
                      "● Active Survey"}
                    {phenom.statusLabel === "Candidate Signal" &&
                      "▲ Candidate Signal"}
                    {phenom.statusLabel === "Calibrated Baseline" &&
                      "◆ Calibrated Baseline"}
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  {phenom.title}
                </h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {phenom.description}
                </p>
              </div>

              <div className="pt-4 border-t border-blue-400/15 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                    {phenom.wavelengthRange}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tabular-nums text-white">
                      {phenom.keyMetric}
                    </span>
                    <span className="text-xs font-mono uppercase text-slate-400">
                      {phenom.metricUnit}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {phenom.scientificMethod}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSpectrum(phenom.linkedSpectralId)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/35 hover:bg-blue-600/55 border border-blue-400/50 text-xs font-medium text-white whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  <LineChart className="w-3.5 h-3.5 text-sky-300" />
                  <span>Inspect Spectrum</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Asymmetric Split Console: Main Viewport + Right Telemetry Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Interactive Celestial / Orbital Canvas */}
          <div className="lg:col-span-8 flex flex-col rounded-xl border border-blue-400/25 bg-[#050c20]/90 overflow-hidden">
            {/* Viewport HUD Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-blue-400/20 bg-[#07122c]/75">
              {mode === ExploreMode.SkySurvey ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveBand(0)}
                    className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      activeBand === 0
                        ? "bg-sky-500/30 text-white border border-sky-400/60"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All 102 Ch
                  </button>
                  {DETECTOR_BANDS.map((band) => (
                    <button
                      key={band.bandNumber}
                      type="button"
                      onClick={() => setActiveBand(band.bandNumber)}
                      className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        activeBand === band.bandNumber
                          ? "bg-sky-500/30 text-white border border-sky-400/60"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      B{band.bandNumber} ({band.minUm.toFixed(1)}–
                      {band.maxUm.toFixed(1)}μm)
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <label
                    htmlFor="epochSlider"
                    className="font-mono text-slate-300"
                  >
                    SURVEY EPOCH:{" "}
                    <span className="text-sky-300 font-semibold tabular-nums">
                      {orbitEpochYr.toFixed(1)}
                    </span>
                  </label>
                  <input
                    id="epochSlider"
                    type="range"
                    min={2025.0}
                    max={2035.0}
                    step={0.5}
                    value={orbitEpochYr}
                    onChange={(e) => setOrbitEpochYr(Number(e.target.value))}
                    className="w-36 accent-sky-400 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setOrbitEpochYr(2026.8)}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>

            {/* Interactive SVG Viewport */}
            <div className="relative flex-1 min-h-[380px] sm:min-h-[450px] flex items-center justify-center p-3">
              {mode === ExploreMode.SkySurvey ? (
                <svg
                  viewBox="0 0 1000 520"
                  onMouseMove={handleSvgMouseMove}
                  className="w-full h-full cursor-crosshair select-none"
                  role="img"
                  aria-label="All-Sky Mollweide Near-Infrared Celestial Map"
                >
                  <defs>
                    <radialGradient id="mollweideBg" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="#0b1d48" />
                      <stop offset="68%" stopColor="#06102a" />
                      <stop offset="100%" stopColor="#030714" />
                    </radialGradient>
                  </defs>

                  {/* All-Sky Mollweide Ellipse */}
                  <ellipse
                    cx="500"
                    cy="260"
                    rx="465"
                    ry="230"
                    fill="url(#mollweideBg)"
                    stroke="#3b82f6"
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />

                  {/* Latitude Parallels */}
                  {[-150, -75, 0, 75, 150].map((dy) => {
                    const halfWidth =
                      Math.sqrt(Math.max(0, 1 - Math.pow(dy / 230, 2))) * 465;
                    return (
                      <line
                        key={dy}
                        x1={500 - halfWidth}
                        y1={260 + dy}
                        x2={500 + halfWidth}
                        y2={260 + dy}
                        stroke="#60a5fa"
                        strokeOpacity={dy === 0 ? "0.35" : "0.16"}
                        strokeDasharray={dy === 0 ? undefined : "4 5"}
                      />
                    );
                  })}

                  {/* Longitude Meridians */}
                  {[-310, -155, 0, 155, 310].map((dx) => (
                    <path
                      key={dx}
                      d={`M 500 30 Q ${500 + dx * 1.32} 260 500 490`}
                      fill="none"
                      stroke="#60a5fa"
                      strokeOpacity={dx === 0 ? "0.35" : "0.16"}
                      strokeDasharray={dx === 0 ? undefined : "4 5"}
                    />
                  ))}

                  {/* Galactic Plane Dust Band */}
                  <path
                    d="M 55 280 C 260 110, 680 410, 945 245"
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.18"
                    strokeWidth="36"
                    strokeLinecap="round"
                  />

                  {/* Ecliptic Plane Sinusoid & Deep Pole Rings */}
                  <g>
                    <path
                      d="M 42 260 C 265 375, 735 145, 958 260"
                      fill="none"
                      stroke="#f59e0b"
                      strokeOpacity="0.6"
                      strokeWidth="1.6"
                      strokeDasharray="7 5"
                    />
                    <circle
                      cx="812"
                      cy="118"
                      r="26"
                      fill="none"
                      stroke="#38bdf8"
                      strokeOpacity="0.45"
                      strokeDasharray="3 3"
                    />
                    <text
                      x="812"
                      y="84"
                      textAnchor="middle"
                      fill="#7dd3fc"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      NEP DEEP FIELD
                    </text>
                  </g>

                  {/* Plotted Celestial Objects */}
                  {visibleObjects.map((obj) => {
                    const isSelected = obj.id === selectedObject.id;
                    const accent =
                      obj.category === "Trans-Neptunian"
                        ? "#f59e0b"
                        : obj.category === "Galaxy"
                          ? "#60a5fa"
                          : obj.category === "Molecular Cloud"
                            ? "#34d399"
                            : "#c084fc";
                    return (
                      <g
                        key={obj.id}
                        onClick={() => onSelectObjectId(obj.id)}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <>
                            <circle
                              cx={obj.skyX}
                              cy={obj.skyY}
                              r="20"
                              fill={accent}
                              fillOpacity="0.18"
                              stroke={accent}
                              strokeWidth="1.5"
                            />
                            <line
                              x1={obj.skyX - 26}
                              y1={obj.skyY}
                              x2={obj.skyX - 12}
                              y2={obj.skyY}
                              stroke="#e2e8f0"
                              strokeWidth="1.3"
                            />
                            <line
                              x1={obj.skyX + 12}
                              y1={obj.skyY}
                              x2={obj.skyX + 26}
                              y2={obj.skyY}
                              stroke="#e2e8f0"
                              strokeWidth="1.3"
                            />
                          </>
                        )}
                        <circle
                          cx={obj.skyX}
                          cy={obj.skyY}
                          r={isSelected ? 7.5 : 5.5}
                          fill={accent}
                          stroke="#ffffff"
                          strokeWidth="1.4"
                        />
                        <text
                          x={obj.skyX + 12}
                          y={obj.skyY + 4}
                          fill={isSelected ? "#ffffff" : "#cbd5e1"}
                          fontSize="12"
                          fontWeight={isSelected ? "600" : "400"}
                        >
                          {obj.name.split(" (")[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                /* Planet X & Extreme Trans-Neptunian Heliocentric Orbital Search View */
                <svg
                  viewBox="0 0 1000 520"
                  className="w-full h-full cursor-crosshair select-none"
                  role="img"
                  aria-label="Outer Solar System Planet X and Extreme Trans-Neptunian Orbits"
                >
                  {/* Reference AU Distance Circles */}
                  {[55, 115, 185, 240].map((r, idx) => (
                    <g key={r}>
                      <circle
                        cx="530"
                        cy="265"
                        r={r}
                        fill="none"
                        stroke="#3b82f6"
                        strokeOpacity="0.18"
                        strokeDasharray="4 6"
                      />
                      <text
                        x={534}
                        y={265 - r + 13}
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {[30, 150, 350, 600][idx]} AU
                      </text>
                    </g>
                  ))}

                  {/* Sun & Kuiper Belt Ring */}
                  <circle
                    cx="530"
                    cy="265"
                    r="55"
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.35"
                    strokeWidth="12"
                  />
                  <circle cx="530" cy="265" r="5" fill="#fde047" />
                  <text
                    x="542"
                    y="269"
                    fill="#fef08a"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    SOL + KUIPER BELT (30–50 AU)
                  </text>

                  {/* Clustered eTNO Orbits (Sedna, 2012 VP113, Leleakuhonua) */}
                  <ellipse
                    cx="655"
                    cy="285"
                    rx="175"
                    ry="78"
                    transform="rotate(14 655 285)"
                    fill="none"
                    stroke="#34d399"
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="638"
                    cy="242"
                    rx="150"
                    ry="68"
                    transform="rotate(-12 638 242)"
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.45"
                    strokeWidth="1.3"
                  />
                  <ellipse
                    cx="670"
                    cy="262"
                    rx="195"
                    ry="72"
                    transform="rotate(4 670 262)"
                    fill="none"
                    stroke="#818cf8"
                    strokeOpacity="0.45"
                    strokeWidth="1.3"
                  />

                  {/* Anti-Aligned Hypothetical Planet X Orbit (a ~ 460 AU) */}
                  <ellipse
                    cx="390"
                    cy="260"
                    rx="245"
                    ry="168"
                    transform="rotate(-8 390 260)"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.2"
                    strokeDasharray="8 5"
                  />

                  {/* Animated / Scrubbable Planet X Position Along Aphelion Corridor */}
                  {(() => {
                    const phaseRad =
                      ((212 + (orbitEpochYr - 2025) * 1.8) * Math.PI) / 180;
                    const px = 390 + 245 * Math.cos(phaseRad);
                    const py = 260 + 168 * Math.sin(phaseRad);
                    const sednaPhase =
                      ((-145 + (orbitEpochYr - 2025) * 2.4) * Math.PI) / 180;
                    const sx = 655 + 175 * Math.cos(sednaPhase);
                    const sy = 285 + 78 * Math.sin(sednaPhase);

                    return (
                      <g>
                        {/* SPHEREx Sightline Cone */}
                        <line
                          x1="530"
                          y1="265"
                          x2={px}
                          y2={py}
                          stroke="#fbbf24"
                          strokeOpacity="0.35"
                          strokeDasharray="3 3"
                        />

                        {/* Planet X Marker */}
                        <g
                          onClick={() => onSelectObjectId("planet-x-candidate")}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={px}
                            cy={py}
                            r="18"
                            fill="#f59e0b"
                            fillOpacity="0.2"
                            stroke="#fbbf24"
                            strokeWidth="1.4"
                          />
                          <circle
                            cx={px}
                            cy={py}
                            r="7"
                            fill="#fbbf24"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={px + 14}
                            y={py - 6}
                            fill="#fef3c7"
                            fontSize="12"
                            fontWeight="600"
                          >
                            Planet X Candidate
                          </text>
                          <text
                            x={px + 14}
                            y={py + 10}
                            fill="#94a3b8"
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            a ≈ 460 AU · m_AB 21.4
                          </text>
                        </g>

                        {/* Sedna Marker */}
                        <g
                          onClick={() => onSelectObjectId("sedna-90377")}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={sx}
                            cy={sy}
                            r="6"
                            fill="#34d399"
                            stroke="#ffffff"
                            strokeWidth="1.4"
                          />
                          <text
                            x={sx + 11}
                            y={sy + 4}
                            fill="#d1fae5"
                            fontSize="11"
                          >
                            90377 Sedna (83.7 AU)
                          </text>
                        </g>
                      </g>
                    );
                  })()}
                </svg>
              )}

              {/* Bottom-Left Crosshair Coordinate HUD */}
              <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 rounded-lg bg-[#040a1a]/90 border border-blue-400/25 px-3 py-1.5 text-xs font-mono tabular-nums text-slate-300">
                <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  RA {cursorCoords.ra} · DEC {cursorCoords.dec}
                </span>
              </div>
            </div>
          </div>

          {/* Right Telemetry & Object Inspector Panel */}
          <aside className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-blue-400/25 bg-[#071129]/90 p-5 gap-4">
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="relative h-44 w-full rounded-lg overflow-hidden border border-blue-400/25 bg-[#040918]">
                <ResilientNasaImage
                  src={selectedObject.imageUrl}
                  alt={selectedObject.name}
                  fallbackTitle={selectedObject.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071129] via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-200">
                  <span>{selectedObject.category}</span>
                  <span>NASA {selectedObject.nasaId}</span>
                </div>
              </div>

              {/* Title & Coordinates */}
              <div>
                <div className="text-xs font-mono text-sky-300">
                  {selectedObject.designation}
                </div>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {selectedObject.name}
                </h2>
                <div className="mt-1.5 flex items-center gap-2 text-xs font-mono tabular-nums text-slate-400">
                  <span>RA {selectedObject.ra}</span>
                  <span aria-hidden="true">·</span>
                  <span>DEC {selectedObject.dec}</span>
                </div>
              </div>

              {/* Quantitative Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-400/15">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Distance
                  </div>
                  <div className="text-base font-mono font-semibold tabular-nums text-white">
                    {selectedObject.distanceLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Peak IR Band
                  </div>
                  <div className="text-base font-mono font-semibold tabular-nums text-sky-300">
                    {selectedObject.peakBandMicrons.toFixed(2)}{" "}
                    <span className="text-xs text-slate-400">μm</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Kinematics / z
                  </div>
                  <div className="text-sm font-mono font-medium tabular-nums text-slate-200">
                    {selectedObject.redshiftOrVelocity}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Effective Temp
                  </div>
                  <div className="text-sm font-mono font-medium tabular-nums text-slate-200">
                    {selectedObject.temperatureK}{" "}
                    <span className="text-xs text-slate-400">K</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedObject.summary}
              </p>

              <div className="pt-2 border-t border-blue-400/15">
                <div className="text-xs font-semibold text-sky-300">
                  SPHEREx Observation Role
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {selectedObject.spherexInsight}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-blue-400/15 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onOpenSpectrum(selectedObject.spectralTargetId)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600/45 hover:bg-blue-600/65 border border-blue-300/60 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                <LineChart className="w-4 h-4 text-sky-200" />
                <span>Analyze 102-Ch Spectrum</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenGalleryItem(selectedObject.nasaId)}
                className="px-3.5 py-2.5 rounded-lg border border-blue-400/35 hover:border-blue-300/70 text-xs font-medium text-slate-200 hover:text-white whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                Full Capture
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
