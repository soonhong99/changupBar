// packages/api/src/services/verification.service.ts

import CoolsmsMessageService, { Message } from 'coolsms-node-sdk';
import prisma from '../config/prisma.js';

// ⬇️ 2. 클라이언트 생성 방식 변경
const smsClient = new (CoolsmsMessageService as any).default(process.env.COOLSMS_API_KEY!, process.env.COOLSMS_API_SECRET!);

/**
 * 6자리 랜덤 인증번호를 생성하고, SMS를 발송한 뒤, DB에 인증 정보를 저장합니다.
 * @param phone - 인증번호를 받을 핸드폰 번호 ('-' 제외)
 */
async function sendVerificationCode(phone: string) {
  // ... (랜덤 코드 생성 및 DB 저장 로직은 동일) ...
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); 

  await prisma.verification.upsert({
    where: { type_target: { type: 'PHONE', target: phone } },
    update: { code, expiresAt },
    create: { type: 'PHONE', target: phone, code, expiresAt },
  });

  // ⬇️ 3. CoolSMS로 SMS 발송 방식 변경 (sendOne의 인자가 Message 객체가 아님)
  await smsClient.sendOne({
    to: phone,
    from: process.env.COOLSMS_SENDER_PHONE!,
    text: `[스마트창업] 인증번호는 [${code}] 입니다.`,
  });

  return { message: '인증번호가 발송되었습니다.' };
}

/**
 * 사용자가 입력한 인증번호가 유효한지 확인합니다.
 * @param phone - 핸드폰 번호
 * @param code - 사용자가 입력한 인증번호
 */
async function verifyCode(phone: string, code: string) {
  const verification = await prisma.verification.findUnique({
    where: { type_target: { type: 'PHONE', target: phone } },
  });

  if (!verification || verification.code !== code) {
    throw new Error('인증번호가 올바르지 않습니다.');
  }

  if (new Date() > verification.expiresAt) {
    throw new Error('인증번호가 만료되었습니다.');
  }

  // 인증 성공 시, 해당 인증 정보는 삭제
  await prisma.verification.delete({
    where: { id: verification.id },
  });

  return { message: '인증에 성공했습니다.' };
}

export default {
  sendVerificationCode,
  verifyCode,
};