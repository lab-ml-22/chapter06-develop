import { Board } from '../types/board';
import { MOCK_BOARDS } from '../config/mockData';

// Mock API 서비스
export class MockApiService {
  private static boards: Board[] = [...MOCK_BOARDS];
  private static nextId = 4;

  // 게시글 목록 조회 (페이징 포함)
  static async getBoards(page: number = 1, limit: number = 5, sort: string = 'registerDate', order: string = 'desc') {
    // 정렬
    const sortedBoards = [...this.boards].sort((a, b) => {
      const aValue = a[sort as keyof Board];
      const bValue = b[sort as keyof Board];
      
      // undefined 체크
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      
      if (order === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBoards = sortedBoards.slice(startIndex, endIndex);
    
    // 총 페이지 수 계산
    const totalPages = Math.ceil(this.boards.length / limit);

    return {
      data: paginatedBoards,
      headers: {
        link: this.generateLinkHeader(page, totalPages, limit)
      }
    };
  }

  // 게시글 상세 조회
  static async getBoardById(id: string) {
    const board = this.boards.find(b => b.id === id);
    if (!board) {
      throw new Error('Board not found');
    }
    return { data: board };
  }

  // 게시글 생성
  static async createBoard(boardData: Omit<Board, 'id'>) {
    const newBoard: Board = {
      ...boardData,
      id: this.nextId.toString()
    };
    this.nextId++;
    this.boards.unshift(newBoard);
    return { data: newBoard };
  }

  // 게시글 수정
  static async updateBoard(id: string, boardData: Partial<Board>) {
    const index = this.boards.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Board not found');
    }
    
    this.boards[index] = { ...this.boards[index], ...boardData };
    return { data: this.boards[index] };
  }

  // 게시글 삭제
  static async deleteBoard(id: string) {
    const index = this.boards.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Board not found');
    }
    
    this.boards.splice(index, 1);
    return { data: { id } };
  }

  // Link 헤더 생성 (페이징용)
  private static generateLinkHeader(page: number, totalPages: number, limit: number) {
    const baseUrl = '/board';
    const links = [];
    
    if (page > 1) {
      links.push(`<${baseUrl}?_page=${page - 1}&_limit=${limit}>; rel="prev"`);
    }
    
    if (page < totalPages) {
      links.push(`<${baseUrl}?_page=${page + 1}&_limit=${limit}>; rel="next"`);
    }
    
    links.push(`<${baseUrl}?_page=1&_limit=${limit}>; rel="first"`);
    links.push(`<${baseUrl}?_page=${totalPages}&_limit=${limit}>; rel="last"`);
    
    return links.join(', ');
  }
}
