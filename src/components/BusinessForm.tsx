"use client";

import { useState } from "react";

interface Props {
  onSubmit: (data: {
    name: string;
    description: string;
    category: string;
    address: string;
    phone: string;
  }) => Promise<void>;
}

export default function BusinessForm({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
    setForm({ name: "", description: "", category: "", address: "", phone: "" });
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-green-400 p-6 text-gray-500 hover:text-green-600 transition-colors"
      >
        + 새 업체 등록
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold">업체 등록</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          업체명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="예: 수학공부방"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">선택하세요</option>
          <option value="교육/학원">교육/학원</option>
          <option value="음식점/카페">음식점/카페</option>
          <option value="미용/뷰티">미용/뷰티</option>
          <option value="건강/의료">건강/의료</option>
          <option value="생활/서비스">생활/서비스</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">업체 설명</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="업체에 대한 간단한 설명 (AI가 글 작성 시 참고합니다)"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="예: 서울시 강남구"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="예: 010-1234-5678"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          등록
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
