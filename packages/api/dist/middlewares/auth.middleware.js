// packages/api/src/middlewares/auth.middleware.ts
import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`Method: ${req.method}, authHeader: ${authHeader}`);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: '인증 토큰이 필요합니다!' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 요청 객체에 사용자 정보 추가
        next(); // 다음 미들웨어 또는 컨트롤러로 진행
    }
    catch (error) {
        res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        return;
    }
};
