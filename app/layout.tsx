import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '@/components/AuthContext';
import NotificationHandler from '@/components/NotificationHandler';

export const metadata: Metadata = {
  title: 'LIVE-SATELLITE | AI-Based Industrial Fire & Persistent Thermal Source Detection',
  description: 'Near real-time AI-powered thermal intelligence platform monitoring industrial fires, persistent thermal sources, and wildland anomalies using NASA FIRMS, OpenStreetMap, and satellite data.',
  keywords: ['NASA FIRMS', 'VIIRS', 'MODIS', 'Fire Detection', 'Industrial Thermal Sources', 'OpenStreetMap', 'Disaster Intelligence'],
  authors: [{ name: 'LIVE-SATELLITE Core Engineering' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-screen bg-[#050811] text-slate-100 antialiased selection:bg-orange-500/30 selection:text-orange-200">
        <AuthProvider>
          <NotificationHandler />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
