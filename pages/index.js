import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const runBurstEngine = async () => {
    if (!title || !script) return alert('يرجى إدخال اسم القضية والسكريبت');
    setLoading(true);
    setData(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, script })
      });
      const resData = await res.json();
      if (res.ok) setData(resData);
      else alert(resData.error || 'حدث خطأ غير متوقع');
    } catch (e) {
      alert('خطأ في الاتصال بالخادم السحابي');
    }
    setLoading(false);
  };

  const copy = (txt) => {
    navigator.clipboard.writeText(txt);
    alert('تم النسخ بنجاح!');
  };

  return (
    <div style={{ backgroundColor: '#07090e', color: '#f1f5f9', minHeight: '100vh', padding: '25px', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* Header HUD */}
        <div style={{ background: 'linear-gradient(135deg, #18090c 0%, #0d121c 100%)', border: '1px solid #2d151c', padding: '22px', borderRadius: '14px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#fff', fontWeight: '900' }}>
              ⚡ RADAR SUGGESTED HIJACK PRO
            </h1>
            <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.92rem' }}>
              منظومة اقتحام مقترحات كبار صناع الجرائم والغموض وهندسة البصمة الدلالية
            </p>
          </div>
          <span style={{ background: '#ba181b20', color: '#ff4d4d', border: '1px solid #ba181b60', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ● متصل بقنوات المنافسين الحية
          </span>
        </div>

        {/* Inputs */}
        <div style={{ background: '#0c1017', border: '1px solid #1c2433', padding: '22px', borderRadius: '14px', marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.95rem' }}>🎯 اسم القضية / الواقعة:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="مثال: مذبحة دلجا المنيا" 
            style={{ width: '100%', padding: '13px', background: '#05070a', border: '1px solid #232d3f', color: '#fff', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '16px', fontSize: '0.95rem' }}
          />

          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.95rem' }}>📄 نص سكريبت القصة الكامل:</label>
          <textarea 
            rows="7" 
            value={script} 
            onChange={(e) => setScript(e.target.value)} 
            placeholder="الصق نص القصة هنا لتحليل المفردات واستخراج الكلمات الرابطة..." 
            style={{ width: '100%', padding: '13px', background: '#05070a', border: '1px solid #232d3f', color: '#fff', borderRadius: '8px', boxSizing: 'border-box', resize: 'vertical', fontSize: '0.95rem' }}
          ></textarea>

          <button 
            onClick={runBurstEngine} 
            disabled={loading}
            style={{ width: '100%', marginTop: '16px', padding: '15px', background: 'linear-gradient(90deg, #ba181b, #e63946)', border: 'none', color: '#fff', fontWeight: '900', fontSize: '1.1rem', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(230,57,70,0.4)' }}
          >
            {loading ? '⏳ جاري سحب بيانات سامح سند و In The Dark وبناء الباقة...' : '🚀 تشغيل الرادار واستخراج حزمة المقترحات'}
          </button>
        </div>

        {/* Results */}
        {data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Target Status */}
            <div style={{ background: '#0c1017', border: '1px solid #1c2433', borderRight: '5px solid #00f5d4', padding: '15px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#00f5d4', fontWeight: 'bold', fontSize: '0.95rem' }}>✓ تم استخراج التاجز المشتركة لربط عنقود التوصيات بالقنوات المستهدفة</span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Sameh Sanad & In The Dark</span>
            </div>

            {/* Titles */}
            <div style={{ background: '#0c1017', padding: '22px', borderRadius: '14px', border: '1px solid #1c2433' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', color: '#fff' }}>🎯 عناوين اقتناص نقرات المقترحات (نمط الفضول الصادم - تحت 54 حرف):</h3>
              {data.titles.map((t, idx) => (
                <div key={idx} onClick={() => copy(t)} style={{ background: '#05070a', border: '1px solid #1e2637', padding: '14px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontWeight: 'bold' }}>{t}</span>
                  <span style={{ fontSize: '0.8rem', color: '#00f5d4', background: '#00f5d415', border: '1px solid #00f5d440', padding: '3px 10px', borderRadius: '5px' }}>{t.length} حرف (اضغط للنسخ)</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: '#0c1017', padding: '22px', borderRadius: '14px', border: '1px solid #1c2433' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📝 الوصف التكتيكي الرابط للمقترحات (3 أسطر بالمللي):</h3>
                <button onClick={() => copy(data.description)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>نسخ الوصف</button>
              </div>
              <div style={{ background: '#05070a', border: '1px solid #1e2637', padding: '14px', borderRadius: '8px', whiteSpace: 'pre-line', fontSize: '0.92rem', lineHeight: '1.7', color: '#e2e8f0' }}>
                {data.description}
              </div>
            </div>

            {/* Tags & Hashtags */}
            <div style={{ background: '#0c1017', padding: '22px', borderRadius: '14px', border: '1px solid #1c2433' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🏷️ صندوق تاجز الارتباط التوصياتي ({data.tagLength} حرف):</h3>
                <button onClick={() => copy(data.tags)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>نسخ التاجز</button>
              </div>
              <div style={{ background: '#05070a', border: '1px solid #1e2637', padding: '14px', borderRadius: '8px', fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                {data.tags}
              </div>
              <div style={{ marginTop: '16px', color: '#00f5d4', fontWeight: 'bold' }}>{data.hashtags}</div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
