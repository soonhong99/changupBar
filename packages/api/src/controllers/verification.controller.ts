// packages/api/src/controllers/verification.controller.ts

import { Request, Response } from 'express';
import verificationService from '../services/verification.service.js';

async function sendCode(req: Request, res: Response) {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: '핸드폰 번호를 입력해주세요.' });

  await verificationService.sendVerificationCode(phone);
  res.status(200).json({ message: '인증번호가 발송되었습니다.' });
}

async function checkCode(req: Request, res: Response) {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ message: '핸드폰 번호와 인증번호를 모두 입력해주세요.' });

  await verificationService.verifyCode(phone, code);
  res.status(200).json({ message: '인증에 성공했습니다.' });
}

export default { sendCode, checkCode };