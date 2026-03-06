"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import BusinessForm from "./BusinessForm";
import BusinessList from "./BusinessList";
import PostList from "./PostList";
import SchedulePanel from "./SchedulePanel";
import SettingsPanel from "./SettingsPanel";

interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  imageUrl: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string;
  status: string;
  scheduledAt: string | null;
  businessId: string;
  business?: Business;
}

export default function Dashboard({ user }: { user: { name?: string | null; image?: string | null } }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"businesses" | "generate" | "schedule" | "settings">("businesses");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusinesses();
    fetchScheduled();
  }, []);

  async function fetchBusinesses() {
    const res = await fetch("/api/businesses");
    if (res.ok) setBusinesses(await res.json());
  }

  async function fetchScheduled() {
    const res = await fetch("/api/posts/schedule");
    if (res.ok) setPosts(await res.json());
  }

  async function handleAddBusiness(data: {
    name: string;
    description: string;
    category: string;
    address: string;
    phone: string;
  }) {
    const res = await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchBusinesses();
    }
  }

  async function handleGenerate(businessId: string, count: number) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, count }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [...data.posts, ...prev]);
        setActiveTab("schedule");
      } else {
        setError(data.error || "생성에 실패했습니다.");
        if (data.error?.includes("API 키")) setActiveTab("settings");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule(postIds: string[], scheduleTimes: string[]) {
    const res = await fetch("/api/posts/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postIds, scheduleTimes }),
    });
    if (res.ok) {
      await fetchScheduled();
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600">AutoBlog</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <nav className="flex gap-6">
          {[
            { key: "businesses" as const, label: "내 업체 관리" },
            { key: "generate" as const, label: "글 생성" },
            { key: "schedule" as const, label: "예약 발행" },
            { key: "settings" as const, label: "설정" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-6">
        {activeTab === "businesses" && (
          <div className="space-y-6">
            <BusinessForm onSubmit={handleAddBusiness} />
            <BusinessList businesses={businesses} />
          </div>
        )}

        {activeTab === "generate" && (
          <div className="space-y-6">
            {businesses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                먼저 &quot;내 업체 관리&quot; 탭에서 업체를 등록해주세요.
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">AI 블로그 글 생성</h2>
                <p className="text-sm text-gray-500 mb-4">
                  업체를 선택하면 AI가 자동으로 블로그 글을 생성합니다. (하루 3개 무료)
                </p>
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
                )}
                <div className="grid gap-4">
                  {businesses.map((biz) => (
                    <div
                      key={biz.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div>
                        <p className="font-medium">{biz.name}</p>
                        <p className="text-sm text-gray-500">
                          {biz.category} {biz.description && `- ${biz.description}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleGenerate(biz.id, 3)}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {loading ? "생성 중..." : "3개 글 생성"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-6">
            <SchedulePanel posts={posts} onSchedule={handleSchedule} />
            <PostList posts={posts} />
          </div>
        )}

        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
