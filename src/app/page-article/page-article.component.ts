
import { Component, OnInit ,  ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';
import { PanierService } from '../panier.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-page-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-article.component.html',
  styleUrl: './page-article.component.css'
})
export class PageArticleComponent implements OnInit {

  article!:Article;
  articles: Article[] = [];
  thumbnailIndex = 0;
  visibleThumbs = 4;

  categorie= 'set'; /*'set';*/ // 👈 catégorie affichée
  page = 0;
  size = 6;
  totalPages = 0;

 @ViewChild('thumbs') thumbs!: ElementRef<HTMLDivElement>;



    constructor(private articleService: ArticleService, private route: ActivatedRoute,private cart: PanierService) {

      const id = Number(this.route.snapshot.paramMap.get('id'));
           this.articleService.getArticleById(id).subscribe(article => {
             this.article = article;
           ;
           });

    }

  ngOnInit(): void {
    this.loadArticles();


  }

  addToCart() {
          this.cart.addToCart(this.article);
  }

  loadArticles() {
    this.articleService
      .getByCategorie(this.categorie, this.page, this.size)
      .subscribe(res => {
        this.articles = res.content;
        this.totalPages = res.totalPages;
      });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadArticles();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadArticles();
    }
  }







  selectedIndex = 0;
  fullscreen = false;

  /*article = {
    categorie: 'Chaussures',
    nom: 'Nike Air Max Pro',
    prix: 45000,
    tailles: ['xl', 'l9', '40', '41', 'm', '4xl', '40', '41', 'm', '4xl', '40', '41', 'm', '4xl']
  };*/

  selectImage(index: number) {
    this.selectedIndex = index;
    this.scrollToActive();
  }

  next() {
    this.selectedIndex =
      (this.selectedIndex + 1) % this.article.images.length;
    this.scrollToActive();
  }

  prev() {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.article.images.length) % this.article.images.length;
    this.scrollToActive();
  }

  openFullscreen() {
    this.fullscreen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    this.fullscreen = false;
    document.body.style.overflow = '';
  }

  scrollThumbs(direction: 'up' | 'down') {
    this.thumbs.nativeElement.scrollBy({
      top: direction === 'up' ? -120 : 120,
      behavior: 'smooth'
    });
  }

  scrollToActive() {
    const el = this.thumbs.nativeElement.children[
      this.selectedIndex
    ] as HTMLElement;

    el?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}



