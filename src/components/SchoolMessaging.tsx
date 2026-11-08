import React, { useState } from 'react';
import { Send, MessageSquare, Clock, CheckCircle, Package, Calendar, Sparkles } from 'lucide-react';
import { Message, School } from '../types';

interface SchoolMessagingProps {
  school: School;
  messages: Message[];
  onSendMessage: (content: string, type?: Message['type']) => void;
}

export const SchoolMessaging: React.FC<SchoolMessagingProps> = ({
  school,
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const schoolMessages = messages.filter((m) => m.schoolId === school.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'chat');
    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-[520px]">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Liaison Directe avec Laurent Serres</h4>
            <p className="text-[11px] text-slate-500">Photographe scolaire · Réponses sous quelques heures</p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Disponible pour votre établissement</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {schoolMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <MessageSquare className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <p className="text-xs font-medium text-slate-600">Aucun message pour le moment</p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-1">
              Posez une question, demandez des précisions sur les formats ou utilisez les boutons rapides en haut de page.
            </p>
          </div>
        ) : (
          schoolMessages.map((msg) => {
            const isSchool = msg.sender === 'school';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSchool ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {isSchool ? school.directorName || 'Direction' : 'Laurent Serres (Photographe)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isSchool
                      ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                  }`}
                >
                  {/* Badges spéciaux selon le type */}
                  {msg.type === 'grid_validation' && (
                    <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider mb-1 opacity-90 text-amber-100">
                      <CheckCircle className="w-3 h-3" /> Grille tarifaire transmise
                    </div>
                  )}
                  {msg.type === 'sample_request' && (
                    <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider mb-1 opacity-90 text-sky-100">
                      <Package className="w-3 h-3" /> Demande d'échantillons
                    </div>
                  )}
                  {msg.type === 'date_proposal' && (
                    <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider mb-1 opacity-90 text-amber-100">
                      <Calendar className="w-3 h-3" /> Proposition de date
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrire un message à Laurent Serres..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </div>
      </form>
    </div>
  );
};
