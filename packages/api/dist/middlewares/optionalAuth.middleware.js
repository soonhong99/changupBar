import jwt from 'jsonwebtoken';
export const optionalAuthMiddleware = (req, res, next) => {
    console.log('--- Optional Auth Middleware Triggered ---');
    const authHeader = req.headers.authorization;
    // console.log('Received Authorization Header:', authHeader);
    // 토큰이 없거나 'Bearer '로 시작하지 않으면, 그냥 통과시킨다.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log('no token continue with Guest');
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verification successful. Role:', decoded.role);
        req.user = decoded; // 토큰이 유효하면 사용자 정보를 추가
    }
    catch (error) {
        // 토큰이 유효하지 않아도 에러를 발생시키지 않고 그냥 통과
        if (error instanceof Error) {
            console.error('JWT Verification FAILED:', error.message);
        }
    }
    next();
};
