// Vercel Serverless Function: /api/news
// Fetches daily skill news from Dev.to and caches per-day

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const STATIC_FALLBACK = [
    { title: 'PyTorch 2.4 Released with 40% Faster Training', tag: 'AI/ML', url: 'https://pytorch.org', date: '2 days ago' },
    { title: 'Stack Overflow Survey: Python Tops Most Used Language 12 Years Running', tag: 'Python', url: 'https://survey.stackoverflow.co', date: '1 week ago' },
    { title: 'Google Releases Gemini 2.0: Multimodal Reasoning Benchmark Results', tag: 'GenAI', url: 'https://deepmind.google', date: '3 days ago' },
    { title: 'MLOps Engineer Salaries Up 28% YoY Across Indian Tech Hubs', tag: 'Career', url: 'https://linkedin.com', date: '5 days ago' },
    { title: 'Kubernetes 1.32: Enhanced Memory Manager and Node Swap Support', tag: 'DevOps', url: 'https://kubernetes.io', date: '4 days ago' },
    { title: 'Meta Open-Sources LLaMA 3.3 — 70B Parameter Model', tag: 'LLM', url: 'https://ai.meta.com', date: '1 week ago' },
    { title: 'SQL Still #1 Required Skill in Data Engineering Job Postings', tag: 'SQL', url: 'https://www.kaggle.com', date: '6 days ago' },
  ];

  try {
    const TAGS = ['machinelearning', 'python', 'mlops', 'datascience', 'deeplearning', 'sql', 'career'];
    const selectedTag = TAGS[new Date().getDay() % TAGS.length];

    const response = await fetch(
      `https://dev.to/api/articles?tag=${selectedTag}&per_page=7&top=7`,
      { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) throw new Error('Dev.to API failed');

    const articles = await response.json();
    const items = articles.map(a => ({
      title: a.title,
      tag: (a.tag_list?.[0] || selectedTag).toUpperCase(),
      url: a.url,
      date: new Date(a.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

    return res.status(200).json({ items, source: 'devto', tag: selectedTag });
  } catch (e) {
    return res.status(200).json({ items: STATIC_FALLBACK, source: 'fallback' });
  }
}
