export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, videoUrl } = req.body;
  const YT_KEY = "AIzaSyAtjwimyJcKkcD1X1yhQMEKrscBWTfvXUQ";

  if (!topic && !videoUrl) {
    return res.status(400).json({ error: 'يرجى إدخال اسم القضية أو رابط فيديو المنافس' });
  }

  try {
    let competitorData = null;
    let extractedTags = [];

    // سحب داتا الفيديو برابط يوتيوب المباشر
    if (videoUrl) {
      let videoId = '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }

      if (videoId) {
        const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YT_KEY}`;
        const vRes = await fetch(vUrl);
        const vJson = await vRes.json();

        if (vJson.items && vJson.items.length > 0) {
          const item = vJson.items[0];
          competitorData = {
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            views: Number(item.statistics.viewCount || 0).toLocaleString('ar-EG'),
            publishedAt: item.snippet.publishedAt.substring(0, 10)
          };
          extractedTags = item.snippet.tags || [];
        }
      }
    }

    // سحب الكلمات الأكثر بحثاً لحظياً من يوتيوب
    const cleanTopic = (topic || competitorData?.title || '').replace(/^(قصة حقيقية|قضية|لغز)\s*[:|-]?\s*/g, '').trim();
    let searchTrends = [];
    if (cleanTopic) {
      const suggestUrl = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=ar&q=${encodeURIComponent(cleanTopic)}`;
      const sRes = await fetch(suggestUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const text = await sRes.text();
      const match = text.match(/\[.*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        searchTrends = (parsed[1] || []).map(i => i[0]);
      }
    }

    const coreTags = [cleanTopic, `قضية ${cleanTopic}`, "قصة حقيقية", "جرائم غامضة", "حكاوي المجهول"];
    let finalTagsArray = [...new Set([...coreTags, ...extractedTags, ...searchTrends])].filter(Boolean);
    let tagBox = finalTagsArray.join(", ");
    if (tagBox.length > 480) {
      tagBox = tagBox.substring(0, 475);
      tagBox = tagBox.substring(0, tagBox.lastIndexOf(","));
    }

    return res.status(200).json({
      targetVideo: competitorData,
      realTags: extractedTags,
      youtubeSearchKeywords: searchTrends,
      tagBox,
      tagLength: tagBox.length
    });

  } catch (err) {
    return res.status(500).json({ error: 'تعذر سحب البيانات الحية' });
  }
}
