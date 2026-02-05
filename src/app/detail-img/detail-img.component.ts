import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';;
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PanierService } from '../panier.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-detail-img',
  standalone: true,
  imports: [RouterOutlet,CommonModule ],
  templateUrl: './detail-img.component.html',
  styleUrl: './detail-img.component.css'
})
export class DetailImgComponent {

  articles: Article[] = [];
    page = 0;
    size = 8;
    totalPages = 0;
    categorie! :string;


  constructor(private articleService: ArticleService , private route: ActivatedRoute, private router: Router, private cart: PanierService  ) {

        this.categorie = this.route.snapshot.paramMap.get('message') ?? 'all';
      if (this.categorie === 'all') {

         this.articleService
             .getArticles(this.page, this.size)
             .subscribe(res => {
              this.articles = res.content;
              this.totalPages = res.totalPages;
               });
             console.log("1111111111111111111");
      }else{
         this.articleService
                      .getByCategorie(this.categorie,this.page, this.size)
                      .subscribe(res => {
                       this.articles = res.content;
                       this.totalPages = res.totalPages;
                        });
                      console.log(this.articles);

        }




    }




    // Fonction appelée quand on clique sur un article
      goToDetail(article: Article) {
        // Redirection vers /detail/1 (exemple)
        this.router.navigate(['/detail', article.id]);
      }


}
