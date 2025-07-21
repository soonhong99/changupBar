/**
 * 6자리 랜덤 인증번호를 생성하고, SMS를 발송한 뒤, DB에 인증 정보를 저장합니다.
 * @param phone - 인증번호를 받을 핸드폰 번호 ('-' 제외)
 */
declare function sendVerificationCode(phone: string): Promise<{
    message: string;
}>;
/**
 * 사용자가 입력한 인증번호가 유효한지 확인합니다.
 * @param phone - 핸드폰 번호
 * @param code - 사용자가 입력한 인증번호
 */
declare function verifyCode(phone: string, code: string): Promise<{
    message: string;
}>;
declare const _default: {
    sendVerificationCode: typeof sendVerificationCode;
    verifyCode: typeof verifyCode;
};
export default _default;
