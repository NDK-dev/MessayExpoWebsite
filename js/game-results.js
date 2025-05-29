// game-results.js - Main logic for parsing URL and displaying game results

class GameResults {
    constructor() {
        this.recipes = [];
        this.medals = [];
        this.currentResults = {
            userId: '',
            dishIds: [],
            remainingTime: 0,
            errorCount: 0
        };
    }

    // Initialize the application
    async init() {
        try {
            // Load data files
            await this.loadData();

            // Parse URL parameters
            this.parseURLParameters();

            // Display results
            this.displayResults();

        } catch (error) {
            console.error('Error initializing game results:', error);
            this.showError('Failed to load game results. Please try again.');
        }
    }

    // Load recipes and medals data from JSON files
    async loadData() {
        try {
            const [recipesResponse, medalsResponse] = await Promise.all([
                fetch('./data/recipes.json'),
                fetch('./data/medals.json')
            ]);

            if (!recipesResponse.ok || !medalsResponse.ok) {
                throw new Error('Failed to fetch data files');
            }

            this.recipes = await recipesResponse.json();
            this.medals = await medalsResponse.json();

        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    // Parse URL parameters to extract game results
    parseURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);

        // Extract parameters
        this.currentResults.userId = urlParams.get('id') || 'Unknown';

        const dishesParam = urlParams.get('dishes');
        this.currentResults.dishIds = dishesParam ?
            dishesParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];

        this.currentResults.remainingTime = parseInt(urlParams.get('time')) || 0;
        this.currentResults.errorCount = parseInt(urlParams.get('count')) || 0;

