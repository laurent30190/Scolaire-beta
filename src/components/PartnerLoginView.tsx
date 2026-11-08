import React, { useState } from 'react';
import { KeyRound, ArrowRight, Lock, School as SchoolIcon, HelpCircle } from 'lucide-react';
import { School } from '../types';

interface PartnerLoginViewProps {
  schools: School[];
  onSelectSchoolByCode: (code: string) => boolean;
  onBackToHome: () => void;
}

export const PartnerLoginView: React.FC<PartnerLoginViewProps> = ({
  schools,
  onSelectSchoolByCode,
  onBackToHome,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const ok = onSelectSchoolByCode(code.trim());
    if (!ok) {
      setError('Code école non reconnu. Chaque école partenaire dispose d\'un code unique.');
    } else {
      setError('');
    }
  };

  const handleQuickCode = (c: string) => {
    setCode(c);
    onSelectSchoolByCode(c);
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 text-center space-y-6 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-xs">
          <SchoolIcon className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider font-mono">
            Accès Sécurisé
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Espace École Partenaire
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Saisissez votre code d'établissement pour accéder à votre grille personnalisée : <strong>un code affiche exclusivement votre école</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Code École Partenaire :
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="Ex : OLIVIERS30"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 font-mono text-sm uppercase font-extrabold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Accéder à l'établissement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Discrete test helper */}
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowHelper(!showHelper)}
            className="text-[11px] text-slate-500 hover:text-amber-700 flex items-center justify-center gap-1 font-medium mx-auto transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{showHelper ? 'Masquer l\'aide aux tests' : 'Aide pour tester : voir les codes'}</span>
          </button>

          {showHelper && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1.5 animate-in fade-in">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block">
                Cliquez pour tester une école :
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {schools.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => handleQuickCode(s.code)}
                    className="p-1.5 bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded text-left transition-colors"
                  >
                    <span className="block text-xs font-mono font-bold text-amber-900 truncate">
                      {s.code}
                    </span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onBackToHome}
          className="w-full py-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};
