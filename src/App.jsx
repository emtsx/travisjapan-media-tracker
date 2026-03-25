import React, { useMemo, useState } from "react";

const APP_TITLE = "Travis Japan - Media Tracker";

const MEMBER_OPTIONS = [
  "Travis Japan",
  "宮近海斗",
  "中村海人",
  "七五三掛龍也",
  "川島如恵留",
  "吉澤閑也",
  "松田元太",
  "松倉海斗",
];

const CATEGORY_OPTIONS = ["すべて", "ドラマ", "バラエティー", "音楽", "その他"];
const MEDIA_OPTIONS = ["TV", "配信", "ラジオ", "雑誌", "FC", "Instagram", "円盤"];
const WATCH_FILTER_OPTIONS = ["すべて", "未視聴", "視聴済み"];
const VIDEO_FILTER_OPTIONS = ["すべて", "動画あり", "動画なし"];
const MEMBER_FILTER_OPTIONS = ["すべて", ...MEMBER_OPTIONS];

const MEMBER_COLORS = {
  "Travis Japan": { bg: "#c4b5fd", text: "#4c1d95", border: "#a78bfa" },
  宮近海斗: { bg: "#ef4444", text: "#ffffff", border: "#dc2626" },
  中村海人: { bg: "#22c55e", text: "#ffffff", border: "#16a34a" },
  七五三掛龍也: { bg: "#f472b6", text: "#ffffff", border: "#ec4899" },
  川島如恵留: { bg: "#ffffff", text: "#334155", border: "#cbd5e1" },
  吉澤閑也: { bg: "#facc15", text: "#713f12", border: "#eab308" },
  松田元太: { bg: "#3b82f6", text: "#ffffff", border: "#2563eb" },
  松倉海斗: { bg: "#fb923c", text: "#ffffff", border: "#f97316" },
};

const starterItems = [
  {
    id: 1,
    source: "TV",
    category: "音楽",
    programName: "CDTVライブ！ライブ！",
    summary: "グループでパフォーマンス出演。",
    date: "2026-03-25",
    time: "19:00",
    members: ["Travis Japan"],
    watched: false,
    hasVideo: true,
  },
  {
    id: 2,
    source: "TV",
    category: "バラエティー",
    programName: "酒のツマミになる話",
    summary: "松田元太が出演予定。",
    date: "2026-03-26",
    time: "21:00",
    members: ["松田元太"],
    watched: true,
    hasVideo: true,
  },
];

const tabs = [
  ...CATEGORY_OPTIONS.map((c) => ({ key: c, label: c })),
  { key: "input", label: "追加" },
];

const palette = {
  pageBg: "linear-gradient(180deg, #2e1065 0%, #4c1d95 48%, #5b21b6 100%)",
  cardBg: "rgba(255,255,255,0.96)",
  border: "#d8b4fe",
  text: "#3b0764",
  muted: "#7e22ce",
  accent: "#7c3aed",
  accentSoft: "#ede9fe",
};

function compareDateTimeAsc(a, b) {
  return new Date(`${a.date}T${a.time || "00:00"}`).getTime() - new Date(`${b.date}T${b.time || "00:00"}`).getTime();
}

function getMemberColor(member) {
  return MEMBER_COLORS[member] || { bg: "#e2e8f0", text: "#334155", border: "#cbd5e1" };
}

function matchesWatchFilter(item, filter) {
  if (filter === "すべて") return true;
  if (filter === "未視聴") return item.watched === false;
  if (filter === "視聴済み") return item.watched === true;
  return true;
}

function matchesVideoFilter(item, filter) {
  if (filter === "すべて") return true;
  if (filter === "動画あり") return item.hasVideo === true;
  if (filter === "動画なし") return item.hasVideo === false;
  return true;
}

function matchesMemberFilter(item, filter) {
  if (filter === "すべて") return true;
  return Array.isArray(item.members) && item.members.includes(filter);
}

function isWithinDateRange(item, startDate, endDate) {
  if (startDate && item.date < startDate) return false;
  if (endDate && item.date > endDate) return false;
  return true;
}

function pill(active) {
  return {
    borderRadius: 999,
    padding: "10px 16px",
    border: `1px solid ${active ? palette.accent : palette.border}`,
    background: active ? palette.accent : "#fff",
    color: active ? "#fff" : palette.text,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: active ? "0 6px 16px rgba(124,58,237,0.35)" : "0 2px 6px rgba(0,0,0,0.05)",
  };
}

function badge(type) {
  const map = {
    default: { bg: palette.accentSoft, color: palette.text },
    green: { bg: "#dcfce7", color: "#166534" },
    gray: { bg: "#f1f5f9", color: "#334155" },
  };
  const c = map[type];
  return {
    background: c.bg,
    color: c.color,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  };
}

function memberTagStyle(member, active = false) {
  const c = getMemberColor(member);
  return {
    background: c.bg,
    color: c.text,
    border: `2px solid ${c.border}`,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
    opacity: active ? 1 : 0.6,
  };
}

