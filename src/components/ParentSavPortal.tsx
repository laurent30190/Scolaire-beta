import React, { useState } from 'react';
import { SavTicket } from '../types';
import {
  HelpCircle,
  QrCode,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  Search,
  FileQuestion,
  ChevronDown,
} from 'lucide-react';

interface ParentSavPortalProps {
  schools: { name: string; city: string }[];
  savTickets: SavTicket[];
  onSubmitSavTicket: (ticket: Omit<SavTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => string;
}

export const ParentSavPortal: React.FC<ParentSavPortalProps> = ({
  schools,
  savTickets,
  onSubmitSavTicket,
}) => {
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [childName, setChildName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [issueType, setIssueType] = useState<SavTicket['issueType']>('qr_lost');
  const [orderReference, setOrderReference] = useState('');
  const [description, setDescription] = useState('');

  const [submittedTicketNumber, setSubmittedTicketNumber] = useState<string | null>(null);

  // Ticket status lookup
  const [lookupTicketNumber, setLookupTicketNumber] = useState('');
  const [lookupResult, setLookupResult] = useState<SavTicket | null>(null);
  const [lookupError, setLookupError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketNum = onSubmitSavTicket({
      parentName,
      email,
      phone,
      schoolName,
      childName,
      classLevel,
      issueType,
      orderReference: orderReference || undefined,
      description,
    });

    setSubmittedTicketNumber(ticketNum);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupTicketNumber.trim().toUpperCase();
    const found = savTickets.find((t) => t.ticketNumber.toUpperCase() === clean);
    if (found) {
      setLookupResult(found);
      setLookupError('');
    } else {
      setLookupResult(null);
      setLookupError('Aucun ticket SAV trouvé avec ce numéro. Vérifiez votre référence.');
    }
  };

  const resetForm = () => {
    setSubmittedTicketNumber(null);
    setParentName('');
    setEmail('');
    setPhone('');
    setSchoolName('');
    setChildName('');
    setClassLevel('');
    setOrderReference('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Parent Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Espace Familles & Assistance Parents · Accès Direct Sans Code</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service Après-Vente & Relation Familles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Un mot d'identifiant égaré ? Un problème de commande ou un tirage corné dans le cartable ? Laurent Serres, photographe scolaire de vos enfants dans le Gard, vous accompagne directement pour trouver une solution immédiate.
          </p>
        </div>

        {/* 4 Quick assistance tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIssueType('qr_lost');
              setDescription("Bonjour, nous avons égaré le mot de passe / QR code pour commander les photos de notre enfant.");
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              issueType === 'qr_lost'
                ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <QrCode className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">QR Code / Mot Perdu</h4>
            <p className="text-[11px] text-slate-500 mt-1">Renvoi gratuit de vos identifiants sécurisés par email/SMS</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setIssueType('forgotten_order');
              setDescription("Bonjour, nous avons manqué la date limite de commande à l'école. Est-il possible de passer commande maintenant ?");
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              issueType === 'forgotten_order'
                ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Commande Oubliée</h4>
            <p className="text-[11px] text-slate-500 mt-1">Réouverture exceptionnelle de la galerie en ligne</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setIssueType('damaged_item');
              setDescription("Bonjour, notre tirage photo est arrivé avec un pli / défaut. Nous demandons une réimpression.");
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              issueType === 'damaged_item'
                ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-2">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Produit Abîmé</h4>
            <p className="text-[11px] text-slate-500 mt-1">Garantie réimpression gratuite sans condition</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setIssueType('download_issue');
              setDescription("Bonjour, je rencontre un problème pour télécharger les fichiers numériques HD de la pochette prestige.");
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              issueType === 'download_issue'
                ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Photo Numérique</h4>
            <p className="text-[11px] text-slate-500 mt-1">Aide au téléchargement du fichier HD</p>
          </button>
        </div>
      </div>

      {/* Form & Lookup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main SAV Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          {submittedTicketNumber ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Demande SAV enregistrée !</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Votre demande a été transmise directement à Laurent Serres. Vous recevrez une réponse sous 24h ouvrées.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Numéro de suivi de votre demande :
                </span>
                <span className="text-lg font-mono font-bold text-amber-700">
                  {submittedTicketNumber}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Déposer une autre demande
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Formulaire d'Assistance Parents</h3>
                  <p className="text-xs text-slate-500">Renseignez les détails pour un traitement rapide</p>
                </div>
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                  Réponse directe par l'artisan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Votre Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Ex : Céline Dupont"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Votre Courriel de contact *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="celine.dupont@email.fr"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    École fréquentée (dans le Gard) *
                  </label>
                  <input
                    type="text"
                    required
                    list="school-suggestions"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Ex : École les Oliviers (Garrigues)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <datalist id="school-suggestions">
                    {schools.map((s, idx) => (
                      <option key={idx} value={`${s.name} (${s.city})`} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom & Prénom de l'enfant *
                  </label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Ex : Théo Dupont"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Classe ou Niveau scolaire *
                  </label>
                  <input
                    type="text"
                    required
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    placeholder="Ex : CP, CE1, Petite Section..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type de problème rencontré *
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="qr_lost">QR Code / Identifiant ou mot de passe égaré</option>
                    <option value="forgotten_order">Commande tardive ou oubliée</option>
                    <option value="damaged_item">Produit abîmé ou problème de qualité</option>
                    <option value="download_issue">Problème de téléchargement fichier numérique</option>
                    <option value="other">Autre demande ou question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Référence de commande (si disponible)
                  </label>
                  <input
                    type="text"
                    value={orderReference}
                    onChange={(e) => setOrderReference(e.target.value)}
                    placeholder="Ex : CMD-30190-8831"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description détaillée de votre situation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Précisez votre demande, les éventuelles fratries concernées, etc."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  * Champs obligatoires pour identifier la fiche élève.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmettre ma demande SAV</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar: Ticket lookup & direct phone assistance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ticket lookup card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Search className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold">Suivre une demande SAV existante</h3>
            </div>

            <form onSubmit={handleLookup} className="space-y-2">
              <input
                type="text"
                value={lookupTicketNumber}
                onChange={(e) => {
                  setLookupTicketNumber(e.target.value);
                  setLookupError('');
                }}
                placeholder="Ex : SAV-2026-081"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Vérifier l'avancement
              </button>
            </form>

            {lookupError && (
              <p className="text-[11px] font-semibold text-rose-600">{lookupError}</p>
            )}

            {lookupResult && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 font-mono">{lookupResult.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      lookupResult.status === 'resolu'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lookupResult.status === 'en_cours'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {lookupResult.status === 'resolu'
                      ? 'Résolu'
                      : lookupResult.status === 'en_cours'
                      ? 'En cours'
                      : 'Nouveau'}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">Élève : <strong>{lookupResult.childName}</strong> ({lookupResult.classLevel})</p>
                {lookupResult.adminNotes && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-700 bg-white p-2 rounded">
                    <strong>Note de Laurent Serres :</strong> {lookupResult.adminNotes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Direct Laurent Serres */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-amber-400">Atelier & Contact Direct</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Laurent Serres est un artisan indépendant situé dans le Gard. En cas d'urgence sur une prise de vue ou une commande :
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <a
                href="mailto:lsphotopro30@gmail.com"
                className="flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">lsphotopro30@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Permanence téléphonique écoles & familles</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Délais de réponse moyens : moins de 24h ouvrées. Réimpressions offertes en cas d'accident de cartable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
