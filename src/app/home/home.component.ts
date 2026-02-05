import {Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener,OnInit, ElementRef, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';

/*objt me permettant de positionner une photo */
interface PhotoCard {
  id: number;
  url: string;
  left: string;
  top: string;
  width: string;
  aspectRatio: number;
  height: string;
  rotation: number;
  zIndex: number;
  isNew: boolean;
  animationDelay: string;
  overlapGroup?: 'left' | 'right' | 'center' | 'bottom';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet ,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent {

  page=0;
  size=8;

  photos: PhotoCard[] = [];
  leftGroupPhotos: PhotoCard[] = [];
  rightGroupPhotos: PhotoCard[] = [];
  isMobile: boolean = false;

      // URLs d'images naturelles (Unsplash)
      private photoUrls = [
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 1
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 2
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 3
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 4
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Sac
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Montre
      ];



  constructor(private router: Router,private articleService: ArticleService) {

       this.articleService
                       .getByCategorie('set', this.page, this.size)
                        .subscribe(res => {

                         /* this.articlesData.Set = res.content;*/

                        });

                       this.articleService.getByCategorie('leggings', this.page, this.size)
                                              .subscribe(res => {
                                               /* this.articlesData.Leggings = res.content;*/

                                              });

                       this.articleService.getByCategorie('trainers', this.page, this.size)
                                           .subscribe(res => {
                                         /*   this.articlesData.Trainers = res.content;*/
                                            });

       this.articleService.getArticles( this.page, 16)
                               .subscribe(res => {
                                 /*this.Alls= res.content;*/
                              /*   this.articlesData.Sacs = res.content;*/

                               });
  }





   // Fonction appelée quand on clique sur un article
    goToDetail(article: Article) {
      // Redirection vers /detail/1 (exemple)
      this.router.navigate(['/detail', article.id]);
    }

    goToArticles(message:string){
         this.router.navigate(['/articles', message]);
      }



 @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

 ngOnInit() {
     this.checkMobile();
       this.initializePhotos();
 }

     @HostListener('window:resize')
     onResize(): void {
       this.checkMobile();
       /*j'ajuste les images si je suis sur un appareil mobile*/
       this.adjustLayoutForScreen();

     }


     private checkMobile(): void {
       this.isMobile = window.innerWidth <= 768;
     }

    /*je considère au debut que je suis sur laptop, j'initialise les photos avec les param laptop*/
     private initializePhotos(): void {
       // 6 photos avec positions fixes et naturelles
       this.photos = [
         // Photo 1: Haut centre (principale)
         {
           id: 1,
           url: this.photoUrls[0],
           left: '40%',
           top: '0%',
           width: '20%',
           height: 'auto',
           aspectRatio: 4/3,
           rotation: 0,
           zIndex: 10,
           isNew: true,
           animationDelay: '0.2s',
           overlapGroup: 'center'
         },
         // Photo 2: Extrême gauche (gauche 1)
         {
           id: 2,
           url: this.photoUrls[1],
           left: '2%',
           top: '25%',
           width: '22%',
           height: 'auto',
           aspectRatio: 4/3,
           rotation: -5,
           zIndex: 3,
           isNew: true,
           animationDelay: '0.4s',
           overlapGroup: 'left'
         },
         // Photo 3: Extrême gauche (gauche 2 - superposée)
         {
           id: 3,
           url: this.photoUrls[2],
           left: '19%',
           top: '35%',
           width: '22%',
           height: 'auto',
           aspectRatio: 4/3,
           rotation: 3,
           zIndex: 4,
           isNew: false,
           animationDelay: '0.6s',
           overlapGroup: 'left'
         },
         // Photo 4: Extrême droite (droite 1)
         {
           id: 4,
           url: this.photoUrls[3],
           left: '70%',
           top: '0%',
           width: '22%',
           height: 'auto',
           aspectRatio: 4/3,
           rotation: 2,
           zIndex: 5,
           isNew: true,
           animationDelay: '0.8s',
           overlapGroup: 'right'
         },
         // Photo 5: Extrême droite (droite 2 - superposée)
         {
           id: 5,
           url: this.photoUrls[4],
           left: '80%',
           top: '30%',
           width: '28%',
           height: 'auto',
           aspectRatio: 4/3,
           rotation: -3,
           zIndex: 6,
           isNew: false,
           animationDelay: '1.0s',
           overlapGroup: 'right'
         },
         // Photo 6: Bas droite
         {
           id: 6,
           url: this.photoUrls[5],
           left: '50%',
           top: '70%',
           width: '20%',
           height: 'auto',
           aspectRatio: 4/3,
           rotation: 1,
           zIndex: 7,
           isNew: false,
           animationDelay: '1.2s',
           overlapGroup: 'bottom'
         }
       ];

       // Séparer les photos par groupes
       this.leftGroupPhotos = this.photos.filter(p => p.overlapGroup === 'left');
       this.rightGroupPhotos = this.photos.filter(p => p.overlapGroup === 'right');

       // Ajuster pour mobile si nécessaire
       if (this.isMobile) {
         this.adjustLayoutForScreen();
       }
     }

   /*fonction qui me permet d'ajuster les position des images*/
     private adjustLayoutForScreen(): void {
       if (this.isMobile) {
          this.photos = [
                  // Photo 1: Haut centre (principale)
                  {
                    id: 1,
                    url: this.photoUrls[0],
                    left: '30%',
                    top: '0%',
                    width: '30%',
                    height: 'auto',
                    aspectRatio: 4/3,
                    rotation: 0,
                    zIndex: 10,
                    isNew: true,
                    animationDelay: '0.2s',
                    overlapGroup: 'center'
                  },
                  // Photo 2: Extrême gauche (gauche 1)
                  {
                    id: 2,
                    url: this.photoUrls[1],
                    left: '-20%',
                    top: '25%',
                    width: '30%',
                    height: 'auto',
                    aspectRatio: 4/3,
                    rotation: -5,
                    zIndex: 3,
                    isNew: true,
                    animationDelay: '0.4s',
                    overlapGroup: 'left'
                  },
                  // Photo 3: Extrême gauche (gauche 2 - superposée)
                  {
                    id: 3,
                    url: this.photoUrls[2],
                    left: '5%',
                    top: '35%',
                    width: '30%',
                    height: 'auto',
                    aspectRatio: 4/3,
                    rotation: 3,
                    zIndex: 4,
                    isNew: false,
                    animationDelay: '0.6s',
                    overlapGroup: 'left'
                  },
                  // Photo 4: Extrême droite (droite 1)
                  {
                    id: 4,
                    url: this.photoUrls[3],
                    left: '70%',
                    top: '0%',
                    width: '30%',
                    height: 'auto',
                    aspectRatio: 4/3,
                    rotation: 2,
                    zIndex: 5,
                    isNew: true,
                    animationDelay: '0.8s',
                    overlapGroup: 'right'
                  },
                  // Photo 5: Extrême droite (droite 2 - superposée)
                  {
                    id: 5,
                    url: this.photoUrls[4],
                    left: '80%',
                    top: '30%',
                    width: '30%',
                    height: 'auto',
                    aspectRatio: 4/3,
                    rotation: -3,
                    zIndex: 6,
                    isNew: false,
                    animationDelay: '1.0s',
                    overlapGroup: 'right'
                  },
                  // Photo 6: Bas droite
                  {
                    id: 6,
                    url: this.photoUrls[5],
                    left: '45%',
                    top: '75%',
                    width: '30%',
                    height: 'auto',
                    aspectRatio: 4/3,
                    rotation: 1,
                    zIndex: 7,
                    isNew: false,
                    animationDelay: '1.2s',
                    overlapGroup: 'bottom'
                  }
                ];
              // Séparer les photos par groupes
                     this.leftGroupPhotos = this.photos.filter(p => p.overlapGroup === 'left');
                     this.rightGroupPhotos = this.photos.filter(p => p.overlapGroup === 'right');
     }

   }


}


