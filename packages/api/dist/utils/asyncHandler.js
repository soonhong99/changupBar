// packages/api/src/utils/asyncHandler.ts
/**
 * 비동기 컨트롤러 함수를 감싸는 래퍼 함수입니다.
 * 컨트롤러 내부에서 발생한 에러를 잡아 Express의 에러 핸들러로 전달합니다.
 * @param fn 비동기 컨트롤러 함수
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
