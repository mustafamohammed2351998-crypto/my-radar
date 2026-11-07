export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, script } = req.body;
  const YT_KEY = "AIzaSyAtjwimyJcKkcD1X1yhQMEKrscBWTfvXUQ";

  if (!title || !script) {
    return res.status(400).json({ error: 'يرجى إدخال اسم القضية والسكريبت' });
  }

  try {
    const cleanTopic = title.replace(/^(قصة حقيقية|قضية|لغز)\s*[:|-]?\s*/g, '').trim();

    // 1. استهداف قنوات سامح سند و In The Dark مباشرة لسحب التاجز وبصمة المقترحات
    const channels = ["سامح سند", "In The Dark محمد حبيب"];
    let competitorVideoIds = [];

    for (const ch of channels) {
      const targetQuery = `${ch} ${cleanTopic}`;
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(targetQuery)}&type=video&key=${YT_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      if (searchData.items) {
        searchData.items.forEach(item => {
          if (item.id && item.id.videoId) competitorVideoIds.push(item.id.videoId);
        });
      }
    }

    // إذا لم تكن هناك فيديوهات مباشرة للقضية عندهم، يسحب الكود أعلى الفيديوهات أداءً في قنواتهم عموماً
    if (competitorVideoIds.length === 0) {
      const fallbackUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=4&q=${encodeURIComponent("سامح سند قصة حقيقية")}&type=video&order=viewCount&key=${YT_KEY}`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();
      if (fallbackData.items) {
        fallbackData.items.forEach(item => {
          if (item.id && item.id.videoId) competitorVideoIds.push(item.id.videoId);
        });
      }
    }

    competitorVideoIds = [...new Set(competitorVideoIds)].slice(0, 6);

    // 2. سحب التاجز المخفية من داخل كود فيديوهاتهم
    let extractedTags = [];
    if (competitorVideoIds.length > 0) {
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${competitorVideoIds.join(',')}&key=${YT_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      (detailsData.items || []).forEach(v => {
        if (v.snippet.tags) extractedTags.push(...v.snippet.tags);
      });
    }

    const uniqueCompTags = [...new Set(extractedTags)];

    // 3. هندسة عناوين بنمط الإثارة النفسية الصادمة (أسلوبهم المعتمد - أقل من 54 حرفاً)
    const titles = [
      `قصة حقيقية: لغز ${cleanTopic} والسر الذي أخفوه`,
      `قصة حقيقية: كارثة ${cleanTopic} وما كشفه الطب الشرعي`,
      `قصة حقيقية: اعترافات ${cleanTopic} التي صدمت الجميع`,
      `قصة حقيقية: ما حدث في ${cleanTopic} خلف الأبواب المغلقة`
    ].map(t => (t.length > 54 ? t.substring(0, 53).trim() : t.trim()));

    // 4. وصف تكتيكي يطابق الكلمات الدلالية الرابطة في أول سطرين (بدون حرق)
    const line1 = `توثيق جنائي واقعي يكشف أسرار وتفاصيل ${cleanTopic} وما أثبتته أوراق التحقيقات الرسمية.`;
    const line2 = `بين تقارير الطب الشرعي والاعترافات الصادمة، نعيد فتح الملف لنكشف اللغز المجهول.`;
    const line3 = `وقائع حقيقية تكشف ما وراء الكواليس لأول مرة.. تابعوا التفاصيل الكاملة حتى النهاية.`;
    const description = `${line1}\n${line2}\n${line3}`;

    // 5. بناء صندوق التاجز: دمج تاجز قضيتك مع التاجز المسحوبة من فيديوهات سامح سند و In The Dark
    const baseTags = [
      cleanTopic,
      `قضية ${cleanTopic}`,
      `لغز ${cleanTopic}`,
      "قصة حقيقية",
      "جرائم غامضة",
      "حكاوي المجهول",
      "تحقيقات النيابة",
      "تقرير الطب الشرعي",
      "أوراق القضية",
      "وثائقي رعب",
      ...uniqueCompTags.slice(0, 10)
    ];

    let tagBox = [...new Set(baseTags)].join(", ");
    if (tagBox.length > 480) {
      tagBox = tagBox.substring(0, 475);
      tagBox = tagBox.substring(0, tagBox.lastIndexOf(","));
    }

    return res.status(200).json({
      titles,
      description,
      tags: tagBox,
      tagLength: tagBox.length,
      hashtags: `#قصة_حقيقية #${cleanTopic.replace(/\s+/g, '_')} #جرائم_غامضة`,
      targetedChannels: ["Sameh Sanad", "In The Dark"]
    });

  } catch (err) {
    return res.status(500).json({ error: 'تعذر الاتصال ببيانات القنوات المستهدفة' });
  }
}
