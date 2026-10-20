/* AbuNawaf hardened — © 2026 أبو نواف · MIT */
const __RL = new Map();
function __rate(req, res, max = 90, win = 60_000) {
  try {
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'x';
    const key = ip + ':' + (req.url || '');
    const now = Date.now();
    const b = __RL.get(key);
    if (!b || now > b.r) { __RL.set(key, { n: 1, r: now + win }); if (__RL.size > 4000) __RL.clear(); return true; }
    b.n++;
    if (b.n > max) { res.setHeader('Retry-After', String(Math.ceil((b.r - now) / 1000))); res.status(429).json({ error: 'rate_limited', message: 'تم تجاوز الحد المسموح — أعد المحاولة بعد قليل' }); return false; }
    return true;
  } catch { return true; }
}
const __origin = (req) => {
  const o = req.headers.origin || '';
  if (!o) return '*';
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o)) return o;
  if (/^https?:\/\/[a-z0-9-]+\.(vercel|arcada)\.app$/.test(o)) return o;
  try { if (o === 'https://' + req.headers.host) return o; } catch {}
  return 'null';
};

const services = [
  { id: 1, name: 'استعادة الحسابات المخترقة', description: 'استعادة حسابات التواصل الاجتماعي المخترقة (فيسبوك، انستغرام، تويتر، سناب شات)', price: 'يبدأ من 500 ريال', category: 'security', icon: '🔐', features: ['استعادة كاملة', 'تأمين بعد الاستعادة', 'دعم فني 24/7'], active: true },
  { id: 2, name: 'تأمين الحسابات', description: 'تأمين شامل لحساباتك الرقمية ضد الاختراق', price: 'يبدأ من 300 ريال', category: 'security', icon: '🛡️', features: ['مصادقة ثنائية', 'فحص أمني', 'تقرير شامل'], active: true },
  { id: 3, name: 'مكافحة الابتزاز الإلكتروني', description: 'حماية من الابتزاز والتهديدات الإلكترونية', price: 'يبدأ من 800 ريال', category: 'security', icon: '⚔️', features: ['تحليل التهديد', 'خطة حماية', 'متابعة قانونية'], active: true },
  { id: 4, name: 'فحص الثغرات الأمنية', description: 'فحص شامل للثغرات في مواقعك وأنظمتك', price: 'يبدأ من 1000 ريال', category: 'audit', icon: '🔍', features: ['فحص OWASP', 'تقرير مفصل', 'خطة إصلاح'], active: true },
  { id: 5, name: 'تحليل البرمجيات الخبيثة', description: 'فحص وتحليل الملفات المشبوهة والبرمجيات الخبيثة', price: 'يبدأ من 400 ريال', category: 'audit', icon: '🦠', features: ['تحليل عميق', 'تقرير IOC', 'خطوات العلاج'], active: true },
  { id: 6, name: 'استشارات أمنية', description: 'استشارات في الأمن السيبراني وحماية البيانات', price: 'يبدأ من 200 ريال', category: 'consulting', icon: '💡', features: ['جلسة متخصصة', 'خطة أمنية', 'متابعة'], active: true },
  { id: 7, name: 'تطوير مواقع آمنة', description: 'تطوير مواقع ويب مع حماية أمنية متقدمة', price: 'يبدأ من 2000 ريال', category: 'development', icon: '🌐', features: ['تصميم حديث', 'حماية WAF', 'شهادة SSL'], active: true },
  { id: 8, name: 'OSINT واستخبارات مفتوحة', description: 'جمع وتحليل المعلومات من المصادر المفتوحة', price: 'يبدأ من 600 ريال', category: 'intelligence', icon: '🕵️', features: ['بحث عميق', 'تقرير مفصل', 'تحليل بيانات'], active: true },
];

export default async function handler(req, res) {
  __ABUNAWAF_HARDENED__: if (!__rate(req, res)) return;
  res.setHeader('Access-Control-Allow-Origin', __origin(req)); res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { category } = req.query;
  let result = [...services];
  if (category) result = result.filter(s => s.category === category);
  
  return res.json(result);
}
