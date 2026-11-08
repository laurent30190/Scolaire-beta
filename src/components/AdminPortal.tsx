import React, { useState } from 'react';
import {
  Product,
  School,
  Message,
  SavTicket,
  ProspectionCode,
  ProductCategory,
} from '../types';
import {
  ShieldCheck,
  Tag,
  Building2,
  MessageSquare,
  LifeBuoy,
  Key,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Send,
  ExternalLink,
  Edit,
  X,
  Phone,
  Mail,
  RefreshCw,
} from 'lucide-react';

interface AdminPortalProps {
  products: Product[];
  schools: School[];
  messages: Message[];
  savTickets: SavTicket[];
  prospectionCodes: ProspectionCode[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateSchools: (schools: School[]) => void;
  onSendMessageFromAdmin: (schoolId: string, content: string) => void;
  onUpdateSavTicket: (ticketId: string, status: SavTicket['status'], adminNotes?: string) => void;
  onAddProspectionCode: (code: string, label: string) => void;
  onDeleteProspectionCode: (code: string) => void;
  onSelectSchoolToView: (school: School) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  schools,
  messages,
  savTickets,
  prospectionCodes,
  onUpdateProducts,
  onUpdateSchools,
  onSendMessageFromAdmin,
  onUpdateSavTicket,
  onAddProspectionCode,
  onDeleteProspectionCode,
  onSelectSchoolToView,
}) => {
  const [activeTab, setActiveTab] = useState<'tarifs' | 'ecoles' | 'messages' | 'sav' | 'prospects'>('tarifs');

  // Tarifs editing state
  const [editingProducts, setEditingProducts] = useState<Product[]>(products);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // New product modal
  const [newProductModal, setNewProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('pochettes');
  const [newProdDimensions, setNewProdDimensions] = useState('');
  const [newProdRatio, setNewProdRatio] = useState<'3:2' | 'standard' | 'objet'>('standard');
  const [newProdBasePrice, setNewProdBasePrice] = useState(7.00);
  const [newProdMarketPrice, setNewProdMarketPrice] = useState(15.00);
  const [newProdResalePrice, setNewProdResalePrice] = useState(14.00);
  const [newProdDesc, setNewProdDesc] = useState('');

  // New school modal
  const [newSchoolModal, setNewSchoolModal] = useState(false);
  const [newSchName, setNewSchName] = useState('');
  const [newSchCity, setNewSchCity] = useState('');
  const [newSchPostal, setNewSchPostal] = useState('30');
  const [newSchCode, setNewSchCode] = useState('');
  const [newSchStudents, setNewSchStudents] = useState(120);
  const [newSchDirector, setNewSchDirector] = useState('');
  const [newSchEmail, setNewSchEmail] = useState('');
  const [newSchPhone, setNewSchPhone] = useState('');

  // Admin reply in messaging
  const [selectedSchoolForMessage, setSelectedSchoolForMessage] = useState<string>(schools[0]?.id || '');
  const [adminReplyText, setAdminReplyText] = useState('');

  // New prospect code state
  const [newCodeVal, setNewCodeVal] = useState('');
  const [newCodeLabel, setNewCodeLabel] = useState('');

  // Handle price edits in memory
  const handleProductBasePriceChange = (id: string, newBase: number) => {
    setEditingProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, baseSchoolPrice: newBase } : p))
    );
  };

  const handleProductMarketPriceChange = (id: string, newMarket: number) => {
    setEditingProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, averageMarketPrice: newMarket } : p))
    );
  };

  const handleSaveAllProducts = () => {
    onUpdateProducts(editingProducts);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `prod-${Date.now()}`;
    const newProd: Product = {
      id,
      name: newProdName,
      category: newProdCategory,
      dimensions: newProdDimensions,
      ratio: newProdRatio,
      description: newProdDesc,
      baseSchoolPrice: newProdBasePrice,
      averageMarketPrice: newProdMarketPrice,
      defaultResalePrice: newProdResalePrice,
    };
    const updated = [...editingProducts, newProd];
    setEditingProducts(updated);
    onUpdateProducts(updated);
    setNewProductModal(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Confirmer la suppression de ce produit ?')) {
      const updated = editingProducts.filter((p) => p.id !== productId);
      setEditingProducts(updated);
      onUpdateProducts(updated);
    }
  };

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newSchCode.trim().toUpperCase();
    if (!cleanCode) return;

    // Build default configs
    const configs: Record<string, any> = {};
    products.forEach((p) => {
      configs[p.id] = {
        productId: p.id,
        enabled: true,
        resalePrice: p.defaultResalePrice,
      };
    });

    const newSchool: School = {
      id: `school-${Date.now()}`,
      code: cleanCode,
      name: newSchName,
      city: newSchCity,
      postalCode: newSchPostal,
      type: 'elementaire',
      studentCount: newSchStudents,
      directorName: newSchDirector,
      email: newSchEmail,
      phone: newSchPhone,
      status: 'active',
      productConfigs: configs,
    };

    const updated = [...schools, newSchool];
    onUpdateSchools(updated);
    setNewSchoolModal(false);
    setNewSchName('');
    setNewSchCode('');
    setNewSchCity('');
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedSchoolForMessage) return;
    onSendMessageFromAdmin(selectedSchoolForMessage, adminReplyText.trim());
    setAdminReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Administrateur · Laurent Serres</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de Bord & Pilotage Photographie
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Gérez les tarifs de base verrouillés (Prix École TTC), suivez vos 8 écoles partenaires dans le Gard, répondez aux directeurs et traitez les demandes SAV des familles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Code Admin Actif : 182420
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('tarifs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'tarifs'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Prix École TTC de Base ({editingProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ecoles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'ecoles'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Écoles Partenaires & Codes ({schools.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messages Directeurs ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sav')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'sav'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Demandes SAV Parents ({savTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prospects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'prospects'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Codes Prospection ({prospectionCodes.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRIX ÉCOLE TTC DE BASE */}
      {activeTab === 'tarifs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Gestion des Prix École TTC de Base
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ces tarifs représentent votre prix artisan facturé aux coopératives scolaires. Ils sont strictement verrouillés en lecture seule pour les directeurs d'écoles.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNewProductModal(true)}
                className="px-3.5 py-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Nouveau Produit</span>
              </button>

              <button
                onClick={handleSaveAllProducts}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les tarifs</span>
              </button>
            </div>
          </div>

          {saveSuccessNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tous les Prix École TTC de base ont été enregistrés avec succès.</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Produit & Ratio</th>
                    <th className="py-3 px-3">Catégorie</th>
                    <th className="py-3 px-4 text-center">Prix École TTC (Laurent Serres)</th>
                    <th className="py-3 px-4 text-center">Prix Moyen Constaté</th>
                    <th className="py-3 px-4 text-center">Prix Conseillé Parents</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {editingProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{prod.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">{prod.description}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize">
                          {prod.category}
                        </span>
                      </td>

                      {/* Editable Base School Price */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50/60 p-1 rounded-lg border border-amber-300">
                          <input
                            type="number"
                            step="0.10"
                            min="0"
                            value={prod.baseSchoolPrice}
                            onChange={(e) =>
                              handleProductBasePriceChange(prod.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 text-center text-xs font-bold font-mono text-amber-950 bg-transparent focus:outline-none"
                          />
                          <span className="text-xs font-bold text-amber-800 pr-1">€</span>
                        </div>
                      </td>

                      {/* Editable Market Average */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                          <input
                            type="number"
                            step="0.50"
                            min="0"
                            value={prod.averageMarketPrice}
                            onChange={(e) =>
                              handleProductMarketPriceChange(prod.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-14 text-center text-xs font-mono text-slate-700 bg-transparent focus:outline-none"
                          />
                          <span className="text-xs text-slate-500 pr-1">€</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {prod.defaultResalePrice.toFixed(2)} €
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer ce produit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ÉCOLES PARTENAIRES & CODES D'ACCÈS */}
      {activeTab === 'ecoles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Écoles Partenaires & Codes d'Accès
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprend les 8 écoles pilotes du Gard. Chaque école possède un code unique qui filtre strictement son accès.
              </p>
            </div>

            <button
              onClick={() => setNewSchoolModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une École Partenaire</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {schools.map((school) => {
              const activeCount = Object.values(school.productConfigs).filter((c) => c.enabled).length;
              return (
                <div
                  key={school.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {school.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {school.studentCount} élèves
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                      {school.name}
                    </h4>

                    <p className="text-xs text-slate-500">
                      {school.postalCode} {school.city}
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                      <div>Dir : <strong>{school.directorName}</strong></div>
                      <div>Tél : {school.phone}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {activeCount} produits actifs
                    </span>
                    <button
                      onClick={() => onSelectSchoolToView(school)}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Voir simulateur</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MESSAGERIE & DIRECTEURS */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Message list */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Tous les Échanges avec les Directeurs</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {messages.length} messages
              </span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all ${
                    m.sender === 'photographer'
                      ? 'bg-slate-50 border-slate-200 ml-6'
                      : 'bg-white border-slate-200 mr-6 shadow-2xs hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {m.authorName}
                      </span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                        {m.schoolCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </p>

                  {m.type === 'grid_validation' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Grille validée ({m.metadata?.totalActiveProducts} articles)</span>
                    </div>
                  )}
                  {m.type === 'date_proposal' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-amber-700 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Date proposée : {m.metadata?.dateProposed} ({m.metadata?.period})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Reply Box */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-600" />
              <span>Répondre à une École</span>
            </h3>

            <form onSubmit={handleSendAdminReply} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sélectionner l'école destinataire
                </label>
                <select
                  value={selectedSchoolForMessage}
                  onChange={(e) => setSelectedSchoolForMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) - {s.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Votre message (en tant que Laurent Serres)
                </label>
                <textarea
                  rows={5}
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="Bonjour, j'ai bien noté votre demande. Je vous confirme..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!adminReplyText.trim()}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer la réponse au directeur</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: DEMANDES SAV PARENTS */}
      {activeTab === 'sav' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Gestion des Demandes SAV des Parents
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Retrouvez les demandes d'identifiants perdus, les réimpressions de tirages abîmés et les commandes tardives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ticket.status === 'resolu'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'en_cours'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ticket.status === 'resolu'
                        ? 'Résolu'
                        : ticket.status === 'en_cours'
                        ? 'En cours'
                        : 'Nouveau'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">
                    {ticket.parentName}
                  </h4>

                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div>Élève : <strong className="text-slate-800">{ticket.childName}</strong> ({ticket.classLevel})</div>
                    <div>École : {ticket.schoolName}</div>
                    <div className="font-mono">{ticket.email} · {ticket.phone}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      Motif : {ticket.issueType}
                    </span>
                    {ticket.description}
                  </div>

                  {ticket.adminNotes && (
                    <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/70">
                      <strong>Note interne :</strong> {ticket.adminNotes}
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {ticket.status !== 'resolu' && (
                      <button
                        onClick={() => {
                          const note = prompt('Ajouter une note de résolution :', 'Traité et tirage remis au directeur.');
                          if (note !== null) {
                            onUpdateSavTicket(ticket.id, 'resolu', note);
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Marquer Résolu
                      </button>
                    )}
                    {ticket.status === 'nouveau' && (
                      <button
                        onClick={() => onUpdateSavTicket(ticket.id, 'en_cours', 'Prise en charge au laboratoire.')}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        En cours
                      </button>
                    )}
                  </div>

                  <a
                    href={`mailto:${ticket.email}?subject=Photographie Scolaire - ${ticket.ticketNumber}`}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    title="Envoyer un email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CODES DE PROSPECTION */}
      {activeTab === 'prospects' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Codes de Prospection & Découverte
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ces codes permettent aux directeurs non encore partenaires d'accéder au simulateur sans dévoiler les Prix École TTC publiquement.
              </p>
            </div>
          </div>

          {/* Create new code */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Créer un Nouveau Code de Prospection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newCodeVal}
                onChange={(e) => setNewCodeVal(e.target.value.toUpperCase())}
                placeholder="Ex : NIMES2026"
                className="px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-xs uppercase font-bold focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                value={newCodeLabel}
                onChange={(e) => setNewCodeLabel(e.target.value)}
                placeholder="Description (ex: Invitation Salon Écoles)"
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCodeVal.trim()) {
                    onAddProspectionCode(newCodeVal.trim(), newCodeLabel.trim() || 'Code de prospection');
                    setNewCodeVal('');
                    setNewCodeLabel('');
                  }
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Générer le code
              </button>
            </div>
          </div>

          {/* List of prospect codes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Libellé</th>
                  <th className="py-3 px-4 text-center">Nombre d'utilisations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prospectionCodes.map((code) => (
                  <tr key={code.code} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {code.code}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {code.label}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                      {code.usesCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteProspectionCode(code.code)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Supprimer ce code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UN PRODUIT */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Ajouter un Nouveau Produit</h3>
              <button onClick={() => setNewProductModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom du produit / formule</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex : Calendrier Panoramique 20x30"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="pochettes">Pochette complète</option>
                    <option value="objets">Objet souvenir</option>
                    <option value="tirages">Tirage seul</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ratio d'image</label>
                  <select
                    value={newProdRatio}
                    onChange={(e) => setNewProdRatio(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="objet">Objet personnalisé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prix École TTC</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={newProdBasePrice}
                    onChange={(e) => setNewProdBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Moyenne marché</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={newProdMarketPrice}
                    onChange={(e) => setNewProdMarketPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Conseillé parents</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={newProdResalePrice}
                    onChange={(e) => setNewProdResalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dimensions / Format</label>
                <input
                  type="text"
                  value={newProdDimensions}
                  onChange={(e) => setNewProdDimensions(e.target.value)}
                  placeholder="Ex : 15x22.5 cm"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description courte</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewProductModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold"
                >
                  Créer le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UNE ÉCOLE */}
      {newSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Ajouter une École Partenaire</h3>
              <button onClick={() => setNewSchoolModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSchool} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de l'école *</label>
                <input
                  type="text"
                  required
                  value={newSchName}
                  onChange={(e) => setNewSchName(e.target.value)}
                  placeholder="Ex : École Primaire Jules Ferry"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code d'accès école *</label>
                  <input
                    type="text"
                    required
                    value={newSchCode}
                    onChange={(e) => setNewSchCode(e.target.value.toUpperCase())}
                    placeholder="Ex : FERRY30"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commune (Gard) *</label>
                  <input
                    type="text"
                    required
                    value={newSchCity}
                    onChange={(e) => setNewSchCity(e.target.value)}
                    placeholder="Ex : Nîmes"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Effectif élèves</label>
                  <input
                    type="number"
                    min="10"
                    value={newSchStudents}
                    onChange={(e) => setNewSchStudents(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    value={newSchPostal}
                    onChange={(e) => setNewSchPostal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom du Directeur</label>
                  <input
                    type="text"
                    value={newSchDirector}
                    onChange={(e) => setNewSchDirector(e.target.value)}
                    placeholder="Mme Martin"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newSchPhone}
                    onChange={(e) => setNewSchPhone(e.target.value)}
                    placeholder="04 66 00 00 00"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Courriel officiel</label>
                <input
                  type="email"
                  value={newSchEmail}
                  onChange={(e) => setNewSchEmail(e.target.value)}
                  placeholder="ce.030xxxx@ac-montpellier.fr"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewSchoolModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold"
                >
                  Ajouter l'école
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
