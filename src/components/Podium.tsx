'use client';

import React from 'react';
import { Player } from '@/types';
import { getDivision } from '@/lib/elo';
import { getClubById } from '@/lib/clubs';
import { sounds } from '@/lib/sound';
import { Crown, Sparkles } from 'lucide-react';

interface PodiumProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const Podium: React.FC<PodiumProps> = ({ players, onSelectPlayer }) => {
  if (players.length < 3) return null;

  const first = players[0];
  const second = players[1];
  const third = players[2];

  const renderCard = (player: Player, rank: 1 | 2 | 3, heightClass: string) => {
    const div = getDivision(player.rating);
    const club = getClubById(player.favoriteClub);

    const rankConfig = {
      1: {
        badge: '👑 1ST',
        gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
        border: 'border-amber-400/60 shadow-glow-gold',
        textBadge: 'bg-amber-400 text-stone-900',
        podiumBg: 'bg-gradient-to-t from-amber-950/80 to-amber-900/40 border-t-2 sm:border-t-4 border-amber-400',
        avatarRing: 'ring-2 sm:ring-4 ring-amber-400',
        medalIcon: '🥇',
      },
      2: {
        badge: '🥈 2ND',
        gradient: 'from-slate-400/15 via-slate-500/5 to-transparent',
        border: 'border-slate-400/40',
        textBadge: 'bg-slate-300 text-stone-900',
        podiumBg: 'bg-gradient-to-t from-slate-900/80 to-slate-800/40 border-t-2 sm:border-t-4 border-slate-300',
        avatarRing: 'ring-2 ring-slate-300',
        medalIcon: '🥈',
      },
      3: {
        badge: '🥉 3RD',
        gradient: 'from-amber-700/15 via-amber-800/5 to-transparent',
        border: 'border-amber-700/40',
        textBadge: 'bg-amber-700 text-amber-100',
        podiumBg: 'bg-gradient-to-t from-stone-900/80 to-stone-800/40 border-t-2 sm:border-t-4 border-amber-600',
        avatarRing: 'ring-2 ring-amber-600',
        medalIcon: '🥉',
      },
    }[rank];

    return (
      <div 
        onClick={() => {
          sounds.playMove();
          onSelectPlayer(player);
        }}
        className={`flex-1 flex flex-col items-center cursor-pointer transition-all duration-200 transform active:scale-95 group max-w-[110px] sm:max-w-[220px]`}
      >
        {/* Floating Rank Avatar & Badge */}
        <div className="relative mb-1.5 sm:mb-3 flex flex-col items-center">
          {rank === 1 && (
            <div className="absolute -top-5 sm:-top-7 animate-bounce">
              <Crown className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400 fill-amber-400 filter drop-shadow-md" />
            </div>
          )}

          <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${player.avatarBg} flex items-center justify-center text-2xl sm:text-4xl shadow-lg relative ${rankConfig.avatarRing} transition-transform group-hover:scale-105`}>
            {player.avatar}
            <span className="absolute -bottom-1 -right-1 text-xs sm:text-base p-0.5 sm:p-1 rounded-full bg-chess-darkest border border-chess-border shadow">
              {club.badgeEmoji}
            </span>
          </div>

          {/* Title tag */}
          {player.title && (
            <span className="mt-1 text-[8px] sm:text-[10px] font-extrabold uppercase px-1 sm:px-2 py-0.2 sm:py-0.5 rounded bg-chess-elevated text-chess-gold border border-chess-gold/40 shadow-sm">
              {player.title}
            </span>
          )}
        </div>

        {/* Player Name & Rating */}
        <div className="text-center w-full px-1 mb-1 sm:mb-2">
          <h3 className="font-bold text-chess-text text-xs sm:text-base truncate group-hover:text-chess-green transition-colors">
            {player.name}
          </h3>
          
          <div className="mt-0.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5">
            <span className="font-black text-xs sm:text-lg text-chess-text">
              {player.rating}
            </span>
            <span className={`text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.2 rounded border ${div.borderColor} ${div.bgColor} ${div.textColor}`}>
              {div.badge}
            </span>
          </div>
        </div>

        {/* Form Dots (visible on tablet/desktop) */}
        <div className="hidden sm:flex items-center gap-1 mb-2">
          {player.form.slice(0, 5).map((res, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full text-[8px] flex items-center justify-center font-bold ${
                res === 'W'
                  ? 'bg-chess-green text-chess-darkest'
                  : res === 'D'
                  ? 'bg-slate-400 text-chess-darkest'
                  : 'bg-chess-red text-white'
              }`}
            >
              {res}
            </span>
          ))}
        </div>

        {/* Podium Base */}
        <div className={`w-full ${heightClass} ${rankConfig.podiumBg} rounded-t-lg sm:rounded-t-xl flex flex-col items-center justify-start pt-1.5 sm:pt-3 shadow-inner`}>
          <span className="text-sm sm:text-2xl font-black opacity-80">{rankConfig.medalIcon}</span>
          <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-extrabold text-chess-muted mt-0.5 sm:mt-1">
            {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'}
          </span>
          <span className="text-[8px] sm:text-[10px] text-chess-muted/80 font-medium">
            {player.wins}W - {player.losses}L
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-chess-card mb-4 sm:mb-8">
      <div className="flex items-center justify-between mb-2 sm:mb-4 pb-2 sm:pb-3 border-b border-chess-border/60">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-chess-gold" />
          <h2 className="font-black text-sm sm:text-lg text-chess-text tracking-tight uppercase">Roommate Podium</h2>
        </div>
        <span className="text-[10px] sm:text-xs text-chess-muted font-medium">Top 3 of the House</span>
      </div>

      <div className="flex items-end justify-center gap-1.5 sm:gap-6 pt-3 sm:pt-6 px-1">
        {/* 2nd Place */}
        {renderCard(second, 2, 'h-18 sm:h-36')}

        {/* 1st Place */}
        {renderCard(first, 1, 'h-24 sm:h-44')}

        {/* 3rd Place */}
        {renderCard(third, 3, 'h-14 sm:h-32')}
      </div>
    </div>
  );
};
