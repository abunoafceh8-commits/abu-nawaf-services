const requests = [];
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const newReq = {
      id: 'REQ-' + Date.now().toString(36).toUpperCase(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    requests.unshift(newReq);
    if (requests.length > 500) requests.pop();
    return res.json({ success: true, request: newReq, message: 'تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.' });
  }
  
  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const idx = requests.findIndex(r => r.id === body.id);
    if (idx >= 0) {
      requests[idx] = { ...requests[idx], ...body, updatedAt: new Date().toISOString() };
      return res.json({ success: true, request: requests[idx] });
    }
    return res.status(404).json({ error: 'Request not found' });
  }
  
  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const idx = requests.findIndex(r => r.id === body.id);
    if (idx >= 0) requests.splice(idx, 1);
    return res.json({ success: true });
  }
  
  return res.json(requests);
}
