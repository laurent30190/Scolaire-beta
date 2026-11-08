import React, { useState } from 'react';
import { Product, ProspectionCode } from '../types';
import { SimulatorRow } from './SimulatorRow';
import { ASSETS } from '../constants/assets';
import {
  Compass,
  KeyRound,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Package,
  Send,
  Phone,
  Mail,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface ProspectPortalProps {
  products: Product[];
  prospectionCodes: ProspectionCode[];
  onProspectCodeUsed: (code: string) => void;
  onRequestContact: (contactData: {
    schoolName: string;
    city: string;
    contactName: string;
    email: string;
    phone: string;
    studentCount: number;
    message: string;
  }) => void;
}

export const ProspectPortal: React.FC<ProspectPortalProps> = ({
  products,
  prospectionCodes,
  onProspectCodeUsed,
  onRequestContact,
}) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedCodeLabel, setUnlockedCodeLabel] = useState('');

  // Simulator state in prospect mode
  const [prospectStudentCount, setProspectStudentCount] = useState<number>(150);
  const [prospectPrices, setProspectPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.id] = p.defaultResalePrice;
    });
    return map;
  });

  const [activeProducts, setActiveProducts] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    products.forEach((p) => {
      map[p.id] = true;
    });
    return map;
  });

  // Contact form state
  const [contactSchool, setContactSchool] = useState('');
  const [contactCity, setContactCity] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('Bonjour Laurent, nous souhaiterions recevoir votre mallette d\'échantillons et étudier un passage pour notre école.');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleUnlock = (codeToTry: string) => {
    const clean = codeToTry.trim().toUpperCase();
    const found = prospectionCodes.find((c) => c.code.toUpperCase() === clean);
    if (found) {
      setIsUnlocked(true);
      setUnlockedCodeLabel(found.label);
      setErrorMsg('');
      onProspectCodeUsed(found.code);
    } else {
      setErrorMsg('Code de prospection invalide. Vérifiez le code fourni par Laurent Serres.');
    }
  };

  const handleToggleProduct = (productId: string) => {
    setActiveProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleResalePriceChange = (productId: string, newPrice: number) => {
    setProspectPrices((prev) => ({
      ...prev,
      [productId]: newPrice,
    }));
  };

  // Profit calculation for prospect simulation
  const enabledProducts = products.filter((p) => activeProducts[p.id]);
  const popularPacks = enabledProducts.filter((p) => p.category === 'pochettes');
  const avgPackMargin = popularPacks.length > 0
    ? popularPacks.reduce((acc, p) => {
        const resale = prospectPrices[p.id] || p.defaultResalePrice;
        return acc + Math.max(0, resale - p.baseSchoolPrice);
      }, 0) / popularPacks.length
    : 8.00;

  const estimatedBuyers = Math.round(prospectStudentCount * 0.8);
  const estimatedProfit = estimatedBuyers * (avgPackMargin + 2.50);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestContact({
      schoolName: contactSchool,
      city: contactCity,
      contactName,
      email: contactEmail,
      phone: contactPhone,
      studentCount: prospectStudentCount,
      message: contactMsg,
    });
    setContactSubmitted(true);
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-xs">
            <Compass className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Espace Découverte & Simulation Prospect
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cet espace permet aux directrices et directeurs d'écoles du Gard de consulter nos grilles tarifaires et de tester le simulateur de marge en toute confidentialité, sans exposer nos tarifs aux concurrents ou aux familles.
            </p>
          </div>

          {/* Form to enter prospect code */}
          <div className="max-w-md mx-auto pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlock(enteredCode);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Entrez votre code (ex: DECOUVERTE30)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-semibold"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Déverrouiller l'accès simulateur</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick demo codes */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-left">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Codes de prospection actifs pour tester :
              </span>
              <div className="flex flex-wrap gap-2">
                {prospectionCodes.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleUnlock(c.code)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 transition-all cursor-pointer"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 max-w-lg mx-auto text-xs text-slate-500">
            Vous n'avez pas encore de code ? Contactez directement Laurent Serres au <strong className="text-slate-800">06 00 00 00 00</strong> ou par mail à <strong className="text-slate-800">lsphotopro30@gmail.com</strong>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Prospect Unlocked */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accès Prospect Déverrouillé ({unlockedCodeLabel})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Simulateur Découverte pour Nouvelles Écoles
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Testez librement les marges que pourrait générer votre coopérative scolaire avec un artisan photographe local basé dans le Gard, sans intermédiaire industriel.
            </p>
          </div>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-4 py-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white rounded-xl text-xs font-medium self-start md:self-center transition-colors cursor-pointer"
          >
            Quitter l'espace prospect
          </button>
        </div>
      </div>

      {/* Simulator Interactive Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Paramétrez votre établissement</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Nombre d'élèves de votre école :</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {prospectStudentCount} élèves
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="400"
              step="5"
              value={prospectStudentCount}
              onChange={(e) => setProspectStudentCount(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>30 (Petite école)</span>
              <span>150 (Moyenne)</span>
              <span>400 (Groupe scolaire)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Gain prévisionnel coopérative
            </span>
            <div className="text-3xl font-black font-mono text-emerald-800 tabular-nums">
              ~ {Math.round(estimatedProfit).toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block">
              Pour environ {estimatedBuyers} commandes familiales
            </span>
          </div>

          <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aucun frais de déplacement dans le Gard</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prêt d'une mallette d'échantillons offerte</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paiement par chèque coopérative OCCE à 30 jours</span>
            </div>
          </div>
        </div>

        {/* Mockup presentation card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <img
            src={ASSETS.packMockup}
            alt="Échantillons et pochettes Laurent Serres"
            referrerPolicy="no-referrer"
            className="w-full sm:w-1/2 h-52 object-cover rounded-xl shadow-xs border border-slate-100"
          />
          <div className="space-y-3 sm:w-1/2">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono uppercase tracking-wide">
              Prestation Professionnelle
            </span>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              Des formules complètes adaptées aux attentes des familles
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tirages individuels, photos de classe et objets souvenirs personnalisés. Une présentation soignée livrée directement à votre école, prête à être distribuée.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Table for Prospect */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Grille Complète des Tarifs & Marges
        </h3>
        <p className="text-xs text-slate-500">
          Vous pouvez modifier librement la colonne « Prix Vente aux Parents » pour voir l'impact immédiat sur la marge de votre école.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-12">Actif</th>
                  <th className="py-3 px-4">Produit & Formule</th>
                  <th className="py-3 px-4 text-center">Prix École TTC</th>
                  <th className="py-3 px-4 text-center">Moyenne Constatée</th>
                  <th className="py-3 px-4 text-center">Prix Vente aux Parents</th>
                  <th className="py-3 px-4 text-right">Gain Net Coopérative</th>
                  <th className="py-3 px-4 text-right">Taux de Marge (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const enabled = activeProducts[product.id] ?? true;
                  const resale = prospectPrices[product.id] ?? product.defaultResalePrice;

                  return (
                    <SimulatorRow
                      key={product.id}
                      product={product}
                      enabled={enabled}
                      resalePrice={resale}
                      onToggleEnabled={handleToggleProduct}
                      onResalePriceChange={handleResalePriceChange}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contact & Sample Request Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs max-w-3xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Recevez votre mallette d'échantillons gratuite
          </h3>
          <p className="text-xs text-slate-600">
            Aucun engagement. Nous déposons directement à votre école une mallette avec l'ensemble des formules et objets de démonstration.
          </p>
        </div>

        {contactSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-base">Demande transmise avec succès !</h4>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Laurent Serres prendra contact avec vous sous 24h ouvrées pour organiser la dépose de la mallette d'échantillons ou convenir d'un rendez-vous.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de votre école *
                </label>
                <input
                  type="text"
                  required
                  value={contactSchool}
                  onChange={(e) => setContactSchool(e.target.value)}
                  placeholder="Ex : École Primaire Jean Moulin"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commune (dans le Gard) *
                </label>
                <input
                  type="text"
                  required
                  value={contactCity}
                  onChange={(e) => setContactCity(e.target.value)}
                  placeholder="Ex : Alès, Nîmes, Uzès..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom & Fonction du contact *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex : M. Bernard (Directeur)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone direct *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ex : 04 66 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Courriel académique ou professionnel *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="ce.030xxxx@ac-montpellier.fr"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message ou période envisagée
                </label>
                <textarea
                  rows={2}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer la demande d'échantillons gratuite</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
