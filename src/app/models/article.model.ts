
export interface ArticleColor {
  name: string;
  rgba: string;
}

export interface Article {
  id?: number;
  nom: string;
  prix: number;
  categorie: string;
  tailles: string[];
  colors: ArticleColor[];
  status: 'NEW' | 'SOLDE' | 'NONE';
  images: string[];
}

export interface Article_ {
  id?: number;
  nom: string;
  prix: number;
  categorie: string;
  tailles: string[];
  colors: ArticleColor[];
  status: 'NEW' | 'SOLDE' | 'NONE';
  images?: string[];
}

