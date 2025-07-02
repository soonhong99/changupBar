// packages/web/src/lib/api.ts

import { Listing } from '@prisma/client'; // Prisma 타입을 재사용!
import { LoginUserInput } from '../../../shared/src/schemas/auth.schema'; // ⬅️ 추가
import { CreateListingInput } from '../../../shared/src/schemas/listing.schema'; // ⬅️ 추가
import { UpdateListingInput } from '../../../shared/src/schemas/listing.schema'; // ⬅️ 추가

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getListingById(id: string): Promise<Listing | null> {
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

// 필터 타입을 정의합니다.
export interface ListingFilter {
    region?: string;
    category?: string;
    keyMoneyLte?: number;
}

export async function getAllListings(filter: ListingFilter = {}): Promise<Listing[]> {
    // 쿼리 스트링을 생성합니다.
    const query = new URLSearchParams();
    if (filter.region) query.append('region', filter.region);
    if (filter.category) query.append('category', filter.category);
    if (filter.keyMoneyLte) query.append('keyMoneyLte', filter.keyMoneyLte.toString());
  
    const queryString = query.toString();
    const url = queryString ? `${API_URL}/listings?${queryString}` : `${API_URL}/listings`;
  
    try {
      const res = await fetch(url);
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

export async function createListing(data: CreateListingInput): Promise<Listing> {
  // 나중에 관리자 인증이 추가되면 여기에 token을 헤더에 담아 보내야 합니다.
  const res = await fetch(`${API_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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