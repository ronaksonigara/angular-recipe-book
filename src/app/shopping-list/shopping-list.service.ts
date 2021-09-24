import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';

@Injectable()
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  constructor() {}

  ingredientsCanged = new Subject<Ingredient[]>();

  startedEditing = new Subject<number>();

  getIngredients() {
    return [...this.ingredients];
  }

  getIngredient(index: number) {
    return { ...this.ingredients[index] };
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsCanged.next([...this.ingredients]);
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsCanged.next([...this.ingredients]);
  }
  updateIngredient(ingredient: Ingredient, index: number) {
    this.ingredients.splice(index, 1, ingredient);
    this.ingredientsCanged.next([...this.ingredients]);
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsCanged.next([...this.ingredients]);
  }
}
