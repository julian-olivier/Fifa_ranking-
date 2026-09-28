import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FIFA Elo | Roommate Rankings & Game Scores',
  description: 'Chess.com-style Elo ranking, game scores, and head-to-head match history for local FIFA / EA FC games.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚽</text></svg>',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-chess-darkest text-chess-text min-h-screen selection:bg-chess-green selection:text-white antialiased touch-manipulation">
        {children}
      </body>
    </html>
  );
}
