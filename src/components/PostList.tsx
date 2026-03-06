"use client";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string;
  status: string;
  scheduledAt: string | null;
  business?: { name: string };
}

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
        생성된 글이 없습니다. &quot;글 생성&quot; 탭에서 글을 만들어보세요.
      </div>
    );
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    draft: { text: "초안", color: "bg-gray-100 text-gray-600" },
    scheduled: { text: "예약됨", color: "bg-blue-100 text-blue-600" },
    published: { text: "발행됨", color: "bg-green-100 text-green-600" },
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">생성된 글 목록</h2>
      {posts.map((post) => {
        const status = statusLabel[post.status] || statusLabel.draft;
        let tags: string[] = [];
        try {
          tags = JSON.parse(post.tags);
        } catch {
          tags = post.tags.split(",");
        }

        return (
          <div key={post.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium">{post.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                {status.text}
              </span>
            </div>
            {post.business && (
              <p className="text-xs text-gray-400 mb-2">{post.business.name}</p>
            )}
            <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {post.scheduledAt && (
              <p className="text-xs text-blue-500 mt-2">
                예약: {new Date(post.scheduledAt).toLocaleString("ko-KR")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
