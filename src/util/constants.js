export const API_URL = 'http://localhost:3002';

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
