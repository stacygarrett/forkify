import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	async getRecipe() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (err) {
			console.log(err);
			alert('Something went wrong :(');
		}
	}
	calcTime() {
		// Assuming that we need 156 min for each 3 ingredients
		const numIng = this.ingredients.length; // ingredients is an array
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}
	calcServings() {
		this.servings = 4;
	}
	parseIngredients() {
		const unitsLong = [ 'tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds' ];
		const unitsShort = [ 'tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound' ];
		const units = [ ...unitsShort, 'kg', 'g' ];

		const newIngredients = this.ingredients.map((el) => {
			// 1) Uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, units[i]);
			});
			// 2) Remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			// 3) Parse ingredients into count, unit, & ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

			let objIng;
			if (unitIndex > -1) {
				// There is a unit
				// i.e. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+")
				// i.e. 4 cups, arrCount is [4]
				const arrCount = arrIng.slice(0, unitIndex);
				let count;
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'));
				} else {
					count = eval(arrIng.slice(0, unitIndex).join('+'));
				}
				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				};
			} else if (parseInt(arrIng[0], 10)) {
				// There is NO unit, but 1st element is a number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: ' ',
					ingredient: arrIng.slice(1).join(' ')
				};
			} else if (unitIndex === -1) {
				// There is NO unit
				objIng = {
					count: 1,
					unit: '',
					ingredient
				};
			}

			return objIng;
		});
		this.ingredients = newIngredients;
	}
	updateServings(type) {
		// type will be + or - button
		// Servings
		const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1;

		// Ingredients
		this.ingredients.forEach((ing) => {
			ing.count *= newServings / this.servings;
		});
		this.servings = newServings;
	}
}
