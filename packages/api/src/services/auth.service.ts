// packages/api/src/services/auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // ⬅️ jwt import 추가
import prisma from '../config/prisma.js';
import { RegisterUserInput, LoginUserInput } from '../../../shared/src/schemas/auth.schema.js';

async function register(data: RegisterUserInput) {
  const { email, name, password } = data;

  // 1. 이메일 중복 확인
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('이미 사용 중인 이메일입니다.');
  }

  // 2. 비밀번호 암호화 (salt round: 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. 사용자 생성
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // 비밀번호를 제외한 사용자 정보 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function login(data: LoginUserInput) {
  const { email, password } = data;

  // 1. 이메일로 사용자 찾기
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 2. 입력된 비밀번호와 DB의 암호화된 비밀번호 비교
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 3. 비밀번호가 일치하면, JWT 생성
  const token = jwt.sign(
    { userId: user.id, role: user.role }, // 토큰에 담을 정보
    process.env.JWT_SECRET!, // 비밀 키
    { expiresIn: '1d' } // 유효기간 (예: 1일)
  );

  return { token };
}

async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    // 비밀번호를 제외한 필드만 선택
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return user;
}

export default {
  register,
  login,
  getMe,
};