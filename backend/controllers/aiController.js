const Goal = require('../models/goalModel');
const Habit = require('../models/habitModel');
const Project = require('../models/projectModel');

// @desc    AI Productivity Assistant Endpoint
// @route   POST /api/ai/chat
const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Gather live context from all MongoDB collections
    const [goals, habits, projects] = await Promise.all([
      Goal.find(),
      Habit.find(),
      Project.find()
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    const overdueGoals = activeGoals.filter(g => g.endDate && new Date(g.endDate) < today);
    const topHabit = [...habits].sort((a, b) => b.streak - a.streak)[0];

    // Calculate total logged hours
    const parseTime = (str) => {
      if (!str) return 0;
      if (str.includes(':')) {
        const [h, m] = str.split(':');
        return (parseInt(h || 0)) + (parseInt(m || 0) / 60);
      }
      return parseFloat(str) || 0;
    };
    const totalHours = projects.reduce(
      (acc, p) => acc + (p.hours || []).reduce((s, h) => s + parseTime(h), 0),
      0
    );

    // 2. If GEMINI_API_KEY is configured in .env, call Gemini directly
    if (process.env.GEMINI_API_KEY) {
      const systemContext = `You are an enterprise productivity AI assistant inside a MERN Goal Tracker app.
Live User Workspace Data:
- Total Goals: ${goals.length} (${completedGoals.length} completed, ${activeGoals.length} active)
- Overdue Goals: ${overdueGoals.map(g => g.text).join(', ') || 'None'}
- Active Goals List: ${activeGoals.map(g => `${g.text} [${g.category}]`).join('; ') || 'None'}
- Habits: ${habits.map(h => `${h.name} (${h.streak}d streak)`).join(', ') || 'None'}
- Total Timesheet Hours Logged: ${totalHours.toFixed(1)}h
Keep responses concise, actionable, and tailored to the user's live data.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemContext}\n\nUser Question: ${message}` }] }]
          })
        }
      );

      const geminiData = await geminiRes.json();
      const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        return res.status(200).json({ reply: aiText, source: 'Gemini AI' });
      }
    }

    // 3. Built-in Context-Aware Intelligence Fallback (Zero-fail for live demos)
    const query = message.toLowerCase();
    let reply = '';

    if (query.includes('summary') || query.includes('status') || query.includes('overview') || query.includes('how am i doing')) {
      const rate = goals.length === 0 ? 0 : Math.round((completedGoals.length / goals.length) * 100);
      reply = `Here is your live workspace briefing:\n\n• **Goal Execution:** You've completed **${completedGoals.length} of ${goals.length}** goals (**${rate}%** completion rate).\n• **Overdue Alerts:** ${overdueGoals.length > 0 ? `You have **${overdueGoals.length}** overdue item(s): *${overdueGoals.map(g => g.text).join(', ')}*.` : 'Zero overdue tasks—you are right on schedule!'}\n• **Habit Momentum:** ${topHabit ? `Your strongest habit is **${topHabit.name}** on a **${topHabit.streak}-day streak**.` : 'No habits tracked yet.'}\n• **Time Logged:** **${totalHours.toFixed(1)} hours** recorded across ${projects.length} timesheet project(s).`;
    } else if (query.includes('focus') || query.includes('priority') || query.includes('next') || query.includes('overdue')) {
      if (overdueGoals.length > 0) {
        reply = `You should tackle your **${overdueGoals.length} overdue goal(s)** first:\n\n${overdueGoals.map((g, i) => `${i + 1}. **${g.text}** (${g.category})`).join('\n')}\n\nReschedule them in the **Upcoming** tab or check them off once completed.`;
      } else if (activeGoals.length > 0) {
        const nextGoal = activeGoals[0];
        reply = `Since you have no overdue tasks, focus on **${nextGoal.text}** under *${nextGoal.category}*. Consider breaking it into 2–3 smaller sub-tasks inside the **Timeline** view to keep momentum high.`;
      } else {
        reply = `Your active queue is completely clear! Head to **Today** or **Inbox** to add your next milestone.`;
      }
    } else if (query.includes('habit') || query.includes('streak')) {
      reply = habits.length > 0
        ? `You are tracking **${habits.length} habit(s)**:\n\n${habits.map(h => `• **${h.name}**: ${h.streak}-day streak`).join('\n')}\n\nKeep checking in daily on the **Habits** tab to protect your streak!`
        : `You haven't created any daily habits yet. Go to **Habits** in the sidebar and add a daily routine like "Code for 1 Hour" or "Drink 2L Water".`;
    } else if (query.includes('breakdown') || query.includes('subtask') || query.includes('plan')) {
      const target = activeGoals[0];
      reply = target
        ? `Here is a suggested 3-step sub-task breakdown for **"${target.text}"**:\n\n1. **Phase 1 (Research & Setup):** Define core requirements and gather resources.\n2. **Phase 2 (Execution):** Complete the primary deliverable in focused 90-minute blocks.\n3. **Phase 3 (Review & Finalize):** Test, verify quality, and mark complete.\n\n*Tip: Go to **Timeline**, hover over "${target.text}", and click **+** to add these directly!*`
        : `Add an active goal first, and I will generate a step-by-step sub-task breakdown for it.`;
    } else {
      reply = `I analyzed your live database (**${activeGoals.length} active goals**, **${habits.length} habits**, **${totalHours.toFixed(1)}h logged**). Ask me:\n\n• *"Give me a workspace summary"*\n• *"What should I focus on next?"*\n• *"Break down my top goal into sub-tasks"*\n• *"How are my habit streaks doing?"*`;
    }

    res.status(200).json({ reply, source: 'Workspace AI Engine' });
  } catch (error) {
    console.error('AI Assistant Error:', error);
    res.status(500).json({ message: 'Failed to generate AI response' });
  }
};

module.exports = { chatWithAssistant };