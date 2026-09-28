'use client';

import React, { useState } from 'react';
import { Player } from '@/types';
import { getDivision } from '@/lib/elo';
import { getClubById } from '@/lib/clubs';
import { sounds } from '@/lib/sound';
import { 
  X, 
  UserPlus, 
  Trash2, 
  Users, 
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';

interface ManagePlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onOpenAddPlayer: () => void;
  onDeletePlayer: (player: Player) => void;
}

export const ManagePlayersModal: React.FC<ManagePlayersModalProps> = ({
  isOpen,
  onClose,
  players,
  onOpenAddPlayer,
  onDeletePlayer,
}) => {
  const [playerToConfirmDelete, setPlayerToConfirmDelete] = useState<Player | null>(null);

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    if (!playerToConfirmDelete) return;
    sounds.playBlunder();
    onDeletePlayer(playerToConfirmDelete);
    setPlayerToConfirmDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#24221f] border-t sm:border border-chess-border rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-chess-modal flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-chess-border rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-chess-border bg-chess-darkest/60 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-chess-gold/20 border border-chess-gold/40 flex items-center justify-center text-chess-gold font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-chess-text tracking-tight">Manage Roommates</h2>
              <p className="text-[10px] sm:text-xs text-chess-muted">Add new players or remove players from the database</p>
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

        {/* Action Header: Add New Player Button */}
        <div className="p-3.5 border-b border-chess-border/60 bg-chess-card/40 flex items-center justify-between">
          <span className="text-xs font-bold text-chess-muted">
            Enrolled Players ({players.length})
          </span>
          <button
            onClick={() => {
              sounds.playMove();
              onClose();
              onOpenAddPlayer();
            }}
            className="btn-chess-green text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Roommate</span>
          </button>
        </div>

        {/* Players List */}
        <div className="p-3.5 overflow-y-auto space-y-2 flex-1 divide-y divide-chess-border/30">
          {players.map((player) => {
            const div = getDivision(player.rating);
            const club = getClubById(player.favoriteClub);

            return (
              <div 
                key={player.id}
                className="pt-2 first:pt-0 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
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
                    <div className="flex items-center space-x-2 text-[10px] text-chess-muted truncate">
                      <span>{player.rating} Elo</span>
                      <span>•</span>
                      <span>{player.wins}W - {player.losses}L</span>
                    </div>
                  </div>
                </div>

                {/* Remove Player Button */}
                <button
                  onClick={() => {
                    sounds.playBlunder();
                    setPlayerToConfirmDelete(player);
                  }}
                  className="p-2 rounded-lg bg-chess-elevated hover:bg-red-950/60 active:bg-red-900 border border-chess-border hover:border-red-500/40 text-chess-muted hover:text-red-400 transition-colors flex-shrink-0 ml-2"
                  title={`Remove ${player.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Alert Banner / Sheet */}
        {playerToConfirmDelete && (
          <div className="p-4 bg-red-950/90 border-t border-red-500/50 flex flex-col space-y-2 animate-fadeIn flex-shrink-0">
            <div className="flex items-center space-x-2 text-red-300 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Remove "{playerToConfirmDelete.name}" from database?</span>
            </div>
            <p className="text-[11px] text-red-200/80">
              This will permanently delete {playerToConfirmDelete.name}'s profile and rating from the active ladder.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setPlayerToConfirmDelete(null)}
                className="flex-1 py-1.5 rounded-lg bg-chess-elevated text-xs font-bold text-chess-text"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-xs font-black text-white shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
