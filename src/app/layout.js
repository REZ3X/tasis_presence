import "./globals.css";
// import AdblockGuard from '@/components/AdblockGuard';

export const metadata = {
  title: "TASIS - Presensi Piket Harian",
  description: "Sistem presensi piket harian TASIS (Tata Tertib Siswa)",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#0d1216",
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "TASIS - Presensi Piket Harian",
    description: "Sistem presensi piket harian untuk anggota TASIS (Tata Tertib Siswa)",
    siteName: "TASIS Presence",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TASIS Logo - Tata Tertib Siswa",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TASIS - Presensi Piket Harian",
    description: "Sistem presensi piket harian untuk anggota TASIS",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#0d1216" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'ui-sans-serif, sans-serif' }}>
        {children}
        {/* <AdblockGuard /> */}
        <script src="https://pl28316934.effectivegatecpm.com/b0/04/76/b00476d5b885cedd5d97e09951b1af49.js"></script>
      </body>
    </html>
  );
}

