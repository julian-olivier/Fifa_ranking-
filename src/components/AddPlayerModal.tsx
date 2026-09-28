'use client';

import React, { useState } from 'react';
import { Player } from '@/types';
import { FIFA_CLUBS } from '@/lib/clubs';
import { sounds } from '@/lib/sound';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (player: Player) => void;
}

const AVATAR_OPTIONS = ['🦁', '⚡', '🎯', '🛡️', '🤖', '🌪️', '🦊', '🦅', '🦍', '🐉', '👑', '🚀', '⚽', '🔥', '💎'];
const COLOR_GRADIENTS = [
  'from-amber-500 to-amber-700',
  'from-sky-500 to-indigo-700',
  'from-red-500 to-rose-800',
  'from-emerald-500 to-teal-800',
  'from-purple-600 to-pink-800',
  'from-blue-600 to-slate-800',
  'from-orange-500 to-red-700',
  'from-cyan-500 to-blue-700',
];

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  isOpen,
  onClose,
  onAddPlayer,
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('ROOKIE');
  const [avatar, setAvatar] = useState('🦁');
  const [avatarBg, setAvatarBg] = useState(COLOR_GRADIENTS[0]);
  const [favoriteClub, setFavoriteClub] = useState('real_madrid');
  const [playstyle, setPlaystyle] = useState('Tiki-Taka & High Press');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter the roommate\'s name.');
      return;
    }

    sounds.playVictory();

    const newPlayer: Player = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      nickname: nickname.trim() || 'The Challenger',
      avatar,
      avatarBg,
      title: title || undefined,
      rating: 1200, // Standard starting Elo
      peakRating: 1200,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      streak: 0,
      form: [],
      favoriteClub,
      playstyle,
      achievements: [],
      ratingHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          rating: 1200,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    onAddPlayer(newPlayer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#24221f] border-t sm:border border-chess-border rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-chess-modal flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-chess-border rounded-full mx-auto mt-2.5 sm:hidden" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-chess-border bg-chess-darkest/60 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-chess-green/20 border border-chess-green/40 flex items-center justify-center text-chess-green font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-chess-text tracking-tight">Add New Roommate</h2>
              <p className="text-[10px] sm:text-xs text-chess-muted">Enrolls with standard 1200 Elo placement rating</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playMove();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-chess-elevated hover:bg-chess-border text-chess-muted hover:text-chess-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {/* Avatar Preview & Selection */}
          <div className="flex flex-col items-center pb-2">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarBg} flex items-center justify-center text-4xl shadow-xl border-2 border-chess-border mb-3`}>
              {avatar}
            </div>

            {/* Avatar emojis */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mb-3">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    sounds.playMove();
                    setAvatar(emoji);
                  }}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                    avatar === emoji ? 'bg-chess-green text-white scale-110 shadow-md' : 'bg-chess-elevated hover:bg-chess-border'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Gradient pickers */}
            <div className="flex space-x-1.5">
              {COLOR_GRADIENTS.map((grad, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    sounds.playMove();
                    setAvatarBg(grad);
                  }}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${grad} border ${
                    avatarBg === grad ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Name & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-chess-muted block mb-1">Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-chess-elevated border border-chess-border rounded-lg px-3 py-2 text-sm text-chess-text font-bold focus:outline-none focus:border-chess-green"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-chess-muted block mb-1">Roommate Nickname</label>
              <input
                type="text"
                placeholder="e.g. The Controller Slammer"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-chess-elevated border border-chess-border rounded-lg px-3 py-2 text-sm text-chess-text font-medium focus:outline-none focus:border-chess-green"
              />
            </div>
          </div>

          {/* Title & Favorite Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-chess-muted block mb-1">Starting Title Badge</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-chess-elevated border border-chess-border rounded-lg px-3 py-2 text-xs text-chess-text font-bold focus:outline-none focus:border-chess-green"
              >
                <option value="ROOKIE">ROOKIE</option>
                <option value="CHALLENGER">CHALLENGER</option>
                <option value="FM">FM (FIFA Master)</option>
                <option value="IM">IM (International Master)</option>
                <option value="GM">GM (Grandmaster)</option>
                <option value="SWEAT">SWEAT (Sweaty Player)</option>
                <option value="GOAT">GOAT</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-chess-muted block mb-1">Primary FIFA Club</label>
              <select
                value={favoriteClub}
                onChange={(e) => setFavoriteClub(e.target.value)}
                className="w-full bg-chess-elevated border border-chess-border rounded-lg px-3 py-2 text-xs text-chess-text font-medium focus:outline-none focus:border-chess-green"
              >
                {FIFA_CLUBS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.badgeEmoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tactical Playstyle */}
          <div>
            <label className="text-xs font-bold text-chess-muted block mb-1">Tactical Playstyle</label>
            <input
              type="text"
              placeholder="e.g. Tiki-Taka, Cross & Inshallah, Skill Spammer"
              value={playstyle}
              onChange={(e) => setPlaystyle(e.target.value)}
              className="w-full bg-chess-elevated border border-chess-border rounded-lg px-3 py-2 text-sm text-chess-text font-medium focus:outline-none focus:border-chess-green"
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full btn-chess-green py-2.5 rounded-xl text-white font-black text-sm tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-chess-btn"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Roommate</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
