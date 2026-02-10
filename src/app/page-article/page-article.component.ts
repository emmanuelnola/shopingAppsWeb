
import { Component, OnInit ,  ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';
import { PanierService } from '../panier.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-page-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-article.component.html',
  styleUrl: './page-article.component.css'
})
export class PageArticleComponent implements OnInit  {
   quantity = 1;
   page = 0;
   size = 7;
   totalPages = 0;
    liked = false;
    showModal = false;
    showToast = false;
    animateArrow = false;

article!: Article;
articles!: Article[];
  currentIndex = 0;
  // AJOUT / MODIF dans counter.component.ts

  arrowState: 'idle' | 'loading' | 'done' = 'idle';
selectedIndex = 0;
  fullscreen = false;


  constructor(private articleService: ArticleService, private route: ActivatedRoute,private cart: PanierService) {

        const id = Number(this.route.snapshot.paramMap.get('id'));
             this.articleService.getArticleById(id).subscribe(article => {
               this.article = article;
               console.log(article);
                this.articleService.getByCategorie(this.article.categorie,this.page, this.size)
                                      .subscribe(res => {
                                       this.articles = res.content;

                                        });
                                      console.log(this.articles);
             ;
             });

      }

     ngOnInit(): void {

      }

  next() {
    this.currentIndex =
      (this.currentIndex + 1) % this.article.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.article.images.length) %
      this.article.images.length;
  }


  toggleArrow() {
    if (this.arrowState !== 'idle') return;

    this.arrowState = 'loading';

    setTimeout(() => {
      this.arrowState = 'done';
    }, 1000); // 1 seconde
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  scrollThumbs(direction: 'up' | 'down', container: HTMLElement) {
    container.scrollBy({
      top: direction === 'up' ? -100 : 100,
      behavior: 'smooth'
    });
  }
 increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  toggleLike() {
    this.liked = !this.liked;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }

  openFullscreen() {
    this.fullscreen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    this.fullscreen = false;
    document.body.style.overflow = '';
  }



}



