export type Category = "철학" | "문학" | "사회" | "과학";

export interface Footnote {
  id: number;
  text: string;
}

export interface Article {
  id: number;
  title: string;
  category: Category;
  author: string;
  date: string;
  content: string[];
  footnotes?: Footnote[];
}