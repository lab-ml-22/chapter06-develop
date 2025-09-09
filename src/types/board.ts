export interface Board {
  id: string;
  title: string;
  author: string;
  contents: string;
  count: number;
  registerDate: string;
  modifyDate?: string;
}

export interface BoardFormData {
  title: string;
  author: string;
  contents: string;
}

export interface BoardUpdateData extends BoardFormData {
  id: string;
  count: number;
  registerDate: string;
  modifyDate?: string;
}
