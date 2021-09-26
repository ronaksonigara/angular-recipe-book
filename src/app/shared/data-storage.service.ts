import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from './../recipes/recipe.service';
import { Recipe } from './../recipes/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private static readonly url =
    'https://angular-recipe-book-3ffb3-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.http.put(DataStorageService.url, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(DataStorageService.url).pipe(
      map((recipes) => {
        if (!recipes) {
          return [];
        }
        return recipes.map((recipe: Recipe) => {
          if (!recipe?.ingredients) {
            return { ...recipe, ingredients: [] };
          }
          return recipe;
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
