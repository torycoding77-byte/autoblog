"use client";

interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  imageUrl: string | null;
}

export default function BusinessList({ businesses }: { businesses: Business[] }) {
  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
        등록된 업체가 없습니다. 위 버튼을 눌러 업체를 등록하세요.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {businesses.map((biz) => (
        <div key={biz.id} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{biz.name}</h3>
              {biz.category && (
                <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mt-1">
                  {biz.category}
                </span>
              )}
              {biz.description && (
                <p className="text-sm text-gray-500 mt-2">{biz.description}</p>
              )}
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                {biz.address && <span>{biz.address}</span>}
                {biz.phone && <span>{biz.phone}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
