export const metadata = {
  title: 'Tekno Aggregator',
  description: 'Rangkuman berita teknologi & gadget dari berbagai sumber',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
