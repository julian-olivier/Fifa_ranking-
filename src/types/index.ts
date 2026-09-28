export type MatchResult = 'W' | 'D' | 'L';

export type ClassificationType = 'Brilliant' | 'Great' | 'Book' | 'Inaccuracy' | 'Mistake' | 'Blunder';

export interface RatingHistoryPoint {
  date: string;
  rating: number;
  matchId?: string;
  opponentName?: string;
  delta?: number;
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  avatarBg: string;
  title?: string; // e.g. 'GM', 'IM', 'FM', 'GOAT', 'SWEAT'
  rating: number;
  peakRating: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  streak: number; // >0 win streak, <0 loss streak, 0 reset
  form: MatchResult[]; // e.g. ['W', 'W', 'D', 'L', 'W']
  favoriteClub: string;
  playstyle: string;
  achievements: string[];
  ratingHistory: RatingHistoryPoint[];
  createdAt: string;
}

export interface MatchStats {
  player1Shots?: number;
  player2Shots?: number;
  player1ShotsOnTarget?: number;
  player2ShotsOnTarget?: number;
  player1Possession?: number; // percentage (0-100)
  player2Possession?: number;
  player1PassAccuracy?: number;
  player2PassAccuracy?: number;
}

export interface GameReview {
  player1Accuracy: number;
  player2Accuracy: number;
  player1Classification: ClassificationType;
  player2Classification: ClassificationType;
  headline: string;
  narrative: string;
  keyMoments: {
    minute?: number;
    description: string;
    type: 'brilliant' | 'great' | 'blunder' | 'turning-point';
  }[];
}

export interface Match {
  id: string;
  date: string;
  player1Id: string;
  player2Id: string;
  player1Club: string;
  player2Club: string;
  player1Score: number;
  player2Score: number;
  isExtraTime?: boolean;
  isPenalties?: boolean;
  penaltyScore?: {
    player1: number;
    player2: number;
  };
  isRageQuit?: boolean;
  rageQuitterId?: string;
  player1RatingBefore: number;
  player2RatingBefore: number;
  player1RatingDelta: number;
  player2RatingDelta: number;
  player1RatingAfter: number;
  player2RatingAfter: number;
  stats?: MatchStats;
  review?: GameReview;
  notes?: string;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  league: string;
  ratingStars: number;
  primaryColor: string;
  secondaryColor: string;
  badgeEmoji: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeClass: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary';
}

export interface TournamentMatch {
  id: string;
  round: number; // 1 = QF, 2 = SF, 3 = Final
  player1Id?: string;
  player2Id?: string;
  matchId?: string;
  winnerId?: string;
  score?: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  winnerId?: string;
  runnerUpId?: string;
  matches: TournamentMatch[];
}

export interface AppData {
  players: Player[];
  matches: Match[];
  tournaments: Tournament[];
  lastUpdated: string;
}

export interface RatingDivision {
  name: string;
  minRating: number;
  maxRating: number;
  badge: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}
