// packages/api/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './api/index.js';
// .env 파일 로드
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());
// API 라우터 연결
app.use('/api/v1', apiRouter);
app.listen(PORT, () => {
    console.log(`✅ API Server is running at http://localhost:${PORT}`);
});
