import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import TiltCard from './TiltCard';

const categoryConfig = {
  electric:   { label: 'Electrical',     accent: '#818cf8', glow: 'rgba(129,140,248,0.15)' },
  motorcycle: { label: 'Motorcycle',     accent: '#f43f5e', glow: 'rgba(244,63,94,0.15)'   },
  car:        { label: 'Automotive',     accent: '#22d3ee', glow: 'rgba(34,211,238,0.15)'  },
  cleaning:   { label: 'Cleaning',       accent: '#34d399', glow: 'rgba(52,211,153,0.15)'  },
  computer:   { label: 'Computer Repair',accent: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
  phone:      { label: 'Phone Repair',   accent: '#2dd4bf', glow: 'rgba(45,212,191,0.15)'  },
};

export default function ServiceCard({ service, index = 0 }) {
  const cfg = categoryConfig[service.category] || categoryConfig.car;

  return (
    <TiltCard
      className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
      intensity={8}
    >
      <Link
        to={`/services/${service.id}`}
        className="group block relative overflow-hidden rounded-2xl p-5 h-full border border-white/[0.06] transition-all duration-300"
        style={{ background: 'rgba(13,13,20,0.85)' }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${cfg.accent}35`;
          e.currentTarget.style.boxShadow   = `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${cfg.glow}`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.boxShadow   = 'none';
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${cfg.glow}, transparent 70%)`,
            transform: 'translate(30%, -30%)',
          }}
        />

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="badge text-[11px]"
            style={{
              background: `${cfg.accent}14`,
              color: cfg.accent,
              border: `1px solid ${cfg.accent}30`,
            }}
          >
            {cfg.label}
          </span>
          {service.avg_rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {Number(service.avg_rating).toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-100 group-hover:text-white mb-1.5 transition-colors line-clamp-1">
          {service.title}
        </h3>

        <p className="text-sm text-slate-500 group-hover:text-slate-400 line-clamp-2 flex-1 leading-relaxed transition-colors">
          {service.description}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: cfg.accent }}
            >
              {service.provider_name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-slate-400 font-medium">{service.provider_name}</span>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-slate-100">{formatPrice(service.price, service.currency)}</span>
            <span className="text-[11px] text-slate-600 ml-1">/ {service.duration_minutes}min</span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
