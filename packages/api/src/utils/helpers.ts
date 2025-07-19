// packages/api/src/utils/helpers.ts

// 계약 상태 한글 변환 함수
export function getContractStatusName(status: string) {
    switch(status) {
      case 'PENDING': return '계약중';
      case 'SOLD': return '계약완료';
      default: return '판매중';
    }
  }