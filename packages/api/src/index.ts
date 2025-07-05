// packages/api/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './api/index.js';
import cors from 'cors'; // ⬅️ 1. cors import 하기

// .env 파일 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:3000', // 허용할 프론트엔드 출처
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization', // Authorization 헤더 허용
};

// 2. 모든 요청에 대해 CORS를 허용하는 미들웨어를 가장 먼저 적용합니다.
app.use(cors(corsOptions));

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// API 라우터 연결
app.use('/api/v1', apiRouter);

app.listen(PORT, () => {
  console.log(`✅ API Server is running at http://localhost:${PORT}`);
});