import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';

/** Données de test pour le carousel New Arrivals (images dans /assets) */
function getMockNewArrivalsByTab(): Article[][] {
  const base = (id: number, nom: string, prix: number, categorie: string, img: string): Article => ({
    id,
    nom,
    prix,
    categorie,
    tailles: ['S', 'M', 'L'],
    colors: [{ name: 'Noir', rgba: '0,0,0' }, { name: 'Blanc', rgba: '255,255,255' }],
    status: 'NEW',
    images: [img],
  });
  const img = (name: string) => name;
  return [
    // Drop 10
    [
      base(1, 'Devon Skort Set', 99900, 'drop-10', img('culotte.jpg')),
      base(2, 'Elora Tennis Skort Set', 120400, 'drop-10', img('culotte1.jpg')),
      base(3, 'Elowen Set', 88150, 'drop-10', img('culotte2.jpg')),
      base(4, 'Freya Skort Set', 95400, 'drop-10', img('shirt.jpg')),
      base(5, 'Luna Drop Set', 78900, 'drop-10', img('rose.jpg')),
      base(6, 'Nova Collection', 110200, 'drop-10', img('derriere.jpg')),
      base(7, 'Aria Set', 87500, 'drop-10', img('gobelet.jpg')),
      base(8, 'Bella Drop 10', 102000, 'drop-10', img('blackbird.jpg')),
    ],
    // Sets
    [
      base(10, 'Classic Set Noir', 89900, 'set', img('culotte1 - Copie.jpg')),
      base(11, 'Set Sport', 112000, 'set', img('culotte2 - Copie.jpg')),
      base(12, 'Set Élégant', 76500, 'set', img('IMG-20251207-WA0002.jpg')),
      base(13, 'Set Weekend', 98800, 'set', img('IMG-20251207-WA0003.jpg')),
      base(14, 'Set Essential', 84500, 'set', img('IMG-20251207-WA0004.jpg')),
      base(15, 'Set Modern', 105600, 'set', img('matos.jpg')),
      base(16, 'Set Rose', 92000, 'set', img('rose.jpg')),
      base(17, 'Set Signature', 118000, 'set', img('Capture.JPG')),
    ],
    // Tracksuit
    [
      base(20, 'Tracksuit Grey', 125000, 'tracksuit', img('shirt.jpg')),
      base(21, 'Tracksuit Black', 132000, 'tracksuit', img('blackbird.jpg')),
      base(22, 'Tracksuit Navy', 118500, 'tracksuit', img('IMG-20251207-WA0010.jpg')),
      base(23, 'Tracksuit Rose', 99500, 'tracksuit', img('rose.jpg')),
      base(24, 'Tracksuit Sport', 108000, 'tracksuit', img('matos.jpg')),
      base(25, 'Tracksuit Essential', 87500, 'tracksuit', img('derriere.jpg')),
      base(26, 'Tracksuit Premium', 145000, 'tracksuit', img('culotte.jpg')),
      base(27, 'Tracksuit Classic', 102000, 'tracksuit', img('gobelet.jpg')),
    ],
  ];
}

const MOCK_NEW_ARRIVALS = getMockNewArrivalsByTab();

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

