import Parser from 'rss-parser';
import { supabase } from '../../../lib/supabase';
import { SOURCES } from '../../../lib/sources';

const parser = new Parser();

export async function GET() {
  let totalSaved = 0;
  const errors = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      const items = feed.items.slice(0, 20).map((item) => ({
        title: item.title || 'Tanpa judul',
        link: item.link,
        summary: (item.contentSnippet || '').slice(0, 300),
        source: source.name,
        category: source.category,
        image_url: extractImage(item),
        published_at: item.isoDate || item.pubDate || new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('news')
        .upsert(items, { onConflict: 'link', ignoreDuplicates: true });

      if (error) {
        errors.push({ source: source.name, error: error.message });
      } else {
        totalSaved += items.length;
      }
    } catch (err) {
      errors.push({ source: source.name, error: err.message });
    }
  }

  return Response.json({ success: true, totalSaved, errors });
}

function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  const match = (item.content || '').match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}
