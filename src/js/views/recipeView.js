import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
	elements.recipe.innerHTML = '';
};

const formatCount = (count) => {
	if (count) {
		count = Math.round((count + Number.EPSILON) * 100) / 100;
		const [ int, dec ] = count.toString().split('.').map((el) => parseInt(el, 10));
		let frac;
		// console.log(dec);
		if (!dec) return count;

		if (dec >= 6 && dec <= 10) {
			frac = new Fraction(1, 16);
		} else if (dec === 125 || (dec >= 11 && dec <= 19)) {
			frac = new Fraction(1, 8);
		} else if (dec >= 20 && dec <= 28) {
			frac = new Fraction(1, 4);
		} else if (dec >= 29 && dec <= 43) {
			frac = new Fraction(1, 3);
		} else if (dec === 5 || (dec >= 44 && dec <= 59)) {
			frac = new Fraction(1, 2);
		} else if (dec === 625 || (dec >= 60 && dec <= 69)) {
			frac = new Fraction(2, 3);
		} else if (dec >= 70 && dec <= 78) {
			frac = new Fraction(3, 4);
		} else if (dec >= 79 && dec <= 86) {
			frac = new Fraction(5, 6);
		} else if (dec === 875 || (dec >= 87 && dec <= 93)) {
			frac = new Fraction(7, 8);
		} else if (dec >= 94) {
			frac = new Fraction(8, 8);
		}

		if (int >= 1) {
			return `${int} ${frac}`;
		} else {
			return frac;
		}
	}
	return '?';
};

/* const formatCount = (count) => {
	if (count) {
		// count = 2.5 --> 2 1/2
		// count = 0.5 --> 1/2
		count = Math.round((count + Number.EPSILON) * 100) / 100;
		const [ int, dec ] = count.toString().split('.').map((el) => parseInt(el, 10));

		if (!dec) return count;
		if (dec === 33 || dec === 67) {
			if (int === 0) {
				const fr = new Fraction(count);
				console.log(fr);
				return `${eval(fr.numerator / fr.numerator)}/${parseInt(
					eval(fr.denominator * fr.numerator / (fr.denominator * fr.denominator / 10))
				)}`;
			} else {
				const fr = new Fraction(count - int);
				return `${int} ${eval(fr.numerator / fr.numerator)}/${parseInt(
					eval(fr.denominator * fr.numerator / (fr.denominator * fr.denominator / 10))
				)}`;
			}
		} else {
			if (int === 0) {
				const fr = new Fraction(count);
				return `${fr.numerator}/${fr.denominator}`;
			} else {
				const fr = new Fraction(count - int);
				return `${int} ${fr.numerator}/${fr.denominator}`;
			}
		}
	}
	return '?';
}; */

const createIngredient = (ingredient) => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {
	const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map((el) => createIngredient(el)).join('')}

            
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = (recipe) => {
	// Update servings
	document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
	// Update ingredients
	const countElements = Array.from(document.querySelectorAll('.recipe__count'));
	countElements.forEach((el, i) => {
		el.textContent = formatCount(recipe.ingredients[i].count);
	});
};
