import { useState, useMemo } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import useStore from '../../store/useStore.js';
import { SKILL_ROLES, PACING_MODES, getSkillResources } from '../../lib/data.js';
import { apiUrl, apiFetch } from '../../lib/api.js';
import { chatAgent, chatAgentWithGemini } from '../../lib/aiEngine.js';

// ─── Contextual Rule-Based & Live AI Engine ──────────────────────────────────
export function contextualAIResponse(question, ctx = {}) {
  const q = question.toLowerCase();

  // 0. Grounded Chatbot Tools from skill_bridge_final_chatbot
  if (/recommend|job|opening|hiring|vacanc|role|gap|readiness|road ?map|course|tutorial|trend|market|city/i.test(q)) {
    try {
      const agentRes = chatAgent(question, {
        skills: ctx.userSkills?.all || [],
        userSkills: ctx.userSkills,
        targetRole: ctx.roleName,
        city: ctx.city || '',
      });
      if (agentRes?.reply) return agentRes.reply;
    } catch {
      // Fall through to domain rules below
    }
  }

  const userName = ctx.user?.name || 'Learner';
  const roleName = ctx.roleName || 'Machine Learning Engineer';
  const pacingName = ctx.pacingName || 'Balanced';
  const nextTask = ctx.nextTask;
  const topGaps = ctx.topGaps || ['PyTorch', 'MLOps', 'Docker'];

  // 1. "What should I do today?" / "Next task"
  if (q.includes('today') || q.includes('next task') || q.includes('what should i do') || q.includes('current task')) {
    if (nextTask) {
      return `🎯 **Next Priority Task for Today:**\n\n**${nextTask.title}** (${nextTask.skill})\n- Category: *${nextTask.type.toUpperCase()}* (~${nextTask.hours} hours)\n- Scheduled Date: ${nextTask.displayDate || nextTask.date}\n- Reward: **+${nextTask.xp} XP**\n\nObjective: ${nextTask.desc}\n\nRecommended practice: Check LeetCode or HackerRank drills under the **Improvement Map** or **Trajectory** page!`;
    }
    return `You're all caught up on your active path tasks! 🎉 Visit **Daily Coding Problem** to solve today's challenge (+10 XP) and keep your ${ctx.streak || 0}-day streak alive!`;
  }

  // 2. Domain: MLOps / Docker / Kubernetes / Deployment / CI/CD / Triton / MLflow
  if (q.includes('mlops') || q.includes('docker') || q.includes('kubernetes') || q.includes('deploy') || q.includes('ci/cd') || q.includes('triton') || q.includes('mlflow')) {
    return `⚙️ **Production MLOps & Model Deployment Master Blueprint:**\n\n1. **Containerization & Optimization:**\n   - Export trained weights to **ONNX** or **TorchScript** for 2x–5x inference acceleration.\n   - Build multi-stage Docker images (python:3.11-slim) to strip build dependencies, keeping image footprint under 500MB.\n\n2. **Serving Infrastructure:**\n   - High-throughput: **Triton Inference Server** with dynamic batching and concurrent model instances.\n   - Microservices: **FastAPI + Uvicorn** with async endpoints and Pydantic request validation.\n\n3. **Orchestration & Autoscaling:**\n   - Deploy to **Kubernetes (K8s)** with Horizontal Pod Autoscaler (HPA) triggered by custom metrics (GPU utilization, queue depth).\n\n4. **Governance & Observability:**\n   - **MLflow Model Registry** for staging → production promotion gates.\n   - Continuous monitoring via **Prometheus + Grafana + Evidently AI** to capture covariate shift, concept drift, and latency degradation (p95/p99).`;
  }

  // 3. Domain: LLMs / RAG / Transformers / Embeddings / Vector DB
  if (q.includes('rag') || q.includes('llm') || q.includes('transformer') || q.includes('embedding') || q.includes('vector') || q.includes('langchain') || q.includes('lora')) {
    return `🤖 **Enterprise RAG & Large Language Model Architecture:**\n\n1. **Document Ingestion & Chunking:**\n   - Use semantic chunking with 15–20% token overlap to preserve contextual continuity.\n   - Generate dense vector embeddings via models like **BGE-large** or **text-embedding-3**.\n\n2. **Hybrid Search Retrieval:**\n   - Combine dense semantic search (HNSW index via pgvector/Chroma) with sparse lexical search (BM25).\n   - Fuse rankings with **Reciprocal Rank Fusion (RRF)** to eliminate retrieval blind spots.\n\n3. **Cross-Encoder Reranking:**\n   - Pass top-20 retrieved candidates through **bge-reranker-large** to compress to top-3 high-relevance context snippets before prompting the LLM.\n\n4. **Fine-Tuning Strategies:**\n   - Utilize **LoRA / QLoRA (NF4 4-bit quantization)** to train low-rank adapter matrices (W0 + ΔW) on consumer GPUs without full checkpoint bloat.`;
  }

  // 4. Domain: Deep Learning / PyTorch / Autograd / Backprop
  if (q.includes('pytorch') || q.includes('deep learning') || q.includes('autograd') || q.includes('backprop') || q.includes('gradient')) {
    return `🧠 **PyTorch Deep Learning & Production Mechanics:**\n\n1. **Dynamic Computational Graph:**\n   - In PyTorch, graphs are built dynamically via autograd. Tensors with requires_grad=True track operations in a DAG; calling loss.backward() computes vector-Jacobian products in reverse topological order.\n\n2. **Training Loop Hygiene:**\n   - Always call optimizer.zero_grad(set_to_none=True) to save memory over zeroing.\n   - Wrap evaluations in with torch.no_grad() to disable graph allocation.\n\n3. **Memory & Acceleration:**\n   - Employ Mixed Precision training (torch.cuda.amp.autocast()) for 2x speedup on Tensor Cores.\n   - Scale with DistributedDataParallel (torch.nn.parallel.DistributedDataParallel) over plain DataParallel to avoid GIL bottlenecks.`;
  }

  // 5. Domain: Data Engineering / Spark / Kafka / Delta Lake / Distributed
  if (q.includes('spark') || q.includes('kafka') || q.includes('data engineering') || q.includes('delta lake') || q.includes('streaming') || q.includes('etl')) {
    return `⚡ **Distributed Data Engineering & Pipeline Design:**\n\n1. **Medallion Lakehouse Pattern:**\n   - **Bronze (Raw):** Append-only raw event stream ingestion from Kafka.\n   - **Silver (Cleansed):** Deduplicated, schema-enforced, joined data stored in Parquet/Delta Lake.\n   - **Gold (Aggregated):** Business KPI marts optimized with Z-Ordering and columnar indexing.\n\n2. **Spark Performance Optimization:**\n   - Avoid data skew by salting partition keys.\n   - Convert expensive shuffle Sort-Merge Joins into **Broadcast Hash Joins** for small lookup dimension tables (<10MB).\n\n3. **Streaming Semantics:**\n   - Implement Apache Kafka with consumer group partition rebalancing and transactional checkpoints for **exactly-once processing semantics (EOS)**.`;
  }

  // 6. Domain: System Design / ML System Design
  if (q.includes('system design') || q.includes('architecture') || q.includes('recommendation') || q.includes('latency')) {
    return `🏛️ **Production ML System Design Framework (FAANG Standard):**\n\n1. **Requirements & SLA:**\n   - Clarify Throughput (QPS), Latency SLA (p99 < 50ms), and Freshness requirements.\n\n2. **Two-Stage Funnel:**\n   - **Candidate Generation (Retrieval):** Scans 1M+ items down to ~500 candidates via Two-Tower Vector Search.\n   - **Heavy Ranker (Scoring):** Evaluates 500 candidates through a Deep Neural Network (DLRM) with feature crossing.\n   - **Re-ranking & Business Rules:** De-duplication, diversity filtering, and sponsor boosts.\n\n3. **Feature Store & Ingestion:**\n   - Offline batch features calculated in Spark/Snowflake; low-latency online features cached in **Redis / Feast**.\n\n4. **Fallback & Graceful Degradation:**\n   - Circuit breakers fall back to popularity heuristics if model inference exceeds timeout window (e.g., >35ms).`;
  }

  // 7. Domain: A/B Testing / Statistics / Data Science
  if (q.includes('a/b test') || q.includes('statistics') || q.includes('p-value') || q.includes('hypothesis') || q.includes('data science') || q.includes('variance')) {
    return `📊 **Statistical Rigor & Production A/B Testing:**\n\n1. **Sample Size & Power Analysis:**\n   - Calculate required sample size before starting the experiment using alpha = 0.05 (Type I error) and 1 - beta = 0.80 (Statistical Power) against Minimum Detectable Effect (MDE).\n\n2. **Preventing P-Hacking:**\n   - Never stop an experiment early upon observing p < 0.05 without Sequential Testing adjustments.\n   - Control False Discovery Rate (FDR) using the **Benjamini-Hochberg procedure** when evaluating multiple concurrent metrics.\n\n3. **Variance Reduction (CUPED):**\n   - Use pre-experiment covariate data to reduce metric variance by 30–50%, enabling experiments to reach significance with half the run time!`;
  }

  // 8. "Adjust my pace"
  if (q.includes('pace') || q.includes('pacing') || q.includes('adjust') || q.includes('faster') || q.includes('slower') || q.includes('timeline')) {
    return `⚡ **Current Pacing Mode:** **${pacingName}** (~${ctx.hoursPerDay || 2.5} hrs/day)\n\nYou can easily switch presets on the **Trajectory Simulator** or **Improvement Map** tabs:\n\n1. **Aggressive (4 Weeks)**: 4 hrs/day (~28h/wk) — High-density daily sprints for rapid job readiness.\n2. **Balanced (8 Weeks — Recommended)**: 2.5 hrs/day (~18h/wk) — Steady mastery for working professionals.\n3. **Conservative (16 Weeks)**: 1.5 hrs/day (~10h/wk) — Sustainable, low-stress timeline.\n\nAll 3 presets restructure the exact same curriculum and milestones. Click "Pacing Presets" in Improvement Map to switch instantly!`;
  }

  // 9. "Explain my top skill gap"
  if (q.includes('gap') || q.includes('explain') || q.includes('top skill') || q.includes('weakness')) {
    const primaryGap = topGaps[0] || 'PyTorch';
    const res = getSkillResources(primaryGap);
    const topVid = res.learning?.[0]?.title || 'Masterclass';
    return `💡 **Top Critical Skill Gap: ${primaryGap}**\n\nFor a **${roleName}**, ${primaryGap} represents one of the highest weighted competencies in modern tech hiring (frequently listed on 80%+ of postings).\n\n**Why it matters:** Real-world roles require production-level knowledge, not just theoretical syntax.\n\n**Best Next Step:** Watch *"${topVid}"* on YouTube, or practice introductory tensor problems on LeetCode. Both are linked directly in your Trajectory and Roadmap tabs!`;
  }

  // 10. "Suggest alternative resources" / "Practice drills"
  if (q.includes('resource') || q.includes('drill') || q.includes('practice') || q.includes('leetcode') || q.includes('hackerrank') || q.includes('coursera') || q.includes('geeksforgeeks')) {
    const skill = nextTask?.skill || topGaps[0] || 'Python';
    const res = getSkillResources(skill);
    return `📚 **Actionable Practice & Learning for ${skill}:**\n\n- **GeeksforGeeks:** Curated articles & tutorials available in Learning Hub\n- **LeetCode:** ${res.practice?.[0]?.title || 'Curated Problem Set'}\n- **HackerRank:** ${res.practice?.[1]?.title || 'Proficiency Track'}\n- **YouTube:** ${res.learning?.[0]?.title || 'Video Deep Dive'}\n- **Coursera:** ${res.learning?.[2]?.title || 'University Specialization'}\n\nYou can open interactive cards with direct outbound links under each milestone on the **Improvement Map** or **Trajectory** page!`;
  }

  // 11. "Streak" / "XP"
  if (q.includes('streak') || q.includes('xp') || q.includes('points') || q.includes('score')) {
    return `🔥 **Your Engagement Stats:**\n\n- Current Streak: **${ctx.streak || 0} Days** ${ctx.streak >= 3 ? '🔥 (On Fire!)' : ''}\n- Total Points: **${ctx.xp || 0} XP**\n- Completed Milestones: **${ctx.completedTasksCount || 0} / ${ctx.totalTasksCount || 18} Tasks**\n\nEvery completed task awards **+25 XP**! Maintain your streak by completing at least one task or solving the Daily Coding Challenge today.`;
  }

  // Standard Q&A mappings
  if (q.includes('gap score') || q.includes('readiness') || q.includes('how does it work'))
    return 'The readiness score uses a weighted formula: Σ[skill_weight × max(0, required − current)], normalized to 0–100%. Higher-weight skills (like Python at 20%) have more impact than lower-weight ones. A score of 100% means you meet all requirements.';

  if (q.includes('resume') || q.includes('pdf') || q.includes('upload') || q.includes('docx'))
    return 'SkillBridge extracts skills from PDF, DOCX, and TXT resumes completely client-side in your browser. You can review and edit the detected skills, delete false positives, or add missing ones before generating your path!';

  if (q.includes('ics') || q.includes('calendar') || q.includes('export'))
    return 'Go to Improvement Map and click "Export .ics". This downloads an iCalendar file compatible with Google Calendar, Apple Calendar, and Outlook, with every scheduled task placed on its due date.';

  if (q.includes('code lab') || q.includes('python') || q.includes('sql') || q.includes('latex'))
    return 'Code Labs has 3 environments: (1) Python Lab — browser-based simulator. (2) SQL Playground — executes real queries against sample tables. (3) LaTeX Builder — compile and download professional resumes and reports.';

  return `Hi ${userName}! I'm your personalized SkillBridge Assistant. I can check your schedule, explain your skill gaps, explain MLOps & LLM architectures, suggest LeetCode/GeeksforGeeks resources, or help adjust your learning pace for **${roleName}**. Try one of the quick prompt buttons below!`;
}

