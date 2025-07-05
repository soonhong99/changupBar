// packages/api/src/api/index.ts

import { Router } from 'express'; // Router 타입을 import
import listingsRouter from './listings.js';
import authRouter from './auth.js'; // ⬅️ auth 라우터 import
import uploadsRouter from './uploads.js';
import usersRouter from './users.js'; // ⬅️ 추가

const router: Router = Router(); // ⬅️ 여기에 : Router 추가

router.use('/listings', listingsRouter);
router.use('/auth', authRouter); // ⬅️ /auth 경로에 라우터 연결
router.use('/uploads', uploadsRouter); // ⬅️ Connect the new router
router.use('/users', usersRouter); // ⬅️ 추가

export default router;