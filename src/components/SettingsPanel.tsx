"use client";

import { useState, useEffect } from "react";

export default function SettingsPanel() {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setHasKey(data.hasApiKey));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiApiKey: apiKey }),
      });
      if (res.ok) {
        setHasKey(true);
        setApiKey("");
        setMessage("API 키가 저장되었습니다.");
      } else {
        const data = await res.json();
        setMessage(data.error || "저장에 실패했습니다.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-lg font-semibold">AI 설정</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Gemini API 키가 필요합니다 (무료)</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Google AI Studio
            </a>
            에 접속 (Google 계정 로그인)
          </li>
          <li>&quot;Create API Key&quot; 클릭</li>
          <li>생성된 키를 아래에 붙여넣기</li>
        </ol>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gemini API Key
        </label>
        <div className="flex gap-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasKey ? "••••••••••(등록됨) - 변경하려면 새 키 입력" : "AIza..."}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || saving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
        {message && (
          <p className={`text-sm mt-2 ${message.includes("실패") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">이용 안내</h3>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>- 하루 최대 <strong>3개</strong> 글 무료 생성</li>
          <li>- Gemini 무료 티어: 분당 15회, 하루 1,500회</li>
          <li>- API 키는 암호화되어 안전하게 저장됩니다</li>
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">상태:</span>
        {hasKey ? (
          <span className="text-sm text-green-600 font-medium">API 키 등록됨 ✓</span>
        ) : (
          <span className="text-sm text-red-500 font-medium">API 키 미등록</span>
        )}
      </div>
    </div>
  );
}
