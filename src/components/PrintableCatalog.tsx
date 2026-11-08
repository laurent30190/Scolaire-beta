import React from 'react';
import { School, Product } from '../types';
import { Printer, X } from 'lucide-react';

interface PrintableCatalogProps {
  school: School;
  products: Product[];
  onClose: () => void;
}

export const PrintableCatalog: React.FC<PrintableCatalogProps> = ({
  school,
  products,
  onClose,
}) => {
  const activeProducts = products.filter(
    (p) => school.productConfigs[p.id]?.enabled ?? true
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 p-4 sm:p-6 backdrop-blur-xs flex justify-center">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl border border-slate-200 my-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-6 no-print">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Grille tarifaire imprimable</h3>
            <p className="text-xs text-slate-500">Document officiel pour le Conseil d'École et la Coopérative OCCE</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le document</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Sheet Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Laurent Serres · Photographie Scolaire
              </h1>
              <p className="text-xs text-slate-600">Photographe Professionnel · Tél : 06 00 00 00 00 · lsphotopro30@gmail.com</p>
              <p className="text-xs text-slate-500 mt-1">Conformité coopératives scolaires OCCE & Éducation Nationale</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-slate-100 font-mono text-xs px-2.5 py-1 rounded font-bold text-slate-800">
                Code École : {school.code}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Année scolaire 2026 / 2027</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500">Établissement : </span>
              <span className="font-bold text-slate-900">{school.name}</span> ({school.city})
            </div>
            <div>
              <span className="text-slate-500">Effectif déclaré : </span>
              <span className="font-bold text-slate-900 font-mono">{school.studentCount} élèves</span>
            </div>
          </div>
        </div>

        {/* Table of selected products */}
        <table className="w-full text-left border-collapse text-xs mb-6">
          <thead>
            <tr className="border-b-2 border-slate-300 bg-slate-50 text-slate-700 font-semibold">
              <th className="py-2.5 px-3">Produit / Formule</th>
              <th className="py-2.5 px-3">Format</th>
              <th className="py-2.5 px-3 text-center">Prix École TTC</th>
              <th className="py-2.5 px-3 text-center">Prix Vente Parents</th>
              <th className="py-2.5 px-3 text-right">Marge Coopérative</th>
              <th className="py-2.5 px-3 text-right">% Marge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {activeProducts.map((p) => {
              const config = school.productConfigs[p.id];
              const resale = config?.resalePrice || p.defaultResalePrice;
              const net = resale - p.baseSchoolPrice;
              const pct = (net / resale) * 100;
              return (
                <tr key={p.id}>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <p className="text-[10px] text-slate-500">{p.description}</p>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono">
                    {p.dimensions || 'Standard'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-700">
                    {p.baseSchoolPrice.toFixed(2)} €
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 bg-amber-50/50">
                    {resale.toFixed(2)} €
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                    +{net.toFixed(2)} €
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-700">
                    {pct.toFixed(1)} %
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer & signatures */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
          <div className="p-4 border border-dashed border-slate-300 rounded-xl h-28 flex flex-col justify-between">
            <span className="font-semibold text-slate-700">Pour l'établissement & la Coopérative Scolaire :</span>
            <span className="text-[10px] text-slate-400">Date et signature :</span>
          </div>
          <div className="p-4 border border-dashed border-slate-300 rounded-xl h-28 flex flex-col justify-between">
            <span className="font-semibold text-slate-700">Pour le photographe :</span>
            <span className="text-slate-900 font-bold">Laurent Serres</span>
            <span className="text-[10px] text-slate-400">Tarifs certifiés conformes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