// ─── AI Assistant Panel ───────────────────────────────────────────────────────
export function AIAssistant() {
  const chatOpen = useStore(s => Boolean(s.chatOpen));
  const chatMessages = useStore(s => s.chatMessages || []);
  const toggleChat = useStore(s => s.toggleChat);
  const addChatMessage = useStore(s => s.addChatMessage);
  const clearChat = useStore(s => s.clearChat);

  const user = useStore(s => s.user);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const committedPath = useStore(s => s.committedPath);
  const targetRole = useStore(s => s.targetRole);
  const gapResults = useStore(s => s.gapResults);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Derive Context
  const roleName = SKILL_ROLES[committedPath?.role || targetRole]?.name || 'Machine Learning Engineer';
  const currentPacing = PACING_MODES[committedPath?.pacing] || PACING_MODES.balanced;
  const completedIds = committedPath?.completedTaskIds || [];
  const nextTask = (committedPath?.tasks || []).find(t => !completedIds.includes(t.id));
  const topGaps = gapResults?.gaps || ['PyTorch', 'MLOps', 'Docker'];

  const userSkills = useStore(s => s.userSkills);
  const aiContext = {
    user,
    roleName,
    pacingName: currentPacing.name,
    hoursPerDay: currentPacing.hoursPerDay,
    nextTask,
    topGaps,
    userSkills: userSkills || { all: [] },
    xp,
    streak,
    completedTasksCount: completedIds.length,
    totalTasksCount: committedPath?.tasks?.length || 18,
  };

  const QUICK_PROMPTS = [
    '💼 Recommend matching jobs',
    '🔍 Analyze my skill gap',
    '🗺️ Generate career roadmap',
    '📚 Recommend free courses',
    '📊 Indian tech market trends',
    '🎯 What should I do today?',
    '⚙️ MLOps Pipeline Guide',
    '🤖 Explain RAG & LLMs',
    '⚡ How do I adjust my pace?',
  ];

  const sendMessage = async (textToSend) => {
    const msg = (textToSend || input).trim();
    if (!msg || loading) return;
    addChatMessage({ role: 'user', content: msg });
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    try {
      const res = await apiFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, context: aiContext }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        addChatMessage({ role: 'assistant', content: data.reply || contextualAIResponse(msg, aiContext) });
      } else {
        const directGemini = await chatAgentWithGemini(msg, aiContext);
        addChatMessage({ role: 'assistant', content: directGemini?.reply || contextualAIResponse(msg, aiContext) });
      }
    } catch {
      clearTimeout(timeoutId);
      // Direct client fallback to Google Gemini Studio trained model
      try {
        const directGemini = await chatAgentWithGemini(msg, aiContext);
        addChatMessage({ role: 'assistant', content: directGemini?.reply || contextualAIResponse(msg, aiContext) });
      } catch {
        addChatMessage({ role: 'assistant', content: contextualAIResponse(msg, aiContext) });
      }
    } finally {
      setLoading(false);
    }
  };

  // Proactive greeting based on real user path and streak
  const proactiveGreeting = useMemo(() => {
    const name = user?.name || 'there';
    if (nextTask) {
      return `👋 Hi ${name}! You're on a **${streak}-day streak** with **${xp} XP**! You have **${(committedPath?.tasks?.length || 18) - completedIds.length}** pending tasks in your **${currentPacing.name} ${roleName}** path.\n\nYour next priority task is **"${nextTask.title}"** (due ${nextTask.displayDate || nextTask.date}). What can I help you tackle today?`;
    }
    return `👋 Hi ${name}! You're on a **${streak}-day streak** with **${xp} XP**! You're currently up-to-date on your **${roleName}** path. Ask me about adjusting your pace, exploring job requirements, or practicing daily coding drills!`;
  }, [user, streak, xp, nextTask, currentPacing, roleName, completedIds.length, committedPath]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="ai-assistant-fab"
        className="ai-fab"
        onClick={toggleChat}
        title={chatOpen ? 'Close AI Career Assistant' : 'Open AI Career Assistant'}
        aria-label="Toggle AI Career Assistant"
      >
        <Bot size={22} />
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="ai-chat-panel" role="dialog" aria-label="AI Career Assistant">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={16} color="var(--brand-light)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  SkillBridge Career AI
                </div>
                <div style={{ fontSize: 10, color: 'var(--brand-light)' }}>
                  Google Gemini · 18k+ Indian Jobs Grounded · {roleName}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearChat}
                style={{ fontSize: 10, padding: '2px 8px' }}
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={toggleChat}
                style={{ padding: '2px 8px', fontSize: 13 }}
                title="Close assistant"
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages" id="chat-messages">
            {chatMessages.length === 0 && (
              <div className="chat-msg assistant" style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                {proactiveGreeting}
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`} style={{ whiteSpace: 'pre-line' }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animation: 'pulse-dot 1.2s infinite' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animation: 'pulse-dot 1.2s 0.2s infinite' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animation: 'pulse-dot 1.2s 0.4s infinite' }} />
              </div>
            )}
          </div>

          {/* Quick-Action Prompt Chips */}
          <div className="ai-quick-prompts">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-quick-chip"
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="chat-input-row">
            <input
              id="ai-chat-input"
              type="text"
              className="chat-input"
              placeholder="Ask about skills, tasks, pace..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;
