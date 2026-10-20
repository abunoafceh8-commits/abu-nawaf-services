import { endpoint, readBody, json, V, rateLimit, requireAdminOrSession } from './_lib/guard.js';
import { put, get, list, del, ref, durable } from './_lib/store.js';

/**
 * /api/requests — طلبات الخدمات.
 * POST عام: استلام طلب جديد (تحقق + حدّ معدّل + منع حقن الحقول)
 * GET/DELETE إداري فقط: لا مزيد من تسريب بيانات العملاء للعامة.
 */
const ALLOWED = ['name', 'email', 'phone', 'service', 'message', 'budget', 'city'];

export default endpoint(async (req, res) => {
  if (req.method === 'POST') {
    if (!rateLimit(req, res, { max: 12, windowMs: 10 * 60 * 1000, key: 'req-post' })) return;
    const b = await readBody(req, 32 * 1024);
    const clean = {};
    for (const k of ALLOWED) if (b[k] != null) clean[k] = V.text(b[k], 1200);
    if (clean.email && !V.email(clean.email)) return json(res, 400, { error: 'البريد الإلكتروني غير صالح' });
    if (!clean.name || (!clean.email && !clean.phone)) return json(res, 400, { error: 'الاسم ووسيلة تواصل مطلوبان' });

    const id = ref('REQ');
    const record = { id, ...clean, status: 'pending', created_at: new Date().toISOString() };
    await put(`req:${id}`, record);
    return json(res, 201, {
      success: true,
      ref: id,
      request: { id, status: 'pending', created_at: record.created_at },
      message: 'تم إرسال طلبك بنجاح. سيتواصل معك فريق أبو نواف خلال 24 ساعة.',
      durable: durable(),
    });
  }

  if (req.method === 'GET') {
    if (!requireAdminOrSession(req, res)) return;
    return json(res, 200, await list('req:', 300));
  }

  if (req.method === 'DELETE') {
    if (!requireAdminOrSession(req, res)) return;
    const b = await readBody(req, 4096);
    const id = V.text(b.id || req.query?.id, 40);
    if (!id) return json(res, 400, { error: 'id مطلوب' });
    await del(`req:${id}`);
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'method_not_allowed' });
}, { name: 'requests', methods: ['GET', 'POST', 'DELETE'] });
