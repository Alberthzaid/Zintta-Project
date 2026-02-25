import { useState } from 'react'
import { PrintLocation } from '../../types'

interface Props {
  images: string[]
  uploadedDesign: string | null
  printLocation: PrintLocation
}

const LOCATION_STYLE: Record<PrintLocation, React.CSSProperties> = {
  FRONT: {
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '38%',
    maxHeight: '35%',
  },
  BACK: {
    top: '22%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '36%',
    maxHeight: '32%',
  },
  SLEEVE: {
    top: '28%',
    left: '15%',
    width: '18%',
    maxHeight: '20%',
  },
}

export default function ProductGallery({ images, uploadedDesign, printLocation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-6">
      {/* Main image */}
      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#2a1d24] relative group">
        <img
          src={images[activeIndex]}
          alt="Product view"
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Design overlay */}
        {uploadedDesign && (
          <div
            className="absolute pointer-events-none"
            style={LOCATION_STYLE[printLocation]}
          >
            <img
              src={uploadedDesign}
              alt="Your design preview"
              className="w-full h-full object-contain opacity-90 drop-shadow-2xl"
            />
          </div>
        )}

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === activeIndex ? 'w-12 bg-white' : 'w-12 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex
                ? 'border-[#ff1a88]'
                : 'border-transparent hover:border-[#ff1a88]/50 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
