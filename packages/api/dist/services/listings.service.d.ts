import { CreateListingInput } from '../../../shared/dist/src/schemas/listing.schema.js';
import { UserRole } from '@prisma/client';
import { UpdateListingInput } from '../../../shared/dist/src/schemas/listing.schema.js';
/**
 * 신규 매물을 데이터베이스에 생성합니다.
 * @param data 컨트롤러에서 유효성 검사를 마친 매물 데이터
 * @returns 생성된 매물 객체
 */
declare function create(data: CreateListingInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    sido: string | null;
    sigungu: string | null;
    eupmyeondong: string | null;
    roadAddress: string | null;
    detailAddress: string | null;
    region: import("@prisma/client").$Enums.Region;
    category: import("@prisma/client").$Enums.Category;
    deposit: number;
    monthlyRent: number;
    keyMoney: number;
    monthlyRevenue: number;
    materialCost: number;
    personnelCost: number;
    utilityCost: number;
    otherCost: number;
    deliveryPercent: number;
    netProfit: number;
    isAutomated: boolean;
    hasParking: boolean;
    isFirstFloor: boolean;
    isNearStation: boolean;
    isBeginnerFriendly: boolean;
    isWomanFriendly: boolean;
    description: string;
    coverImage: string;
    imageUrls: string[];
    status: import("@prisma/client").$Enums.ListingStatus;
    contractStatus: import("@prisma/client").$Enums.ContractStatus;
    viewCount: number;
    likeCount: number;
    isBest: boolean;
    bestUntil: Date | null;
    isWeeklyBest: boolean;
    featuredStart: Date | null;
    featuredEnd: Date | null;
}>;
/**
 * ID로 특정 매물 하나를 조회합니다.
 * @param id 조회할 매물의 ID
 * @returns 조회된 매물 객체, 없으면 null
 */
