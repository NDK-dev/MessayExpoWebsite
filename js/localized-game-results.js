// Updated game-results.js with localization integration

class LocalizedGameResults extends GameResults {
    constructor() {
        super();
        this.isLocalizationReady = false;

        // Wait for localization to be ready
        window.addEventListener('localizationReady', () => {
            this.isLocalizationReady = true;
            this.refreshTranslations();
        });

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.refreshTranslations();
        });
    }

    // Override the original init method to wait for localization
    async init() {
        try {
            // Load data files
            await this.loadData();

            // Parse URL parameters
            this.parseURLParameters();

            // Wait for localization if not ready
            if (!this.isLocalizationReady) {
                await this.waitForLocalization();
            }

            // Display results with translations
            this.displayResults();

        } catch (error) {
            console.error('Error initializing game results:', error);
            this.showError(t('errors.init_failed'));
        }
    }

    // Wait for localization to be ready
    waitForLocalization() {
        return new Promise((resolve) => {
            if (this.isLocalizationReady) {
                resolve();
            } else {
                window.addEventListener('localizationReady', resolve, { once: true });
            }
        });
    }

    // Refresh all translations when language changes
    refreshTranslations() {
        if (this.isLocalizationReady) {
            // Update page title and meta tags
            window.localizationManager.updatePageTitle();

            // Apply translations to static elements
            window.localizationManager.applyTranslations();

            // Re-display content with new translations
            this.displayResults();
        }
    }

    // Override updateUserId with localization
    updateUserId() {
        const userIdElement = document.querySelector('.user-id');
        if (userIdElement) {
            userIdElement.textContent = t('header.user_id', { userId: this.currentResults.userId });
        }
    }

    // Override displayDishes with localization
    displayDishes() {
        const dishesGrid = document.querySelector('.dishes-grid');
        if (!dishesGrid) return;

        // Clear existing dishes
        dishesGrid.innerHTML = '';

        // Get recipe objects for the dish IDs
        const playerRecipes = this.getPlayerRecipes();

        if (playerRecipes.length === 0) {
            this.showNoDishesMessage(dishesGrid);
            return;
        }

        // Create dish elements with translations
        playerRecipes.forEach(recipe => {
            const translatedRecipe = translateRecipe(recipe);
            const dishElement = this.createDishElement(translatedRecipe);
            dishesGrid.appendChild(dishElement);
        });
    }

    // Override createDishElement with localization
    createDishElement(recipe) {
        const dishItem = document.createElement('div');
        dishItem.className = 'dish-item';
        dishItem.innerHTML = `
            <div class="dish-circle">
                <img src="${recipe.imagePath}" alt="${recipe.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="placeholder-text" style="display: none;">${t('dishes.dish_image')}</span>
            </div>
            <div class="dish-name">${recipe.name}</div>
        `;

        // Add click event to show modal
        dishItem.addEventListener('click', () => {
            this.showRecipeModal(recipe);
        });

        return dishItem;
    }

    // Override getIngredientDisplayName with localization
    getIngredientDisplayName(ingredient) {
        return translateIngredient(ingredient);
    }

    // Override createIngredientsHTML with localization
    createIngredientsHTML(recipe) {
        const necessaryIngredient = recipe.necessaryIngredient;
        const optionalIngredient = recipe.optionalIngredient;

        let ingredientsHTML = '';

        // Primary ingredient
        if (necessaryIngredient) {
            ingredientsHTML += `
                <div class="ingredient-item">
                    <img src="${this.getIngredientImagePath(necessaryIngredient)}" 
                         alt="${translateIngredient(necessaryIngredient)}" 
                         class="ingredient-image"
                         onerror="this.style.display='none';">
                    <div class="ingredient-label">${translateIngredient(necessaryIngredient)}</div>
                </div>
            `;
        }

        // Plus icon
        if (necessaryIngredient && optionalIngredient) {
            ingredientsHTML += '<div class="plus-icon">+</div>';
        }

        // Secondary ingredient
        if (optionalIngredient) {
            ingredientsHTML += `
                <div class="ingredient-item">
                    <img src="${this.getIngredientImagePath(optionalIngredient)}" 
                         alt="${translateIngredient(optionalIngredient)}" 
                         class="ingredient-image"
                         onerror="this.style.display='none';">
                    <div class="ingredient-label">${translateIngredient(optionalIngredient)}</div>
                </div>
            `;
        }

        return ingredientsHTML;
    }

    // Override showRecipeModal with localization
    showRecipeModal(recipe) {
        const modal = document.getElementById('recipe-modal');
        const modalIngredientsContainer = document.getElementById('modal-ingredients');

        document.getElementById('modal-image').src = recipe.imagePath;
        document.getElementById('modal-image').alt = recipe.name;
        document.getElementById('modal-title').textContent = recipe.name;
        document.getElementById('modal-description').textContent = recipe.description || t('modal.no_description');

        // Add ingredients
        modalIngredientsContainer.innerHTML = this.createIngredientsHTML(recipe);

        modal.classList.add('show');

        // Close modal when clicking the close button or outside modal content
        modal.querySelector('.close-btn').onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    // Override showMedalModal with localization
    showMedalModal(medal) {
        const modal = document.getElementById('recipe-modal');
        const modalIngredientsContainer = document.getElementById('modal-ingredients');

        document.getElementById('modal-image').src = medal.imagePath;
        document.getElementById('modal-image').alt = medal.name;
        document.getElementById('modal-title').textContent = medal.name;
        document.getElementById('modal-description').textContent = medal.description || t('medals.congratulations');

        // Clear ingredients for medals (they don't have ingredients)
        modalIngredientsContainer.innerHTML = '';

        modal.classList.add('show');

        // Close modal when clicking the close button or outside modal content
        modal.querySelector('.close-btn').onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    // Override showNoDishesMessage with localization
    showNoDishesMessage(container) {
        container.innerHTML = `
            <div class="dish-item">
                <div class="dish-circle">
                    <span class="placeholder-text">${t('dishes.no_dishes')}</span>
                </div>
                <div class="dish-name">${t('dishes.no_results')}</div>
            </div>
        `;
    }

    // Override displayMedals with localization
    displayMedals() {
        const medalsGrid = document.querySelector('.medals-grid');
        if (!medalsGrid) return;

        // Calculate earned medals
        const earnedMedals = this.calculateEarnedMedals();

        // Clear existing medals
        medalsGrid.innerHTML = '';

        if (earnedMedals.length === 0) {
            this.showNoMedalsMessage(medalsGrid);
            return;
        }

        // Create medal elements with translations
        earnedMedals.forEach(medal => {
            const translatedMedal = translateMedal(medal);
            const medalElement = this.createMedalElement(translatedMedal);
            medalsGrid.appendChild(medalElement);
        });
    }

    // Override createMedalElement with localization
    createMedalElement(medal) {
        const medalItem = document.createElement('div');
        medalItem.className = 'medal-item';

        medalItem.innerHTML = `
            <div class="medal-circle">
                <img src="${medal.imagePath}" alt="${medal.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="placeholder-text" style="display: none;">${t('medals.medal_image')}</span>
            </div>
            <div class="medal-name">${medal.name}</div>
        `;

        // Add click event to show modal for medal
        medalItem.addEventListener('click', () => {
            this.showMedalModal(medal);
        });

        return medalItem;
    }

    // Override showNoMedalsMessage with localization
    showNoMedalsMessage(container) {
        container.innerHTML = `
            <div class="medal-item">
                <div class="medal-circle">
                    <span class="placeholder-text">${t('medals.no_medals')}</span>
                </div>
                <div class="medal-name">${t('medals.keep_trying')}</div>
            </div>
        `;
    }

    // Override showError with localization
    showError(message) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #e74c3c;">
                    <h2>${t('errors.general_error')}</h2>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Language Selector Handler
class LanguageHandler {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupLanguageSelector();
        });
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('language-select');

        if (!languageSelect) {
            console.warn('Language selector not found');
            return;
        }

        // Set initial language from localStorage or browser
        const savedLang = localStorage.getItem('game-results-language') ||
            navigator.language.split('-')[0] || 'en';

        // Set the saved language as selected
        languageSelect.value = savedLang;

        // Handle language change
        languageSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            this.changeLanguage(selectedLang);
        });

        // Also listen for localization ready event
        window.addEventListener('localizationReady', () => {
            // Sync with localization manager
            if (window.localizationManager) {
                const currentLang = window.localizationManager.getCurrentLanguage();
                languageSelect.value = currentLang;
            }
        });
    }

    changeLanguage(selectedLang) {
        // Save to localStorage
        localStorage.setItem('game-results-language', selectedLang);

        // Update HTML lang attribute
        document.documentElement.lang = selectedLang;

        // If localization manager exists, use it
        if (window.localizationManager && window.localizationManager.changeLanguage) {
            window.localizationManager.changeLanguage(selectedLang);
        } else {
            // Fallback: reload page with language parameter
            const url = new URL(window.location);
            url.searchParams.set('lang', selectedLang);
            window.location.href = url.toString();
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language handler first (for immediate dropdown functionality)
    new LanguageHandler();

    // Initialize localization system
    if (window.localizationManager) {
        window.localizationManager.init().then(() => {
            console.log('Localization system initialized');
        }).catch(error => {
            console.error('Failed to initialize localization:', error);
        });
    }

    // Initialize game results with localization
    const gameResults = new LocalizedGameResults();
    gameResults.init();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocalizedGameResults, LanguageHandler };
}