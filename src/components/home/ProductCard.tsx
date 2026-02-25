import { useNavigate } from 'react-router-dom'
import { Product } from '../../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()

  return (
    <div className="group product-card flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span
              className={`text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-md ${
                product.badge === 'Bestseller'
                  ? 'bg-black/60'
                  : 'bg-[#ff1a88]/80'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6 flex flex-col flex-1">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-white/40 text-sm leading-relaxed">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#ff1a88] font-bold text-lg">{product.price}</span>
          <div className="flex gap-1">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="size-3 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
            Ver
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chat</span>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
