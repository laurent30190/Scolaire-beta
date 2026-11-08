import React, { useState, useEffect } from 'react';
import {
  Product,
  School,
  Message,
  SavTicket,
  ProspectionCode,
  ActivePortal,
} from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredSchools,
  saveStoredSchools,
  getStoredMessages,
  saveStoredMessages,
  getStoredSavTickets,
  saveStoredSavTickets,
  getStoredProspectionCodes,
  saveStoredProspectionCodes,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomePortals } from './components/HomePortals';
import { SchoolPortal } from './components/SchoolPortal';
import { ProspectPortal } from './components/ProspectPortal';
import { ParentSavPortal } from './components/ParentSavPortal';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PartnerLoginView } from './components/PartnerLoginView';
import { Camera, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [schools, setSchools] = useState<School[]>(getStoredSchools);
  const [messages, setMessages] = useState<Message[]>(getStoredMessages);
  const [savTickets, setSavTickets] = useState<SavTicket[]>(getStoredSavTickets);
  const [prospectionCodes, setProspectionCodes] = useState<ProspectionCode[]>(getStoredProspectionCodes);

  const [activePortal, setActivePortal] = useState<ActivePortal>('home');
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredSchools(schools);
  }, [schools]);

  useEffect(() => {
    saveStoredMessages(messages);
  }, [messages]);

  useEffect(() => {
    saveStoredSavTickets(savTickets);
  }, [savTickets]);

  useEffect(() => {
    saveStoredProspectionCodes(prospectionCodes);
  }, [prospectionCodes]);

  // Handler for school code login
  const handleSelectSchoolByCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const found = schools.find((s) => s.code.toUpperCase() === clean);
    if (found) {
      setCurrentSchool(found);
      setActivePortal('partner');
      return true;
    }
    return false;
  };

  const handleUpdateSchoolConfig = (updatedSchool: School) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === updatedSchool.id ? updatedSchool : s))
    );
    if (currentSchool?.id === updatedSchool.id) {
      setCurrentSchool(updatedSchool);
    }
  };

  const handleSendMessageFromSchool = (
    content: string,
    type: Message['type'] = 'chat',
    metadata?: any
  ) => {
    if (!currentSchool) return;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      schoolId: currentSchool.id,
      schoolCode: currentSchool.code,
      schoolName: currentSchool.name,
      sender: 'school',
      authorName: `${currentSchool.directorName} (Direction)`,
      type,
      content,
      metadata,
      timestamp: dateStr,
      readByAdmin: false,
      readBySchool: true,
    };

    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleSendMessageFromAdmin = (schoolId: string, content: string) => {
    const school = schools.find((s) => s.id === schoolId);
    if (!school) return;

    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      schoolId: school.id,
      schoolCode: school.code,
      schoolName: school.name,
      sender: 'photographer',
      authorName: 'Laurent Serres',
      type: 'chat',
      content,
      timestamp: dateStr,
      readByAdmin: true,
      readBySchool: false,
    };

    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleSubmitSavTicket = (
    ticketData: Omit<SavTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>
  ): string => {
    const ticketNumber = `SAV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newTicket: SavTicket = {
      ...ticketData,
      id: `sav-${Date.now()}`,
      ticketNumber,
      createdAt: dateStr,
      status: 'nouveau',
    };

    setSavTickets((prev) => [newTicket, ...prev]);
    return ticketNumber;
  };

  const handleUpdateSavTicket = (
    ticketId: string,
    status: SavTicket['status'],
    adminNotes?: string
  ) => {
    setSavTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              adminNotes: adminNotes !== undefined ? adminNotes : t.adminNotes,
            }
          : t
      )
    );
  };

  const handleAddProspectionCode = (code: string, label: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    const exists = prospectionCodes.some((c) => c.code === clean);
    if (exists) return;

    const newCode: ProspectionCode = {
      code: clean,
      label,
      createdAt: new Date().toISOString().split('T')[0],
      usesCount: 0,
    };

    setProspectionCodes((prev) => [...prev, newCode]);
  };

  const handleDeleteProspectionCode = (code: string) => {
    setProspectionCodes((prev) => prev.filter((c) => c.code !== code));
  };

  const handleProspectCodeUsed = (code: string) => {
    setProspectionCodes((prev) =>
      prev.map((c) =>
        c.code.toUpperCase() === code.toUpperCase()
          ? { ...c, usesCount: c.usesCount + 1 }
          : c
      )
    );
  };

  const handleRequestContactFromProspect = (contactData: any) => {
    // Generate a message to admin
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      schoolId: 'prospect',
      schoolCode: 'PROSPECT',
      schoolName: `${contactData.schoolName} (${contactData.city})`,
      sender: 'school',
      authorName: `${contactData.contactName} (${contactData.phone})`,
      type: 'sample_request',
      content: `Demande de mallette d'échantillons prospect pour ${contactData.schoolName} (${contactData.studentCount} élèves). Courriel : ${contactData.email}. Message : ${contactData.message}`,
      timestamp: dateStr,
      readByAdmin: false,
      readBySchool: true,
    };

    setMessages((prev) => [newMsg, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        currentSchool={currentSchool}
        onLogoutSchool={() => {
          setCurrentSchool(null);
          setActivePortal('home');
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={() => {
          setIsAdminLoggedIn(false);
          setActivePortal('home');
        }}
        onRequestAdminLogin={() => setAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePortal === 'home' && (
          <HomePortals
            schools={schools}
            prospectionCodes={prospectionCodes}
            onSelectSchoolByCode={handleSelectSchoolByCode}
            onOpenProspectPortal={(code) => {
              if (code) handleProspectCodeUsed(code);
              setActivePortal('prospect');
            }}
            onOpenParentPortal={() => setActivePortal('parent')}
            onOpenAdminModal={() => setAdminModalOpen(true)}
          />
        )}

        {activePortal === 'partner' && (
          currentSchool ? (
            <SchoolPortal
              school={currentSchool}
              products={products}
              messages={messages}
              onUpdateSchoolConfig={handleUpdateSchoolConfig}
              onSendMessage={handleSendMessageFromSchool}
              onChangeSchool={() => setCurrentSchool(null)}
            />
          ) : (
            <PartnerLoginView
              schools={schools}
              onSelectSchoolByCode={handleSelectSchoolByCode}
              onBackToHome={() => setActivePortal('home')}
            />
          )
        )}

        {activePortal === 'prospect' && (
          <ProspectPortal
            products={products}
            prospectionCodes={prospectionCodes}
            onProspectCodeUsed={handleProspectCodeUsed}
            onRequestContact={handleRequestContactFromProspect}
          />
        )}

        {activePortal === 'parent' && (
          <ParentSavPortal
            schools={schools.map((s) => ({ name: s.name, city: s.city }))}
            savTickets={savTickets}
            onSubmitSavTicket={handleSubmitSavTicket}
          />
        )}

        {activePortal === 'admin' && (
          isAdminLoggedIn ? (
            <AdminPortal
              products={products}
              schools={schools}
              messages={messages}
              savTickets={savTickets}
              prospectionCodes={prospectionCodes}
              onUpdateProducts={setProducts}
              onUpdateSchools={setSchools}
              onSendMessageFromAdmin={handleSendMessageFromAdmin}
              onUpdateSavTicket={handleUpdateSavTicket}
              onAddProspectionCode={handleAddProspectionCode}
              onDeleteProspectionCode={handleDeleteProspectionCode}
              onSelectSchoolToView={(s) => {
                setCurrentSchool(s);
                setActivePortal('partner');
              }}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
              <h2 className="text-xl font-bold">Accès Administrateur Requis</h2>
              <p className="text-xs text-slate-600">
                Vous devez entrer le code secret 182420 pour accéder aux réglages.
              </p>
              <button
                onClick={() => setAdminModalOpen(true)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Ouvrir la saisie du code secret
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  Laurent Serres · Artisan Photographe Scolaire
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Photographe scolaire professionnel dans le Gard et la région Occitanie. Respect scrupuleux des normes coopératives OCCE, du droit à l'image et accompagnement dédié des équipes pédagogiques.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span>Déplacements dans tout le Gard & la Région Occitanie</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Portails & Accès</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <button onClick={() => setActivePortal('partner')} className="hover:text-amber-700">
                    École Partenaire (Codes écoles)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePortal('prospect')} className="hover:text-amber-700">
                    Espace Découverte (Prospection)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePortal('parent')} className="hover:text-amber-700">
                    SAV & Assistance Familles (Sans code)
                  </button>
                </li>
                <li>
                  <button onClick={() => setAdminModalOpen(true)} className="hover:text-amber-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Accès Photographe (Code 182420)</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Contact & Atelier</h4>
              <div className="space-y-1 text-slate-600">
                <p>Laurent Serres</p>
                <p>Gard (30), France</p>
                <p className="font-mono text-slate-700">lsphotopro30@gmail.com</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Pochettes, tirages 15x22.5, tirages d'art, objets personnalisés et galeries numériques sécurisées.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              © 2026 Laurent Serres. Tous droits réservés.
            </div>
            <div>
              Conformité RGPD scolaire & Coopératives Autonomes / OCCE
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          setActivePortal('admin');
        }}
      />
    </div>
  );
}
