// src/pages/Dashboard/UserDashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { getLoggedInUser } from "../../services/authService";
import { getUserById } from "../../services/userService";
import { getAllSubTasks } from "../../services/subTaskService";

const API_BASE = "https://localhost:7039";

// Only accent/status colors stay fixed — everything else reads from MUI theme
const ACCENT = "#6c63ff";
const TEAL   = "#00d2c8";
const ROSE   = "#ff4d7e";
const AMBER  = "#ffb547";
const GREEN  = "#3dd68c";

const TASK_COLORS    = [ROSE, ACCENT, TEAL, AMBER, GREEN];
const PRIORITY_COLOR = { High: ROSE, Medium: AMBER, Low: TEAL };

// ── Avatar ─────────────────────────────────────────────────────
function AvatarImg({ user, size = 72 }) {
  const src     = user?.profileImage ? `${API_BASE}${user.profileImage}` : null;
  const initial = user?.fullName?.charAt(0) ?? "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: src ? "transparent" : `linear-gradient(135deg, ${ACCENT}, ${TEAL})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0,
      boxShadow: `0 0 0 3px rgba(108,99,255,0.2), 0 0 0 6px rgba(108,99,255,0.08)`,
      overflow: "hidden",
    }}>
      {src
        ? <img src={src} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initial}
    </div>
  );
}

