'use client';

import React from 'react';
import { Match, Player } from '@/types';
import { Trophy, Flame, Target, Swords } from 'lucide-react';

interface StatsOverviewProps {
  players: Player[];
  matches: Match[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ players, matches }) => {
  if (players.length === 0) return null;

  // Leader
  const leader = [...players].sort((a, b) => b.rating - a.rating)[0];

  // Best streak
  const bestStreakPlayer = [...players].sort((a, b) => b.streak - a.streak)[0];

  // Most goals
  const topScorer = [...players].sort((a, b) => b.goalsScored - a.goalsScored)[0];

  // Total goals in all matches
  const totalGoals = matches.reduce((acc, m) => acc + m.player1Score + m.player2Score, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
      
      {/* Current #1 GM */}
      <div className="bg-chess-card border border-chess-border rounded-xl p-2.5 sm:p-3.5 flex items-center space-x-2 sm:space-x-3 shadow-chess-card">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted tracking-wider block truncate">House #1</span>
          <h4 className="font-extrabold text-xs sm:text-sm text-chess-text truncate">{leader?.name}</h4>
          <span className="text-[11px] sm:text-xs font-black text-amber-400 block">{leader?.rating} Elo</span>
        </div>
      </div>

      {/* On Fire Streak */}
      <div className="bg-chess-card border border-chess-border rounded-xl p-2.5 sm:p-3.5 flex items-center space-x-2 sm:space-x-3 shadow-chess-card">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted tracking-wider block truncate">Streak</span>
          <h4 className="font-extrabold text-xs sm:text-sm text-chess-text truncate">{bestStreakPlayer?.name}</h4>
          <span className="text-[11px] sm:text-xs font-black text-orange-400 block truncate">
            {bestStreakPlayer && bestStreakPlayer.streak > 0 ? `${bestStreakPlayer.streak} Wins` : 'None'}
          </span>
        </div>
      </div>

      {/* Golden Boot (Top Scorer) */}
      <div className="bg-chess-card border border-chess-border rounded-xl p-2.5 sm:p-3.5 flex items-center space-x-2 sm:space-x-3 shadow-chess-card">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-chess-green/15 border border-chess-green/30 flex items-center justify-center text-chess-green flex-shrink-0">
          <Target className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted tracking-wider block truncate">Golden Boot</span>
          <h4 className="font-extrabold text-xs sm:text-sm text-chess-text truncate">{topScorer?.name}</h4>
          <span className="text-[11px] sm:text-xs font-black text-chess-green block truncate">{topScorer?.goalsScored} Goals</span>
        </div>
      </div>

      {/* Total Games & Goals */}
      <div className="bg-chess-card border border-chess-border rounded-xl p-2.5 sm:p-3.5 flex items-center space-x-2 sm:space-x-3 shadow-chess-card">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
          <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted tracking-wider block truncate">Fixtures</span>
          <h4 className="font-extrabold text-xs sm:text-sm text-chess-text truncate">{matches.length} Matches</h4>
          <span className="text-[11px] sm:text-xs font-black text-sky-400 block truncate">{totalGoals} Goals</span>
        </div>
      </div>

    </div>
  );
};
