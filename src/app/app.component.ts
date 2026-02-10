
import {Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener,OnInit, ElementRef,ViewChild,Input, Output, EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterOutlet, RouterModule  } from '@angular/router';
import { PanierService } from './panier.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { PagePanierComponent  } from './page-panier/page-panier.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import {  HttpClientModule,HttpClient } from '@angular/common/http'; // ✅ nécessaire pour this.http


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, PagePanierComponent ,RouterOutlet ,CommonModule,RouterModule,ReactiveFormsModule,FooterComponent,  HttpClientModule  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
    error = false;

     currentRoute: string = '';
    isScrolled = false;

    form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      this.isScrolled = scrollTop > 25;
    }

  images = [
    'assets/blackbird.jpg',
    'assets/logo-bande.png',
    'assets/blackbird.jpg'
  ];
  title = 'shopping';

   articles = [
     {
       category: 'Chaussures',
       image: 'assets/blackbird.jpg',
       price: '45 000 FCFA',
       bottomMessage: 'Chaussures élégantes',
       description: 'Chaussures en cuir de haute qualité.',
        hoverMessage: 'Promo spéciale -20%',
     },
     {
       category: 'Téléphones',
       image: 'assets/logo-bande.png',
       price: '150 000 FCFA',
       bottomMessage: 'Chaussures élégantes',
       description: 'Smartphone Android dernière génération.',
        hoverMessage: 'Promo spéciale -20%',
     },
     {
       category: 'Ordinateurs',
       image:'assets/blackbird.jpg',
       price: '350 000 FCFA',
       bottomMessage: 'Chaussures élégantes',
       description: 'Laptop performant pour travail et gaming.',
        hoverMessage: 'Promo spéciale -20%',
     }
   ];


  mainImage = 'assets/logo-bande.png';

   // Miniatures
   thumbnails = [
    'assets/blackbird.jpg',
     'assets/logo-bande.png',
     'assets/blackbird.jpg'
   ];
  /*gestion du sous menu----------------------------*/

   /*responsive menu*/


  /*panier*/
     cartCount = 0;

  /*---*/
   isPanierPanelOpen = false;

     openPanierPanel() {
       this.isPanierPanelOpen = true;
     }

     closePanierPanel() {
       this.isPanierPanelOpen = false;
     }

    isPanelOpen = false;

     searchText = '';
     activeMenu: string | null = null;
     activeSubMenu: string | null = null;

    openPanel() {
      this.isPanelOpen = true;
    }

    closePanel() {
      this.isPanelOpen = false;
    }




  // OUVRIR / FERMER MENU PRINCIPAL
  toggleMenu(menu: string) {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
      this.activeSubMenu = null; // ferme aussi le sous-menu
    } else {
      this.activeMenu = menu;
      this.activeSubMenu = null;
    }
  }

  // OUVRIR / FERMER SOUS-MENU
  toggleSubMenu(subMenu: string) {
    this.activeSubMenu =
      this.activeSubMenu === subMenu ? null : subMenu;
  }

    onSearch() {
      console.log('Recherche :', this.searchText);
    }

  /*pour le bouton de connexion*/
   cisOpen = false;

    loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });



    copen() {
      this.cisOpen = true;
    }

    cclose() {
      this.cisOpen = false;
    }


   submit() {
       if (this.form.invalid) return;

       const { username, password } = this.form.value;

       this.authService.login(username!, password!).subscribe({
         next: () => this.router.navigate(['/admin']),
         error: () => this.error = true
       });
     }







   changeMainImage(index: number) {
     const clicked = this.thumbnails[index];

     // Swap : la miniature devient principale
     this.thumbnails[index] = this.mainImage;
     this.mainImage = clicked;
   }

   currentIndex = 0;

  constructor(private cart: PanierService, private fb: FormBuilder,private authService: AuthService,private router: Router, private http: HttpClient) {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  currentIndx = 0;

    ngOnInit() {
       this.router.events
          .pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd)
          )
          .subscribe(event => {
            this.currentRoute = event.urlAfterRedirects;
            console.log(this.currentRoute);
          });

        this.startAutoSlide();
        this.cart.count$.subscribe(count => this.cartCount = count);
    }

    startAutoSlide() {
      setInterval(() => {
        this.next();
      }, 3000); // passe à la photo suivante toutes les 3 secondes
    }



    next() {
      this.currentIndx = (this.currentIndx + 1) % this.articles.length;
    }

    prev() {
      this.currentIndx =
        (this.currentIndx - 1 + this.articles.length) % this.articles.length;
    }

    goToAdminPage() {

        this.router.navigate(['/admin']);
    }

     filteredArticles(){
        console.log("barre de  recherche");
      }

     goToArticles(message:string){
             this.router.navigate(['/articles', message]);
          }

}

