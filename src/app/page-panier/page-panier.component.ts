import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PanierService } from '../panier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-panier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-panier.component.html',
  styleUrl: './page-panier.component.css'
})




export class PagePanierComponent {

   @Input() Panieropen = false;

   @Output() Panierclose = new EventEmitter<void>();

   closePanierPanel() {
     this.Panierclose.emit();
   }


  // Liste des articles dans le panier
  items: any[] = [];

  // Montant total du panier
  total = 0;

  constructor(private cart: PanierService) {}

  ngOnInit() {

    // On écoute les changements du panier
    this.cart.items$.subscribe(items => this.items = items);

    // On écoute le total
    this.cart.total$.subscribe(total => this.total = total);
  }

  // Mise à jour de la quantité
  updateQty(id: number, qty: number) {
    this.cart.updateQuantity(id, qty);
  }

  // Supprimer un produit
  remove(id: number) {
    this.cart.removeItem(id);
  }

  // Vider le panier
  clear() {
    this.cart.clearCart();
  }

    /*envoyer le panier via whatqapp*/


    sendMessage(): void {
      /*const produits = this.dataService.getProduits();
      const categories = this.groupByCategorie(produits);*/

      let message = '📋 voici le contenu de son panier: 📋\n\n';
    console.log(this.items);

        this.items.forEach(item => {
          message += `✅ ${item.title}\n`;
          message += `   💰 ${ item.price}€\n`;
          message += `   📝 ${item.quantity}\n`;
          message = '\n\n';
        });

      this.openWhatsApp('+237696366042', message);
    }

     /* Ouvrir WhatsApp */
     private openWhatsApp(phoneNumber: string, message: string): void {
       const cleanedNumber = phoneNumber.replace(/\D/g, '');
       const encodedMessage = encodeURIComponent(message);
       const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;

       window.open(whatsappUrl, '_blank');
     }
}
