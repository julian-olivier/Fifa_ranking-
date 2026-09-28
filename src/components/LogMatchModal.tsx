'use client';

import React, { useState, useMemo } from 'react';
import { Player, Match, AppData } from '@/types';
import { FIFA_CLUBS, getClubById } from '@/lib/clubs';
import { calculateEloChange } from '@/lib/elo';
import { sounds } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { 
  X, 
  Plus, 
  Minus, 
  Swords, 
  AlertTriangle, 
  Sparkles,
  Zap
} from 'lucide-react';
import { LogMatchInput } from '@/lib/storage';

interface LogMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  preselectedPlayer?: Player | null;
  onMatchLogged: (input: LogMatchInput) => void;
}

export const LogMatchModal: React.FC<LogMatchModalProps> = ({
  isOpen,
  onClose,
  players,
  preselectedPlayer,
  onMatchLogged,
}) => {
  // Player selections
  const [p1Id, setP1Id] = useState<string>(
    preselectedPlayer?.id || (players[0] ? players[0].id : '')
  );
  const [p2Id, setP2Id] = useState<string>(
    players.find((p) => p.id !== (preselectedPlayer?.id || players[0]?.id))?.id || (players[1] ? players[1].id : '')
  );

  // Clubs
  const [p1Club, setP1Club] = useState<string>(
    preselectedPlayer ? preselectedPlayer.favoriteClub : 'real_madrid'
  );
  const [p2Club, setP2Club] = useState<string>('man_city');

  // Scores
  const [p1Score, setP1Score] = useState<number>(2);
  const [p2Score, setP2Score] = useState<number>(1);

  // Match modifiers
  const [isExtraTime, setIsExtraTime] = useState<boolean>(false);
  const [isPenalties, setIsPenalties] = useState<boolean>(false);
  const [p1Penalties, setP1Penalties] = useState<number>(4);
  const [p2Penalties, setP2Penalties] = useState<number>(3);
  const [isRageQuit, setIsRageQuit] = useState<boolean>(false);
  const [rageQuitter, setRageQuitter] = useState<'p1' | 'p2'>('p2');

  const player1 = players.find((p) => p.id === p1Id);
  const player2 = players.find((p) => p.id === p2Id);

  // Live ELO Calculation preview
  const liveElo = useMemo(() => {
    if (!player1 || !player2) return null;
    const p1Games = player1.wins + player1.draws + player1.losses;
    const p2Games = player2.wins + player2.draws + player2.losses;

    return calculateEloChange({
      p1Rating: player1.rating,
      p2Rating: player2.rating,
      p1Score,
      p2Score,
      p1GamesPlayed: p1Games,
      p2GamesPlayed: p2Games,
      isRageQuit,
      rageQuitterId: isRageQuit ? rageQuitter : undefined,
      isExtraTime,
      isPenalties,
    });
  }, [player1, player2, p1Score, p2Score, isRageQuit, rageQuitter, isExtraTime, isPenalties]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1Id || !p2Id || p1Id === p2Id) {
      alert('Please select two distinct roommates.');
      return;
    }

    sounds.playWhistle();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#81b64c', '#f0c15c', '#ffffff'],
      });
    } catch {}

    const payload: LogMatchInput = {
      player1Id: p1Id,
      player2Id: p2Id,
      player1Club: p1Club,
      player2Club: p2Club,
      player1Score: p1Score,
      player2Score: p2Score,
      isExtraTime,
      isPenalties,
      penaltyScore: isPenalties ? { player1: p1Penalties, player2: p2Penalties } : undefined,
      isRageQuit,
      rageQuitterId: isRageQuit ? (rageQuitter === 'p1' ? p1Id : p2Id) : undefined,
    };

    onMatchLogged(payload);
  };

  const club1Obj = getClubById(p1Club);
  const club2Obj = getClubById(p2Club);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#24221f] border-t sm:border border-chess-border rounded-t-3xl sm:rounded-2xl w-full max-w-2xl shadow-chess-modal flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-chess-border rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-chess-border bg-chess-darkest/60 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-chess-green/20 border border-chess-green/40 flex items-center justify-center text-chess-green font-bold">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-chess-text tracking-tight">Log Roommate Fixture</h2>
              <p className="text-[10px] sm:text-xs text-chess-muted">Live Elo update & post-game review</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          
          {/* Players Selection & Matchup Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
            
            {/* Player 1 (Home) */}
            <div className="bg-chess-card border border-chess-border/80 rounded-xl p-3 sm:p-4 flex flex-col space-y-2.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chess-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-chess-green"></span> Player 1 (Home)
              </span>

              {/* Player select */}
              <select
                value={p1Id}
                onChange={(e) => {
                  sounds.playMove();
                  setP1Id(e.target.value);
                  const sel = players.find((p) => p.id === e.target.value);
                  if (sel) setP1Club(sel.favoriteClub);
                }}
                className="bg-chess-elevated border border-chess-border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-chess-text font-bold focus:outline-none focus:border-chess-green transition-colors"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === p2Id}>
                    {p.name} ({p.rating} Elo)
                  </option>
                ))}
              </select>

              {/* Club select */}
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl">{club1Obj.badgeEmoji}</span>
                <select
                  value={p1Club}
                  onChange={(e) => {
                    sounds.playMove();
                    setP1Club(e.target.value);
                  }}
                  className="bg-chess-elevated border border-chess-border rounded-lg px-2.5 py-1.5 text-xs text-chess-text font-medium flex-1 focus:outline-none focus:border-chess-green"
                >
                  {FIFA_CLUBS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.ratingStars}★)
                    </option>
                  ))}
                </select>
              </div>

              {/* Score Control */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-chess-muted">Goals</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMove();
                      setP1Score((s) => Math.max(0, s - 1));
                    }}
                    className="w-10 h-10 rounded-lg bg-chess-elevated active:bg-chess-border text-chess-text flex items-center justify-center font-bold text-base transition-colors border border-chess-border"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-2xl font-black text-chess-text">
                    {p1Score}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMove();
                      setP1Score((s) => s + 1);
                    }}
                    className="w-10 h-10 rounded-lg bg-chess-elevated active:bg-chess-border text-chess-text flex items-center justify-center font-bold text-base transition-colors border border-chess-border"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Player 2 (Away) */}
            <div className="bg-chess-card border border-chess-border/80 rounded-xl p-3 sm:p-4 flex flex-col space-y-2.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chess-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-chess-blue"></span> Player 2 (Away)
              </span>

              {/* Player select */}
              <select
                value={p2Id}
                onChange={(e) => {
                  sounds.playMove();
                  setP2Id(e.target.value);
                  const sel = players.find((p) => p.id === e.target.value);
                  if (sel) setP2Club(sel.favoriteClub);
                }}
                className="bg-chess-elevated border border-chess-border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-chess-text font-bold focus:outline-none focus:border-chess-green transition-colors"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === p1Id}>
                    {p.name} ({p.rating} Elo)
                  </option>
                ))}
              </select>

              {/* Club select */}
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl">{club2Obj.badgeEmoji}</span>
                <select
                  value={p2Club}
                  onChange={(e) => {
                    sounds.playMove();
                    setP2Club(e.target.value);
                  }}
                  className="bg-chess-elevated border border-chess-border rounded-lg px-2.5 py-1.5 text-xs text-chess-text font-medium flex-1 focus:outline-none focus:border-chess-green"
                >
                  {FIFA_CLUBS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.ratingStars}★)
                    </option>
                  ))}
                </select>
              </div>

              {/* Score Control */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-chess-muted">Goals</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMove();
                      setP2Score((s) => Math.max(0, s - 1));
                    }}
                    className="w-10 h-10 rounded-lg bg-chess-elevated active:bg-chess-border text-chess-text flex items-center justify-center font-bold text-base transition-colors border border-chess-border"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-2xl font-black text-chess-text">
                    {p2Score}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMove();
                      setP2Score((s) => s + 1);
                    }}
                    className="w-10 h-10 rounded-lg bg-chess-elevated active:bg-chess-border text-chess-text flex items-center justify-center font-bold text-base transition-colors border border-chess-border"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Match Conditions & Rage Quit Toggle */}
          <div className="bg-chess-card border border-chess-border/60 rounded-xl p-3 space-y-2.5">
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chess-muted">
              Match Conditions
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-chess-text p-2 rounded-lg bg-chess-elevated border border-chess-border/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExtraTime}
                  onChange={(e) => {
                    sounds.playMove();
                    setIsExtraTime(e.target.checked);
                  }}
                  className="rounded text-chess-green focus:ring-0 w-4 h-4 bg-chess-darkest border-chess-border"
                />
                <span>Extra Time</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-chess-text p-2 rounded-lg bg-chess-elevated border border-chess-border/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPenalties}
                  onChange={(e) => {
                    sounds.playMove();
                    setIsPenalties(e.target.checked);
                  }}
                  className="rounded text-chess-green focus:ring-0 w-4 h-4 bg-chess-darkest border-chess-border"
                />
                <span>Penalties</span>
              </label>

              <label className="col-span-2 sm:col-span-1 flex items-center space-x-2 text-xs font-semibold text-chess-red p-2 rounded-lg bg-chess-elevated border border-chess-border/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRageQuit}
                  onChange={(e) => {
                    sounds.playMove();
                    setIsRageQuit(e.target.checked);
                  }}
                  className="rounded text-chess-red focus:ring-0 w-4 h-4 bg-chess-darkest border-chess-border"
                />
                <span>🚨 Rage Quit / Forfeit</span>
              </label>
            </div>

            {/* Rage Quit Picker */}
            {isRageQuit && (
              <div className="p-2.5 rounded-lg bg-chess-red-bg border border-chess-red/30 flex flex-col xs:flex-row items-start xs:items-center justify-between text-xs gap-2">
                <div className="flex items-center space-x-1.5 text-chess-red">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Who disconnected?</span>
                </div>
                <div className="flex items-center space-x-2 w-full xs:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMove();
                      setRageQuitter('p1');
                    }}
                    className={`flex-1 xs:flex-initial px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      rageQuitter === 'p1' ? 'bg-chess-red text-white' : 'bg-chess-elevated text-chess-text'
                    }`}
                  >
                    {player1?.name || 'Player 1'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMove();
                      setRageQuitter('p2');
                    }}
                    className={`flex-1 xs:flex-initial px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      rageQuitter === 'p2' ? 'bg-chess-red text-white' : 'bg-chess-elevated text-chess-text'
                    }`}
                  >
                    {player2?.name || 'Player 2'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LIVE ELO PREVIEW BANNER */}
          {liveElo && player1 && player2 && (
            <div className="bg-gradient-to-r from-chess-darkest via-chess-card to-chess-darkest border border-chess-border rounded-xl p-3 shadow-inner">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chess-muted mb-1.5">
                <span className="flex items-center gap-1 text-chess-gold">
                  <Sparkles className="w-3 h-3" /> Live Elo Impact
                </span>
                <span>Win Prob: {liveElo.p1Expected}% - {liveElo.p2Expected}%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                {/* P1 Delta */}
                <div className="bg-chess-elevated/70 p-2 rounded-lg border border-chess-border/50">
                  <span className="text-[11px] font-bold text-chess-text block truncate">{player1.name}</span>
                  <div className="flex items-center justify-center space-x-1 mt-0.5">
                    <span className="text-xs text-chess-muted">{player1.rating}</span>
                    <span className="text-[10px] text-chess-muted">→</span>
                    <span className="text-sm font-black text-chess-text">{liveElo.p1NewRating}</span>
                    <span className={`text-[10px] font-black px-1 rounded ${
                      liveElo.p1Delta > 0 
                        ? 'text-chess-green bg-chess-green/10' 
                        : liveElo.p1Delta < 0 
                        ? 'text-chess-red bg-chess-red/10' 
                        : 'text-chess-muted'
                    }`}>
                      {liveElo.p1Delta > 0 ? `+${liveElo.p1Delta}` : liveElo.p1Delta}
                    </span>
                  </div>
                </div>

                {/* P2 Delta */}
                <div className="bg-chess-elevated/70 p-2 rounded-lg border border-chess-border/50">
                  <span className="text-[11px] font-bold text-chess-text block truncate">{player2.name}</span>
                  <div className="flex items-center justify-center space-x-1 mt-0.5">
                    <span className="text-xs text-chess-muted">{player2.rating}</span>
                    <span className="text-[10px] text-chess-muted">→</span>
                    <span className="text-sm font-black text-chess-text">{liveElo.p2NewRating}</span>
                    <span className={`text-[10px] font-black px-1 rounded ${
                      liveElo.p2Delta > 0 
                        ? 'text-chess-green bg-chess-green/10' 
                        : liveElo.p2Delta < 0 
                        ? 'text-chess-red bg-chess-red/10' 
                        : 'text-chess-muted'
                    }`}>
                      {liveElo.p2Delta > 0 ? `+${liveElo.p2Delta}` : liveElo.p2Delta}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1 pb-4 sm:pb-0">
            <button
              type="submit"
              className="w-full btn-chess-green py-3 rounded-xl text-white font-black text-sm tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-chess-btn active:translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Confirm & Record Score</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