// ── XP Bar ─────────────────────────────────────────────────────
function XPBar({ completed }) {
  const theme = useTheme();
  const xp    = completed * 120;
  const next  = Math.ceil((completed + 5) / 5) * 5 * 120;
  const pct   = (xp / next) * 100;
  const level = Math.floor(completed / 5) + 1;
  const track = theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: theme.palette.text.secondary }}>
          XP {xp.toLocaleString()} / {next.toLocaleString()}
        </span>
        <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>Lv {level}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: track, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${ACCENT}, ${TEAL})` }}
        />
      </div>
    </div>
  );
}

// ── Circular Progress ──────────────────────────────────────────
function CircularProgress({ value, size = 80, color = ACCENT, label }) {
  const theme = useTheme();
  const r     = (size - 10) / 2;
  const circ  = 2 * Math.PI * r;
  const dash  = Math.max(0, Math.min((value / 100) * circ, circ));
  const track = theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={6} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size > 60 ? 16 : 12, fontWeight: 700, color: theme.palette.text.primary }}>
          {value}%
        </span>
        {label && <span style={{ fontSize: 9, color: theme.palette.text.secondary, marginTop: 1 }}>{label}</span>}
      </div>
    </div>
  );
}

// ── Activity Bar ───────────────────────────────────────────────
function ActivityBar({ data }) {
  const theme    = useTheme();
  const days     = ["M","T","W","T","F","S","S"];
  const todayIdx = (new Date().getDay() + 6) % 7;
  const track    = theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const max      = Math.max(...data.map(d => d.val), 1);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 70 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.val / max) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
            style={{
              width: "100%", borderRadius: "6px 6px 3px 3px", minHeight: 4,
              background: i === todayIdx ? `linear-gradient(180deg, ${ACCENT}, ${TEAL})` : track,
            }}
          />
          <span style={{ fontSize: 9, color: theme.palette.text.secondary }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Stat Badge ─────────────────────────────────────────────────
function StatBadge({ label, value, color }) {
  const theme = useTheme();
  const shadow = theme.palette.mode === "dark"
    ? "0 2px 12px rgba(0,0,0,0.45)"
    : "0 2px 12px rgba(0,0,0,0.08)";
  const border = theme.palette.mode === "dark"
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.07)";
  return (
    <div style={{
      flex: 1,
      background: theme.palette.background.paper,
      border: `1px solid ${border}`,
      borderRadius: 12, padding: "10px 8px", textAlign: "center",
      boxShadow: shadow,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: theme.palette.text.secondary, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── Panel (left-column card wrapper) ──────────────────────────
function Panel({ children, delay = 0, style = {} }) {
  const theme  = useTheme();
  const shadow = theme.palette.mode === "dark"
    ? "0 4px 32px rgba(0,0,0,0.55)"
    : "0 4px 32px rgba(0,0,0,0.09)";
  const border = theme.palette.mode === "dark"
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.07)";
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: theme.palette.background.paper,
        border: `1px solid ${border}`,
        borderRadius: 20,
        padding: 20,
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Task Card ──────────────────────────────────────────────────
function TaskCard({ task, subtasks, expanded, onToggle }) {
  const theme    = useTheme();
  const taskSubs = subtasks.filter(s => Number(s.taskId) === Number(task.taskId));
  const done     = taskSubs.filter(s => s.isCompleted).length;
  const progress = taskSubs.length ? Math.round((done / taskSubs.length) * 100) : 0;
  const color    = TASK_COLORS[task.taskId % TASK_COLORS.length];
  const pmColor  = PRIORITY_COLOR[task.priority] ?? TEAL;

  const border   = expanded
    ? `1px solid ${color}55`
    : `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`;
  const shadow   = theme.palette.mode === "dark"
    ? "0 4px 24px rgba(0,0,0,0.5)"
    : "0 4px 24px rgba(0,0,0,0.09)";
  const track    = theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const subBg    = theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const subBorder = theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const cbBorder = theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onToggle}
      style={{
        background: theme.palette.background.paper,
        border,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: shadow,
        transition: "border 0.2s, box-shadow 0.2s",
      }}
    >
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: pmColor,
                background: pmColor + "20", borderRadius: 5,
                padding: "2px 8px", letterSpacing: 0.5, textTransform: "uppercase",
              }}>{task.priority}</span>
              <span style={{ fontSize: 11, color: theme.palette.text.secondary }}>{task.status}</span>
              {task.dueDate && (
                <span style={{ fontSize: 11, color: theme.palette.text.secondary }}>
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.palette.text.primary }}>{task.title}</div>
            {task.description && (
              <div style={{ fontSize: 12, color: theme.palette.text.secondary, marginTop: 4, lineHeight: 1.6 }}>
                {task.description}
              </div>
            )}
          </div>
          <CircularProgress value={progress} size={52} color={color} />
        </div>

        {/* progress bar */}
        <div style={{ height: 5, background: track, borderRadius: 99, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: color, borderRadius: 99 }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
          <span style={{ fontSize: 11, color: theme.palette.text.secondary }}>
            {taskSubs.length ? `${done}/${taskSubs.length} subtasks` : "No subtasks"}
          </span>
          {taskSubs.length > 0 && (
            <span style={{ fontSize: 11, color, fontWeight: 600 }}>
              {expanded ? "▲ Collapse" : "▼ Expand"}
            </span>
          )}
        </div>
      </div>

      {/* subtasks drawer */}
      <AnimatePresence>
        {expanded && taskSubs.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              borderTop: `1px solid ${subBorder}`,
              padding: "14px 18px",
              background: subBg,
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 700, color: theme.palette.text.secondary,
              marginBottom: 12, letterSpacing: 1, textTransform: "uppercase",
            }}>Subtasks</div>
            {taskSubs.map(st => (
              <div
                key={st.subTaskId}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${st.isCompleted ? color : cbBorder}`,
                  background: st.isCompleted ? color + "28" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {st.isCompleted && (
                    <svg width="10" height="8" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 13,
                  color: st.isCompleted ? theme.palette.text.disabled : theme.palette.text.primary,
                  textDecoration: st.isCompleted ? "line-through" : "none",
                }}>{st.title}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function UserDashboard() {
  const loggedUser = getLoggedInUser();
  const theme      = useTheme();

  const [user,         setUser]         = useState(null);
  const [subtasks,     setSubtasks]     = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [activeTab,    setActiveTab]    = useState("active");
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!loggedUser?.userId) return;
    Promise.all([getUserById(loggedUser.userId), getAllSubTasks()])
      .then(([userRes, stRes]) => {
        setUser(userRes.data);
        setSubtasks(stRes.data);
        setLoading(false);
      });
  }, [loggedUser?.userId]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div style={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border: `3px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderTop: `3px solid ${ACCENT}`,
          }}
        />
      </div>
    );
  }

  // ── Derived data ─────────────────────────────────────────────
  const allTasks       = user.assignedTasks ?? [];
  const activeTasks    = allTasks.filter(t => t.status !== "Completed");
  const completedTasks = allTasks.filter(t => t.status === "Completed");

  const avgProgress = allTasks.length
    ? Math.round(allTasks.reduce((acc, t) => {
        const subs = subtasks.filter(s => Number(s.taskId) === Number(t.taskId));
        const done = subs.filter(s => s.isCompleted).length;
        return acc + (subs.length ? (done / subs.length) * 100 : 0);
      }, 0) / allTasks.length)
    : 0;

  const todayStr     = new Date().toDateString();
  const dueToday     = allTasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === todayStr);
  const displayTasks = activeTab === "active" ? activeTasks : completedTasks;

  const weekActivity = Array.from({ length: 7 }, (_, i) => ({
    val: subtasks.filter(s => s.isCompleted).length > 0 ? Math.floor(Math.random() * 8) + 1 : 0,
  }));

  const hr       = new Date().getHours();
  const greeting = hr < 12 ? "Good morning ☀️" : hr < 18 ? "Good afternoon 👋" : "Good evening 🌙";

  // Theme-aware helpers
  const border     = theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardShadow = theme.palette.mode === "dark"
    ? "0 4px 28px rgba(0,0,0,0.5)"
    : "0 4px 28px rgba(0,0,0,0.09)";

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.palette.background.default,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: theme.palette.text.primary,
      padding: "28px 24px",
      boxSizing: "border-box",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap'); *{box-sizing:border-box}`}</style>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, color: theme.palette.text.secondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            {greeting}
          </div>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700,
            background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {user.fullName}
          </div>
        </div>
        <div style={{
          background: ACCENT + "18", color: ACCENT, fontSize: 12, fontWeight: 600,
          padding: "6px 16px", borderRadius: 99, border: `1px solid ${ACCENT}44`,
        }}>
          {user.roleName ?? "Member"}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", gap: 20, alignItems: "start" }}>

        {/* ════ LEFT ════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Profile */}
          <Panel delay={0} style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <AvatarImg user={user} size={76} />
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: theme.palette.text.primary }}>
              {user.fullName}
            </div>
            <div style={{ fontSize: 12, color: ACCENT, marginBottom: 4, marginTop: 2 }}>{user.email}</div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: GREEN + "18", color: GREEN,
              fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 99, marginBottom: 18,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
              {user.isActive ? "Active" : "Inactive"}
            </div>
            <XPBar completed={completedTasks.length} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <StatBadge label="Total"  value={allTasks.length}         color={ACCENT} />
              <StatBadge label="Done"   value={completedTasks.length}   color={GREEN}  />
              <StatBadge label="Skills" value={user.skills?.length ?? 0} color={AMBER} />
            </div>
          </Panel>

          {/* Skills */}
          {user.skills?.length > 0 && (
            <Panel delay={0.05}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.secondary, marginBottom: 12 }}>My Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {user.skills.map(skill => {
                  const lc = skill.skillLevel === "Expert" ? GREEN : skill.skillLevel === "Intermediate" ? AMBER : TEAL;
                  return (
                    <div key={skill.skillId} style={{
                      background: lc + "18", color: lc,
                      border: `1px solid ${lc}40`,
                      borderRadius: 99, padding: "4px 12px", fontSize: 11, fontWeight: 600,
                    }}>
                      {skill.skillName} · {skill.skillLevel}
                    </div>
                  );
                })}
              </div>
            </Panel>
          )}

          {/* Progress rings */}
          <Panel delay={0.1}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.secondary, marginBottom: 16 }}>Task Progress</div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}>
                <CircularProgress value={avgProgress} size={80} color={ACCENT} label="Avg" />
                <div style={{ fontSize: 11, color: theme.palette.text.secondary, marginTop: 6 }}>Overall</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <CircularProgress
                  value={allTasks.length ? Math.round((completedTasks.length / allTasks.length) * 100) : 0}
                  size={80} color={TEAL} label="Rate"
                />
                <div style={{ fontSize: 11, color: theme.palette.text.secondary, marginTop: 6 }}>Completion</div>
              </div>
            </div>
          </Panel>

          {/* Weekly activity */}
          <Panel delay={0.15}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.secondary, marginBottom: 4 }}>Weekly Activity</div>
            <div style={{ fontSize: 11, color: theme.palette.text.secondary, marginBottom: 14 }}>Subtask completions this week</div>
            <ActivityBar data={weekActivity} />
          </Panel>
        </div>

        {/* ════ RIGHT ════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{
              display: "flex", gap: 6,
              background: theme.palette.background.paper,
              border: `1px solid ${border}`,
              borderRadius: 14, padding: 5, width: "fit-content",
              boxShadow: cardShadow,
            }}
          >
            {[
              { key: "active",    label: `Active (${activeTasks.length})`       },
              { key: "completed", label: `Completed (${completedTasks.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? ACCENT : "transparent",
                  color: activeTab === tab.key ? "#fff" : theme.palette.text.secondary,
                  border: "none", borderRadius: 10, padding: "8px 20px",
                  fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}
          >
            {[
              { label: "In Progress",  value: activeTasks.length, color: ACCENT, icon: "⚡" },
              { label: "Due Today",    value: dueToday.length,    color: ROSE,   icon: "🔴" },
              { label: "Avg Progress", value: `${avgProgress}%`,  color: TEAL,   icon: "📈" },
            ].map((s, i) => (
              <div key={i} style={{
                background: theme.palette.background.paper,
                border: `1px solid ${border}`,
                borderRadius: 16, padding: "16px 18px",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: cardShadow,
              }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: theme.palette.text.secondary, marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Task cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {displayTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  background: theme.palette.background.paper,
                  border: `1px solid ${border}`,
                  borderRadius: 20, padding: 40, textAlign: "center",
                  boxShadow: cardShadow,
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 12 }}>
                  {activeTab === "active" ? "🎉" : "📋"}
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, color: theme.palette.text.primary, marginBottom: 6 }}>
                  {activeTab === "active" ? "All caught up!" : "No completed tasks yet"}
                </div>
                <div style={{ fontSize: 13, color: theme.palette.text.secondary }}>
                  {activeTab === "active"
                    ? "You have no active tasks right now."
                    : "Complete tasks to see them here."}
                </div>
              </motion.div>
            ) : (
              displayTasks.map((task, i) => (
                <motion.div
                  key={task.taskId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                >
                  <TaskCard
                    task={task}
                    subtasks={subtasks}
                    expanded={expandedTask === task.taskId}
                    onToggle={() => setExpandedTask(expandedTask === task.taskId ? null : task.taskId)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}