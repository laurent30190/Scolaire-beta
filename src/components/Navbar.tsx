import React, { useState } from 'react';
import { Camera, ShieldCheck, HelpCircle, School, Compass, Menu, X, LogOut } from 'lucide-react';
import { ActivePortal, School as SchoolType } from '../types';

interface NavbarProps {
  activePortal: ActivePortal;
  setActivePortal: (portal: ActivePortal) => void;
  currentSchool: SchoolType | null;
  onLogoutSchool: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  onRequestAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePortal,
  setActivePortal,
  currentSchool,
  onLogoutSchool,
  isAdminLoggedIn,
  onLogoutAdmin,
  onRequestAdminLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActivePortal('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-sm shadow-amber-600/20">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Laurent Serres
                </span>
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  Photographe Scolaire Professionnel · Gard & Occitanie
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActivePortal('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activePortal === 'home' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : ''
              }`}
            >
              Accueil & Portails
            </button>

            <button
              onClick={() => setActivePortal('partner')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activePortal === 'partner' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : ''
              }`}
            >
              <School className="w-4 h-4 text-slate-400" />
              <span>École Partenaire</span>
              {currentSchool && (
                <span className="text-[11px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono">
                  {currentSchool.code}
                </span>
              )}
            </button>

            <button
              onClick={() => setActivePortal('prospect')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activePortal === 'prospect' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : ''
              }`}
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Espace Découverte</span>
            </button>

            <button
              onClick={() => setActivePortal('parent')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activePortal === 'parent' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : ''
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>SAV Parents</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action / Admin / Account status */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePortal('admin')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activePortal === 'admin'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Panneau Admin</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  title="Déconnexion Admin"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentSchool ? (
              <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 rounded-lg px-2.5 py-1">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                    {currentSchool.name}
                  </span>
                  <span className="text-[10px] text-amber-700 font-mono">
                    Code: {currentSchool.code}
                  </span>
                </div>
                <button
                  onClick={onLogoutSchool}
                  title="Changer d'école"
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onRequestAdminLogin}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Accès Photographe</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              setActivePortal('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
              activePortal === 'home' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700'
            }`}
          >
            Accueil & Portails
          </button>
          <button
            onClick={() => {
              setActivePortal('partner');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors flex items-center justify-between ${
              activePortal === 'partner' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <School className="w-4 h-4" />
              <span>École Partenaire</span>
            </span>
            {currentSchool && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                {currentSchool.code}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActivePortal('prospect');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activePortal === 'prospect' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Espace Découverte</span>
          </button>
          <button
            onClick={() => {
              setActivePortal('parent');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activePortal === 'parent' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>SAV Parents (Sans code)</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setActivePortal('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Accéder au Panneau Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  onRequestAdminLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
              >
                Accès Photographe (Laurent Serres)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
