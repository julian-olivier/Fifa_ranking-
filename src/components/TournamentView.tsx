'use client';

import React, { useState } from 'react';
import { Player, Tournament } from '@/types';
import { sounds } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { Trophy, Plus, Crown, X } from 'lucide-react';

interface TournamentViewProps {
  tournaments: Tournament[];
  players: Player[];
  onUpdateTournaments: (tournaments: Tournament[]) => void;
}

export const TournamentView: React.FC<TournamentViewProps> = ({
  tournaments,
  players,
  onUpdateTournaments,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cupName, setCupName] = useState('Weekend Living Room Cup');
  const [selectedP1, setSelectedP1] = useState(players[0]?.id || '');
  const [selectedP2, setSelectedP2] = useState(players[1]?.id || '');
  const [selectedP3, setSelectedP3] = useState(players[2]?.id || '');
  const [selectedP4, setSelectedP4] = useState(players[3]?.id || '');

  const activeTournaments = tournaments.length > 0 ? tournaments : [];

  const handleCreateCup = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playVictory();

    const newCup: Tournament = {
      id: `t_${Date.now()}`,
      name: cupName,
      date: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      matches: [
        {
          id: `m_sf1_${Date.now()}`,
          round: 1, // Semifinal 1
          player1Id: selectedP1,
          player2Id: selectedP2,
        },
        {
          id: `m_sf2_${Date.now()}`,
          round: 1, // Semifinal 2
          player1Id: selectedP3,
          player2Id: selectedP4,
        },
        {
          id: `m_f_${Date.now()}`,
          round: 2, // Final
          player1Id: undefined,
          player2Id: undefined,
        },
      ],
    };

    onUpdateTournaments([newCup, ...tournaments]);
    setShowCreateModal(false);
  };

  const handleScoreCupMatch = (tourneyId: string, matchId: string, winnerId: string, score: string) => {
    sounds.playVictory();

    const updated = tournaments.map((t) => {
      if (t.id !== tourneyId) return t;

      const newMatches = t.matches.map((m) => {
        if (m.id === matchId) {
          return { ...m, winnerId, score };
        }
        return m;
      });

      const sf1 = newMatches[0];
      const sf2 = newMatches[1];
      const finalMatch = newMatches[2];

      if (finalMatch) {
        if (sf1.winnerId && finalMatch.player1Id !== sf1.winnerId) {
          finalMatch.player1Id = sf1.winnerId;
        }
        if (sf2.winnerId && finalMatch.player2Id !== sf2.winnerId) {
          finalMatch.player2Id = sf2.winnerId;
        }
      }

      let cupWinner = t.winnerId;
      let cupStatus = t.status;
      if (finalMatch && finalMatch.winnerId) {
        cupWinner = finalMatch.winnerId;
        cupStatus = 'completed';

        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}
      }

      return {
        ...t,
        winnerId: cupWinner,
        status: cupStatus,
        matches: newMatches,
      };
    });

    onUpdateTournaments(updated);
  };

  const getPlayer = (id?: string) => players.find((p) => p.id === id);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-chess-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <h2 className="font-extrabold text-base sm:text-lg text-chess-text tracking-tight uppercase">
              Living Room Cups
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-chess-muted mt-0.5">
            Knockout brackets & roommate tournaments
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playMove();
            setShowCreateModal(true);
          }}
          className="btn-chess-green text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Cup Bracket</span>
        </button>
      </div>

      {/* Tournaments List */}
      {activeTournaments.length === 0 ? (
        <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center text-chess-muted">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-chess-border mb-2.5" />
          <p className="text-sm font-bold text-chess-text">No active cups yet.</p>
          <p className="text-xs text-chess-muted mt-1">
            Tap "New Cup Bracket" to set up a 4-roommate knockout tournament!
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {activeTournaments.map((cup) => {
            const champion = getPlayer(cup.winnerId);
            const sf1 = cup.matches[0];
            const sf2 = cup.matches[1];
            const finalMatch = cup.matches[2];

            const p1 = getPlayer(sf1?.player1Id);
            const p2 = getPlayer(sf1?.player2Id);
            const p3 = getPlayer(sf2?.player1Id);
            const p4 = getPlayer(sf2?.player2Id);

            const f1 = getPlayer(finalMatch?.player1Id);
            const f2 = getPlayer(finalMatch?.player2Id);

            return (
              <div key={cup.id} className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-chess-card space-y-4 sm:space-y-6">
                
                {/* Cup Header */}
                <div className="flex items-center justify-between border-b border-chess-border/60 pb-2.5">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-chess-text">{cup.name}</h3>
                      {cup.status === 'completed' ? (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-amber-400" /> Done
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-chess-green/20 text-chess-green border border-chess-green/40">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-chess-muted">{cup.date}</span>
                  </div>

                  {champion && (
                    <div className="flex items-center space-x-1.5 bg-chess-darkest px-2.5 py-1 rounded-xl border border-amber-500/30">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <div className="text-right">
                        <span className="text-[8px] uppercase font-bold text-amber-400 block">Champ</span>
                        <span className="text-xs font-black text-chess-text">{champion.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bracket Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Semifinals */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-chess-muted block">
                      Semifinals
                    </span>

                    {/* SF 1 */}
                    <div className="bg-chess-elevated border border-chess-border rounded-xl p-2.5 sm:p-3 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-chess-text">
                        <div className="flex items-center space-x-1">
                          <span>{p1?.avatar}</span>
                          <span className="truncate max-w-[80px] sm:max-w-none">{p1?.name || 'TBD'}</span>
                          {sf1.winnerId === p1?.id && <span className="text-chess-green text-xs">✓</span>}
                        </div>
                        <span className="font-black text-chess-muted px-1.5 py-0.2 rounded bg-chess-darkest text-[11px]">
                          {sf1.score || 'vs'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="truncate max-w-[80px] sm:max-w-none">{p2?.name || 'TBD'}</span>
                          <span>{p2?.avatar}</span>
                          {sf1.winnerId === p2?.id && <span className="text-chess-green text-xs">✓</span>}
                        </div>
                      </div>

                      {!sf1.winnerId && p1 && p2 && (
                        <div className="flex gap-2 pt-1 border-t border-chess-border/50">
                          <button
                            onClick={() => handleScoreCupMatch(cup.id, sf1.id, p1.id, '3-1')}
                            className="flex-1 py-1.5 rounded-lg bg-chess-card active:bg-chess-green active:text-white text-[11px] font-bold text-chess-muted transition-colors"
                          >
                            {p1.name} Won
                          </button>
                          <button
                            onClick={() => handleScoreCupMatch(cup.id, sf1.id, p2.id, '2-3')}
                            className="flex-1 py-1.5 rounded-lg bg-chess-card active:bg-chess-green active:text-white text-[11px] font-bold text-chess-muted transition-colors"
                          >
                            {p2.name} Won
                          </button>
                        </div>
                      )}
                    </div>

                    {/* SF 2 */}
                    <div className="bg-chess-elevated border border-chess-border rounded-xl p-2.5 sm:p-3 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-chess-text">
                        <div className="flex items-center space-x-1">
                          <span>{p3?.avatar}</span>
                          <span className="truncate max-w-[80px] sm:max-w-none">{p3?.name || 'TBD'}</span>
                          {sf2.winnerId === p3?.id && <span className="text-chess-green text-xs">✓</span>}
                        </div>
                        <span className="font-black text-chess-muted px-1.5 py-0.2 rounded bg-chess-darkest text-[11px]">
                          {sf2.score || 'vs'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="truncate max-w-[80px] sm:max-w-none">{p4?.name || 'TBD'}</span>
                          <span>{p4?.avatar}</span>
                          {sf2.winnerId === p4?.id && <span className="text-chess-green text-xs">✓</span>}
                        </div>
                      </div>

                      {!sf2.winnerId && p3 && p4 && (
                        <div className="flex gap-2 pt-1 border-t border-chess-border/50">
                          <button
                            onClick={() => handleScoreCupMatch(cup.id, sf2.id, p3.id, '2-1')}
                            className="flex-1 py-1.5 rounded-lg bg-chess-card active:bg-chess-green active:text-white text-[11px] font-bold text-chess-muted transition-colors"
                          >
                            {p3.name} Won
                          </button>
                          <button
                            onClick={() => handleScoreCupMatch(cup.id, sf2.id, p4.id, '1-2')}
                            className="flex-1 py-1.5 rounded-lg bg-chess-card active:bg-chess-green active:text-white text-[11px] font-bold text-chess-muted transition-colors"
                          >
                            {p4.name} Won
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Grand Final */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> Grand Final
                    </span>

                    <div className="bg-gradient-to-br from-amber-950/20 via-chess-elevated to-chess-darkest border sm:border-2 border-amber-500/40 rounded-xl p-3 sm:p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-black text-chess-text">
                        <div className="flex items-center space-x-1">
                          <span>{f1?.avatar || '❓'}</span>
                          <span className={finalMatch?.winnerId === f1?.id ? 'text-amber-400' : ''}>
                            {f1?.name || 'Winner SF1'}
                          </span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-chess-darkest border border-chess-border">
                          {finalMatch?.score || 'VS'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={finalMatch?.winnerId === f2?.id ? 'text-amber-400' : ''}>
                            {f2?.name || 'Winner SF2'}
                          </span>
                          <span>{f2?.avatar || '❓'}</span>
                        </div>
                      </div>

                      {f1 && f2 && !finalMatch?.winnerId && (
                        <div className="flex gap-2 pt-2 border-t border-chess-border/60">
                          <button
                            onClick={() => handleScoreCupMatch(cup.id, finalMatch.id, f1.id, '3-2')}
                            className="flex-1 py-2 rounded-lg btn-chess-green text-white text-xs font-black"
                          >
                            Crown {f1.name}
                          </button>
                          <button
                            onClick={() => handleScoreCupMatch(cup.id, finalMatch.id, f2.id, '1-4')}
                            className="flex-1 py-2 rounded-lg btn-chess-green text-white text-xs font-black"
                          >
                            Crown {f2.name}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal to Create Cup */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-chess-card border-t sm:border border-chess-border rounded-t-3xl sm:rounded-2xl w-full max-w-md p-4 sm:p-5 space-y-3.5 shadow-chess-modal">
            <div className="flex items-center justify-between pb-2 border-b border-chess-border/50">
              <h3 className="font-extrabold text-sm sm:text-base text-chess-text">Create 4-Player Cup</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-chess-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <label className="text-xs font-bold text-chess-muted block mb-1">Cup Name</label>
              <input
                type="text"
                value={cupName}
                onChange={(e) => setCupName(e.target.value)}
                className="w-full bg-chess-elevated border border-chess-border rounded-lg px-3 py-2 text-xs text-chess-text font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-chess-muted font-bold block mb-1">SF1 Seed 1</label>
                <select
                  value={selectedP1}
                  onChange={(e) => setSelectedP1(e.target.value)}
                  className="w-full bg-chess-elevated border border-chess-border rounded-lg px-2 py-1.5 text-xs text-chess-text font-bold"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-chess-muted font-bold block mb-1">SF1 Seed 2</label>
                <select
                  value={selectedP2}
                  onChange={(e) => setSelectedP2(e.target.value)}
                  className="w-full bg-chess-elevated border border-chess-border rounded-lg px-2 py-1.5 text-xs text-chess-text font-bold"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-chess-muted font-bold block mb-1">SF2 Seed 1</label>
                <select
                  value={selectedP3}
                  onChange={(e) => setSelectedP3(e.target.value)}
                  className="w-full bg-chess-elevated border border-chess-border rounded-lg px-2 py-1.5 text-xs text-chess-text font-bold"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-chess-muted font-bold block mb-1">SF2 Seed 2</label>
                <select
                  value={selectedP4}
                  onChange={(e) => setSelectedP4(e.target.value)}
                  className="w-full bg-chess-elevated border border-chess-border rounded-lg px-2 py-1.5 text-xs text-chess-text font-bold"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2 pb-2 sm:pb-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-chess-elevated text-xs font-bold text-chess-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCup}
                className="flex-1 py-2.5 rounded-xl btn-chess-green text-xs font-black text-white"
              >
                Generate Bracket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
