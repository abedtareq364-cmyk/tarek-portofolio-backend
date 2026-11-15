require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ObjectId } = require('mongodb');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // Render يعمل خلف بروكسي، وده يجعل الـ rate limit يقرأ IP الزائر الحقيقي
app.disable('x-powered-by');
app.use(helmet());

/* ---------- CORS: مسموح لدومينك فقط ---------- */
const ALLOWED = (process.env.ALLOWED_ORIGINS ||
  'https://tarekkorshed.com,https://www.tarekkorshed.com')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked'));
  },
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

/* ---------- حدود الطلبات ---------- */
const limiter = (windowMin, max) => rateLimit({
  windowMs: windowMin * 60 * 1000,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'طلبات كثيرة، حاول لاحقاً.' }
});
app.use(limiter(15, 300));                       // حد عام
const contactLimit = limiter(15, 5);             // رسائل التواصل
const commentLimit = limiter(15, 10);
const likeLimit    = limiter(15, 30);
const adminLimit   = limiter(15, 20);            // يبطّئ تخمين التوكن

/* ---------- حماية لوحة التحكم ---------- */
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN || '';
  if (expected.length < 32) {
    console.error('ADMIN_TOKEN غير مضبوط أو قصير (يجب 32 حرفاً على الأقل)');
    return res.status(503).json({ success: false, error: 'Unavailable' });
  }
  const given = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  // نقارن hash الاثنين فيتساوى الطول ولا يتسرب شيء من التوقيت
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
}

/* ---------- أدوات تحقق ---------- */
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ARTICLE_RE = /^[a-z0-9-]{1,60}$/;
const articleOf = v => (typeof v === 'string' && ARTICLE_RE.test(v) ? v : null);

/* ---------- فحص الحالة ---------- */
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.get('/api/status', (req, res) => res.json({ status: 'online' }));

/* ---------- استقبال الرسائل ---------- */
app.post('/api/contact', contactLimit, async (req, res) => {
  const name = str(req.body.name, 100);
  const email = str(req.body.email, 200);
  const message = str(req.body.message, 5000);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'بيانات غير صالحة.' });
  }
  try {
    const db = await connectDB();
    const result = await db.collection('messages').insertOne({
      name, email, message, created_at: new Date()
    });
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error('contact error:', err.message);
    res.status(500).json({ success: false, error: 'حدث خطأ داخلي.' });
  }
});

/* ---------- لوحة التحكم (محمية) ---------- */
app.get('/api/messages', adminLimit, requireAdmin, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);
    const db = await connectDB();
    const messages = await db.collection('messages')
      .find({}).sort({ created_at: -1 }).skip(skip).limit(limit).toArray();
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    console.error('messages error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر جلب الرسائل.' });
  }
});

// حذف رسالة (لاحترام مدة الاحتفاظ وطلبات الحذف)
app.delete('/api/messages/:id', adminLimit, requireAdmin, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: 'معرّف غير صالح.' });
  }
  try {
    const db = await connectDB();
    const r = await db.collection('messages').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: r.deletedCount === 1 });
  } catch (err) {
    console.error('delete error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر الحذف.' });
  }
});

/* ---------- التعليقات ---------- */
app.post('/api/comments', commentLimit, async (req, res) => {
  const articleId = articleOf(req.body.articleId) || 'clean-code';
  const name = str(req.body.name, 60);
  const text = str(req.body.text, 1000);
  const rating = Math.min(5, Math.max(1, Math.round(Number(req.body.rating) || 5)));

  if (!text) return res.status(400).json({ success: false, error: 'نص التعليق مطلوب.' });

  try {
    const db = await connectDB();
    const doc = { articleId, name, rating, text, created_at: new Date() };
    const result = await db.collection('comments').insertOne(doc);
    res.status(201).json({ success: true, comment: { ...doc, _id: result.insertedId } });
  } catch (err) {
    console.error('comment error:', err.message);
    res.status(500).json({ success: false, error: 'حدث خطأ داخلي.' });
  }
});

app.get('/api/comments', async (req, res) => {
  const articleId = articleOf(req.query.article) || 'clean-code';
  try {
    const db = await connectDB();
    const results = await db.collection('comments')
      .find({ articleId }).sort({ created_at: -1 }).limit(100).toArray();
    res.json(results);
  } catch (err) {
    console.error('comments error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر جلب التعليقات.' });
  }
});

/* ---------- الإعجابات (بدون رقم وهمي) ---------- */
app.get('/api/likes', async (req, res) => {
  const articleId = articleOf(req.query.article) || 'clean-code';
  try {
    const db = await connectDB();
    const doc = await db.collection('likes').findOne({ articleId });
    res.json({ success: true, count: doc ? doc.count : 0 });
  } catch (err) {
    console.error('likes error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر جلب الإعجابات.' });
  }
});

app.post('/api/likes', likeLimit, async (req, res) => {
  const articleId = articleOf(req.body.articleId) || 'clean-code';
  const inc = req.body.action === 'unlike' ? -1 : 1;
  try {
    const db = await connectDB();
    const col = db.collection('likes');
    await col.updateOne({ articleId }, { $inc: { count: inc } }, { upsert: true });
    await col.updateOne({ articleId, count: { $lt: 0 } }, { $set: { count: 0 } });
    const doc = await col.findOne({ articleId });
    res.json({ success: true, count: doc ? doc.count : 0 });
  } catch (err) {
    console.error('like error:', err.message);
    res.status(500).json({ success: false, error: 'تعذر تحديث الإعجاب.' });
  }
});

/* ---------- معالجة الأخطاء ---------- */
app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));
app.use((err, req, res, next) => {
  if (err && err.message === 'CORS blocked') {
    return res.status(403).json({ success: false, error: 'Origin not allowed' });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'JSON غير صالح.' });
  }
  console.error('unhandled:', err && err.message);
  res.status(500).json({ success: false, error: 'خطأ داخلي.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;