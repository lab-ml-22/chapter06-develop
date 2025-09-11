// API 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  BOARD: `${API_BASE_URL}/board`,
  BOARD_BY_ID: (id: string) => `${API_BASE_URL}/board/${id}`,
} as const;

// 배포 환경에서 API 서버가 없을 때 사용할 Mock 데이터
export const isProduction = process.env.NODE_ENV === 'production';
export const isLocalhost = API_BASE_URL.includes('localhost');

// Mock 데이터 사용 여부 (환경 변수로 제어)
export const useMockData = process.env.REACT_APP_USE_MOCK === 'true' || 
  (isProduction && !process.env.REACT_APP_API_URL);
