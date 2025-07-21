import { Request, Response } from 'express';
declare function createListing(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * ID로 특정 매물 하나를 조회하는 컨트롤러
 */
declare function getListingById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 모든 매물 목록을 조회하는 컨트롤러 (필터링 기능 추가)
 */
declare function getAllListings(req: Request, res: Response): Promise<void>;
/**
 * 특정 매물을 '찜'하는 컨트롤러
 */
declare function likeListing(req: Request, res: Response): Promise<void>;
declare function deleteListing(req: Request, res: Response): Promise<void>;
declare function updateListing(req: Request, res: Response): Promise<void>;
/**
 * '주간 대표 매물'을 조회하는 컨트롤러
 */
declare function getFeaturedListings(req: Request, res: Response): Promise<void>;
declare function getStats(req: Request, res: Response): Promise<void>;
declare function getMostViewedListing(req: Request, res: Response): Promise<void>;
declare const _default: {
    createListing: typeof createListing;
    getListingById: typeof getListingById;
    getAllListings: typeof getAllListings;
    likeListing: typeof likeListing;
    deleteListing: typeof deleteListing;
    updateListing: typeof updateListing;
    getFeaturedListings: typeof getFeaturedListings;
    getStats: typeof getStats;
    getMostViewedListing: typeof getMostViewedListing;
};
export default _default;
