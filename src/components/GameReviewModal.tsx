'use client';

import React, { useEffect, useState } from 'react';
import { Match, Player } from '@/types';
import { getClubById } from '@/lib/clubs';
import { ALL_ACHIEVEMENTS } from '@/lib/achievements';
import { sounds } from '@/lib/sound';
import { 
  X, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  players: Player[];
  newAchievementsP1?: string[];
  newAchievementsP2?: string[];
  onOpenLogMatch?: () => void;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  isOpen,
  onClose,
  match,
  players,
  newAchievementsP1 = [],
  newAchievementsP2 = [],
  onOpenLogMatch,
}) => {
  const [animatedDeltaP1, setAnimatedDeltaP1] = useState(0);
  const [animatedDeltaP2, setAnimatedDeltaP2] = useState(0);

  useEffect(() => {
    if (isOpen && match) {
      if (match.player1Score !== match.player2Score) {
        sounds.playVictory();
      } else {
        sounds.playMove();
      }

      // Animate rating counter
      let step = 0;
      const totalSteps = 20;
      const p1Target = match.player1RatingDelta;
      const p2Target = match.player2RatingDelta;

      const timer = setInterval(() => {
        step++;
        setAnimatedDeltaP1(Math.round((p1Target / totalSteps) * step));
        setAnimatedDeltaP2(Math.round((p2Target / totalSteps) * step));
        if (step >= totalSteps) {
          clearInterval(timer);
          setAnimatedDeltaP1(p1Target);
          setAnimatedDeltaP2(p2Target);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isOpen, match]);

  if (!isOpen || !match) return null;

  const p1 = players.find((p) => p.id === match.player1Id);
  const p2 = players.find((p) => p.id === match.player2Id);

  const club1 = getClubById(match.player1Club);
  const club2 = getClubById(match.player2Club);

  const review = match.review;

  const renderClassificationBadge = (type: string) => {
    switch (type) {
      case 'Brilliant':
        return (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-cyan-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <Sparkles className="w-3 h-3 fill-cyan-300" /> Brilliant
          </span>
        );
      case 'Great':
        return (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-emerald-950/80 text-emerald-300 border border-emerald-400/60">
            <CheckCircle2 className="w-3 h-3" /> Great
          </span>
        );
      case 'Book':
        return (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-sky-950/80 text-sky-300 border border-sky-400/60">
            📘 Book
          </span>
        );
      case 'Inaccuracy':
        return (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-yellow-950/80 text-yellow-300 border border-yellow-500/60">
            <HelpCircle className="w-3 h-3" /> Inaccuracy
          </span>
        );
      case 'Mistake':
        return (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-orange-950/80 text-orange-300 border border-orange-500/60">
            <AlertTriangle className="w-3 h-3" /> Mistake
          </span>
        );
      case 'Blunder':
        return (
          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-red-950/80 text-red-400 border border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
            <AlertCircle className="w-3 h-3" /> Blunder
          </span>
        );
      default:
        return null;
    }
  };

  const unlockedList = [
    ...newAchievementsP1.map((id) => ({ id, player: p1?.name })),
    ...newAchievementsP2.map((id) => ({ id, player: p2?.name })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#21201d] border-t sm:border border-chess-border rounded-t-3xl sm:rounded-3xl w-full max-w-2xl shadow-chess-modal flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-chess-border rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-chess-darkest via-chess-card to-chess-darkest p-3.5 sm:p-6 border-b border-chess-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-chess-green/20 border border-chess-green/50 flex items-center justify-center text-chess-green shadow-inner">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base sm:text-lg text-chess-text uppercase tracking-tight">Game Review</span>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-chess-green text-chess-darkest">
                  Analysis
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-chess-muted">Accuracy, tactical classifications & Elo update</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playMove();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-chess-elevated hover:bg-chess-border text-chess-muted hover:text-chess-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          
          {/* Main Scoreboard & Accuracy Comparison */}
          <div className="bg-chess-card border border-chess-border rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-inner">
            <div className="grid grid-cols-5 items-center text-center">
              
              {/* Player 1 Side */}
              <div className="col-span-2 flex flex-col items-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${p1?.avatarBg || 'from-gray-700 to-gray-900'} flex items-center justify-center text-2xl sm:text-3xl shadow-lg relative mb-1.5`}>
                  {p1?.avatar || '⚽'}
                  <span className="absolute -bottom-1 -right-1 text-xs sm:text-sm p-0.5 rounded-full bg-chess-darkest border border-chess-border">
                    {club1.badgeEmoji}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-base text-chess-text truncate max-w-[95px] sm:max-w-[120px]">
                  {p1?.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-chess-muted">{club1.shortName}</p>

                {/* Rating Delta */}
                <div className="mt-1 flex items-center space-x-1 text-xs">
                  <span className="font-black text-chess-text text-xs sm:text-sm">{match.player1RatingAfter}</span>
                  <span className={`text-[10px] sm:text-xs font-black px-1 rounded ${
                    animatedDeltaP1 > 0 
                      ? 'text-chess-green bg-chess-green/15' 
                      : animatedDeltaP1 < 0 
                      ? 'text-chess-red bg-chess-red/15' 
                      : 'text-chess-muted'
                  }`}>
                    {animatedDeltaP1 > 0 ? `+${animatedDeltaP1}` : animatedDeltaP1}
                  </span>
                </div>

                {/* Accuracy Pill */}
                <div className="mt-2">
                  <div className="text-[11px] sm:text-xs font-black text-chess-green">
                    {review?.player1Accuracy}% Acc
                  </div>
                  <div className="mt-1">
                    {review && renderClassificationBadge(review.player1Classification)}
                  </div>
                </div>
              </div>

              {/* Center Score & Conditions */}
              <div className="col-span-1 flex flex-col items-center justify-center px-0.5">
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-2xl sm:text-4xl font-black text-chess-text">
                  <span>{match.player1Score}</span>
                  <span className="text-chess-muted/60">-</span>
                  <span>{match.player2Score}</span>
                </div>

                {match.isPenalties && match.penaltyScore && (
                  <span className="text-[9px] sm:text-[11px] font-bold text-chess-gold mt-1 text-center">
                    ({match.penaltyScore.player1}-{match.penaltyScore.player2}p)
                  </span>
                )}

                {match.isExtraTime && !match.isPenalties && (
                  <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-chess-elevated text-chess-muted border border-chess-border mt-1">
                    AET
                  </span>
                )}

                {match.isRageQuit && (
                  <span className="text-[8px] sm:text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-chess-red text-white mt-1 animate-pulse">
                    RAGE QUIT
                  </span>
                )}
              </div>

              {/* Player 2 Side */}
              <div className="col-span-2 flex flex-col items-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${p2?.avatarBg || 'from-gray-700 to-gray-900'} flex items-center justify-center text-2xl sm:text-3xl shadow-lg relative mb-1.5`}>
                  {p2?.avatar || '⚽'}
                  <span className="absolute -bottom-1 -right-1 text-xs sm:text-sm p-0.5 rounded-full bg-chess-darkest border border-chess-border">
                    {club2.badgeEmoji}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-base text-chess-text truncate max-w-[95px] sm:max-w-[120px]">
                  {p2?.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-chess-muted">{club2.shortName}</p>

                {/* Rating Delta */}
                <div className="mt-1 flex items-center space-x-1 text-xs">
                  <span className="font-black text-chess-text text-xs sm:text-sm">{match.player2RatingAfter}</span>
                  <span className={`text-[10px] sm:text-xs font-black px-1 rounded ${
                    animatedDeltaP2 > 0 
                      ? 'text-chess-green bg-chess-green/15' 
                      : animatedDeltaP2 < 0 
                      ? 'text-chess-red bg-chess-red/15' 
                      : 'text-chess-muted'
                  }`}>
                    {animatedDeltaP2 > 0 ? `+${animatedDeltaP2}` : animatedDeltaP2}
                  </span>
                </div>

                {/* Accuracy Pill */}
                <div className="mt-2">
                  <div className="text-[11px] sm:text-xs font-black text-chess-blue">
                    {review?.player2Accuracy}% Acc
                  </div>
                  <div className="mt-1">
                    {review && renderClassificationBadge(review.player2Classification)}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Coach's Headline & Tactical Narrative */}
          {review && (
            <div className="bg-chess-card border border-chess-border/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5">
              <div className="flex items-start space-x-2">
                <span className="text-base">🧠</span>
                <h3 className="font-extrabold text-xs sm:text-base text-chess-text leading-tight">
                  {review.headline}
                </h3>
              </div>
              <p className="text-[11px] sm:text-sm text-chess-muted leading-relaxed">
                {review.narrative}
              </p>

              {/* Key Moments */}
              {review.keyMoments && review.keyMoments.length > 0 && (
                <div className="pt-2 border-t border-chess-border/60 space-y-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chess-muted block">
                    Decisive Moments
                  </span>
                  <div className="space-y-1">
                    {review.keyMoments.map((m, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs">
                        <span className="px-1.5 py-0.2 rounded bg-chess-elevated font-mono font-bold text-chess-gold text-[9px] sm:text-[10px] mt-0.5 flex-shrink-0">
                          {m.minute}'
                        </span>
                        <span className="text-chess-text flex-1 text-[11px] sm:text-xs">
                          {m.description}
                        </span>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-chess-muted flex-shrink-0">
                          {m.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Newly Unlocked Achievements Banner */}
          {unlockedList.length > 0 && (
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-amber-950/60 border border-amber-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>New Trophy Unlocked!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {unlockedList.map((item, idx) => {
                  const ach = ALL_ACHIEVEMENTS.find((a) => a.id === item.id);
                  if (!ach) return null;
                  return (
                    <div key={idx} className="flex items-center space-x-2 bg-black/40 p-2 rounded-xl border border-amber-500/20">
                      <span className="text-xl sm:text-2xl">{ach.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-amber-200">{ach.title}</div>
                        <div className="text-[9px] text-amber-300/70">{item.player} earned this reward</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 pb-4 sm:pb-0">
            <button
              onClick={() => {
                sounds.playMove();
                onClose();
                if (onOpenLogMatch) onOpenLogMatch();
              }}
              className="w-full sm:flex-1 btn-chess-green py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch / Log Next</span>
            </button>
            <button
              onClick={() => {
                sounds.playMove();
                onClose();
              }}
              className="w-full sm:flex-1 btn-chess-secondary py-2.5 rounded-xl text-chess-text font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center cursor-pointer"
            >
              Back to Leaderboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
