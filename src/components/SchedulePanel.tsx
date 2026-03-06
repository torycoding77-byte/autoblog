"use client";

import { useState } from "react";

interface Post {
  id: string;
  title: string;
  status: string;
  scheduledAt: string | null;
}

interface Props {
  posts: Post[];
  onSchedule: (postIds: string[], scheduleTimes: string[]) => Promise<void>;
}

export default function SchedulePanel({ posts, onSchedule }: Props) {
  const draftPosts = posts.filter((p) => p.status === "draft");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [startTime, setStartTime] = useState("09:00");
  const [intervalMinutes, setIntervalMinutes] = useState(120);
  const [saving, setSaving] = useState(false);

  function togglePost(id: string) {
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedPosts.size === draftPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(draftPosts.map((p) => p.id)));
    }
  }

  async function handleSchedule() {
    if (selectedPosts.size === 0) return;

    setSaving(true);
    try {
      const postIds = Array.from(selectedPosts);
      const scheduleTimes = postIds.map((_, i) => {
        const [h, m] = startTime.split(":").map(Number);
        const d = new Date(startDate);
        d.setHours(h, m + intervalMinutes * i, 0, 0);
        return d.toISOString();
      });

      await onSchedule(postIds, scheduleTimes);
      setSelectedPosts(new Set());
    } finally {
      setSaving(false);
    }
  }

  if (draftPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">예약 발행 설정</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">발행 날짜</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">글 간격 (분)</label>
          <select
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value={60}>1시간</option>
            <option value={120}>2시간</option>
            <option value={180}>3시간</option>
            <option value={240}>4시간</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            예약할 글 선택 ({selectedPosts.size}/{draftPosts.length})
          </span>
          <button onClick={selectAll} className="text-xs text-green-600 hover:underline">
            {selectedPosts.size === draftPosts.length ? "선택 해제" : "전체 선택"}
          </button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {draftPosts.map((post, i) => {
            const [h, m] = startTime.split(":").map(Number);
            const schedTime = new Date(startDate);
            schedTime.setHours(h, m + intervalMinutes * i, 0, 0);

            return (
              <label
                key={post.id}
                className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedPosts.has(post.id) ? "border-green-400 bg-green-50" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPosts.has(post.id)}
                  onChange={() => togglePost(post.id)}
                  className="accent-green-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {schedTime.toLocaleString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSchedule}
        disabled={selectedPosts.size === 0 || saving}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors"
      >
        {saving ? "예약 중..." : `${selectedPosts.size}개 글 예약 발행`}
      </button>
    </div>
  );
}
