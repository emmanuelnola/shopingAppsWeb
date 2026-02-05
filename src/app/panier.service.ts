
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  // BehaviorSubject = variable observable qui garde sa dernière valeur
  // On initialise le panier avec ce qu'il y a dans localStorage
  private itemsSubject = new BehaviorSubject<any[]>(this.loadCart());

  // Observable qui émet la liste des items
  items$ = this.itemsSubject.asObservable();

  // Observable qui retourne la quantité totale du panier
  count$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  // Observable qui retourne le montant total du panier
  total$ = this.items$.pipe(
    map(items =>
      items.reduce((sum, item) => sum + (item.quantity * item.prix), 0)
    )
  );

  constructor() {}

  /** Récupère le panier enregistré dans localStorage */
  private loadCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  /** Sauvegarde le panier dans localStorage */
  private saveCart(items: any[]) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  /** Ajoute un produit dans le panier */
  addToCart(product: any) {

    // On récupère les articles actuels
    const items = this.itemsSubject.value;

    // Vérifie si le produit existe déjà dans le panier
    const existing = items.find(i => i.id === product.id);

    if (existing) {
      // Si déjà présent, on incrémente la quantité
      existing.quantity++;
    } else {
      // Sinon on ajoute le produit en mettant qty = 1
      items.push({ ...product, quantity: 1 });
    }

    // On met à jour l’observable + localStorage
    this.itemsSubject.next(items);
    this.saveCart(items);
  }

  /** Modifie la quantité d’un produit */
  updateQuantity(id: number, quantity: number) {
    const items = this.itemsSubject.value;

    const obj = items.find(i => i.id === id);
    if (obj) {
      obj.quantity = quantity;

      // Si la quantité tombe à 0 → on supprime l’article
      if (obj.quantity <= 0) {
        this.removeItem(id);
        return;
      }

      // On met à jour la liste
      this.itemsSubject.next(items);
      this.saveCart(items);
    }
  }

  /** Supprime un produit du panier */
  removeItem(id: number) {
    const filtered = this.itemsSubject.value.filter(i => i.id !== id);

    // Mise à jour du panier
    this.itemsSubject.next(filtered);
    this.saveCart(filtered);
  }

  /** Vide complètement le panier */
  clearCart() {
    this.itemsSubject.next([]);
    localStorage.removeItem('cart');
  }
}
