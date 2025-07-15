// localization.js - Complete localization engine for the results page

class LocalizationManager {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'es', 'fr', 'de', 'ja'];
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.isInitialized = false;
    }

    // Initialize the localization system
    async init() {
        try {
            // Load all language files
            await this.loadTranslations();

            // Detect and set initial language
            this.detectLanguage();

            // Apply initial translations
            this.applyTranslations();

            this.isInitialized = true;

            // Dispatch custom event when localization is ready
            window.dispatchEvent(new CustomEvent('localizationReady', {
                detail: { language: this.currentLanguage }
            }));

        } catch (error) {
            console.error('Failed to initialize localization:', error);
            // Fallback to English if initialization fails
            this.currentLanguage = this.fallbackLanguage;
        }
    }

    // Load all translation files
    async loadTranslations() {
        const loadPromises = this.supportedLanguages.map(async (lang) => {
            try {
                const response = await fetch(`src/game/results/locales/${lang}.json`);
                if (response.ok) {
                    this.translations[lang] = await response.json();
                } else {
                    console.warn(`Failed to load ${lang} translations`);
                }
            } catch (error) {
                console.warn(`Error loading ${lang} translations:`, error);
            }
        });

        await Promise.all(loadPromises);
    }

    // Detect user's preferred language
    detectLanguage() {
        // Priority: localStorage > URL parameter > browser language > fallback

        // 1. Check localStorage
        const savedLang = localStorage.getItem('game-results-language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }

        // 2. Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
            this.saveLanguagePreference(urlLang);
            return;
        }

        // 3. Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            this.currentLanguage = browserLang;
            this.saveLanguagePreference(browserLang);
            return;
        }

        // 4. Fallback to default
        this.currentLanguage = this.fallbackLanguage;
    }

    // Save language preference to localStorage
    saveLanguagePreference(language) {
        localStorage.setItem('game-results-language', language);
    }

    // Change the current language
    changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Unsupported language: ${language}`);
            return false;
        }

        this.currentLanguage = language;
        this.saveLanguagePreference(language);
        this.applyTranslations();

        // Update HTML lang attribute
        document.documentElement.lang = language;

        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));

        return true;
    }

    // Get translated text for a key
    translate(key, params = {}) {
        if (!this.isInitialized) {
            return key; // Return key if not initialized
        }

        let translation = this.getNestedTranslation(this.translations[this.currentLanguage], key);

        // Fallback to default language if translation not found
        if (!translation && this.currentLanguage !== this.fallbackLanguage) {
            translation = this.getNestedTranslation(this.translations[this.fallbackLanguage], key);
        }

        // Final fallback to key itself
        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }

        // Replace parameters in translation
        return this.replaceParameters(translation, params);
    }

    // Get nested translation using dot notation (e.g., "modal.close")
    getNestedTranslation(translations, key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], translations);
    }

    // Replace parameters in translation string
    replaceParameters(translation, params) {
        return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    // Apply translations to all elements with data-translate attribute
    applyTranslations() {
        // Translate elements with data-translate attribute
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const params = this.getElementParams(element);
            element.textContent = this.translate(key, params);
        });

        // Translate elements with data-translate-html attribute (for HTML content)
        const htmlTranslatableElements = document.querySelectorAll('[data-translate-html]');
        htmlTranslatableElements.forEach(element => {
            const key = element.getAttribute('data-translate-html');
            const params = this.getElementParams(element);
            element.innerHTML = this.translate(key, params);
        });

        // Translate placeholder attributes
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            element.placeholder = this.translate(key);
        });

        // Translate alt attributes
        const altElements = document.querySelectorAll('[data-translate-alt]');
        altElements.forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            element.alt = this.translate(key);
        });
    }

    // Get parameters from data attributes
    getElementParams(element) {
        const params = {};
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-param-')) {
                const paramName = attr.name.replace('data-param-', '');
                params[paramName] = attr.value;
            }
        });
        return params;
    }

    // Translate dynamic content (recipes, medals)
    translateRecipe(recipe) {
        const key = `recipes.${recipe.id}`;
        return {
            ...recipe,
            name: this.translate(`${key}.name`, {}, recipe.name),
            description: this.translate(`${key}.description`, {}, recipe.description)
        };
    }

    translateMedal(medal) {
        const key = `medals.${medal.id}`;
        return {
            ...medal,
            name: this.translate(`${key}.name`, {}, medal.name),
            description: this.translate(`${key}.description`, {}, medal.description)
        };
    }

    // Translate ingredient names
    translateIngredient(ingredient) {
        return this.translate(`ingredients.${ingredient}`, {}, ingredient);
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get supported languages
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    // Check if localization is ready
    isReady() {
        return this.isInitialized;
    }

    // Create language selector dropdown
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <select id="language-select" class="language-select">
                ${this.supportedLanguages.map(lang => `
                    <option value="${lang}" ${lang === this.currentLanguage ? 'selected' : ''}>
                        ${this.getLanguageDisplayName(lang)}
                    </option>
                `).join('')}
            </select>
        `;

        // Add event listener
        const select = selector.querySelector('#language-select');
        select.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        return selector;
    }

    // Get display name for language
    getLanguageDisplayName(lang) {
        const displayNames = {
            'en': '🇺🇸 English',
            'es': '🇪🇸 Español',
            'fr': '🇫🇷 Français',
            'de': '🇩🇪 Deutsch',
            'ja': '🇯🇵 日本語'
        };
        return displayNames[lang] || lang.toUpperCase();
    }

    // Update page title
    updatePageTitle() {
        const title = this.translate('page.title');
        document.title = title;

        // Update meta tags
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.translate('page.description');
        }

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.content = this.translate('page.twitter_title');
        }

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.content = this.translate('page.twitter_description');
        }
    }

    // Format numbers according to locale
    formatNumber(number) {
        try {
            return new Intl.NumberFormat(this.currentLanguage).format(number);
        } catch (error) {
            return number.toString();
        }
    }

    // Format time according to locale
    formatTime(seconds) {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return this.translate('time.minutes_seconds', {
                minutes: minutes,
                seconds: remainingSeconds
            });
        } else {
            return this.translate('time.seconds', { seconds: seconds });
        }
    }
}

// Create global instance
window.localizationManager = new LocalizationManager();

// Helper functions for easier access
window.t = (key, params) => window.localizationManager.translate(key, params);
window.translateRecipe = (recipe) => window.localizationManager.translateRecipe(recipe);
window.translateMedal = (medal) => window.localizationManager.translateMedal(medal);
window.translateIngredient = (ingredient) => window.localizationManager.translateIngredient(ingredient);

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.localizationManager.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalizationManager;
}