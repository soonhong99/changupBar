// packages/api/src/services/listings.service.ts
// 아직 실제 로직은 없습니다.
export default {
    create: async (data) => {
        console.log('Service received data:', data);
        return { id: 'temp-id', ...data };
    },
};
