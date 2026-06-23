import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const categoryConfig = {
  electric:  { label: 'Electrical',     bg: 'bg-brand-50 text-brand-700 border-brand-200'    },
  motorcycle:{ label: 'Motorcycle',     bg: 'bg-rose-50 text-rose-700 border-rose-200'        },
  car:       { label: 'Automotive',     bg: 'bg-sky-50 text-sky-700 border-sky-200'           },
  cleaning:  { label: 'Cleaning',       bg: 'bg-emerald-50 text-emerald-700 border-emerald-200'},
  computer:  { label: 'Computer Repair',bg: 'bg-violet-50 text-violet-700 border-violet-200'  },
  phone:     { label: 'Phone Repair',   bg: 'bg-teal-50 text-teal-700 border-teal-200'        },
};

export default function ServiceCard({ service, index = 0 }) {
  const cfg = categoryConfig[service.category] || categoryConfig.car;

  return (
    <Link
      to={`/services/${service.id}`}
      className="group card-hover p-5 flex flex-col animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`badge border ${cfg.bg}`}>
          {cfg.label}
        </span>
        {service.avg_rating > 0 && (
          <span className="flex items-center gap-1 text-sm text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
            <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {service.avg_rating}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
        {service.title}
      </h3>

      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 flex-1 leading-relaxed">
        {service.description}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {service.provider_name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {service.provider_name}
          </span>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-gray-900">{formatPrice(service.price, service.currency)}</span>
          <span className="text-xs text-gray-400 ml-1">/ {service.duration_minutes}min</span>
        </div>
      </div>
    </Link>
  );
}
