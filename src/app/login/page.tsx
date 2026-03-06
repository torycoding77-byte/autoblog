"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">AutoBlog</h1>
        <p className="text-gray-500 mb-8">
          AI가 자동으로 네이버 블로그 글을 생성합니다
        </p>

        <button
          onClick={() => signIn("naver", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-[#03C75A] hover:bg-[#02b351] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.5 10.6L6.3 1H1v18h5.5V9.4L13.7 19H19V1h-5.5v9.6z" />
          </svg>
          네이버로 로그인
        </button>

        <p className="text-xs text-gray-400 mt-6">
          로그인 시 네이버 계정 정보가 안전하게 OAuth로 처리됩니다.
          <br />
          비밀번호는 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}
