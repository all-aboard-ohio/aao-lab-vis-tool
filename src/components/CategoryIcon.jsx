import { TrainFront, Building2, Waypoints, TrainTrack, HardHat, MapPin } from 'lucide-react'
import { getCategory } from '../data/categories'

const ICONS = {
  TrainFront,
  Building2,
  Waypoints,
  TrainTrack,
  HardHat,
}

/** Renders the lucide icon associated with a location category. */
export default function CategoryIcon({ type, size = 20, className = '', ...rest }) {
  const cat = getCategory(type)
  const Icon = ICONS[cat.icon] ?? MapPin
  return <Icon size={size} className={className} aria-hidden="true" {...rest} />
}
