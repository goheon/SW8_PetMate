export const API_URL = 'http://localhost:3001';

export const getCookie = (name) => {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
};

export const parseJwt = (token) => {
  const base64Url = token.split('.')[1]; // JWT의 Payload 부분을 추출
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64 URL-safe 형식을 일반 Base64 형식으로 변환
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

//주소 스트링에서 oo구까지 자르는 함수
export function cutAddressToDistrict(address) {
  // '구' 단위까지만 추출하는 정규 표현식
  const regex = /^.*?구/;
  const match = address.match(regex);

  // 매치된 주소가 있다면 그 부분을 반환하고, 없다면 전체 주소를 반환한다.
  return match ? match[0] : address;
}