declare function getById(id: string): Promise<({
    _count: {
        likedBy: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    sido: string | null;
    sigungu: string | null;
    eupmyeondong: string | null;
    roadAddress: string | null;
    detailAddress: string | null;
    region: import("@prisma/client").$Enums.Region;
    category: import("@prisma/client").$Enums.Category;
    deposit: number;
    monthlyRent: number;
    keyMoney: number;
    monthlyRevenue: number;
    materialCost: number;
    personnelCost: number;
    utilityCost: number;
    otherCost: number;
    deliveryPercent: number;
    netProfit: number;
    isAutomated: boolean;
    hasParking: boolean;
    isFirstFloor: boolean;
    isNearStation: boolean;
    isBeginnerFriendly: boolean;
    isWomanFriendly: boolean;
    description: string;
    coverImage: string;
    imageUrls: string[];
    status: import("@prisma/client").$Enums.ListingStatus;
    contractStatus: import("@prisma/client").$Enums.ContractStatus;
    viewCount: number;
    likeCount: number;
    isBest: boolean;
    bestUntil: Date | null;
    isWeeklyBest: boolean;
    featuredStart: Date | null;
    featuredEnd: Date | null;
}) | null>;
/**
 * 필터 조건과 사용자 역할에 따라 매물 목록을 조회합니다.
 * @param query 필터 및 정렬 조건
 * @param role 요청한 사용자의 역할 (예: 'ADMIN', 'USER' 또는 undefined)
 */
declare function getAll(query: GetAllListingsQuery, role?: UserRole): Promise<({
    _count: {
        likedBy: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    sido: string | null;
    sigungu: string | null;
    eupmyeondong: string | null;
    roadAddress: string | null;
    detailAddress: string | null;
    region: import("@prisma/client").$Enums.Region;
    category: import("@prisma/client").$Enums.Category;
    deposit: number;
    monthlyRent: number;
    keyMoney: number;
    monthlyRevenue: number;
    materialCost: number;
    personnelCost: number;
    utilityCost: number;
    otherCost: number;
    deliveryPercent: number;
    netProfit: number;
    isAutomated: boolean;
    hasParking: boolean;
    isFirstFloor: boolean;
    isNearStation: boolean;
    isBeginnerFriendly: boolean;
    isWomanFriendly: boolean;
    description: string;
    coverImage: string;
    imageUrls: string[];
    status: import("@prisma/client").$Enums.ListingStatus;
    contractStatus: import("@prisma/client").$Enums.ContractStatus;
    viewCount: number;
    likeCount: number;
    isBest: boolean;
    bestUntil: Date | null;
    isWeeklyBest: boolean;
    featuredStart: Date | null;
    featuredEnd: Date | null;
})[]>;
/**
 * 특정 사용자가 특정 매물을 '찜'합니다.
 * @param userId '찜'하는 사용자의 ID
 * @param listingId '찜'할 매물의 ID
 */
declare function like(userId: string, listingId: string): Promise<{
    message: string;
}>;
declare function update(id: string, data: UpdateListingInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    sido: string | null;
    sigungu: string | null;
    eupmyeondong: string | null;
    roadAddress: string | null;
    detailAddress: string | null;
    region: import("@prisma/client").$Enums.Region;
    category: import("@prisma/client").$Enums.Category;
    deposit: number;
    monthlyRent: number;
    keyMoney: number;
    monthlyRevenue: number;
    materialCost: number;
    personnelCost: number;
    utilityCost: number;
    otherCost: number;
    deliveryPercent: number;
    netProfit: number;
    isAutomated: boolean;
    hasParking: boolean;
    isFirstFloor: boolean;
    isNearStation: boolean;
    isBeginnerFriendly: boolean;
    isWomanFriendly: boolean;
    description: string;
    coverImage: string;
    imageUrls: string[];
    status: import("@prisma/client").$Enums.ListingStatus;
    contractStatus: import("@prisma/client").$Enums.ContractStatus;
    viewCount: number;
    likeCount: number;
    isBest: boolean;
    bestUntil: Date | null;
    isWeeklyBest: boolean;
    featuredStart: Date | null;
    featuredEnd: Date | null;
}>;
/**
 * 현재 노출 기간에 해당하는 '주간 대표 매물'들을 역할에 따라 조회합니다.
 * @param role 요청한 사용자의 역할
 */
declare function getFeatured(role?: UserRole): Promise<({
    _count: {
        likedBy: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    sido: string | null;
    sigungu: string | null;
    eupmyeondong: string | null;
    roadAddress: string | null;
    detailAddress: string | null;
    region: import("@prisma/client").$Enums.Region;
    category: import("@prisma/client").$Enums.Category;
    deposit: number;
    monthlyRent: number;
    keyMoney: number;
    monthlyRevenue: number;
    materialCost: number;
    personnelCost: number;
    utilityCost: number;
    otherCost: number;
    deliveryPercent: number;
    netProfit: number;
    isAutomated: boolean;
    hasParking: boolean;
    isFirstFloor: boolean;
    isNearStation: boolean;
    isBeginnerFriendly: boolean;
    isWomanFriendly: boolean;
    description: string;
    coverImage: string;
    imageUrls: string[];
    status: import("@prisma/client").$Enums.ListingStatus;
    contractStatus: import("@prisma/client").$Enums.ContractStatus;
    viewCount: number;
    likeCount: number;
    isBest: boolean;
    bestUntil: Date | null;
    isWeeklyBest: boolean;
    featuredStart: Date | null;
    featuredEnd: Date | null;
})[]>;
interface GetAllListingsQuery {
    region?: 'METROPOLITAN' | 'NON_METROPOLITAN';
    category?: 'CAFE_BAKERY' | 'RESTAURANT_BAR' | 'RETAIL_ETC';
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    keyMoneyLte?: string;
    sortBy?: 'createdAt' | 'keyMoney' | 'status' | 'viewCount' | 'likeCount';
    order?: 'asc' | 'desc';
    sido?: string;
    sigungu?: string;
}
declare function remove(id: string): Promise<{
    message: string;
}>;
/**
 * 공개된 매물의 통계를 계산합니다.
 */
declare function getStats(): Promise<{
    totalCount: number;
    newThisWeekCount: number;
}>;
/**
 * 공개된 매물 중 가장 조회수가 높은 매물 1개를 조회합니다. (5분 캐시 적용)
 */
declare function getMostViewed(): Promise<any>;
declare const _default: {
    create: typeof create;
    getById: typeof getById;
    getAll: typeof getAll;
    like: typeof like;
    remove: typeof remove;
    update: typeof update;
    getFeatured: typeof getFeatured;
    getStats: typeof getStats;
    getMostViewed: typeof getMostViewed;
};
export default _default;
