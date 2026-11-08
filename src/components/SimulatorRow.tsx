import React from 'react';
import { Lock, Plus, Minus, Info } from 'lucide-react';
import { Product } from '../types';

interface SimulatorRowProps {
  product: Product;
  enabled: boolean;
  resalePrice: number;
  onToggleEnabled: (productId: string) => void;
  onResalePriceChange: (productId: string, newPrice: number) => void;
  isReadOnly?: boolean;
}

export const SimulatorRow: React.FC<SimulatorRowProps> = ({
  product,
  enabled,
  resalePrice,
  onToggleEnabled,
  onResalePriceChange,
  isReadOnly = false,
}) => {
  const basePrice = product.baseSchoolPrice;
  const netMarginEuro = Math.max(0, resalePrice - basePrice);
  const marginPercentage = resalePrice > 0 ? (netMarginEuro / resalePrice) * 100 : 0;

  const handleStepPrice = (delta: number) => {
    if (isReadOnly) return;
    const current = Number(resalePrice) || product.defaultResalePrice;
    const updated = Math.max(basePrice, Math.round((current + delta) * 10) / 10);
    onResalePriceChange(product.id, updated);
  };

  const handleDirectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const val = parseFloat(e.target.value.replace(',', '.'));
    if (!isNaN(val)) {
      onResalePriceChange(product.id, Math.max(0, val));
    } else if (e.target.value === '') {
      onResalePriceChange(product.id, 0);
    }
  };

  return (
    <tr
      className={`transition-colors border-b border-slate-200/80 ${
        enabled
          ? 'bg-white hover:bg-amber-50/20'
          : 'bg-slate-50/70 opacity-60 hover:opacity-80'
      }`}
    >
      {/* 1. Toggle Activé / Proposé */}
      <td className="py-3 px-3 text-center w-12 shrink-0">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => !isReadOnly && onToggleEnabled(product.id)}
            disabled={isReadOnly}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 transition cursor-pointer disabled:cursor-not-allowed"
          />
        </label>
      </td>

      {/* 2. Colonne Produit & Formule */}
      <td className="py-3 px-4 min-w-[240px] max-w-[340px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${enabled ? 'text-slate-900' : 'text-slate-500'}`}>
              {product.name}
            </span>
            {product.highlight && (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                Populaire
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {product.dimensions && <span className="font-mono text-slate-600">{product.dimensions} · </span>}
            {product.description}
          </div>
        </div>
      </td>

      {/* 3. Prix École TTC (Verrouillé/fixe pour le directeur) */}
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 text-slate-700 font-mono text-sm font-semibold"
          title="Prix École TTC garanti et verrouillé par Laurent Serres"
        >
          <Lock className="w-3 h-3 text-slate-400" />
          <span className="tabular-nums">{basePrice.toFixed(2)} €</span>
        </div>
      </td>

      {/* 4. Prix moyen constaté (Indicateur indicatif repère) */}
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <div className="text-xs text-slate-500 font-mono flex items-center justify-center gap-1">
          <span className="tabular-nums font-medium">{product.averageMarketPrice.toFixed(2)} €</span>
          <span className="text-[10px] text-slate-400" title="Moyenne constatée dans les coopératives du Gard">TTC</span>
        </div>
      </td>

      {/* 5. Saisie interactive : Prix de vente aux parents */}
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
          <button
            type="button"
            onClick={() => handleStepPrice(-0.5)}
            disabled={isReadOnly || !enabled || resalePrice <= basePrice}
            className="w-7 h-7 rounded bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center shadow-xs text-xs font-bold transition-colors cursor-pointer"
            title="Diminuer de 0,50 €"
          >
            <Minus className="w-3 h-3" />
          </button>

          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="decimal"
              value={resalePrice > 0 ? resalePrice.toFixed(2) : ''}
              onChange={handleDirectInputChange}
              disabled={isReadOnly || !enabled}
              className="w-16 text-center text-sm font-bold font-mono text-slate-900 bg-transparent focus:outline-none tabular-nums"
              placeholder="0.00"
            />
            <span className="text-xs font-semibold text-slate-500 pr-1">€</span>
          </div>

          <button
            type="button"
            onClick={() => handleStepPrice(0.5)}
            disabled={isReadOnly || !enabled}
            className="w-7 h-7 rounded bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center shadow-xs text-xs font-bold transition-colors cursor-pointer"
            title="Augmenter de 0,50 €"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </td>

      {/* 6. Gain Net unitaire en € pour la coopérative scolaire */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        {enabled ? (
          <div className="inline-flex flex-col items-end">
            <span
              className={`text-sm font-bold font-mono tabular-nums ${
                netMarginEuro > 0 ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              +{netMarginEuro.toFixed(2)} €
            </span>
            <span className="text-[10px] text-slate-400">net / vente</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Désactivé</span>
        )}
      </td>

      {/* 7. Pourcentage de Marge (%) avec indicateur */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        {enabled ? (
          <div className="inline-flex items-center gap-1.5 justify-end">
            <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  marginPercentage >= 45
                    ? 'bg-emerald-500'
                    : marginPercentage >= 25
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, marginPercentage))}%` }}
              />
            </div>
            <span
              className={`text-sm font-semibold font-mono tabular-nums ${
                marginPercentage >= 45
                  ? 'text-emerald-700'
                  : marginPercentage >= 25
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {marginPercentage.toFixed(1)} %
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
    </tr>
  );
};
