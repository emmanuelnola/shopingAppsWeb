import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   articles = [
       { id: 1,
         category: 'Chaussures',
         imagep:'assets/culotte.jpg',
         images: ['assets/culotte1.jpg','assets/culotte2.jpg'],
         price: '45 000 FCFA',
         bottomMessage: 'Chaussures élégantes',
         description: 'Chaussures en cuir de haute qualité.',
          hoverMessage: 'Promo spéciale -20%',
       },
       { id: 2,
         category: 'Téléphones',
         imagep: 'assets/culotte1.jpg',
         images: ['assets/culotte.jpg','assets/culotte2.jpg'],
         price: '150 000 FCFA',
         bottomMessage: 'Chaussures élégantes',
         description: 'Smartphone Android dernière génération.',
          hoverMessage: 'Promo spéciale -20%',
       },
       { id:3,
         category: 'Ordinateurs',
         imagep:'assets/culotte2.jpg',
         images: ['assets/culotte.jpg','assets/culotte1.jpg'],
         price: '350 000 FCFA',
         bottomMessage: 'Chaussures élégantes',
         description: 'Laptop performant pour travail et gaming.',
          hoverMessage: 'Promo spéciale -20%',
       }
     ];


  products = [
    { id: 1, name: 'Chaussure', price: 20000 },
    { id: 2, name: 'Sac à main', price: 15000 },
    { id: 3, name: 'Montre', price: 30000 }
  ];

  getProductById(id: number) {
    return this.articles.find(p => p.id === id);
  }
}
