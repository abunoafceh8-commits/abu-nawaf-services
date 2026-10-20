const defaultServices = [
  { id: '1', name: 'استعادة الحسابات المخترقة', description: 'استعادة حسابات التواصل الاجتماعي المخترقة', price: 'يبدأ من 500 ريال', category: 'security', icon: '🔐', active: true },
  { id: '2', name: 'تأمين الحسابات', description: 'تأمين شامل لحساباتك الرقمية', price: 'يبدأ من 300 ريال', category: 'security', icon: '🛡️', active: true },
  { id: '3', name: 'مكافحة الابتزاز الإلكتروني', description: 'حماية من الابتزاز والتهديدات الإلكترونية', price: 'يبدأ من 800 ريال', category: 'security', icon: '⚔️', active: true },
  { id: '4', name: 'فحص الثغرات الأمنية', description: 'فحص شامل للثغرات في أنظمتك', price: 'يبدأ من 1000 ريال', category: 'audit', icon: '🔍', active: true },
  { id: '5', name: 'تحليل البرمجيات الخبيثة', description: 'فحص وتحليل الملفات المشبوهة', price: 'يبدأ من 400 ريال', category: 'audit', icon: '🦠', active: true },
  { id: '6', name: 'استشارات أمنية', description: 'استشارات في الأمن السيبراني', price: 'يبدأ من 200 ريال', category: 'consulting', icon: '💡', active: true },
  { id: '7', name: 'تطوير مواقع آمنة', description: 'تطوير مواقع ويب مع حماية أمنية متقدمة', price: 'يبدأ من 2000 ريال', category: 'development', icon: '🌐', active: true },
  { id: '8', name: 'OSINT واستخبارات مفتوحة', description: 'جمع وتحليل المعلومات من المصادر المفتوحة', price: 'يبدأ من 600 ريال', category: 'intelligence', icon: '🕵️', active: true },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { category } = req.query;
  let services = [...defaultServices];
  if (category) services = services.filter(s => s.category === category);
  
  return res.json(services);
}
