// packages/api/src/api/index.ts
import { Router } from 'express'; // Router 타입을 import
import listingsRouter from './listings.js';
const router = Router(); // ⬅️ 여기에 : Router 추가
router.use('/listings', listingsRouter);
export default router;