function inputStyle(fullWidth = false) {
  return {
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${palette.border}`,
    width: fullWidth ? "100%" : "auto",
    boxSizing: "border-box",
  };
}

export default function App() {
  const [mobileDemo, setMobileDemo] = useState(false);
  const [items, setItems] = useState(starterItems);
  const [tab, setTab] = useState("すべて");
  const [watchFilter, setWatchFilter] = useState("すべて");
  const [videoFilter, setVideoFilter] = useState("すべて");
  const [memberFilter, setMemberFilter] = useState("すべて");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [draft, setDraft] = useState({
    source: "TV",
    category: "ドラマ",
    programName: "",
    summary: "",
    date: "2026-03-30",
    time: "20:00",
    members: [],
    watched: false,
    hasVideo: false,
  });

  const filtered = useMemo(() => {
    return items
      .filter((i) => tab === "すべて" || i.category === tab)
      .filter((i) => matchesWatchFilter(i, watchFilter))
      .filter((i) => matchesVideoFilter(i, videoFilter))
      .filter((i) => matchesMemberFilter(i, memberFilter))
      .filter((i) => isWithinDateRange(i, startDateFilter, endDateFilter));
  }, [items, tab, watchFilter, videoFilter, memberFilter, startDateFilter, endDateFilter]);

  const sorted = useMemo(() => [...filtered].sort(compareDateTimeAsc), [filtered]);

  function addItem() {
    if (!draft.programName.trim()) return;
    setItems((prev) => [...prev, { ...draft, id: Date.now() }]);
    setDraft((prev) => ({ ...prev, programName: "", summary: "" }));
  }

  function toggleField(id, key) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: !i[key] } : i)));
  }

  function toggleDraftMember(member) {
    setDraft((prev) => ({
      ...prev,
      members: prev.members.includes(member)
        ? prev.members.filter((x) => x !== member)
        : [...prev.members, member],
    }));
  }

  return (
    <div style={{ padding: mobileDemo ? 16 : 32, background: palette.pageBg, minHeight: "100vh" }}>
      <div style={{ maxWidth: mobileDemo ? 390 : 960, margin: "0 auto", transition: "max-width 0.2s ease" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#fff", fontWeight: 900, fontSize: mobileDemo ? 22 : 28, letterSpacing: 0.2 }}>
            {APP_TITLE}
          </div>
          <button onClick={() => setMobileDemo((v) => !v)} style={pill(mobileDemo)}>
            {mobileDemo ? "通常表示に戻す" : "スマホ表示デモ"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={pill(tab === t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab !== "input" && (
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: 16,
              borderRadius: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {WATCH_FILTER_OPTIONS.map((o) => (
                <button key={o} onClick={() => setWatchFilter(o)} style={pill(watchFilter === o)}>
                  {o}
                </button>
              ))}
              {VIDEO_FILTER_OPTIONS.map((o) => (
                <button key={o} onClick={() => setVideoFilter(o)} style={pill(videoFilter === o)}>
                  {o}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", flexDirection: mobileDemo ? "column" : "row" }}>
              <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)} style={inputStyle(mobileDemo)}>
                {MEMBER_FILTER_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} style={inputStyle(mobileDemo)} />
              <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} style={inputStyle(mobileDemo)} />
            </div>
          </div>
        )}

        {tab !== "input" &&
          sorted.map((i) => (
            <div
              key={i.id}
              style={{
                background: palette.cardBg,
                padding: mobileDemo ? 16 : 20,
                borderRadius: 24,
                marginBottom: 14,
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontWeight: 900, color: palette.accent, fontSize: 20 }}>{i.date}</div>
              <div style={{ color: palette.muted, fontSize: 14 }}>{i.time}</div>
              <div style={{ fontWeight: 900, fontSize: 20, marginTop: 8 }}>{i.programName}</div>

              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span style={badge("default")}>{i.category}</span>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", flexDirection: mobileDemo ? "column" : "row" }}>
                <button onClick={() => toggleField(i.id, "watched")} style={pill(i.watched)}>
                  {i.watched ? "視聴済み" : "未視聴"}
                </button>
                <button onClick={() => toggleField(i.id, "hasVideo")} style={pill(i.hasVideo)}>
                  {i.hasVideo ? "動画あり" : "動画なし"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {i.members.map((m) => (
                  <span key={m} style={memberTagStyle(m, true)}>
                    {m}
                  </span>
                ))}
              </div>

              {i.summary && <div style={{ marginTop: 10 }}>{i.summary}</div>}
            </div>
          ))}

        {tab === "input" && (
          <div style={{ background: "#fff", padding: 20, borderRadius: 20 }}>
            <div style={{ marginBottom: 10, fontWeight: 700 }}>カテゴリ / 媒体</div>
            <div style={{ display: "flex", gap: 8, flexDirection: mobileDemo ? "column" : "row" }}>
              <select value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} style={inputStyle(mobileDemo)}>
                {CATEGORY_OPTIONS.filter((c) => c !== "すべて").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select value={draft.source} onChange={(e) => setDraft((p) => ({ ...p, source: e.target.value }))} style={inputStyle(mobileDemo)}>
                {MEDIA_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: 10, fontWeight: 700 }}>タイトル</div>
            <input
              placeholder="タイトル"
              value={draft.programName}
              onChange={(e) => setDraft((p) => ({ ...p, programName: e.target.value }))}
              style={{ ...inputStyle(true), marginTop: 4 }}
            />

            <div style={{ marginTop: 10, fontWeight: 700 }}>日付・時間</div>
            <div style={{ display: "flex", gap: 8, flexDirection: mobileDemo ? "column" : "row" }}>
              <input type="date" value={draft.date} onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))} style={inputStyle(mobileDemo)} />
              <input type="time" value={draft.time} onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))} style={inputStyle(mobileDemo)} />
            </div>

            <div style={{ marginTop: 10, fontWeight: 700 }}>出演メンバー</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {MEMBER_OPTIONS.map((m) => (
                <button key={m} type="button" onClick={() => toggleDraftMember(m)} style={memberTagStyle(m, draft.members.includes(m))}>
                  {m}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <button onClick={addItem} style={pill(true)}>
                追加する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
