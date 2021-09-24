import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from './../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  id: number = -1;
  editMode: boolean = false;
  recipeForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private resipeService: RecipeService,
    private router: Router
  ) {}

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = Boolean(params['id']) ? Number(params['id']) : -1;
      this.editMode = Boolean(params['id']) ?? null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName: string = '';
    let recipeDescription: string = '';
    let recipeImagePath: string = '';
    let recipeIngridents: FormArray = new FormArray([]);

    if (this.editMode) {
      const recipe = this.resipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;

      if (recipe.ingredients.length) {
        for (let ingredient of recipe.ingredients) {
          recipeIngridents.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      ingredients: recipeIngridents,
    });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onSubmit() {
    let recipeId: number;
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );
    if (this.editMode) {
      this.resipeService.updateRecipe(newRecipe, this.id);
      recipeId = this.id;
    } else {
      this.resipeService.addRecipe(newRecipe);
      recipeId = Number(this.resipeService.getRecipeTotalLength()) - 1;
    }
    this.onClear();
    this.router.navigate(['recipes', recipeId]);
  }

  onClear() {
    if (this.editMode) {
      this.editMode = false;
      this.id = -1;
    }

    this.recipeForm.reset();
    (this.recipeForm.get('ingredients') as FormArray).clear();
  }

  onCancelClick() {
    const recipeID = this.editMode ? this.id : '';

    this.onClear();

    const route = ['recipes', recipeID].filter(Boolean);
    this.router.navigate(route);
  }
}
