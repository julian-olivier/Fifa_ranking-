'use client';

import React, { useEffect, useState } from 'react';
import { AppData, Match, Player, Tournament } from '@/types';
import { INITIAL_DATA } from '@/lib/seed';
import { fetchAppData, persistAppData, processMatch, resetToSeedData, LogMatchInput } from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
import { Podium } from '@/components/Podium';
import { Leaderboard } from '@/components/Leaderboard';
import { RecentMatches } from '@/components/RecentMatches';
import { RivalryExplorer } from '@/components/RivalryExplorer';
import { TournamentView } from '@/components/TournamentView';
import { LogMatchModal } from '@/components/LogMatchModal';
import { PlayerProfileModal } from '@/components/PlayerProfileModal';
import { AddPlayerModal } from '@/components/AddPlayerModal';
import { ManagePlayersModal } from '@/components/ManagePlayersModal';
import { sounds } from '@/lib/sound';
import { CheckCircle2, X } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'leaderboard' | 'matches' | 'rivalry' | 'tournaments'>('leaderboard');

  // Modal states
  const [isLogMatchOpen, setIsLogMatchOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isManagePlayersOpen, setIsManagePlayersOpen] = useState(false);
  const [profilePlayer, setProfilePlayer] = useState<Player | null>(null);
  const [challengePlayer, setChallengePlayer] = useState<Player | null>(null);

  // Fast Match Result Toast
  const [matchToast, setMatchToast] = useState<{
    p1Name: string;
    p2Name: string;
    score: string;
    p1Delta: number;
    p2Delta: number;
    p1Rating: number;
    p2Rating: number;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const loaded = await fetchAppData();
        setData(loaded);
      } catch (e) {
        console.error('Error fetching app data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogMatch = (input: LogMatchInput) => {
    try {
      const { updatedData, createdMatch } = processMatch(data, input);
      setData(updatedData);
      persistAppData(updatedData);
      setIsLogMatchOpen(false);

      const p1 = updatedData.players.find((p) => p.id === createdMatch.player1Id);
      const p2 = updatedData.players.find((p) => p.id === createdMatch.player2Id);

      // Play audio feedback
      if (createdMatch.player1Score !== createdMatch.player2Score) {
        sounds.playVictory();
      } else {
        sounds.playMove();
      }

      // Display non-intrusive score & Elo update banner
      setMatchToast({
        p1Name: p1?.name || 'Player 1',
        p2Name: p2?.name || 'Player 2',
        score: `${createdMatch.player1Score} - ${createdMatch.player2Score}`,
        p1Delta: createdMatch.player1RatingDelta,
        p2Delta: createdMatch.player2RatingDelta,
        p1Rating: createdMatch.player1RatingAfter,
        p2Rating: createdMatch.player2RatingAfter,
      });

      setTimeout(() => {
        setMatchToast(null);
      }, 7000);
    } catch (e) {
      alert('Failed to log match: ' + e);
    }
  };

  const handleAddPlayer = (newPlayer: Player) => {
    const updated: AppData = {
      ...data,
      players: [...data.players, newPlayer],
    };
    setData(updated);
    persistAppData(updated);
  };

  const handleDeletePlayer = (playerToDelete: Player) => {
    const updated: AppData = {
      ...data,
      players: data.players.filter((p) => p.id !== playerToDelete.id),
    };
    setData(updated);
    persistAppData(updated);
  };

  const handleUpdateTournaments = (tournaments: Tournament[]) => {
    const updated: AppData = {
      ...data,
      tournaments,
    };
    setData(updated);
    persistAppData(updated);
  };

  const handleResetData = async () => {
    const reset = await resetToSeedData();
    setData(reset);
  };

  const handleImportData = (imported: AppData) => {
    setData(imported);
    persistAppData(imported);
  };

  const handleQuickMatch = (p1: Player, p2: Player) => {
    setChallengePlayer(p1);
    setIsLogMatchOpen(true);
  };

  // Sorted players by Elo
  const sortedByRating = [...data.players].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#161512] chess-pattern text-chess-text flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLogMatch={() => {
          setChallengePlayer(null);
          setIsLogMatchOpen(true);
        }}
        onOpenAddPlayer={() => setIsAddPlayerOpen(true)}
        onOpenManagePlayers={() => setIsManagePlayersOpen(true)}
        onResetData={handleResetData}
        appData={data}
        onImportData={handleImportData}
      />

      {/* Score Logged Toast Notification */}
      {matchToast && (
        <div className="sticky top-16 sm:top-20 z-30 max-w-xl mx-auto w-full px-3 pt-2 animate-fadeIn">
          <div className="bg-[#24221f] border border-chess-green/50 rounded-xl p-3 shadow-chess-card flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2.5 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-chess-green flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-extrabold text-chess-text block truncate">
                  Score Logged: {matchToast.p1Name} <span className="text-chess-gold">{matchToast.score}</span> {matchToast.p2Name}
                </span>
                <span className="text-[11px] text-chess-muted block truncate">
                  {matchToast.p1Name}: {matchToast.p1Rating} ({matchToast.p1Delta >= 0 ? `+${matchToast.p1Delta}` : matchToast.p1Delta}) • {matchToast.p2Name}: {matchToast.p2Rating} ({matchToast.p2Delta >= 0 ? `+${matchToast.p2Delta}` : matchToast.p2Delta})
                </span>
              </div>
            </div>
            <button
              onClick={() => setMatchToast(null)}
              className="text-chess-muted hover:text-chess-text p-1 ml-2 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-28 sm:pb-8">
        
        {/* View Switcher Content */}
        {currentTab === 'leaderboard' && (
          <div className="space-y-6">
            <Podium
              players={sortedByRating}
              onSelectPlayer={(p) => setProfilePlayer(p)}
            />
            <Leaderboard
              players={data.players}
              onSelectPlayer={(p) => setProfilePlayer(p)}
              onChallengePlayer={(p) => {
                setChallengePlayer(p);
                setIsLogMatchOpen(true);
              }}
              onOpenAddPlayer={() => setIsAddPlayerOpen(true)}
              onOpenManagePlayers={() => setIsManagePlayersOpen(true)}
            />
          </div>
        )}

        {currentTab === 'matches' && (
          <RecentMatches
            matches={data.matches}
            players={data.players}
          />
        )}

        {currentTab === 'rivalry' && (
          <RivalryExplorer
            players={data.players}
            matches={data.matches}
            onQuickMatch={handleQuickMatch}
          />
        )}

        {currentTab === 'tournaments' && (
          <TournamentView
            tournaments={data.tournaments}
            players={data.players}
            onUpdateTournaments={handleUpdateTournaments}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-chess-border/80 bg-chess-card/40 py-6 mt-12 text-center text-xs text-chess-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-chess-green font-bold">♞ FIFA.ELO</span>
            <span>•</span>
            <span>Roommate League & Game Score Tracker</span>
          </div>
          <div className="text-chess-muted/80">
            Chess.com-inspired Elo ratings & match results
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LogMatchModal
        isOpen={isLogMatchOpen}
        onClose={() => {
          setIsLogMatchOpen(false);
          setChallengePlayer(null);
        }}
        players={data.players}
        preselectedPlayer={challengePlayer}
        onMatchLogged={handleLogMatch}
      />

      <PlayerProfileModal
        player={profilePlayer}
        onClose={() => setProfilePlayer(null)}
        allPlayers={data.players}
        matches={data.matches}
        onChallengePlayer={(p) => {
          setProfilePlayer(null);
          setChallengePlayer(p);
          setIsLogMatchOpen(true);
        }}
        onDeletePlayer={(playerToDelete) => {
          handleDeletePlayer(playerToDelete);
          setProfilePlayer(null);
        }}
      />

      <AddPlayerModal
        isOpen={isAddPlayerOpen}
        onClose={() => setIsAddPlayerOpen(false)}
        onAddPlayer={handleAddPlayer}
      />

      <ManagePlayersModal
        isOpen={isManagePlayersOpen}
        onClose={() => setIsManagePlayersOpen(false)}
        players={data.players}
        onOpenAddPlayer={() => {
          setIsManagePlayersOpen(false);
          setIsAddPlayerOpen(true);
        }}
        onDeletePlayer={handleDeletePlayer}
      />

    </div>
  );
}
