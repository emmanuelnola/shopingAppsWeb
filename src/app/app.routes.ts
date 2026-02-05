import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageArticleComponent } from './page-article/page-article.component';
import { PagePanierComponent  } from './page-panier/page-panier.component';
import { ArticleComponent  } from './article/article.component';
import { DetailImgComponent } from './detail-img/detail-img.component';



export const routes: Routes = [

    { path: 'home', component: HomeComponent },
    { path: 'articles/:message', component: DetailImgComponent },
    { path: 'detail/:id', component: PageArticleComponent },
   /* { path: 'cart', component: PagePanierComponent  },*/
    { path: 'article', component: ArticleComponent  },
    // optionnel
    { path: '', redirectTo: '/home', pathMatch: 'full' },



    ];
