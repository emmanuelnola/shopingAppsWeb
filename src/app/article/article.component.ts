import { Component, OnInit } from '@angular/core';
import { PanierService } from '../panier.service';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';
import { Article_ } from '../models/article.model';
import { ArticleColor } from '../models/article.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export type ArticleStatus = 'NEW' | 'SOLDE' | 'NONE';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
    standalone: true,
    imports: [CommonModule,FormsModule],
    styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  articles: Article[] = [];
  images: File[] = [];
  page = 0;
    size = 5;
    totalPages = 0;
    selectedCategorie='';



  tempColor = { name: '', rgba: '#000000' };

  articleForm !:Article_ ;




  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleForm= this.initForm();
    this.loadArticles();
  }

  loadArticles() {
    this.articleService.getArticles(this.page, this.size)
      .subscribe(res => {
        this.articles = res.content;
        this.totalPages = res.totalPages;
      });
  }

  onFileChange(event: any) {
    this.images = Array.from(event.target.files);
  }

  categories: string[] = [
    'Chaussures',
    'Sacs',
    'set',
    'Accessoires',
    'Montres',
    'drop9'
  ];

  // afficher / cacher la liste
  showCategorieList = false;

  // quand on clique sur l'input
  openCategorieList() {
    this.showCategorieList = !this.showCategorieList;
  }


  // choisir une catégorie
  chooseCategorie(cat: string) {
    this.articleForm.categorie = cat;
    this.showCategorieList = false;
  }

 statuses: { label: string; value: ArticleStatus }[] = [
   { label: 'Nouveau', value: 'NEW' },
   { label: 'En solde', value: 'SOLDE' },
   { label: 'Aucun', value: 'NONE' }
 ];


  showStatusList = false;

  // ouvrir la liste
  openStatusList() {
    this.showStatusList = !this.showStatusList;
  }


  // choisir un statut
  chooseStatus(status: ArticleStatus) {
    this.articleForm.status = status;
    this.showStatusList = false;
  }



   editArticle(a: Article) {
    /* this.articleForm = {
       nom: a.nom,
       prix: a.prix,
       categorie: a.categorie,
       tailles: a.tailles ?? [],
       colors: (a.couleurs ?? []).map(rgba => ({
         name: rgba,   // ou un label générique
         rgba: rgba
       })),
       status: (a.status ?? 'NONE') as ArticleStatus
     };

     this.images = []; // on ne recharge PAS les images existantes*/
   }



 onImagesChange(e: any) {
    this.images = Array.from(e.target.files);
  }
changePage(delta: number): void {
    this.page += delta;
    this.page = Math.max(0, this.page);
    this.loadByCategorie();
  }


   initForm(): Article_ {
      return {
        nom: '',
        prix: 0,
        categorie: '',
         tailles: [] as string[],
          colors: [] as ArticleColor[],
          status: 'NONE' as ArticleStatus
      };
    }

  saveArticle() {

    const payload = {
      nom: this.articleForm.nom,
      prix: this.articleForm.prix,
      categorie: this.articleForm.categorie,
      tailles: this.articleForm.tailles,
      couleurs: this.articleForm.colors.map(c => c.rgba), // ✅ ICI
      status: this.articleForm.status
    };

    console.log('Article envoyé au backend:', payload);

    this.articleService.addArticle(payload, this.images)
      .subscribe({
        next: () => {
          alert('Article ajouté avec succès');
          this.reset();
          this.loadArticles();
        },
        error: (err) => {
          console.error('Erreur backend:', err);
          alert('Échec de l’ajout');
        }
      });
  }


   addColor() {
     if (!this.tempColor.name) return;

     this.articleForm.colors.push({
       name: this.tempColor.name,
       rgba: this.tempColor.rgba
     });

     // reset
     this.tempColor = { name: '', rgba: '#000000' };
   }

   removeColor(color: ArticleColor) {
     this.articleForm.colors =
       this.articleForm.colors.filter(c => c !== color);
   }






  onTaillesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.articleForm.tailles = input.value.split(',').map(t => t.trim());
  }




  deleteArticle(id: number) {
    if (confirm('Supprimer cet article ?')) {
      this.articleService.deleteArticle(id)
        .subscribe(() => this.loadArticles());
    }
  }

   loadByCategorie(): void {
      if (!this.selectedCategorie) {
        this.loadArticles();
        return;
      }

      this.articleService
        .getByCategorie(this.selectedCategorie, this.page, this.size)
        .subscribe(res => {
          this.articles = res.content;
          this.totalPages = res.totalPages;
        });
    }

   reset() {
      this.articleForm = this.initForm();
      this.images = [];
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

}


/*
    selectedIndex = 0;
    isFullscreen = false;

    /* ---------- MINIATURES ---------- */

  /*  thumbnailIndex = 0;
    visibleThumbs = 4;

    scrollUp() {
      if (this.thumbnailIndex > 0) {
        this.thumbnailIndex--;
      }
    }

    scrollDown() {
      if (this.thumbnailIndex < this.images.length - this.visibleThumbs) {
        this.thumbnailIndex++;
      }
    }

    get visibleImages() {
      return this.images.slice(
        this.thumbnailIndex,
        this.thumbnailIndex + this.visibleThumbs
      );
    }

    selectImage(index: number) {
      this.selectedIndex = index;
    }

    /* ---------- FULLSCREEN ---------- */

  /*  openFullscreen() {
      this.isFullscreen = true;
    }

    closeFullscreen() {
      this.isFullscreen = false;
    }

    next() {
      this.selectedIndex =
        (this.selectedIndex + 1) % this.images.length;
    }

    prev() {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.images.length) % this.images.length;
    }*/


