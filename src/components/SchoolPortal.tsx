import React, { useState } from 'react';
import {
  School,
  Product,
  ProductCategory,
  Message,
} from '../types';
import { SimulatorRow } from './SimulatorRow';
import { SchoolMessaging } from './SchoolMessaging';
import {
  ProposeDateModal,
  RequestSampleModal,
  ValidateGridModal,
} from './SchoolActionModals';
import { PrintableCatalog } from './PrintableCatalog';
import {
  Calendar,
  Package,
  CheckCircle2,
  Printer,
  Sparkles,
  TrendingUp,
  Sliders,
  Info,
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  Check,
} from 'lucide-react';

interface SchoolPortalProps {
  school: School;
  products: Product[];
  messages: Message[];
  onUpdateSchoolConfig: (school: School) => void;
  onSendMessage: (content: string, type?: Message['type'], metadata?: any) => void;
  onChangeSchool: () => void;
}

export const SchoolPortal: React.FC<SchoolPortalProps> = ({
  school,
  products,
  messages,
  onUpdateSchoolConfig,
  onSendMessage,
  onChangeSchool,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [participationRate, setParticipationRate] = useState<number>(80); // 80% default estimated buyers

  // Modals state
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const displayNotification = (text: string) => {
    setShowNotification(text);
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Filter products by category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  // Toggle enable/disable product for this school
  const handleToggleProduct = (productId: string) => {
    const existing = school.productConfigs[productId] || {
      productId,
      enabled: true,
      resalePrice: products.find((p) => p.id === productId)?.defaultResalePrice || 10,
    };

    const updatedConfigs = {
      ...school.productConfigs,
      [productId]: {
        ...existing,
        enabled: !existing.enabled,
      },
    };

    onUpdateSchoolConfig({
      ...school,
      productConfigs: updatedConfigs,
    });
  };

  // Update parent resale price
  const handleResalePriceChange = (productId: string, newPrice: number) => {
    const existing = school.productConfigs[productId] || {
      productId,
      enabled: true,
      resalePrice: newPrice,
    };

    const updatedConfigs = {
      ...school.productConfigs,
      [productId]: {
        ...existing,
        resalePrice: newPrice,
      },
    };

    onUpdateSchoolConfig({
      ...school,
      productConfigs: updatedConfigs,
    });
  };

  // Calculate active products count and average margin per buyer
  const activeProducts = products.filter(
    (p) => school.productConfigs[p.id]?.enabled ?? true
  );

  // Compute average net margin on popular packs
  const popularPacks = activeProducts.filter((p) => p.category === 'pochettes');
  const avgPackMargin = popularPacks.length > 0
    ? popularPacks.reduce((acc, p) => {
        const resale = school.productConfigs[p.id]?.resalePrice ?? p.defaultResalePrice;
        return acc + Math.max(0, resale - p.baseSchoolPrice);
      }, 0) / popularPacks.length
    : 8.00;

  // Estimated buyers
  const estimatedBuyers = Math.round((school.studentCount * participationRate) / 100);
  // Average purchase per buyer: 1 pack + 0.8 souvenir object
  const estimatedTotalCoopProfit = estimatedBuyers * (avgPackMargin + 2.50);

  // Handlers for Quick Action Buttons
  const handleDateProposal = (date: string, period: 'matin' | 'journee_entiere', note: string) => {
    const periodLabel = period === 'matin' ? 'la matinée' : 'la journée entière';
    const content = `Proposition de date pour notre prise de vue scolaire : le ${new Date(date).toLocaleDateString('fr-FR')} (${periodLabel}). ${note ? `Précisions : ${note}` : ''}`;
    
    onSendMessage(content, 'date_proposal', {
      dateProposed: date,
      period,
    });

    onUpdateSchoolConfig({
      ...school,
      preferredShootDate: date,
      shootPeriod: period,
      notes: note,
    });

    displayNotification('Proposition de date transmise à Laurent Serres');
  };

  const handleSampleRequest = (address: string, notes: string) => {
    const content = `Demande de mallette d'échantillons et objets de démonstration. Adresse de livraison : ${address}. ${notes ? `Note : ${notes}` : ''}`;
    
    onSendMessage(content, 'sample_request', {
      sampleAddress: address,
    });

    displayNotification("Demande d'échantillons envoyée avec succès");
  };

  const handleValidateGrid = () => {
    const now = new Date().toISOString().split('T')[0];
    const content = `Grille tarifaire validée par l'école. ${activeProducts.length} produits sélectionnés pour notre prise de vue. Gain prévisionnel coopérative : ~${Math.round(estimatedTotalCoopProfit)} €.`;
    
    onSendMessage(content, 'grid_validation', {
      totalActiveProducts: activeProducts.length,
      estimatedMarginTotal: Math.round(estimatedTotalCoopProfit),
    });

    onUpdateSchoolConfig({
      ...school,
      lastGridValidatedAt: now,
    });

    displayNotification('Grille tarifaire validée et transmise à Laurent Serres');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast notification */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* School identity banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded font-mono">
                {school.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {school.postalCode} {school.city} · Gard (30)
              </span>
              {school.lastGridValidatedAt && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Grille validée le {school.lastGridValidatedAt}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {school.name}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap pt-1">
              <span><strong>Direction :</strong> {school.directorName}</span>
              <span>·</span>
              <span><strong>Effectif :</strong> <span className="font-mono font-bold">{school.studentCount} élèves</span></span>
              <span>·</span>
              <span><strong>Courriel :</strong> {school.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setPrintModalOpen(true)}
              className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors bg-white hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimer la grille</span>
            </button>
            <button
              onClick={onChangeSchool}
              className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Changer d'école
            </button>
          </div>
        </div>

        {/* Quick 1-click action buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Actions rapides en 1 clic pour la direction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setDateModalOpen(true)}
              className="p-3 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  Proposer une date
                </span>
                <span className="text-[11px] text-slate-600">
                  {school.preferredShootDate
                    ? `Souhait : ${school.preferredShootDate}`
                    : 'Fixer la date de prise de vue'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setSampleModalOpen(true)}
              className="p-3 bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200/80 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  Demander des échantillons
                </span>
                <span className="text-[11px] text-slate-600">
                  Mallette de démonstration gratuite
                </span>
              </div>
            </button>

            <button
              onClick={() => setValidateModalOpen(true)}
              className="p-3 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  Envoyer la grille validée
                </span>
                <span className="text-[11px] text-slate-600">
                  {activeProducts.length} produits sélectionnés
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-600" />
              <span>Simulateur de Prix & Marge Scolaire</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ajustez vos prix de vente aux familles. Vos marges et gains pour la coopérative scolaire sont calculés en temps réel.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shrink-0 self-start">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setSelectedCategory('pochettes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'pochettes'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Formules complètes
            </button>
            <button
              onClick={() => setSelectedCategory('objets')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'objets'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Objets souvenirs
            </button>
            <button
              onClick={() => setSelectedCategory('tirages')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'tirages'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tirages seuls
            </button>
          </div>
        </div>

        {/* The single line table container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-12" title="Inclure ou exclure du bon de commande">
                    Actif
                  </th>
                  <th className="py-3 px-4">
                    Produit & Formule
                  </th>
                  <th className="py-3 px-4 text-center">
                    Prix École TTC
                  </th>
                  <th className="py-3 px-4 text-center">
                    Moyenne Constatée
                  </th>
                  <th className="py-3 px-4 text-center">
                    Prix Vente aux Parents
                  </th>
                  <th className="py-3 px-4 text-right">
                    Gain Net Coopérative
                  </th>
                  <th className="py-3 px-4 text-right">
                    Taux de Marge (%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const config = school.productConfigs[product.id];
                  const enabled = config ? config.enabled : true;
                  const resalePrice = config ? config.resalePrice : product.defaultResalePrice;

                  return (
                    <SimulatorRow
                      key={product.id}
                      product={product}
                      enabled={enabled}
                      resalePrice={resalePrice}
                      onToggleEnabled={handleToggleProduct}
                      onResalePriceChange={handleResalePriceChange}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer info bar */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Prix École TTC :</strong> Tarif facturé par Laurent Serres, fixe et verrouillé. Les prix de vente aux familles sont libres et déterminés par votre conseil d'école.
              </span>
            </div>
            <div className="font-mono text-slate-600 shrink-0">
              {activeProducts.length} / {products.length} références actives
            </div>
          </div>
        </div>
      </div>

      {/* Grid with Global Profit Projection & School Messaging */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Global Cooperative Gain Projection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Estimation Coopérative / OCCE</h3>
                  <p className="text-[11px] text-slate-500">Projection financière sur {school.studentCount} élèves</p>
                </div>
              </div>
            </div>

            {/* Big Projected Total */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Gain net estimé pour l'école
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-800 tabular-nums">
                ~ {Math.round(estimatedTotalCoopProfit).toLocaleString('fr-FR')} €
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                100% reversé à la coopérative de l'établissement
              </p>
            </div>

            {/* Slider participation rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Taux de participation des familles :</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {participationRate} % ({estimatedBuyers} commandes)
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={participationRate}
                onChange={(e) => setParticipationRate(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>40% (Prudent)</span>
                <span>80% (Moyenne Gard)</span>
                <span>100% (Maximum)</span>
              </div>
            </div>

            {/* Concrete project financing examples */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Ce que cette somme permet de financer :
              </span>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Sortie scolaire en car (Pont du Gard, Camargue, Cévennes)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Spectacle vivant ou intervenant musique / théâtre</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Matériel pédagogique, livres BCD ou jeux de cour de récréation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Laurent Serres engagement banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Autonomie et soutien à votre coopérative scolaire</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Les tarifs École TTC proposés par Laurent Serres sont fermes et garantis. Votre conseil d'école fixe librement le prix de vente aux familles afin de dégager la marge nécessaire au financement de vos projets pédagogiques et sorties scolaires.
            </p>
          </div>
        </div>

        {/* Right: Integrated Messaging */}
        <div className="lg:col-span-7">
          <SchoolMessaging
            school={school}
            messages={messages}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>

      {/* Modals */}
      <ProposeDateModal
        isOpen={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        school={school}
        onSubmit={handleDateProposal}
      />

      <RequestSampleModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        school={school}
        onSubmit={handleSampleRequest}
      />

      <ValidateGridModal
        isOpen={validateModalOpen}
        onClose={() => setValidateModalOpen(false)}
        school={school}
        products={products}
        activeProductsCount={activeProducts.length}
        totalEstimatedSchoolMargin={estimatedTotalCoopProfit}
        onConfirm={handleValidateGrid}
      />

      {printModalOpen && (
        <PrintableCatalog
          school={school}
          products={products}
          onClose={() => setPrintModalOpen(false)}
        />
      )}
    </div>
  );
};
