// packages/api/src/data/regionGroups.ts

export const regionGroups: { [key: string]: string[] } = {
    '서울 중심권': ['종로구', '중구', '용산구'],
    '서울 동남권': ['강남구', '서초구', '송파구', '강동구'],
    '경기 동남권': ['성남시', '하남시', '용인시', '수원시', '광주시', '이천시'],
    '서울 서남권': ['영등포구', '구로구', '금천구', '관악구', '동작구', '양천구', '강서구'],
    '경기 서남권': ['광명시', '부천시', '안양시', '군포시', '의왕시', '시흥시', '안산시', '화성시', '평택시'],
    '인천 서남권': ['부평구', '계양구', '서구', '미추홀구', '남동구', '연수구', '중구', '동구', '강화군', '옹진군'],
    '수도권 서북권': ['마포구', '서대문구', '은평구'],
    '경기 서북권': ['고양시', '파주시', '김포시'],
    '서울 동북권': ['동대문구', '성동구', '광진구', '중랑구', '노원구', '도봉구', '강북구', '성북구'],
    '경기 동북권': ['구리시', '남양주시', '의정부시', '양주시', '동두천시', '포천시', '가평군', '연천군']
};
  
export const findRegionGroup = (sigungu: string): string[] | null => {
for (const groupName in regionGroups) {
    if (regionGroups[groupName].includes(sigungu)) {
    return regionGroups[groupName];
    }
}
return null;
};