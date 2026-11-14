export enum ScreenTab {
  Home = 'Home',
  Explore = 'Explore',
  Gallery = 'Gallery',
  Data = 'Data',
  About = 'About',
}

export enum ExploreMode {
  SkySurvey = 'SkySurvey',
  PlanetXOrbit = 'PlanetXOrbit',
  Phenomena = 'Phenomena',
}

export type GalleryCategory =
  | 'All'
  | 'SPHEREx Mission'
  | 'Galaxies'
  | 'Outer Solar System'
  | 'Nebulae & Ices';

export interface CelestialObject {
  id: string;
  name: string;
  designation: string;
  category: 'Trans-Neptunian' | 'Galaxy' | 'Molecular Cloud' | 'Cosmological Web';
  ra: string;
  dec: string;
  skyX: number; // 0-1000 SVG coordinate
  skyY: number; // 0-520 SVG coordinate
  orbitRadiusAu?: number;
  orbitEccentricity?: number;
  orbitAngleDeg?: number;
  distanceLabel: string;
  redshiftOrVelocity: string;
  peakBandMicrons: number;
  apparentMagAb: number;
  temperatureK: number;
  summary: string;
  spherexInsight: string;
  imageUrl: string;
  nasaId: string;
  spectralTargetId: string;
}

export interface CosmicPhenomenon {
  id: string;
  title: string;
  epochOrScale: string;
  wavelengthRange: string;
  statusLabel: 'Active Survey' | 'Candidate Signal' | 'Calibrated Baseline';
  skyRegion: string;
  keyMetric: string;
  metricUnit: string;
  description: string;
  scientificMethod: string;
  linkedSpectralId: string;
}

export interface GalleryItem {
  id: string;
  nasaId: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  dateCreated: string;
  credit: string;
  wavelengthInfo: string;
  imageUrl: string;
  description: string;
}

export interface SpectralFeatureLine {
  wavelengthUm: number;
  molecule: string;
  label: string;
  type: 'absorption' | 'emission';
}

export interface SpectralTarget {
  id: string;
  name: string;
  subtitle: string;
  defaultRedshift: number;
  fluxUnit: string;
  baseFluxPoints: { wavelength: number; flux: number; modelFlux: number }[];
  features: SpectralFeatureLine[];
  notes: string;
}

export interface DetectorBand {
  bandNumber: number;
  name: string;
  minUm: number;
  maxUm: number;
  resolvingPower: number;
  detectorMaterial: string;
  primaryScience: string;
  sensitivityAbMag: number;
  surveyCompletenessPct: number;
}

export interface SpacecraftSubsystem {
  id: string;
  name: string;
  code: string;
  operatingTemp: string;
  massOrSpec: string;
  svgX: number;
  svgY: number;
  summary: string;
  engineeringDetail: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  kind: 'Object' | 'Gallery' | 'Spectrum' | 'Spacecraft';
  targetTab: ScreenTab;
  targetSubId?: string;
  exploreMode?: ExploreMode;
}
