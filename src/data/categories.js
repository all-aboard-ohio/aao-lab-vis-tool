// Category metadata for points of note along a route.
//
// Each category maps to a brand color and a lucide-react icon name. Markers,
// the legend, and location panels all read from this single source so the
// visual language stays consistent. Colors use the AAO brand palette.

export const CATEGORIES = {
  station: {
    id: 'station',
    label: 'Station',
    plural: 'Stations',
    description: 'Proposed passenger rail stations and platforms.',
    color: '#B72717', // aao-dark-red
    icon: 'TrainFront',
  },
  tod: {
    id: 'tod',
    label: 'Transit-Oriented Development',
    plural: 'Transit-Oriented Development',
    description: 'Walkable housing, retail, and jobs clustered around a station.',
    color: '#388CBB', // aao-light-blue
    icon: 'Building2',
  },
  'grade-separation': {
    id: 'grade-separation',
    label: 'Grade Separation',
    plural: 'Grade Separations',
    description: 'Overpasses or underpasses that remove road/rail conflicts.',
    color: '#012345', // aao-dark-blue
    icon: 'Waypoints',
  },
  'track-improvement': {
    id: 'track-improvement',
    label: 'Track Improvement',
    plural: 'Track Improvements',
    description: 'Upgraded, doubled, or realigned track for faster, safer service.',
    color: '#D55855', // aao-light-red
    icon: 'TrainTrack',
  },
  construction: {
    id: 'construction',
    label: 'New Construction',
    plural: 'New Construction',
    description: 'New bridges, crossings, or structures required for the line.',
    color: '#8a6d1f', // muted gold, distinct from the brand reds/blues
    icon: 'HardHat',
  },
}

export const CATEGORY_ORDER = [
  'station',
  'tod',
  'grade-separation',
  'track-improvement',
  'construction',
]

export function getCategory(type) {
  return CATEGORIES[type] ?? CATEGORIES.station
}
