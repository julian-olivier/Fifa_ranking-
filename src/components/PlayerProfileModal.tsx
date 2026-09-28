'use client';

import React from 'react';
import { Match, Player } from '@/types';
import { getDivision } from '@/lib/elo';
import { getClubById } from '@/lib/clubs';
import { ALL_ACHIEVEMENTS } from '@/lib/achievements';
import { sounds } from '@/lib/sound';
import { 
  X, 
  Trophy, 
  TrendingUp, 
  Flame, 
  Snowflake, 
  Swords,
  Trash2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface PlayerProfileModalProps {
  player: Player | null;
  onClose: () => void;
  allPlayers: Player[];
  matches: Match[];
  onChallengePlayer: (player: Player) => void;
  onDeletePlayer?: (player: Player) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  player,
  onClose,
  allPlayers,
  matches,
  onChallengePlayer,
  onDeletePlayer,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  if (!player) return null;

  const div = getDivision(player.rating);
  const club = getClubById(player.favoriteClub);

  const totalGames = player.wins + player.draws + player.losses;
  const winRate = totalGames > 0 ? Math.round((player.wins / totalGames) * 100) : 0;
  const avgGoals = totalGames > 0 ? (player.goalsScored / totalGames).toFixed(1) : '0.0';

  const chartData = player.ratingHistory.map((pt, idx) => ({
    name: pt.date ? pt.date.slice(5) : `G${idx + 1}`,
    rating: pt.rating,
  }));

  // Head-to-Head stats against other roommates
  const h2hStats = allPlayers
    .filter((p) => p.id !== player.id)
    .map((opp) => {
      const vsMatches = matches.filter(
        (m) =>
          (m.player1Id === player.id && m.player2Id === opp.id) ||
          (m.player1Id === opp.id && m.player2Id === player.id)
      );

      let w = 0;
      let d = 0;
      let l = 0;
      vsMatches.forEach((m) => {
        const isP1 = m.player1Id === player.id;
        const myScore = isP1 ? m.player1Score : m.player2Score;
        const oppScore = isP1 ? m.player2Score : m.player1Score;
        if (myScore > oppScore) w++;
        else if (myScore < oppScore) l++;
        else d++;
      });

      return {
        opponent: opp,
        total: vsMatches.length,
        wins: w,
        draws: d,
        losses: l,
      };
    })
    .filter((h) => h.total > 0);

  const playerAchievementsSet = new Set(player.achievements || []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#24221f] border-t sm:border border-chess-border rounded-t-3xl sm:rounded-3xl w-full max-w-3xl shadow-chess-modal flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-chess-border rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Banner & Header */}
        <div className="relative bg-gradient-to-r from-chess-darkest via-chess-card to-chess-darkest p-4 sm:p-6 border-b border-chess-border flex-shrink-0">
          <button
            onClick={() => {
              sounds.playMove();
              onClose();
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg bg-chess-elevated hover:bg-chess-border text-chess-muted hover:text-chess-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Avatar */}
            <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${player.avatarBg} flex items-center justify-center text-3xl sm:text-4xl shadow-xl relative border-2 border-chess-border flex-shrink-0`}>
              {player.avatar}
              <span className="absolute -bottom-1 -right-1 text-xs sm:text-base p-0.5 sm:p-1 rounded-full bg-chess-darkest border border-chess-border shadow" title={club.name}>
                {club.badgeEmoji}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex flex-wrap items-center gap-1.5">
                {player.title && (
                  <span className="text-[9px] sm:text-xs font-black uppercase px-1.5 py-0.2 rounded bg-chess-elevated text-chess-gold border border-chess-gold/40 shadow-sm">
                    {player.title}
                  </span>
                )}
                <h2 className="text-lg sm:text-2xl font-black text-chess-text tracking-tight truncate">
                  {player.name}
                </h2>
                <span className={`text-[8px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${div.borderColor} ${div.bgColor} ${div.textColor}`}>
                  {div.badge}
                </span>
              </div>

              <p className="text-[11px] text-chess-muted italic truncate">"{player.nickname}"</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-chess-muted">
                <span>{player.playstyle}</span>
                <span>•</span>
                <span>{club.name}</span>
              </div>
            </div>

            {/* Elo Stats Badge */}
            <div className="bg-chess-card border border-chess-border rounded-xl p-2 sm:p-3 px-3 sm:px-5 text-center flex-shrink-0 hidden xs:block">
              <span className="text-[9px] uppercase font-bold text-chess-muted tracking-wider block">Elo</span>
              <span className="text-xl sm:text-3xl font-black text-chess-text">{player.rating}</span>
              <span className="text-[9px] text-chess-muted block">
                Peak: <strong className="text-chess-gold">{player.peakRating}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-chess-card border border-chess-border/80 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted block">Record</span>
              <span className="text-xs sm:text-sm font-black text-chess-text mt-0.5 block">
                <span className="text-chess-green">{player.wins}W</span> - <span className="text-slate-400">{player.draws}D</span> - <span className="text-chess-red">{player.losses}L</span>
              </span>
            </div>

            <div className="bg-chess-card border border-chess-border/80 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted block">Win Rate</span>
              <span className="text-xs sm:text-sm font-black text-chess-green mt-0.5 block">{winRate}%</span>
            </div>

            <div className="bg-chess-card border border-chess-border/80 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted block">Avg Goals</span>
              <span className="text-xs sm:text-sm font-black text-chess-blue mt-0.5 block">{avgGoals} / g</span>
            </div>

            <div className="bg-chess-card border border-chess-border/80 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted block">Streak</span>
              <div className="flex items-center justify-center mt-0.5">
                {player.streak > 0 ? (
                  <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center">
                    <Flame className="w-3 h-3 fill-amber-400 mr-0.5" /> {player.streak}W
                  </span>
                ) : player.streak < 0 ? (
                  <span className="text-xs sm:text-sm font-black text-sky-400 flex items-center">
                    <Snowflake className="w-3 h-3 mr-0.5" /> {Math.abs(player.streak)}L
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-black text-chess-muted">-</span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Rating Progression Chart */}
          <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <TrendingUp className="w-4 h-4 text-chess-green" />
                <h3 className="font-extrabold text-xs sm:text-sm text-chess-text uppercase tracking-wide">
                  Rating Trajectory
                </h3>
              </div>
              <span className="text-[10px] sm:text-xs text-chess-muted font-medium">Elo over time</span>
            </div>

            <div className="h-36 sm:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#736f68" 
                    fontSize={9} 
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 50', 'dataMax + 50']} 
                    stroke="#736f68" 
                    fontSize={9} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#262421', 
                      borderColor: '#3d3934',
                      borderRadius: '8px',
                      color: '#f1ede4',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#81b64c" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#81b64c', r: 3 }} 
                    activeDot={{ r: 5, fill: '#f0c15c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trophy Cabinet / Achievements */}
          <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Trophy className="w-4 h-4 text-chess-gold" />
                <h3 className="font-extrabold text-xs sm:text-sm text-chess-text uppercase tracking-wide">
                  Trophies ({player.achievements?.length || 0} / {ALL_ACHIEVEMENTS.length})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = playerAchievementsSet.has(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-2 rounded-xl border flex items-center space-x-2 transition-all ${
                      isUnlocked
                        ? 'bg-chess-elevated/70 border-chess-gold/40 shadow-sm'
                        : 'bg-chess-darkest/40 border-chess-border/40 opacity-40'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">
                      {isUnlocked ? ach.icon : '🔒'}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-chess-text truncate">
                        {ach.title}
                      </h4>
                      <p className="text-[9px] text-chess-muted line-clamp-1">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Head-to-Head Record */}
          {h2hStats.length > 0 && (
            <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3 sm:p-5">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                <Swords className="w-4 h-4 text-chess-red" />
                <h3 className="font-extrabold text-xs sm:text-sm text-chess-text uppercase tracking-wide">
                  Rivalry Breakdown
                </h3>
              </div>

              <div className="divide-y divide-chess-border/50 text-xs">
                {h2hStats.map((h, i) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-base">{h.opponent.avatar}</span>
                      <span className="font-bold text-chess-text text-xs truncate">{h.opponent.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-2">
                      <span className="font-bold text-[11px]">
                        <span className="text-chess-green">{h.wins}W</span>-<span className="text-slate-400">{h.draws}D</span>-<span className="text-chess-red">{h.losses}L</span>
                      </span>
                      <span className="text-[10px] text-chess-muted">({h.total}m)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Box if triggered */}
          {showConfirmDelete ? (
            <div className="p-3.5 bg-red-950/80 border border-red-500/50 rounded-xl space-y-2 animate-fadeIn">
              <span className="text-xs font-bold text-red-200 block">
                Remove "{player.name}" from the database?
              </span>
              <p className="text-[10px] text-red-300/80">
                This will delete their Elo rating and remove them from the active house leaderboard.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-1.5 rounded-lg bg-chess-elevated text-xs font-bold text-chess-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBlunder();
                    if (onDeletePlayer) onDeletePlayer(player);
                    onClose();
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-xs font-black text-white"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            /* Action Buttons */
            <div className="flex items-center gap-2 pt-1 pb-4 sm:pb-0">
              <button
                onClick={() => {
                  sounds.playMove();
                  onClose();
                  onChallengePlayer(player);
                }}
                className="flex-1 btn-chess-green py-3 rounded-xl text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-chess-btn active:translate-y-0.5"
              >
                <Swords className="w-4 h-4" />
                <span>Challenge {player.name} to a Match</span>
              </button>

              {onDeletePlayer && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-3 rounded-xl bg-chess-elevated hover:bg-red-950/60 active:bg-red-900 border border-chess-border hover:border-red-500/40 text-chess-muted hover:text-red-400 transition-colors flex items-center justify-center"
                  title={`Remove ${player.name} from database`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
