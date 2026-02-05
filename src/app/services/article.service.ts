import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
 private baseUrl = 'http://localhost:8080/api/articles';
 /* private baseUrl = 'http://51.254.138.51:8080/api/articles';*/

  constructor(private http: HttpClient) {}

  // ➕ Ajouter un article (multipart)
  addArticle(article: any, images: File[]): Observable<Article> {
    const formData = new FormData();

    formData.append(
      'article',
      new Blob([JSON.stringify(article)], { type: 'application/json' })
    );

    images.forEach(image => {
      formData.append('images', image);
    });

    return this.http.post<Article>(this.baseUrl, formData);
  }


// ✅ Articles par catégorie avec pagination
  getByCategorie(
    categorie: string,
    page: number,
    size: number
  ): Observable<any> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(
      `${this.baseUrl}/categorie/${categorie}`,
      { params }
    );
  }

  // 📄 Tous les articles (pagination)
  getArticles(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(this.baseUrl, { params });
  }

    getArticleById(id: number): Observable<Article> {
      return this.http.get<Article>(`${this.baseUrl}/${id}`);
    }

  // ❌ Supprimer article
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

 updateArticle(
    id: number,
    article: Article,
    images?: File[]
    ): Observable<Article> {

    const formData = new FormData();

    formData.append(
      'article',
      new Blob([JSON.stringify(article)], { type: 'application/json' })
    );



    if (images) {
      images.forEach(img => {
        formData.append('images', img);
      });
    }

    return this.http.put<Article>(
      `${this.baseUrl}/${id}`,
      formData
    );
  }

}
