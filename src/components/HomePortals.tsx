import React, { useState } from 'react';
import { School, ProspectionCode } from '../types';
import { ASSETS } from '../constants/assets';
import {
  School as SchoolIcon,
  Compass,
  HelpCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Camera,
  MapPin,
  Lock,
  Heart,
  Clock,
  Layers,
  Award,
  ChevronRight,
  HelpCircle as HelpIcon,
} from 'lucide-react';

interface HomePortalsProps {
  schools: School[];
  prospectionCodes: ProspectionCode[];
  onSelectSchoolByCode: (code: string) => boolean;
  onOpenProspectPortal: (code?: string) => void;
  onOpenParentPortal: () => void;
  onOpenAdminModal: () => void;
}

export const HomePortals: React.FC<HomePortalsProps> = ({
  schools,
  prospectionCodes,
  onSelectSchoolByCode,
  onOpenProspectPortal,
  onOpenParentPortal,
  onOpenAdminModal,
}) => {
  const [enteredSchoolCode, setEnteredSchoolCode] = useState('');
  const [schoolError, setSchoolError] = useState('');

  const [enteredProspectCode, setEnteredProspectCode] = useState('');
  const [prospectError, setProspectError] = useState('');

  const [showTestHelper, setShowTestHelper] = useState(false);

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredSchoolCode.trim()) return;
    const success = onSelectSchoolByCode(enteredSchoolCode.trim());
    if (!success) {
      setSchoolError('Code école non reconnu. Chaque école partenaire possède un code unique fourni par Laurent Serres.');
    } else {
      setSchoolError('');
    }
  };

  const handleQuickSchoolClick = (code: string) => {
    setEnteredSchoolCode(code);
    onSelectSchoolByCode(code);
  };

  const handleProspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = enteredProspectCode.trim().toUpperCase();
    const found = prospectionCodes.find((c) => c.code.toUpperCase() === clean);
    if (found || clean === 'DECOUVERTE30' || clean === 'PROSPECT2026') {
      onOpenProspectPortal(clean || 'DECOUVERTE30');
    } else {
      setProspectError('Code de prospection invalide. Utilisez DECOUVERTE30 ou contactez Laurent Serres.');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Presentation Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            src={ASSETS.heroSchool}
            alt="Séance photo scolaire en extérieur"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold backdrop-blur-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Photographe Scolaire Professionnel · Gard & Occitanie</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Plateforme de Liaison & Simulateur Scolaire
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Espace dédié aux directions d'écoles pour modéliser leurs marges coopératives, personnaliser les formules proposées aux familles et échanger directement avec <strong>Laurent Serres</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Prise de vue professionnelle adaptée aux écoles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Transparence et conformité coopératives OCCE</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Prise de vue bienveillante et adaptée aux rythmes scolaires</span>
                </div>
              </div>
            </div>

            {/* Laurent Serres Real Portrait Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-slate-800/85 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-2xl max-w-xs w-full text-center space-y-4">
                <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden border-3 border-amber-500 shadow-lg">
                  <img
                    src={ASSETS.laurentPortrait}
                    alt="Laurent Serres, photographe scolaire"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg tracking-tight">Laurent Serres</h3>
                  <p className="text-xs text-amber-400 font-semibold">Photographe Scolaire Professionnel</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gard & Région Occitanie</span>
                  </p>
                </div>
                <div className="text-[11px] text-slate-300 pt-3 border-t border-slate-700/80 leading-relaxed">
                  Interlocuteur unique et direct pour les directions d'écoles, les équipes enseignantes et les coopératives scolaires.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PORTAL 1: ÉCOLE PARTENAIRE (SOUS CODE STRICT - 1 CODE AFFICHE UNE ÉCOLE) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg flex flex-col justify-between space-y-6 hover:border-amber-400/80 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <SchoolIcon className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Portail 1 · Espace Partenaire
                  </span>
                  <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                    Accès sous code
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  École Partenaire
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accès strictement protégé par votre code établissement unique : <strong>1 code affiche exclusivement votre école</strong>. Ajustez vos produits, simulez vos marges coopératives et communiquez en direct avec Laurent Serres.
                </p>
              </div>

              {/* Form with School Code */}
              <form onSubmit={handleSchoolSubmit} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Saisissez votre code d'accès école :
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={enteredSchoolCode}
                      onChange={(e) => {
                        setEnteredSchoolCode(e.target.value);
                        setSchoolError('');
                      }}
                      placeholder="Ex : OLIVIERS30"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 font-mono text-xs uppercase font-extrabold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {schoolError && (
                  <p className="text-[11px] font-semibold text-rose-600">{schoolError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Accéder à mon établissement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Discrete helper for tests (does not publicly expose the whole school list) */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTestHelper(!showTestHelper)}
                className="text-[11px] text-slate-500 hover:text-amber-700 flex items-center gap-1 font-medium transition-colors"
              >
                <HelpIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{showTestHelper ? 'Masquer l\'aide aux tests' : 'Aide démo : voir les codes écoles pilotes'}</span>
              </button>

              {showTestHelper && (
                <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 animate-in fade-in duration-150">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block">
                    Cliquez sur un code pour tester :
                  </span>
                  <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                    {schools.map((s) => (
                      <button
                        key={s.code}
                        type="button"
                        onClick={() => handleQuickSchoolClick(s.code)}
                        className="text-left px-2 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded text-[11px] font-mono font-bold text-amber-900 truncate"
                        title={s.name}
                      >
                        {s.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PORTAL 2: ÉCOLE PARTENAIRE POTENTIEL */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg flex flex-col justify-between space-y-6 hover:border-sky-400/80 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
                <Compass className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                    Portail 2 · Découverte
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    Code Prospection
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  École Partenaire Potentiel
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vous souhaitez tester le simulateur, comparer nos tarifs et découvrir l'ensemble de nos formules sans exposer publiquement nos tarifs aux parents ou concurrents.
                </p>
              </div>

              {/* Form with Prospect Code */}
              <form onSubmit={handleProspectSubmit} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Code de prospection fourni par Laurent Serres :
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={enteredProspectCode}
                      onChange={(e) => {
                        setEnteredProspectCode(e.target.value);
                        setProspectError('');
                      }}
                      placeholder="Ex : DECOUVERTE30"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 font-mono text-xs uppercase font-extrabold tracking-wider focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {prospectError && (
                  <p className="text-[11px] font-semibold text-rose-600">{prospectError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Tester le simulateur prospect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Demo Prospect Codes */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block">
                Codes de découverte pour tester :
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenProspectPortal('DECOUVERTE30')}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  DECOUVERTE30
                </button>
                <button
                  type="button"
                  onClick={() => onOpenProspectPortal('PROSPECT2026')}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  PROSPECT2026
                </button>
              </div>
            </div>
          </div>

          {/* PORTAL 3: PARENTS & SAV */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg flex flex-col justify-between space-y-6 hover:border-emerald-400/80 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <HelpCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Portail 3 · Familles
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Accès Libre Sans Code
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Espace Parents & SAV
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vous êtes parent d'un élève photographié par Laurent Serres ? Accédez immédiatement à notre formulaire d'assistance sans aucun code ni mot de passe.
                </p>
              </div>

              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>QR code ou mot de passe élève égaré</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Commande tardive ou oubliée à l'école</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Tirage photo abîmé (réimpression gratuite)</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={onOpenParentPortal}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>Accéder à l'espace assistance parents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                Traitement humain et bienveillant sous 24h ouvrées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STRATÉGIE DE COMMUNICATION & PROSPECTION : MA FAÇON DE TRAVAILLER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          {/* Header section with quote and photographer positioning */}
          <div className="border-b border-slate-100 pb-8 space-y-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
              Laurent Serres · Artisan Photographe Scolaire
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ma façon de travailler
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-3xl">
              « Je suis Laurent Serres, photographe scolaire professionnel. Mon engagement : offrir aux écoles et aux familles une prestation chaleureuse, respectueuse du temps scolaire et d'une qualité photographique irréprochable. »
            </p>
          </div>

          {/* Pillars of Laurent Serres' working method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    1. Respect absolu du temps scolaire et de l'équipe
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Une organisation fluide élaborée en amont avec la direction : adaptation stricte aux récréations, aux créneaux de sieste des maternelles et aux décharges des enseignants. Aucun cours perturbé.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    2. Transparence totale & soutien à la coopérative
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Des Prix École TTC fixes et garantis, une liberté totale laissée au conseil d'école pour déterminer ses prix aux familles, et 100% de la marge reversée pour financer les sorties scolaires et projets pédagogiques (respect de la circulaire Éducation Nationale et règles OCCE).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    3. Suivi personnalisé et interlocuteur unique
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Un contact direct avec l'artisan sans intermédiaire : organisation soignée de la prise de vue, livraison méthodique par classe et prise en charge rapide des demandes des parents.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Mockup photo showcasing real formulas and products */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src={ASSETS.packMockup}
                  alt="Présentation des formules de photographie scolaire"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-900">Formules Modulables</span>
                  <span className="text-[11px] text-slate-500">Choix libre des packs et objets proposés aux familles</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-900">Service Familles Dédié</span>
                  <span className="text-[11px] text-slate-500">Gestion directe des réimpressions et du suivi des commandes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discreet Admin Access Footer Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>
              Espace réservé au photographe (Laurent Serres) : gestion des prix de base et des codes écoles.
            </span>
          </div>

          <button
            onClick={onOpenAdminModal}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Accès Administrateur (Code 182420)</span>
          </button>
        </div>
      </section>
    </div>
  );
};
