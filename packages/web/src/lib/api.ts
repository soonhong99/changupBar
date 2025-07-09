// packages/web/src/lib/api.ts

import { Listing, User } from '@prisma/client'; // Prisma 타입을 재사용!
import { LoginUserInput, RegisterUserInput } from '../../../shared/src/schemas/auth.schema'; // ⬅️ 추가
import { CreateListingInput, UpdateListingInput } from '../../../shared/src/schemas/listing.schema'; // ⬅️ 추가

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 필터 타입을 정의합니다.
export interface ListingFilter {
  region?: string;
  category?: string;
  keyMoneyLte?: number;
  sortBy?: 'createdAt' | 'keyMoney' | 'status' | 'viewCount' | 'likeCount'; // ⬅️ 추가
  order?: string;  // 추가
  status?: string; // ⬅️ 이 줄을 추가합니다.
}

export async function getListingById(id: string): Promise<ListingWithCounts | null> {
  try {
    const res = await fetch(`${API_URL}/listings/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch listing');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}



export async function getAllListings(filter: ListingFilter = {}, token?: string | null): Promise<ListingWithCounts[]> {
    // 쿼리 스트링을 생성합니다.
    const query = new URLSearchParams();
    if (filter.region) query.append('region', filter.region);
    if (filter.category) query.append('category', filter.category);
    if (filter.keyMoneyLte) query.append('keyMoneyLte', filter.keyMoneyLte.toString());
    if (filter.sortBy) query.append('sortBy', filter.sortBy); // 추가
    if (filter.order) query.append('order', filter.order); // 추가
  
    const queryString = query.toString();
    const url = queryString ? `${API_URL}/listings?${queryString}` : `${API_URL}/listings`;
  
    try {
      const res = await fetch(url, {
        // ⬇️ 헤더 부분을 추가/수정합니다.
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error('Failed to fetch listings');
      }
      return res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
}

export async function loginUser(data: LoginUserInput): Promise<{ token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '로그인에 실패했습니다.');
  }

  return res.json();
}

export async function likeListing(listingId: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/listings/${listingId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // ⬅️ 인증 토큰을 헤더에 추가
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '매물 찜하기에 실패했습니다.');
  }

  return res.json();
}

export async function createListing(data: CreateListingInput, token: String): Promise<Listing> {
  const res = await fetch(`${API_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '매물 생성에 실패했습니다.');
  }

  return res.json();
}

export async function getPresignedUrl(
  { filename, filetype }: { filename: string, filetype: string }, 
  token: string
): Promise<{ uploadUrl: string, publicUrl: string }> {
  const res = await fetch(`${API_URL}/uploads/presigned-url?filename=${filename}&filetype=${filetype}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Pre-signed URL을 받아오는데 실패했습니다.');
  }

  return res.json();
}

export async function deleteListingById(id: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '매물 삭제에 실패했습니다.');
  }

  return res.json();
}

export async function updateListing(
  id: string,
  data: UpdateListingInput,
  token: string
): Promise<Listing> {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '매물 수정에 실패했습니다.');
  }

  return res.json();
}

export async function registerUser(data: RegisterUserInput): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '회원가입에 실패했습니다.');
  }
  return res.json();
}

export async function getMyLikedListings(token: string): Promise<Listing[]> {
  const res = await fetch(`${API_URL}/users/me/likes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('찜한 목록을 불러오는데 실패했습니다.');
  return res.json();
}

export async function getMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// getFeaturedListings 함수의 반환 타입을 ListingWithCounts[]로 변경합니다.
export async function getFeaturedListings(): Promise<ListingWithCounts[]> {
  try {
    const res = await fetch(`${API_URL}/listings/featured`);
    if (!res.ok) {
      throw new Error('대표 매물을 불러오는데 실패했습니다.');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getListingStats(): Promise<{ totalCount: number; newThisWeekCount: number }> {
  try {
    const res = await fetch(`${API_URL}/listings/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  } catch (error) {
    console.error(error);
    return { totalCount: 0, newThisWeekCount: 0 };
  }
}

export type ListingWithCounts = Listing & {
  _count: {
    likedBy: number;
  };
};