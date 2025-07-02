// packages/web/src/app/(admin)/admin/page.tsx

"use client"; // ⬅️ 클라이언트 컴포넌트로 전환

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllListings, deleteListingById } from "@/lib/api"; // ⬅️ deleteListingById 추가
import { Listing } from "@prisma/client";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const { token } = useAuth();

  const fetchListings = async () => {
    const data = await getAllListings();
    setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      try {
        await deleteListingById(id, token);
        alert('삭제되었습니다.');
        fetchListings(); // 목록을 다시 불러옵니다.
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">매물 관리</h1>
        <Link href="/admin/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + 새 매물 등록
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">매물 이름</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지역</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">권리금</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{listing.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{listing.region}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{listing.keyMoney.toLocaleString()} 원</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    listing.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/admin/edit/${listing.id}`} className="text-indigo-600 hover:text-indigo-900">
                    수정
                </Link>
                <button onClick={() => handleDelete(listing.id)} className="text-red-600 hover:text-red-900 ml-4">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}