/** Onglets New Arrivals */
const NEW_ARRIVALS_TABS = [
  { label: 'Drop 10', slug: 'drop-10' },
  { label: 'Sets', slug: 'set' },
  { label: 'Tracksuit', slug: 'tracksuit' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ScrollingModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  articles: Article[] = [];
  page = 0;
  size = 16;

  photos: PhotoCard[] = [];
  leftGroupPhotos: PhotoCard[] = [];
  rightGroupPhotos: PhotoCard[] = [];
  isMobile: boolean = false;

  // New Arrivals: tabs + carousel
  newArrivalsTabs = NEW_ARRIVALS_TABS;
  activeTabIndex = 0;
  productsByTab: Article[][] = [[], [], []];
  loadingTab: number | null = null;
  /** true = utiliser les données de test (images du projet), false = appeler l’API */
  useMockNewArrivals = true;
  carouselScrollProgress = 0;
  /** Défilement auto : pause quand l'utilisateur survole le carousel */
  carouselAutoScrollPaused = false;
  private carouselAutoScrollInterval: ReturnType<typeof setInterval> | null = null;
  private readonly carouselAutoScrollDelayMs = 4000;
  private readonly carouselScrollStepPx = 240;

  @ViewChild('carouselScroll', { static: false }) carouselScroll!: ElementRef<HTMLDivElement>;

      // URLs d'images naturelles (Unsplash)
      private photoUrls = [
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 1
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 2
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 3
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chaussures 4
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Sac
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Montre
      ];



  constructor(private router: Router, private articleService: ArticleService) {
       this.articleService.getArticles(this.page, this.size)
                                             .subscribe(res => {
                                              this.articles = res.content;
                                               });
    }



  goToDetail(article: Article) {
    if (article.id != null) {
      this.router.navigate(['/detail', article.id]);
    }
  }

  goToArticles(message: string) {
    this.router.navigate(['/articles', message]);
  }

  setActiveTab(index: number) {
    this.activeTabIndex = index;
    this.loadProductsForTab(index);
    const el = this.carouselScroll?.nativeElement;
    if (el) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
      this.onCarouselScroll();
    }
  }

  loadProductsForTab(index: number) {
    if (this.useMockNewArrivals) {
      console.log('useMockNewArrivals', this.useMockNewArrivals);
      this.productsByTab = MOCK_NEW_ARRIVALS.map(tab => [...tab]);
      this.loadingTab = null;
      return;
    }
    const slug = this.newArrivalsTabs[index].slug;
    this.loadingTab = index;
    this.articleService.getByCategorie(slug, this.page, this.size).subscribe({
      next: (res) => {
        this.productsByTab[index] = res.content ?? [];
        this.loadingTab = null;
      },
      error: () => {
        this.productsByTab[index] = [];
        this.loadingTab = null;
      }
    });
  }

  onCarouselScroll() {
    const el = this.carouselScroll?.nativeElement;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    this.carouselScrollProgress = maxScroll <= 0 ? 0 : el.scrollLeft / maxScroll;
  }

  /** Avance le carousel d’un pas (une carte), en boucle. */
  private stepCarouselAutoScroll(): void {
    if (this.carouselAutoScrollPaused) return;
    const el = this.carouselScroll?.nativeElement;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const next = el.scrollLeft + this.carouselScrollStepPx;
    el.scrollTo({ left: next >= maxScroll ? 0 : next, behavior: 'smooth' });
    this.onCarouselScroll();
  }

  startCarouselAutoScroll(): void {
    this.stopCarouselAutoScroll();
    this.carouselAutoScrollInterval = setInterval(
      () => this.stepCarouselAutoScroll(),
      this.carouselAutoScrollDelayMs
    );
  }

  stopCarouselAutoScroll(): void {
    if (this.carouselAutoScrollInterval) {
      clearInterval(this.carouselAutoScrollInterval);
      this.carouselAutoScrollInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopCarouselAutoScroll();
  }

  getProductImage(article: Article): string {
    if (article.images?.length) {
      const img = article.images[0];
      return img.startsWith('http') || img.startsWith('/') ? img : `/assets/${img}`;
    }
    return '/assets/logo.jpg';
  }

  formatPrice(prix: number): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(prix);
  }

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.checkMobile();
    this.initializePhotos();
    this.loadProductsForTab(0);
  }

  ngAfterViewInit(): void {
    const el = this.carouselScroll?.nativeElement;
    if (el) {
      el.addEventListener('scroll', () => this.onCarouselScroll());
      this.onCarouselScroll();
      el.addEventListener('mouseenter', () => (this.carouselAutoScrollPaused = true));
      el.addEventListener('mouseleave', () => (this.carouselAutoScrollPaused = false));
      this.startCarouselAutoScroll();
    }
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


