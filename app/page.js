import { supabase } from '../lib/supabase';

export const revalidate = 300;

async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default async function Home() {
  const news = await getNews();

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Tekno Aggregator</h1>
        <p style={{ color: '#666', marginTop: 4 }}>Rangkuman berita teknologi & gadget terbaru</p>
      </header>

      {news.length === 0 && (
        <p style={{ color: '#888' }}>
          Belum ada berita. Jalankan endpoint <code>/api/fetch-news</code> dulu untuk mengambil data.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {news.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              gap: 12,
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #eee',
              borderRadius: 12,
              padding: 12,
            }}
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt=""
                style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
              />
            )}
            <div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                {item.source} · {timeAgo(item.published_at)}
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.35 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{item.summary}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
