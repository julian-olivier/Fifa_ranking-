'use client';

import React, { useState } from 'react';
import { Match, Player } from '@/types';
import { getClubById } from '@/lib/clubs';
import { sounds } from '@/lib/sound';
import { 
  Swords, 
  Zap, 
  ChevronRight
} from 'lucide-react';

interface RivalryExplorerProps {
  players: Player[];
  matches: Match[];
  onQuickMatch: (p1: Player, p2: Player) => void;
}

export const RivalryExplorer: React.FC<RivalryExplorerProps> = ({
  players,
  matches,
  onQuickMatch,
}) => {
  const [p1Id, setP1Id] = useState<string>(players[0]?.id || '');
  const [p2Id, setP2Id] = useState<string>(
    players.find((p) => p.id !== players[0]?.id)?.id || players[1]?.id || ''
  );

  const player1 = players.find((p) => p.id === p1Id);
  const player2 = players.find((p) => p.id === p2Id);

  // Filter matches between these two players
  const rivalryMatches = matches.filter(
    (m) =>
      (m.player1Id === p1Id && m.player2Id === p2Id) ||
      (m.player1Id === p2Id && m.player2Id === p1Id)
  );

  // Statistics
  let p1Wins = 0;
  let p2Wins = 0;
  let draws = 0;
  let p1Goals = 0;
  let p2Goals = 0;

  rivalryMatches.forEach((m) => {
    const isP1Home = m.player1Id === p1Id;
    const score1 = isP1Home ? m.player1Score : m.player2Score;
    const score2 = isP1Home ? m.player2Score : m.player1Score;

    p1Goals += score1;
    p2Goals += score2;

    if (score1 > score2) p1Wins++;
    else if (score2 > score1) p2Wins++;
    else draws++;
  });

  const totalMatches = rivalryMatches.length;
  const p1WinRate = totalMatches > 0 ? Math.round((p1Wins / totalMatches) * 100) : 0;
  const p2WinRate = totalMatches > 0 ? Math.round((p2Wins / totalMatches) * 100) : 0;
  const drawRate = totalMatches > 0 ? 100 - p1WinRate - p2WinRate : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Selector Header */}
      <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-chess-card">
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-chess-red" />
          <h2 className="font-extrabold text-base sm:text-lg text-chess-text tracking-tight uppercase">
            Head-to-Head Rivalry Hub
          </h2>
        </div>

        {/* Roommate Switchers */}
        <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-3">
          {/* P1 Select */}
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase font-bold text-chess-muted mb-1 block">Rival 1</label>
            <select
              value={p1Id}
              onChange={(e) => {
                sounds.playMove();
                setP1Id(e.target.value);
              }}
              className="w-full bg-chess-elevated border border-chess-border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-chess-text font-bold focus:outline-none focus:border-chess-green"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === p2Id}>
                  {p.name} ({p.rating} Elo)
                </option>
              ))}
            </select>
          </div>

          {/* VS Center */}
          <div className="sm:col-span-1 text-center font-black text-chess-gold text-xs sm:text-base py-0.5 sm:py-1">
            VS
          </div>

          {/* P2 Select */}
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase font-bold text-chess-muted mb-1 block">Rival 2</label>
            <select
              value={p2Id}
              onChange={(e) => {
                sounds.playMove();
                setP2Id(e.target.value);
              }}
              className="w-full bg-chess-elevated border border-chess-border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-chess-text font-bold focus:outline-none focus:border-chess-green"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === p1Id}>
                  {p.name} ({p.rating} Elo)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matchup Comparison Card */}
      {player1 && player2 && (
        <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-chess-card space-y-4 sm:space-y-6">
          
          <div className="grid grid-cols-3 items-center text-center">
            
            {/* Player 1 summary */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${player1.avatarBg} flex items-center justify-center text-2xl sm:text-4xl shadow-md relative border-2 border-chess-border mb-1.5`}>
                {player1.avatar}
              </div>
              <h3 className="font-black text-xs sm:text-lg text-chess-text truncate max-w-[85px] sm:max-w-none">{player1.name}</h3>
              <p className="text-[10px] sm:text-xs font-bold text-chess-green">{player1.rating} Elo</p>
              <div className="text-xl sm:text-3xl font-black text-chess-text mt-1">{p1Wins}</div>
              <span className="text-[9px] uppercase font-bold text-chess-muted">Wins</span>
            </div>

            {/* Middle Stats */}
            <div className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-2">
              <span className="text-[10px] sm:text-xs font-bold text-chess-muted uppercase tracking-wider">
                {totalMatches} Matches
              </span>
              <div className="text-sm sm:text-2xl font-black text-slate-300 bg-chess-elevated px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl border border-chess-border">
                {draws} Draws
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-chess-muted">
                {p1Goals} - {p2Goals} Goals
              </span>

              {/* Play Match Button */}
              <button
                onClick={() => {
                  sounds.playMove();
                  onQuickMatch(player1, player2);
                }}
                className="mt-1 btn-chess-green text-white font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-white" />
                <span>Play Derby</span>
              </button>
            </div>

            {/* Player 2 summary */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${player2.avatarBg} flex items-center justify-center text-2xl sm:text-4xl shadow-md relative border-2 border-chess-border mb-1.5`}>
                {player2.avatar}
              </div>
              <h3 className="font-black text-xs sm:text-lg text-chess-text truncate max-w-[85px] sm:max-w-none">{player2.name}</h3>
              <p className="text-[10px] sm:text-xs font-bold text-chess-blue">{player2.rating} Elo</p>
              <div className="text-xl sm:text-3xl font-black text-chess-text mt-1">{p2Wins}</div>
              <span className="text-[9px] uppercase font-bold text-chess-muted">Wins</span>
            </div>

          </div>

          {/* Win Split Ratio Bar */}
          {totalMatches > 0 && (
            <div>
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-chess-muted mb-1">
                <span className="text-chess-green">{player1.name} ({p1WinRate}%)</span>
                <span>Draws ({drawRate}%)</span>
                <span className="text-chess-blue">{player2.name} ({p2WinRate}%)</span>
              </div>
              <div className="w-full h-2.5 sm:h-3 bg-chess-darkest rounded-full overflow-hidden flex">
                <div style={{ width: `${p1WinRate}%` }} className="bg-chess-green h-full" />
                <div style={{ width: `${drawRate}%` }} className="bg-slate-500 h-full" />
                <div style={{ width: `${p2WinRate}%` }} className="bg-chess-blue h-full" />
              </div>
            </div>
          )}

          {/* Direct Encounters List */}
          <div className="pt-3 border-t border-chess-border/80">
            <h4 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-chess-muted mb-2 sm:mb-3">
              Direct Encounters ({rivalryMatches.length})
            </h4>

            {rivalryMatches.length === 0 ? (
              <div className="text-center py-6 text-chess-muted text-xs">
                No official matches logged between them yet. Tap "Play Derby" to start this rivalry!
              </div>
            ) : (
              <div className="space-y-1.5">
                {rivalryMatches.map((m) => {
                  const c1 = getClubById(m.player1Club);
                  const c2 = getClubById(m.player2Club);
                  const p1Obj = players.find((p) => p.id === m.player1Id);
                  const p2Obj = players.find((p) => p.id === m.player2Id);

                  return (
                    <div
                      key={m.id}
                      className="bg-chess-elevated/70 border border-chess-border rounded-xl p-2.5 sm:p-3 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs min-w-0 flex-1">
                        <span className="text-chess-muted text-[10px] hidden xs:inline w-12">
                          {m.date ? m.date.slice(5, 10) : 'Recent'}
                        </span>
                        
                        <div className="flex items-center space-x-1 font-bold text-chess-text truncate flex-1 justify-end">
                          <span className="truncate">{p1Obj?.name}</span>
                          <span className="text-[10px] sm:text-xs">{c1.badgeEmoji}</span>
                        </div>

                        <span className="font-black px-2 py-0.5 rounded bg-chess-darkest text-chess-text text-xs sm:text-sm border border-chess-border flex-shrink-0">
                          {m.player1Score} - {m.player2Score}
                        </span>

                        <div className="flex items-center space-x-1 font-bold text-chess-text truncate flex-1">
                          <span className="text-[10px] sm:text-xs">{c2.badgeEmoji}</span>
                          <span className="truncate">{p2Obj?.name}</span>
                        </div>
                      </div>

                      <div className="text-[10px] font-bold text-chess-muted ml-2 flex-shrink-0">
                        <span className={m.player1RatingDelta >= 0 ? 'text-chess-green' : 'text-chess-red'}>
                          {m.player1RatingDelta >= 0 ? `+${m.player1RatingDelta}` : m.player1RatingDelta}
                        </span>
                        <span className="mx-0.5">/</span>
                        <span className={m.player2RatingDelta >= 0 ? 'text-chess-green' : 'text-chess-red'}>
                          {m.player2RatingDelta >= 0 ? `+${m.player2RatingDelta}` : m.player2RatingDelta}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
