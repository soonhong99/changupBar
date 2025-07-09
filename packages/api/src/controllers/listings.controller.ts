// packages/api/src/controllers/listings.controller.ts

import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createListingSchema } from '../../../shared/src/schemas/listing.schema.js';
import listingService from '../services/listings.service.js';
import { updateListingSchema } from '../../../shared/src/schemas/listing.schema.js'; // ⬅️ 추가

async function createListing(req: Request, res: Response) {
  try {
    // 1. Zod 스키마를 사용해 요청 본문(req.body)을 검증합니다.
    const validatedData = createListingSchema.parse(req.body);

    // 2. (아직 만들지 않은) 서비스 계층을 호출하여 데이터를 생성합니다.
    const newListing = await listingService.create(validatedData);
    
    // 3. 성공적으로 생성되면 201 Created 상태 코드와 함께 결과를 반환합니다.
    res.status(201).json(newListing);

  } catch (error) {
    // Zod 유효성 검사 에러 처리
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: '입력값이 올바르지 않습니다.',
        errors: error.flatten().fieldErrors,
      });
    }
    
    // 그 외 서버 내부 에러 처리
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
}

/**
 * ID로 특정 매물 하나를 조회하는 컨트롤러
 */
async function getListingById(req: Request, res: Response) {
  const { id } = req.params; // URL 파라미터에서 id를 추출합니다.

  const listing = await listingService.getById(id);

  // 서비스에서 null을 반환하면, 404 Not Found 응답을 보냅니다.
  if (!listing) {
    return res.status(404).json({ message: '해당 매물을 찾을 수 없습니다.' });
  }

  // 매물을 찾으면 200 OK 상태 코드와 함께 결과를 반환합니다.
  res.status(200).json(listing);
}

/**
 * 모든 매물 목록을 조회하는 컨트롤러 (필터링 기능 추가)
 */
async function getAllListings(req: Request, res: Response) {
  // req.user가 존재하면 role을, 없으면 undefined를 전달
  const listings = await listingService.getAll(req.query, req.user?.role);
  res.status(200).json(listings);
}

/**
 * 특정 매물을 '찜'하는 컨트롤러
 */
async function likeListing(req: Request, res: Response) {
  const { id: listingId } = req.params;
  const userId = req.user!.userId; // authMiddleware가 보장해주는 사용자 ID

  const result = await listingService.like(userId, listingId);
  res.status(200).json(result);
}

async function deleteListing(req: Request, res: Response) {
  const { id } = req.params;
  await listingService.remove(id);
  res.status(200).json({ message: '매물이 성공적으로 삭제되었습니다.' });
}

async function updateListing(req: Request, res: Response) {
  const { id } = req.params;
  const validatedData = updateListingSchema.parse(req.body);
  const updatedListing = await listingService.update(id, validatedData);
  res.status(200).json(updatedListing);
}

/**
 * '주간 대표 매물'을 조회하는 컨트롤러
 */
async function getFeaturedListings(req: Request, res: Response) {
  const listings = await listingService.getFeatured(req.user?.role);
  res.status(200).json(listings);
}

async function getStats(req: Request, res: Response) {
  const stats = await listingService.getStats();
  res.status(200).json(stats);
}

export default {
  createListing,
  getListingById,
  getAllListings,
  likeListing,
  deleteListing,
  updateListing,
  getFeaturedListings,
  getStats,
};