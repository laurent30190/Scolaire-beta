import React, { useState } from 'react';
import { Calendar, Package, CheckCircle2, Printer, X, Send, Sparkles, MapPin, Clock } from 'lucide-react';
import { School, Product } from '../types';

interface ProposeDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  onSubmit: (date: string, period: 'matin' | 'journee_entiere', note: string) => void;
}

export const ProposeDateModal: React.FC<ProposeDateModalProps> = ({
  isOpen,
  onClose,
  school,
  onSubmit,
}) => {
  const [date, setDate] = useState(school.preferredShootDate || '2026-11-15');
  const [period, setPeriod] = useState<'matin' | 'journee_entiere'>(school.shootPeriod || 'matin');
  const [note, setNote] = useState(school.notes || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Proposer une date de prise de vue</h3>
              <p className="text-xs text-slate-500">{school.name} · {school.city}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(date, period, note);
            onClose();
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date souhaitée pour la prise de vue
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Période recommandée : Automne (rentrée) ou Printemps. Prise en compte des jours de décharge de direction.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Créneau prévu
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPeriod('matin')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  period === 'matin'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold">Matinée</span>
                  <span className="text-[11px] text-slate-500">Idéal maternelles & petites structures (&lt; 5 classes)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPeriod('journee_entiere')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  period === 'journee_entiere'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold">Journée entière</span>
                  <span className="text-[11px] text-slate-500">Élémentaires & fratries (&gt; 5 classes)</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Consignes particulières pour Laurent Serres (optionnel)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex : Photos en extérieur sous le préau, fratries pendant la récréation, jour de présence de l'enseignant de musique..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Transmettre la proposition à Laurent Serres</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RequestSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  onSubmit: (address: string, notes: string) => void;
}

export const RequestSampleModal: React.FC<RequestSampleModalProps> = ({
  isOpen,
  onClose,
  school,
  onSubmit,
}) => {
  const [address, setAddress] = useState(`${school.name}, ${school.postalCode} ${school.city}`);
  const [notes, setNotes] = useState('Pour présentation en conseil d\'école et réunion des maîtres.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Demander la mallette d'échantillons</h3>
              <p className="text-xs text-slate-500">Prêt gracieux sans aucun engagement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(address, notes);
            onClose();
          }}
          className="p-6 space-y-4"
        >
          <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-100 text-xs text-sky-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Contenu de la mallette d'échantillons :
            </p>
            <ul className="list-disc list-inside text-[11px] text-sky-800 space-y-0.5 ml-1">
              <li>Exemples de formules complètes et tirages (15x22.5 cm)</li>
              <li>Tirages photographiques haute définition</li>
              <li>Exemples d'objets : Magnet 10x15, Mug céramique, Porte-clés, Marque-pages</li>
              <li>Bon de commande type et explication du système sécurisé QR code</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse de livraison (École ou mairie)
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Précision ou date de conseil d'école (optionnel)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Réunion d'équipe le 12 du mois, besoin des échantillons avant..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirmer la demande d'échantillons</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ValidateGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  products: Product[];
  activeProductsCount: number;
  totalEstimatedSchoolMargin: number;
  onConfirm: () => void;
}

export const ValidateGridModal: React.FC<ValidateGridModalProps> = ({
  isOpen,
  onClose,
  school,
  products,
  activeProductsCount,
  totalEstimatedSchoolMargin,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Transmission de la grille validée</h3>
              <p className="text-xs text-slate-600">{school.name} · Code {school.code}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700">
            Vous vous apprêtez à notifier officiellement <strong>Laurent Serres</strong> de votre sélection de produits et de vos tarifs de vente aux parents.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Nombre de produits sélectionnés :</span>
              <span className="font-bold font-mono text-slate-900">{activeProductsCount} références</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Effectif de l'école :</span>
              <span className="font-bold font-mono text-slate-900">{school.studentCount} élèves</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-800">Gain estimé pour la coopérative scolaire :</span>
              <span className="font-bold font-mono text-emerald-700 text-sm">
                ~ {Math.round(totalEstimatedSchoolMargin)} € nets
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
            Un message de confirmation automatique sera consigné dans votre fil de discussion. Laurent Serres préparera les bons de commande personnalisés avec les tarifs que vous venez de fixer.
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Modifier encore
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider et envoyer la grille</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
