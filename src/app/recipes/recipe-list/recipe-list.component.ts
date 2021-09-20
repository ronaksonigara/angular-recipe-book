import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Pizza Recipe',
      'This is Simple Pizza Recipe',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1bdKKaTySsc4t8ahzTXQIG87Ls_J8ph907w&usqp=CAU'
    ),
    new Recipe(
      'Pizza Recipe',
      'This is Simple Pizza Recipe',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1bdKKaTySsc4t8ahzTXQIG87Ls_J8ph907w&usqp=CAU'
    )
  
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
