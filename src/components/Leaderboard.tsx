'use client';

import React, { useState } from 'react';
import { Player } from '@/types';
import { getDivision } from '@/lib/elo';
import { getClubById } from '@/lib/clubs';
import { sounds } from '@/lib/sound';
import { 
  Trophy, 
  Flame, 
  Snowflake, 
  ChevronRight, 
  Swords, 
  Search,
  Sparkles,
  UserPlus,
  Users
} from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onChallengePlayer: (player: Player) => void;
  onOpenAddPlayer?: () => void;
  onOpenManagePlayers?: () => void;
}

type SortField = 'rating' | 'winrate' | 'goals' | 'streak';

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  onSelectPlayer,
  onChallengePlayer,
  onOpenAddPlayer,
  onOpenManagePlayers,
}) => {
  const [sortField, setSortField] = useState<SortField>('rating');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedPlayers = [...players]
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.favoriteClub.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'rating') return b.rating - a.rating;
      if (sortField === 'winrate') {
        const totalA = a.wins + a.draws + a.losses || 1;
        const totalB = b.wins + b.draws + b.losses || 1;
        return b.wins / totalA - a.wins / totalA;
      }
      if (sortField === 'goals') return b.goalsScored - a.goalsScored;
      if (sortField === 'streak') return b.streak - a.streak;
      return 0;
    });

  return (
    <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl shadow-chess-card overflow-hidden">
      
      {/* Header and Controls */}
      <div className="p-3 sm:p-6 border-b border-chess-border bg-chess-card/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-chess-gold" />
              <h2 className="font-extrabold text-base sm:text-xl text-chess-text">Global Ladder</h2>
            </div>
            <p className="text-[11px] sm:text-xs text-chess-muted mt-0.5">
              Competitive head-to-head FIFA rankings
            </p>
          </div>

          <div className="flex items-center space-x-1.5 sm:hidden">
            {onOpenAddPlayer && (
              <button
                onClick={() => {
                  sounds.playMove();
                  onOpenAddPlayer();
                }}
                className="btn-chess-green text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add</span>
              </button>
            )}
            {onOpenManagePlayers && (
              <button
                onClick={() => {
                  sounds.playMove();
                  onOpenManagePlayers();
                }}
                className="btn-chess-secondary text-chess-text text-[11px] font-bold p-1.5 rounded-lg flex items-center"
                title="Manage roommates"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-chess-muted" />
            <input
              type="text"
              placeholder="Search roommate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-chess-elevated border border-chess-border text-xs rounded-lg pl-8 pr-3 py-1.5 text-chess-text placeholder-chess-muted/60 focus:outline-none focus:border-chess-green transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between bg-chess-elevated p-1 rounded-lg border border-chess-border text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => {
                sounds.playMove();
                setSortField('rating');
              }}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] ${
                sortField === 'rating' ? 'bg-chess-card text-chess-gold shadow-sm font-bold' : 'text-chess-muted'
              }`}
            >
              Elo
            </button>
            <button
              onClick={() => {
                sounds.playMove();
                setSortField('winrate');
              }}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] ${
                sortField === 'winrate' ? 'bg-chess-card text-chess-green shadow-sm font-bold' : 'text-chess-muted'
              }`}
            >
              Win %
            </button>
            <button
              onClick={() => {
                sounds.playMove();
                setSortField('goals');
              }}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] ${
                sortField === 'goals' ? 'bg-chess-card text-chess-blue shadow-sm font-bold' : 'text-chess-muted'
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => {
                sounds.playMove();
                setSortField('streak');
              }}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] ${
                sortField === 'streak' ? 'bg-chess-card text-orange-400 shadow-sm font-bold' : 'text-chess-muted'
              }`}
            >
              Streak
            </button>
          </div>

          {onOpenAddPlayer && (
            <button
              onClick={() => {
                sounds.playMove();
                onOpenAddPlayer();
              }}
              className="hidden sm:flex btn-chess-green text-white text-xs font-bold px-3 py-1.5 rounded-lg items-center space-x-1 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Roommate</span>
            </button>
          )}

          {onOpenManagePlayers && (
            <button
              onClick={() => {
                sounds.playMove();
                onOpenManagePlayers();
              }}
              className="hidden sm:flex btn-chess-secondary text-chess-text text-xs font-bold px-3 py-1.5 rounded-lg items-center space-x-1"
              title="Manage or remove roommates"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage</span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE LIST VIEW (Clean App-style touch cards, 0 horizontal scroll!) */}
      <div className="block sm:hidden divide-y divide-chess-border/40">
        {sortedPlayers.map((player, index) => {
          const div = getDivision(player.rating);
          const club = getClubById(player.favoriteClub);
          const totalMatches = player.wins + player.draws + player.losses;
          const winRate = totalMatches > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;

          return (
            <div
              key={player.id}
              onClick={() => {
                sounds.playMove();
                onSelectPlayer(player);
              }}
              className="p-3 active:bg-chess-elevated transition-colors cursor-pointer flex flex-col space-y-2"
            >
              {/* Top row: Rank + Avatar + Name + Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${
                    index === 0 ? 'bg-amber-400 text-stone-900' : index === 1 ? 'bg-slate-300 text-stone-900' : index === 2 ? 'bg-amber-700 text-amber-100' : 'text-chess-muted bg-chess-elevated'
                  }`}>
                    {index + 1}
                  </span>

                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${player.avatarBg} flex items-center justify-center text-lg shadow-sm relative flex-shrink-0`}>
                    {player.avatar}
                    <span className="absolute -bottom-1 -right-1 text-[10px] p-0.2 rounded-full bg-chess-darkest border border-chess-border">
                      {club.badgeEmoji}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      {player.title && (
                        <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-chess-elevated text-chess-gold border border-chess-gold/40">
                          {player.title}
                        </span>
                      )}
                      <span className="font-bold text-chess-text text-sm truncate">
                        {player.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-chess-muted truncate">
                      {club.name} • {player.playstyle}
                    </p>
                  </div>
                </div>

                {/* Rating badge */}
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="font-black text-base text-chess-text block leading-tight">
                    {player.rating}
                  </span>
                  <span className={`text-[8px] uppercase font-black px-1.5 py-0.2 rounded border ${div.borderColor} ${div.bgColor} ${div.textColor}`}>
                    {div.badge}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Form + Stats + Quick Challenge */}
              <div className="flex items-center justify-between pt-1 border-t border-chess-border/30 text-xs">
                {/* Form Pills */}
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] uppercase font-bold text-chess-muted mr-1">Form:</span>
                  {player.form.slice(0, 5).map((res, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                        res === 'W'
                          ? 'bg-chess-green text-chess-darkest'
                          : res === 'D'
                          ? 'bg-stone-500 text-chess-text'
                          : 'bg-chess-red text-white'
                      }`}
                    >
                      {res}
                    </span>
                  ))}
                </div>

                {/* Stats & Challenge */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-chess-muted">
                    <span className="text-chess-green">{player.wins}W</span>-<span className="text-chess-red">{player.losses}L</span> ({winRate}%)
                  </span>

                  {player.streak > 0 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded flex items-center">
                      <Flame className="w-2.5 h-2.5 mr-0.5 fill-amber-400" /> {player.streak}W
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playMove();
                      onChallengePlayer(player);
                    }}
                    className="p-1 rounded-md bg-chess-elevated active:bg-chess-green text-chess-muted active:text-white border border-chess-border"
                    title="Challenge"
                  >
                    <Swords className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP & TABLET TABLE VIEW */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-chess-border/80 text-[11px] uppercase tracking-wider text-chess-muted bg-chess-darkest/40">
              <th className="py-3 px-4 font-bold text-center w-12">#</th>
              <th className="py-3 px-4 font-bold">Roommate</th>
              <th className="py-3 px-4 font-bold text-center">Elo Rating</th>
              <th className="py-3 px-4 font-bold text-center hidden md:table-cell">Recent Form</th>
              <th className="py-3 px-4 font-bold text-center">W - D - L</th>
              <th className="py-3 px-4 font-bold text-center hidden lg:table-cell">Win %</th>
              <th className="py-3 px-4 font-bold text-center hidden md:table-cell">Goals (GD)</th>
              <th className="py-3 px-4 font-bold text-center">Streak</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chess-border/40 text-sm">
            {sortedPlayers.map((player, index) => {
              const div = getDivision(player.rating);
              const club = getClubById(player.favoriteClub);
              const totalMatches = player.wins + player.draws + player.losses;
              const winRate = totalMatches > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
              const goalDiff = player.goalsScored - player.goalsConceded;

              const rankBadge =
                index === 0
                  ? 'bg-amber-400 text-stone-900 font-black'
                  : index === 1
                  ? 'bg-slate-300 text-stone-900 font-black'
                  : index === 2
                  ? 'bg-amber-700 text-amber-100 font-black'
                  : 'text-chess-muted font-bold';

              return (
                <tr
                  key={player.id}
                  onClick={() => {
                    sounds.playMove();
                    onSelectPlayer(player);
                  }}
                  className="hover:bg-chess-elevated/70 transition-colors cursor-pointer group"
                >
                  {/* Rank Number */}
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${rankBadge}`}>
                      {index + 1}
                    </span>
                  </td>

                  {/* Player Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${player.avatarBg} flex items-center justify-center text-xl shadow-md relative flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        {player.avatar}
                        <span className="absolute -bottom-1 -right-1 text-xs p-0.5 rounded-full bg-chess-darkest border border-chess-border" title={club.name}>
                          {club.badgeEmoji}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {player.title && (
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-chess-elevated text-chess-gold border border-chess-gold/40">
                              {player.title}
                            </span>
                          )}
                          <span className="font-bold text-chess-text truncate group-hover:text-chess-green transition-colors">
                            {player.name}
                          </span>
                        </div>
                        <p className="text-xs text-chess-muted truncate">
                          {player.playstyle} • <span className="text-chess-muted/80">{club.name}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Rating & Division */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-base text-chess-text tracking-tight">
                        {player.rating}
                      </span>
                      <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${div.borderColor} ${div.bgColor} ${div.textColor}`}>
                        {div.badge}
                      </span>
                    </div>
                  </td>

                  {/* Recent Form */}
                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {player.form.slice(0, 5).map((res, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                            res === 'W'
                              ? 'bg-chess-green text-chess-darkest shadow-sm'
                              : res === 'D'
                              ? 'bg-stone-500 text-chess-text'
                              : 'bg-chess-red text-white'
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* W - D - L Record */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs font-semibold text-chess-text">
                      <span className="text-chess-green">{player.wins}W</span>
                      <span className="text-chess-muted mx-1">-</span>
                      <span className="text-slate-400">{player.draws}D</span>
                      <span className="text-chess-muted mx-1">-</span>
                      <span className="text-chess-red">{player.losses}L</span>
                    </span>
                  </td>

                  {/* Win Rate */}
                  <td className="py-3 px-4 text-center hidden lg:table-cell">
                    <div className="w-20 mx-auto">
                      <div className="flex items-center justify-between text-xs font-bold text-chess-text mb-1">
                        <span>{winRate}%</span>
                        <span className="text-[10px] text-chess-muted">({totalMatches}p)</span>
                      </div>
                      <div className="w-full bg-chess-elevated h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-chess-green h-full rounded-full transition-all duration-500"
                          style={{ width: `${winRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Goals & Goal Diff */}
                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="text-xs font-semibold">
                      <span className="text-chess-text">{player.goalsScored}</span>
                      <span className="text-chess-muted text-[10px] ml-1">
                        ({goalDiff >= 0 ? `+${goalDiff}` : goalDiff})
                      </span>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-3 px-4 text-center">
                    {player.streak > 0 ? (
                      <span className="inline-flex items-center text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded-full">
                        <Flame className="w-3.5 h-3.5 mr-0.5 fill-amber-400" />
                        {player.streak}W
                      </span>
                    ) : player.streak < 0 ? (
                      <span className="inline-flex items-center text-xs font-bold text-sky-400 bg-sky-950/40 border border-sky-600/30 px-2 py-0.5 rounded-full">
                        <Snowflake className="w-3.5 h-3.5 mr-0.5" />
                        {Math.abs(player.streak)}L
                      </span>
                    ) : (
                      <span className="text-xs text-chess-muted font-bold">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          sounds.playMove();
                          onChallengePlayer(player);
                        }}
                        title={`Challenge ${player.name}`}
                        className="p-1.5 rounded-lg bg-chess-elevated hover:bg-chess-green hover:text-white text-chess-muted border border-chess-border transition-colors"
                      >
                        <Swords className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          sounds.playMove();
                          onSelectPlayer(player);
                        }}
                        title="View Profile"
                        className="p-1.5 rounded-lg bg-chess-elevated hover:bg-chess-border text-chess-muted hover:text-chess-text border border-chess-border transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
