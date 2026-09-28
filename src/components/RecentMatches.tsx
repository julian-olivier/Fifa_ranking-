'use client';

import React, { useState } from 'react';
import { Match, Player } from '@/types';
import { getClubById } from '@/lib/clubs';
import { sounds } from '@/lib/sound';
import { 
  History, 
  Filter,
  Trophy,
  Swords
} from 'lucide-react';

interface RecentMatchesProps {
  matches: Match[];
  players: Player[];
}

export const RecentMatches: React.FC<RecentMatchesProps> = ({
  matches,
  players,
}) => {
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string>('all');

  const filteredMatches = matches.filter((m) => {
    if (selectedPlayerFilter === 'all') return true;
    return m.player1Id === selectedPlayerFilter || m.player2Id === selectedPlayerFilter;
  });

  return (
    <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl shadow-chess-card overflow-hidden">
      
      {/* Header */}
      <div className="p-3.5 sm:p-6 border-b border-chess-border bg-chess-card/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-chess-blue/15 border border-chess-blue/30 flex items-center justify-center text-chess-blue">
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-chess-text tracking-tight uppercase">
              Match Scores & Elo Log
            </h2>
            <p className="text-[11px] sm:text-xs text-chess-muted">
              Past game scores and rating adjustments between roommates
            </p>
          </div>
        </div>

        {/* Player Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-chess-muted" />
          <select
            value={selectedPlayerFilter}
            onChange={(e) => {
              sounds.playMove();
              setSelectedPlayerFilter(e.target.value);
            }}
            className="w-full sm:w-auto bg-chess-elevated border border-chess-border text-xs rounded-lg px-2.5 py-1.5 text-chess-text font-semibold focus:outline-none focus:border-chess-green cursor-pointer"
          >
            <option value="all">All Roommates ({matches.length})</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="divide-y divide-chess-border/40">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 text-chess-muted text-xs sm:text-sm">
            <Swords className="w-8 h-8 mx-auto mb-2 text-chess-muted/40" />
            No matches found for this filter.
          </div>
        ) : (
          filteredMatches.map((m) => {
            const p1 = players.find((p) => p.id === m.player1Id);
            const p2 = players.find((p) => p.id === m.player2Id);
            const c1 = getClubById(m.player1Club);
            const c2 = getClubById(m.player2Club);

            const isP1Winner = m.player1Score > m.player2Score;
            const isP2Winner = m.player2Score > m.player1Score;
            const isDraw = m.player1Score === m.player2Score;

            const dateStr = m.date
              ? new Date(m.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={m.id}
                className="p-3 sm:p-4 hover:bg-chess-elevated/40 transition-colors flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center justify-between"
              >
                {/* Mobile date meta */}
                <div className="flex sm:hidden items-center justify-between text-[10px] text-chess-muted font-semibold">
                  <span>{dateStr}</span>
                  {isDraw ? (
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Draw</span>
                  ) : (
                    <span className="text-chess-gold font-bold uppercase text-[9px] flex items-center gap-0.5">
                      <Trophy className="w-2.5 h-2.5" /> {isP1Winner ? p1?.name : p2?.name} won
                    </span>
                  )}
                </div>

                {/* Main Match Score Row */}
                <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4 flex-1">
                  {/* Date on Desktop */}
                  <span className="text-[11px] font-medium text-chess-muted w-28 hidden md:block">
                    {dateStr}
                  </span>

                  {/* Player 1 */}
                  <div className="flex-1 flex items-center justify-end space-x-2 text-right min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className={`text-xs sm:text-sm font-bold truncate ${isP1Winner ? 'text-chess-text font-black' : 'text-chess-muted'}`}>
                          {p1?.name || 'Player 1'}
                        </span>
                        <span className="text-sm" title={c1.name}>{c1.badgeEmoji}</span>
                      </div>
                      <div className="flex items-center justify-end space-x-1 mt-0.5">
                        <span className="text-[10px] text-chess-muted truncate hidden xs:inline">{c1.shortName}</span>
                        <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${
                          m.player1RatingDelta > 0 
                            ? 'text-chess-green bg-chess-green/10' 
                            : m.player1RatingDelta < 0 
                            ? 'text-chess-red bg-chess-red/10' 
                            : 'text-chess-muted bg-chess-card'
                        }`}>
                          {m.player1RatingDelta > 0 ? `+${m.player1RatingDelta}` : m.player1RatingDelta}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score in Center */}
                  <div className="flex flex-col items-center justify-center px-1.5 flex-shrink-0">
                    <span className="px-3 py-1 rounded-xl bg-chess-darkest border border-chess-border font-black text-sm sm:text-base text-chess-text shadow-inner tracking-wider">
                      {m.player1Score} - {m.player2Score}
                    </span>
                    {m.isPenalties && (
                      <span className="text-[8px] font-bold text-chess-gold uppercase mt-0.5">Pens</span>
                    )}
                    {m.isExtraTime && !m.isPenalties && (
                      <span className="text-[8px] font-bold text-chess-muted uppercase mt-0.5">AET</span>
                    )}
                    {m.isRageQuit && (
                      <span className="text-[8px] font-black text-chess-red uppercase mt-0.5">Rage Quit</span>
                    )}
                  </div>

                  {/* Player 2 */}
                  <div className="flex-1 flex items-center space-x-2 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm" title={c2.name}>{c2.badgeEmoji}</span>
                        <span className={`text-xs sm:text-sm font-bold truncate ${isP2Winner ? 'text-chess-text font-black' : 'text-chess-muted'}`}>
                          {p2?.name || 'Player 2'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${
                          m.player2RatingDelta > 0 
                            ? 'text-chess-green bg-chess-green/10' 
                            : m.player2RatingDelta < 0 
                            ? 'text-chess-red bg-chess-red/10' 
                            : 'text-chess-muted bg-chess-card'
                        }`}>
                          {m.player2RatingDelta > 0 ? `+${m.player2RatingDelta}` : m.player2RatingDelta}
                        </span>
                        <span className="text-[10px] text-chess-muted truncate hidden xs:inline">{c2.shortName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elo Rating After Result (Desktop) */}
                <div className="hidden sm:flex items-center justify-end space-x-3 text-xs pl-2">
                  <div className="text-right text-[11px] text-chess-muted">
                    <div>
                      {p1?.name}: <span className="font-bold text-chess-text">{m.player1RatingAfter}</span>
                    </div>
                    <div>
                      {p2?.name}: <span className="font-bold text-chess-text">{m.player2RatingAfter}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