        // Validate parameters
        if (this.currentResults.dishIds.length === 0) {
            console.warn('No valid dish IDs found in URL');
        }
    }

    // Display the game results on the webpage
    displayResults() {
        // Update user ID
        this.updateUserId();

        // Display dishes
        this.displayDishes();

        // Calculate and display medals
        this.displayMedals();
    }

    // Update user ID in the header
    updateUserId() {
        const userIdElement = document.querySelector('.user-id');
        if (userIdElement) {
            userIdElement.textContent = `Your ID: ${this.currentResults.userId}`;
        }
    }

    // Display the dishes made by the player
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

        // Create dish elements
        playerRecipes.forEach(recipe => {
            const dishElement = this.createDishElement(recipe);
            dishesGrid.appendChild(dishElement);
        });
    }

    // Get recipe objects based on dish IDs from URL
    getPlayerRecipes() {
        return this.currentResults.dishIds
            .map(dishId => this.recipes.find(recipe => recipe.id === dishId))
            .filter(recipe => recipe !== undefined);
    }

    // Create HTML element for a single dish
    createDishElement(recipe) {
        const dishItem = document.createElement('div');
        dishItem.className = 'dish-item';
        dishItem.innerHTML = `
            <div class="dish-circle">
                <img src="${recipe.imagePath}" alt="${recipe.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="placeholder-text" style="display: none;">Dish Image</span>
            </div>
            <div class="dish-name">${recipe.name}</div>
        `;

        // Add click event to show modal
        dishItem.addEventListener('click', () => {
            this.showRecipeModal(recipe);
        });

        return dishItem;
    }

    // Show the modal popup with recipe details
    showRecipeModal(recipe) {
        const modal = document.getElementById('recipe-modal');
        document.getElementById('modal-image').src = recipe.imagePath;
        document.getElementById('modal-image').alt = recipe.name;
        document.getElementById('modal-title').textContent = recipe.name;
        document.getElementById('modal-description').textContent = recipe.description || "No description available.";
        modal.classList.add('show');

        // Close modal when clicking the close button or outside modal content
        modal.querySelector('.close-btn').onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    // Show the modal popup with medal details
    showMedalModal(medal) {
        const modal = document.getElementById('recipe-modal');
        document.getElementById('modal-image').src = medal.imagePath;
        document.getElementById('modal-image').alt = medal.name;
        document.getElementById('modal-title').textContent = medal.name;
        document.getElementById('modal-description').textContent = medal.description || "Congratulations on earning this medal!";
        modal.classList.add('show');

        // Close modal when clicking the close button or outside modal content
        modal.querySelector('.close-btn').onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    // Show message when no dishes are found
    showNoDishesMessage(container) {
        container.innerHTML = `
            <div class="dish-item">
                <div class="dish-circle">
                    <span class="placeholder-text">No dishes found</span>
                </div>
                <div class="dish-name">No Results</div>
            </div>
        `;
    }

    // Calculate and display medals earned
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

        // Create medal elements
        earnedMedals.forEach(medal => {
            const medalElement = this.createMedalElement(medal);
            medalsGrid.appendChild(medalElement);
        });
    }

    // Calculate which medals the player has earned
    calculateEarnedMedals() {
        const playerRecipes = this.getPlayerRecipes();
        const { remainingTime, errorCount } = this.currentResults;

        return this.medals.filter(medal => {
            return this.checkMedalCondition(medal, playerRecipes, remainingTime, errorCount);
        });
    }

    // Check if a specific medal condition is met
    checkMedalCondition(medal, recipes, remainingTime, errorCount) {
        const hasEnoughRecipes = recipes.length >= 2;

        switch (medal.id) {
            case 'FOCUSED_ON_VARIETY':
                if (!hasEnoughRecipes) return false;
                const uniqueIngredients = new Set(recipes.map(r => r.optionalIngredient));
                return uniqueIngredients.size === recipes.length;

            case 'NUTRITIONALLY_BALANCED':
                if (!hasEnoughRecipes) return false;
                const nutritionSet = new Set(recipes.flatMap(r => r.nutrition));
                return nutritionSet.has('PROTEIN') && nutritionSet.has('VITAMINS');

            case 'BODY_BUILDER':
                if (!hasEnoughRecipes) return false;
                const bodyBuilderNutrition = new Set(recipes.flatMap(r => r.nutrition));
                return bodyBuilderNutrition.size === 1 && bodyBuilderNutrition.has('PROTEIN');

            case 'HEALTHY_FLOW':
                if (!hasEnoughRecipes) return false;
                const healthyNutrition = new Set(recipes.flatMap(r => r.nutrition));
                return healthyNutrition.size === 1 && healthyNutrition.has('VITAMINS');

            case 'PASTA_MAESTRO':
                return recipes.length > 0 && recipes.every(r => r.category === 'PASTA');

            case 'SUSHI_CHEF':
                return recipes.length > 0 && recipes.every(r => r.category === 'SUSHI');

            case 'SANDWICH_EARL':
                return recipes.length > 0 && recipes.every(r => r.category === 'SANDWICH');

            case 'TACO_ESTETA':
                return recipes.length > 0 && recipes.every(r => r.category === 'TACOS');

            case 'CURRY_MAHARAJA':
                return recipes.length > 0 && recipes.every(r => r.category === 'CURRY');

            case 'SELECTIVE_EATER':
                if (!hasEnoughRecipes) return false;
                const uniqueRecipes = new Set(recipes.map(r => r.id));
                return uniqueRecipes.size === 1;

            case 'FISHERMAN':
                return hasEnoughRecipes && recipes.every(r => r.farm === 'SEAFOOD');

            case 'FARMER':
                return hasEnoughRecipes && recipes.every(r => r.farm === 'VEGETABLES');

            case 'LIVESTOCK_FARMER':
                return hasEnoughRecipes && recipes.every(r => r.farm === 'LIVESTOCK');

            case 'HUMPTY_DUMPTY':
                return hasEnoughRecipes && recipes.every(r => r.optionalIngredient === 'EGG');

            case 'MAES_TORO':
                return hasEnoughRecipes && recipes.every(r => r.optionalIngredient === 'TUNA');

            case 'POPEYE':
                return hasEnoughRecipes && recipes.every(r => r.optionalIngredient === 'SPINACH');

            case 'COWBOY':
                return hasEnoughRecipes && recipes.every(r => r.optionalIngredient === 'MEAT');

            case 'QUICK_DECISION_MAKER':
                return remainingTime > 60;

            case 'LAID_BACK_AND_STEADY':
                return remainingTime < 20;

            case 'UNIQUE_PALATE':
                return errorCount >= 3;

            case 'REFINED_PALATE':
                return errorCount === 0;

            default:
                return false;
        }
    }

    // Create HTML element for a single medal
    createMedalElement(medal) {
        const medalItem = document.createElement('div');
        medalItem.className = 'medal-item';

        medalItem.innerHTML = `
            <div class="medal-circle">
                <img src="${medal.imagePath}" alt="${medal.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="placeholder-text" style="display: none;">Medal Image</span>
            </div>
            <div class="medal-name">${medal.name}</div>
        `;

        // Add click event to show modal for medal
        medalItem.addEventListener('click', () => {
            this.showMedalModal(medal);
        });

        return medalItem;
    }

    // Show message when no medals are earned
    showNoMedalsMessage(container) {
        container.innerHTML = `
            <div class="medal-item">
                <div class="medal-circle">
                    <span class="placeholder-text">No medals earned</span>
                </div>
                <div class="medal-name">Keep trying!</div>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #e74c3c;">
                    <h2>Error</h2>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const gameResults = new GameResults();
    gameResults.init();
});

// Debug function to test with sample data
function testWithSampleData() {
    // Example: test URL would be ?id=12345&dishes=0,4,16&time=45&count=1
    // This represents: Pasta Carbonara, Tuna Sushi, Shrimp Curry with 45 seconds remaining and 1 error
    window.history.replaceState({}, '', `${window.location.pathname}?id=12345&dishes=0,4,16&time=45&count=1`);
    location.reload();
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameResults;
}