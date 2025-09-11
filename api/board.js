// Vercel API Route
const mockBoards = [
  {
    id: "1",
    title: "Vercel API Routes 테스트",
    author: "관리자",
    contents: "Vercel API Routes를 사용한 Mock 데이터입니다.",
    count: 0,
    registerDate: "2025-01-12 15:00:00"
  },
  {
    id: "2", 
    title: "TypeScript 변환 완료",
    author: "개발자",
    contents: "React 프로젝트를 TypeScript로 성공적으로 변환했습니다!",
    count: 5,
    registerDate: "2025-01-12 14:30:00"
  }
];

export default function handler(req, res) {
  const { method, query } = req;
  
  if (method === 'GET') {
    const page = parseInt(query._page) || 1;
    const limit = parseInt(query._limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBoards = mockBoards.slice(startIndex, endIndex);
    const totalPages = Math.ceil(mockBoards.length / limit);
    
    res.setHeader('Link', `</api/board?_page=${page + 1}&_limit=${limit}>; rel="next", </api/board?_page=${totalPages}&_limit=${limit}>; rel="last"`);
    res.status(200).json(paginatedBoards);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
