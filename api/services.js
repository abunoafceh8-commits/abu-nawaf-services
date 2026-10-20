export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = new URL('https://abu-nawaf-services-wcfq.arcada.app/api/services');
    if (req.url.includes('?')) url.search = req.url.split('?')[1];
    const r = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
    return res.json(await r.json());
  } catch (e) {
    return res.json([
      { id: 1, name: 'استعادة الحسابات المخترقة', description: 'استعادة حسابات التواصل', price: '500 ريال', icon: '🔐' },
      { id: 2, name: 'تأمين الحسابات', description: 'تأمين شامل', price: '300 ريال', icon: '🛡️' },
      { id: 3, name: 'مكافحة الابتزاز', description: 'حماية من الابتزاز', price: '800 ريال', icon: '⚔️' },
      { id: 4, name: 'فحص الثغرات', description: 'فحص أمني شامل', price: '1000 ريال', icon: '🔍' },
    ]);
  }
}
