'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Swords, 
  History, 
  Users, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download, 
  Upload,
  Crown,
  Plus
} from 'lucide-react';
import { sounds } from '@/lib/sound';
import { AppData } from '@/types';

interface NavbarProps {
  currentTab: 'leaderboard' | 'matches' | 'rivalry' | 'tournaments';
  setCurrentTab: (tab: 'leaderboard' | 'matches' | 'rivalry' | 'tournaments') => void;
  onOpenLogMatch: () => void;
  onOpenAddPlayer: () => void;
  onOpenManagePlayers?: () => void;
  onResetData: () => void;
  appData: AppData;
  onImportData: (data: AppData) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLogMatch,
  onOpenAddPlayer,
  onOpenManagePlayers,
  onResetData,
  appData,
  onImportData,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  const handleExport = () => {
    sounds.playMove();
    const jsonStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fifa_roommates_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowSettingsMenu(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.players && parsed.matches) {
          onImportData(parsed);
          sounds.playRatingUp();
          alert('Data imported successfully!');
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (err) {
        alert('Failed to parse file: ' + err);
      }
    };
    reader.readAsText(file);
    setShowSettingsMenu(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#1e1d1a]/95 backdrop-blur-md border-b border-chess-border shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Brand */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer select-none" 
              onClick={() => setCurrentTab('leaderboard')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-chess-green to-chess-green-dark flex items-center justify-center shadow-md border border-chess-green-light/30 flex-shrink-0">
                <span className="text-xl sm:text-2xl">♞</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-chess-text">
                    FIFA<span className="text-chess-green">.ELO</span>
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-chess-elevated text-chess-gold border border-chess-gold/30 items-center gap-1">
                    <Crown className="w-2.5 h-2.5" /> Roommate Tour
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-chess-muted font-medium truncate hidden xs:block">
                  Chess.com-style local rankings
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#262421] p-1 rounded-xl border border-chess-border/60">
              <button
                onClick={() => {
                  sounds.playMove();
                  setCurrentTab('leaderboard');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'leaderboard'
                    ? 'bg-chess-elevated text-chess-text shadow-sm border border-chess-border'
                    : 'text-chess-muted hover:text-chess-text hover:bg-chess-darkest/40'
                }`}
              >
                <Trophy className={`w-4 h-4 ${currentTab === 'leaderboard' ? 'text-chess-gold' : ''}`} />
                <span>Leaderboard</span>
              </button>

              <button
                onClick={() => {
                  sounds.playMove();
                  setCurrentTab('matches');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'matches'
                    ? 'bg-chess-elevated text-chess-text shadow-sm border border-chess-border'
                    : 'text-chess-muted hover:text-chess-text hover:bg-chess-darkest/40'
                }`}
              >
                <History className={`w-4 h-4 ${currentTab === 'matches' ? 'text-chess-blue' : ''}`} />
                <span>Matches</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-chess-card text-chess-muted">
                  {appData.matches.length}
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playMove();
                  setCurrentTab('rivalry');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'rivalry'
                    ? 'bg-chess-elevated text-chess-text shadow-sm border border-chess-border'
                    : 'text-chess-muted hover:text-chess-text hover:bg-chess-darkest/40'
                }`}
              >
                <Swords className={`w-4 h-4 ${currentTab === 'rivalry' ? 'text-chess-red' : ''}`} />
                <span>Rivalry Hub</span>
              </button>

              <button
                onClick={() => {
                  sounds.playMove();
                  setCurrentTab('tournaments');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'tournaments'
                    ? 'bg-chess-elevated text-chess-text shadow-sm border border-chess-border'
                    : 'text-chess-muted hover:text-chess-text hover:bg-chess-darkest/40'
                }`}
              >
                <Users className={`w-4 h-4 ${currentTab === 'tournaments' ? 'text-purple-400' : ''}`} />
                <span>Cups</span>
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2">
              
              {/* Audio Toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
                className="p-1.5 sm:p-2 rounded-lg bg-chess-card hover:bg-chess-elevated border border-chess-border text-chess-muted hover:text-chess-text transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-chess-green" /> : <VolumeX className="w-4 h-4 text-chess-muted" />}
              </button>

              {/* Settings & Data Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    sounds.playMove();
                    setShowSettingsMenu(!showSettingsMenu);
                  }}
                  className="p-1.5 sm:p-2 rounded-lg bg-chess-card hover:bg-chess-elevated border border-chess-border text-chess-muted hover:text-chess-text transition-colors"
                  title="Options and data"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-chess-elevated border border-chess-border rounded-xl shadow-chess-modal py-2 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-chess-muted border-b border-chess-border/50">
                      Roommate Data
                    </div>
                    
                    <button
                      onClick={() => {
                        sounds.playMove();
                        onOpenAddPlayer();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-chess-text hover:bg-chess-card text-left transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-chess-green" />
                      <span>Add New Roommate</span>
                    </button>

                    {onOpenManagePlayers && (
                      <button
                        onClick={() => {
                          sounds.playMove();
                          onOpenManagePlayers();
                          setShowSettingsMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-chess-text hover:bg-chess-card text-left transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-chess-gold" />
                        <span>Manage / Remove Players</span>
                      </button>
                    )}

                    <button
                      onClick={handleExport}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-chess-text hover:bg-chess-card text-left transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-chess-blue" />
                      <span>Export JSON Backup</span>
                    </button>

                    <label className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-chess-text hover:bg-chess-card text-left cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>Import JSON Data</span>
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>

                    <div className="border-t border-chess-border/50 my-1"></div>

                    <button
                      onClick={() => {
                        sounds.playBlunder();
                        if (confirm('Reset to default seed data? All custom logged matches will be reverted.')) {
                          onResetData();
                        }
                        setShowSettingsMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 hover:bg-chess-card text-left transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Seed Data</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Primary Action Button: Log Match (Desktop & Tablet) */}
              <button
                onClick={() => {
                  sounds.playMove();
                  onOpenLogMatch();
                }}
                className="btn-chess-green hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white font-bold text-xs sm:text-sm tracking-wide shadow-chess-btn cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Log Match</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Native App Style, Ergonomic for Thumbs) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1916]/95 backdrop-blur-lg border-t border-chess-border/80 px-2 py-1 shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around relative">
          
          {/* Tab 1: Leaderboard */}
          <button
            onClick={() => {
              sounds.playMove();
              setCurrentTab('leaderboard');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              currentTab === 'leaderboard' ? 'text-chess-gold font-bold scale-105' : 'text-chess-muted'
            }`}
          >
            <Trophy className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Ranks</span>
          </button>

          {/* Tab 2: Matches */}
          <button
            onClick={() => {
              sounds.playMove();
              setCurrentTab('matches');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              currentTab === 'matches' ? 'text-chess-blue font-bold scale-105' : 'text-chess-muted'
            }`}
          >
            <History className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Matches</span>
          </button>

          {/* Center Floating Action Button: Log Match */}
          <div className="relative -top-4 flex flex-col items-center">
            <button
              onClick={() => {
                sounds.playMove();
                onOpenLogMatch();
              }}
              className="w-13 h-13 rounded-2xl btn-chess-green text-white flex items-center justify-center shadow-lg border-2 border-chess-darkest transform active:scale-95 transition-transform"
              title="Log a Match"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
            <span className="text-[9px] font-black uppercase text-chess-green mt-0.5 tracking-wider">
              Play
            </span>
          </div>

          {/* Tab 3: Rivalry */}
          <button
            onClick={() => {
              sounds.playMove();
              setCurrentTab('rivalry');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              currentTab === 'rivalry' ? 'text-chess-red font-bold scale-105' : 'text-chess-muted'
            }`}
          >
            <Swords className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">H2H</span>
          </button>

          {/* Tab 4: Tournaments */}
          <button
            onClick={() => {
              sounds.playMove();
              setCurrentTab('tournaments');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              currentTab === 'tournaments' ? 'text-purple-400 font-bold scale-105' : 'text-chess-muted'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Cups</span>
          </button>

        </div>
      </nav>
    </>
  );
};
