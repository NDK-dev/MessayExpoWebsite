// game-results.js - Main logic with integrated translations and enhanced square share functionality

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

        // Localization
        this.currentLanguage = 'en';
        this.translations = this.getEmbeddedTranslations();

        // Store generated image data for download
        this.generatedImageData = null;

        this.init();
    }

    // Get embedded translations
    getEmbeddedTranslations() {
        return {
            en: {
                header: {
                    title: "Your Dishes",
                    user_id: "Your ID: {userId}",
                    celebration_banner: "Celebration Banner"
                },
                dishes: {
                    loading: "Loading your delicious dishes"
                },
                medalsSection: {
                    title: "Medals You Achieved!",
                    loading: "Calculating your achievements"
                },
                modal: {
                    close: "×"
                },
                messages: {
                    noDishes: "No dishes found",
                    noMedals: "No medals earned",
                    keepTrying: "Keep trying!",
                    noDescription: "No description available."
                },
                share: {
                    button_text: "Share My Results",
                    modal_title: "Share Your Results!",
                    step1_text: " Step 1",
                    step2_text: "Step 2",
                    step2_support_text: "Please upload the saved image to your post manually",
                    download_button_text: "Download Image",
                    instagram: "Instagram",
                    facebook: "Facebook",
                    twitter: "Twitter",
                    line: "Line",
                    success_message: "Copied to clipboard! 📋",
                    download_success: "Image downloaded! 📥",
                    share_text: "🍽️ Check out my dishes and medals that I achieved in the #EyeTracking Shopping Game at the Reborn Challenge Booth of the Osaka Healthcare Pavilion! #Expo2025 ",
                    instagram_copy_text: "🍽️ Check out my dishes and medals that I achieved in the #EyeTracking Shopping Game at the Reborn Challenge Booth of the Osaka Healthcare Pavilion! #Expo2025 ",
                    instagram_instruction_mobile: "Text copied to clipboard!\n\n📱 Open Instagram app:\n1. Create a new post\n2. Paste the text in caption\n3. Add a screenshot of this results page",
                    instagram_instruction_desktop: "Text copied to clipboard!\n\n📱 Please open Instagram on your mobile device:\n1. Create a new post\n2. Paste the copied text\n3. Add a screenshot of this page",
                    card_title: "Your Achievements",
                    card_id_prefix: "ID: ",
                    card_dishes_title: "My Dishes",
                    card_medals_title: "My Medals",
                    card_view_more: "View All Medals",
                    card_no_dish: "No Dish",
                    card_no_medals: "No Medals"
                },
                recipes: {
                    0: { name: "Pasta Carbonara", description: "A rich, creamy pasta dish with bacon, eggs, and cheese." },
                    1: { name: "Vongole Bianco", description: "A simple pasta bursting with the flavor of clams." },
                    2: { name: "Pasta Napolitana", description: "A pasta with the perfect blend of tomato sweetness and sausage flavor." },
                    3: { name: "Spinach Cream Pasta", description: "A creamy pasta with the aroma of spinach and bacon." },
                    4: { name: "Tuna Sushi", description: "Sushi made with fresh tuna." },
                    5: { name: "Shrimp Sushi", description: "Sushi made with plump shrimp." },
                    6: { name: "Shellfish Sushi", description: "Sushi made with fresh, crunchy shellfish." },
                    7: { name: "Egg Sushi", description: "Sushi made with fluffy, slightly sweet omelet." },
                    8: { name: "BLT Sandwich", description: "A luxurious sandwich with bacon, lettuce, and tomato." },
                    9: { name: "Egg Sandwich", description: "A sandwich with fluffy, creamy egg filling." },
                    10: { name: "Tuna Sandwich", description: "A sandwich with rich, creamy tuna filling." },
                    11: { name: "Pork Cutlet Sandwich", description: "A sandwich with a crispy, extra-thick pork cutlet." },
                    12: { name: "Chili Bean Tacos", description: "A taco packed with the rich flavor of beans." },
                    13: { name: "Chorizo Tacos", description: "A spicy taco with chorizo sausage." },
                    14: { name: "Tuna Tacos", description: "A taco with the perfect match of tuna and avocado." },
                    15: { name: "Vegetable Tacos", description: "A healthy taco with spinach dough and plenty of vegetables." },
                    16: { name: "Shrimp Curry", description: "A curry with the rich flavor of shrimp." },
                    17: { name: "Chickpea Curry", description: "Rich and flavorful spicy chickpea curry." },
                    18: { name: "Butter Chicken Curry", description: "A fragrant curry with the aroma of butter." },
                    19: { name: "Spinach Cheese Curry", description: "An Indian-style curry with the rich aroma of spinach and cheese." }
                },
                medals: {
                    FOCUSED_ON_VARIETY: { name: "Focused on Variety", description: "So many ingredients! Your table has become colorful!" },
                    NUTRITIONALLY_BALANCED: { name: "Nutritionally Balanced", description: "Balanced meal: Carbs, Protein, and Vitamins" },
                    BODY_BUILDER: { name: "Body Builder", description: "You're swole from all that muscle food!" },
                    HEALTHY_FLOW: { name: "Healthy Flow", description: "With all those veggies, your blood must be super smooth!" },
                    PASTA_MAESTRO: { name: "Pasta Maestro", description: "The pasta wizard is born!" },
                    SUSHI_CHEF: { name: "Sushi Chef", description: "A true artisan who has mastered sushi!" },
                    SANDWICH_EARL: { name: "Sandwich Earl", description: "Even Mr. Sandwich (John Montagu) would be surprised-what a noble palate!" },
                    TACO_ESTETA: { name: "Taco Esteta", description: "A gourmet of tacos. You wear that sombrero well!" },
                    CURRY_MAHARAJA: { name: "Curry Maharaja", description: "You've built a kingdom of aromatic spices!" },
                    SELECTIVE_EATER: { name: "Selective Eater", description: "That dedication to single-mindedly pursuing one flavor-so admirable!" },
                    FISHERMAN: { name: "Fisherman", description: "A true fisherman who knows all the blessings of the sea!" },
                    FARMER: { name: "Farmer", description: "The strength of a farmer who lives with the soil has reached your table!" },
                    LIVESTOCK_FARMER: { name: "Livestock Farmer", description: "A livestock farmer raising animals with lots of love!" },
                    HUMPTY_DUMPTY: { name: "Humpty Dumpty", description: "An egg lover that would surprise even the always-smiling Humpty Dumpty!" },
                    MAES_TORO: { name: "Maes'Toro", description: "Maes'Toro, master of tuna, wins thunderous applause again today!" },
                    POPEYE: { name: "Popeye", description: "Like power-packed Popeye, your nutrition is fully charged!" },
                    COWBOY: { name: "Cowboy", description: "Like a cowboy riding the wilds, an adventurer in pursuit of freedom and flavor!" },
                    QUICK_DECISION_MAKER: { name: "Quick Decision Maker", description: "Amazing decision-making speed! You never hesitate, even in a pinch!" },
                    LAID_BACK_AND_STEADY: { name: "Laid Back and Steady", description: "Controlling life at your own pace-now that's cool!" },
                    UNIQUE_PALATE: { name: "Unique Palate", description: "Your sense of taste is one of a kind!" },
                    REFINED_PALATE: { name: "Refined Palate", description: "Oh, traveler with a refined palate, your tongue is truly first-class!" }
                },
                ingredients: {
                    SPAGHETTI: 'Spaghetti', RICE: 'Rice', BREAD: 'Bread', CORN: 'Corn', EGG: 'Egg',
                    SHELLFISH: 'Shellfish', TOMATO: 'Tomato', SPINACH: 'Spinach', TUNA: 'Tuna',
                    SHRIMP: 'Shrimp', MEAT: 'Meat', BEANS: 'Beans', HOT_PEPPER: 'Hot Pepper'
                }
            },
            ja: {
                header: {
                    title: "あなたの料理",
                    user_id: "あなたのID: {userId}",
                    celebration_banner: "お祝いバナー"
                },
                dishes: {
                    loading: "美味しい料理を読み込み中"
                },
                medalsSection: {
                    title: "獲得したメダル！",
                    loading: "成果を計算中"
                },
                modal: {
                    close: "×"
                },
                messages: {
                    noDishes: "料理が見つかりません",
                    noMedals: "メダルを獲得していません",
                    keepTrying: "頑張って！",
                    noDescription: "説明がありません。"
                },
                share: {
                    button_text: "結果をシェア",
                    modal_title: "結果をシェアしよう！",
                    step1_text: "Step 1",
                    step2_text: "Step 2",
                    step2_support_text: "保存した画像は、投稿にご自身でアップロードする必要があります。",
                    download_button_text: "画像をダウンロード",
                    instagram: "Instagram",
                    facebook: "Facebook",
                    twitter: "Twitter",
                    line: "Line",
                    success_message: "クリップボードにコピーしました！📋",
                    download_success: "画像をダウンロードしました！📥",
                    share_text: "🍽️ 大阪ヘルスケアパビリオンのリボーンチャレンジブースで、「視線でお買い物ゲーム」を体験しました！ \n" +
                        "#Expo2025 #eyetracking\n" +
                        "\n" +
                        "私のつくった料理はこちら",
                    instagram_copy_text: "🍽️ 大阪ヘルスケアパビリオンのリボーンチャレンジブースで、「視線でお買い物ゲーム」を体験しました #Expo2025 #eyetracking 私のつくった料理はこちら",
                    instagram_instruction_mobile: "テキストをコピーしました！\n\n📱 Instagramアプリを開いて:\n1. 新しい投稿を作成\n2. キャプションにペースト\n3. この結果画面のスクリーンショットを追加",
                    instagram_instruction_desktop: "テキストをコピーしました！\n\n📱 モバイルデバイスでInstagramアプリを開き:\n1. 新しい投稿を作成\n2. コピーしたテキストを貼り付け\n3. この画面のスクリーンショットを追加",
                    card_title: "あなたの成果",
                    card_id_prefix: "ID: ",
                    card_dishes_title: "私の料理",
                    card_medals_title: "私のメダル",
                    card_view_more: "すべてのメダルを見る",
                    card_no_dish: "料理なし",
                    card_no_medals: "メダルなし"
                },
                recipes: {
                    0: { name: "カルボナーラパスタ", description: "卵とチーズ、ベーコンがからむ濃厚パスタ" },
                    1: { name: "ボンゴレ・ビアンコ", description: "あさりの旨味がたっぷりのシンプルなパスタ" },
                    2: { name: "ナポリタン", description: "トマトの甘みとウィンナーの旨味が絶妙なパスタ" },
                    3: { name: "ほうれん草のクリームパスタ", description: "ほうれん草とベーコンの風味が香るクリーミーなパスタ" },
                    4: { name: "マグロのお寿司", description: "新鮮なマグロを使ったお寿司" },
                    5: { name: "エビのお寿司", description: "ぷりぷりのエビを使ったお寿司" },
                    6: { name: "貝のお寿司", description: "新鮮なコリコリの貝を使ったお寿司" },
                    7: { name: "卵のお寿司", description: "甘い、ふわふわ卵焼きのお寿司" },
                    8: { name: "BLTサンド", description: "ベーコン、レタス、トマトの豪華なサンドイッチ" },
                    9: { name: "たまごサンド", description: "ふわふわの卵フィリングがたっぷり入ったサンドイッチ" },
                    10: { name: "ツナマヨサンド", description: "ツナとマヨネーズの相性抜群なサンドイッチ" },
                    11: { name: "トンカツサンド", description: "サクサクの極厚トンカツが入ったサンドイッチ" },
                    12: { name: "チリビーンズタコス", description: "豆の旨味がぎゅっと詰まったタコス" },
                    13: { name: "チョリソータコス", description: "スパイシーなチョリソーのタコス" },
                    14: { name: "ツナとアボカドのタコス", description: "ツナとアボカドの相性抜群のタコス" },
                    15: { name: "野菜たっぷりタコス", description: "ほうれん草が練り込まれた生地に、野菜がのったヘルシータコス" },
                    16: { name: "海老カレー", description: "海老の旨味がたっぷりのカレー" },
                    17: { name: "ひよこ豆のカレー", description: "ひよこ豆たっぷりのスパイシーカレー" },
                    18: { name: "バターチキンカレー", description: "バターの風味が香ばしいチキンカレー" },
                    19: { name: "ほうれん草とチーズのカレー", description: "ほうれん草とチーズの香り豊かなインド風カレー" }
                },
                medals: {
                    FOCUSED_ON_VARIETY: { name: "バリエーション重視", description: "食材たっぷり！食卓がカラフルになったね！" },
                    NUTRITIONALLY_BALANCED: { name: "栄養バランスばっちり", description: "炭水化物とタンパク質、ビタミンのバランスの取れたいい食事" },
                    BODY_BUILDER: { name: "ボディビルダー", description: "筋肉を育てるための食事でムキムキだ！" },
                    HEALTHY_FLOW: { name: "スーパーヘルシー", description: "たっぷりの野菜できみの血液はさらさらだね！" },
                    PASTA_MAESTRO: { name: "パスタマエストロ", description: "パスタの魔法使い、ここに誕生！" },
                    SUSHI_CHEF: { name: "寿司職人", description: "寿司を極めた真の職人！" },
                    SANDWICH_EARL: { name: "サンドイッチ伯爵", description: "サンドイッチ伯爵もびっくりな、貴族の味覚だね！" },
                    TACO_ESTETA: { name: "タコスエスティータ", description: "タコスの美食家。ソンブレロがよく似合う！" },
                    CURRY_MAHARAJA: { name: "カレーマハラジャ", description: "香りたつスパイスの王国をきみが築いた！" },
                    SELECTIVE_EATER: { name: "一途な人", description: "一途に１つの味を追い求めるその姿勢、ステキ！" },
                    FISHERMAN: { name: "漁師", description: "海のめぐみを知り尽くした真の漁師！" },
                    FARMER: { name: "農家", description: "土とともに生きる農家の力、食卓に届いた！" },
                    LIVESTOCK_FARMER: { name: "畜産家", description: "愛情たっぷりに育てる畜産家！" },
                    HUMPTY_DUMPTY: { name: "ハンプティ・ダンプティ", description: "まんまるスマイルのハンプティ・ダンプティもびっくりな卵好き" },
                    MAES_TORO: { name: "マエス'トロ'", description: "トロを極めしマエス'トロ'、今日も拍手喝采！" },
                    POPEYE: { name: "ポパイ", description: "パワー満点ポパイのごとく、栄養チャージ完了！" },
                    COWBOY: { name: "カウボーイ", description: "荒野を駆けるカウボーイのごとく、自由と味を追い求める冒険者！" },
                    QUICK_DECISION_MAKER: { name: "すばやい決断", description: "すばらしくスピーディな決断力！ピンチでも迷わない！" },
                    LAID_BACK_AND_STEADY: { name: "のんびりマイペース", description: "自分のペースで人生をコントロールできる人ってかっこいい。" },
                    UNIQUE_PALATE: { name: "ユニークな味覚", description: "きみだけの味覚センス、唯一無二！" },
                    REFINED_PALATE: { name: "たしかな味覚", description: "洗練された味覚の旅人よ。その舌はまさに一流！" }
                },
                ingredients: {
                    SPAGHETTI: 'スパゲッティ', RICE: 'ご飯', BREAD: 'パン', CORN: 'コーン', EGG: '卵',
                    SHELLFISH: '貝', TOMATO: 'トマト', SPINACH: 'ほうれん草', TUNA: 'マグロ',
                    SHRIMP: 'エビ', MEAT: '肉', BEANS: '豆', HOT_PEPPER: '唐辛子'
                }
            }
        };
    }

    // Translation method
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }

        if (value === undefined) return key;

        // Replace parameters like {userId}
        return value.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    // Generate 8-digit ID from userId
    generateEightDigitId(userId) {
        if (!userId || userId === 'Unknown') {
            // Generate a random 8-digit ID if no userId
            return Math.floor(10000000 + Math.random() * 90000000).toString();
        }

        // Create a hash from the userId and convert to 8 digits
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        // Ensure positive and convert to 8 digits
        const positiveHash = Math.abs(hash);
        const eightDigitId = (positiveHash % 90000000) + 10000000;
        return eightDigitId.toString();
    }

    // Switch language
    switchLanguage(lang) {
        if (lang === this.currentLanguage) return;

        this.currentLanguage = lang;

        // Update dropdown
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = lang;
        }

        // Apply translations and re-render
        this.applyTranslations();
        this.displayResults();
    }

    // Apply translations to static elements
    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');

        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const paramUserId = element.getAttribute('data-param-userId');

            let params = {};
            if (paramUserId) {
                params.userId = this.currentResults.userId;
            }

            const translatedText = this.t(key, params);
            element.textContent = translatedText;
        });
    }

    // Initialize the application
    async init() {
        console.log('Starting game results initialization');

        try {
            // Load data
            await this.loadData();
            console.log('Data loaded successfully');

            // Parse URL parameters
            this.parseURLParameters();
            console.log('URL parameters parsed:', this.currentResults);

            // Set up language selector
            this.setupLanguageSelector();

            // Set up share functionality
            this.setupShareFunctionality();

            // Display results
            this.displayResults();
            console.log('Results displayed');

        } catch (error) {
            console.error('Error initializing game results:', error);
            this.showError('Failed to load game results. Please try again.');
        }
    }

    // Setup language selector
    setupLanguageSelector() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });

            // Set initial language
            this.currentLanguage = languageSelect.value || 'en';
        }
    }

    // Setup share functionality
    setupShareFunctionality() {
        // Ensure global functions are available
        window.shareResults = () => this.shareResults();
        window.closeShareModal = () => this.closeShareModal();
        window.shareToInstagram = () => this.shareToInstagram();
        window.shareToFacebook = () => this.shareToFacebook();
        window.shareToTwitter = () => this.shareToTwitter();
        window.shareToLine = () => this.shareToLine();

        // Set up modal event listeners
        const shareModal = document.getElementById('share-modal');
        if (shareModal) {
            // Close modal when clicking outside
            shareModal.addEventListener('click', (e) => {
                if (e.target.id === 'share-modal') {
                    this.closeShareModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal();
            }
        });
    }

    // MODIFIED SHARE FUNCTIONALITY - ALWAYS SHOW CUSTOM MODAL
    async shareResults() {
        try {
            // Save original button state
            const shareBtn = document.querySelector('.share-button');
            const originalHTML = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span>🖼️ Generating image...</span>';
            shareBtn.disabled = true;

            // Update share card with user data
            this.populateShareCard();

            // Generate image with html2canvas
            const shareCard = document.getElementById('share-card');
            const canvas = await html2canvas(shareCard, {
                scale: 2,
                backgroundColor: "#FCF6F0",
                logging: false,
                useCORS: true,
                allowTaint: true,
                height: shareCard.offsetHeight,
                width: shareCard.offsetWidth
            });

            // Convert to image data and store it
            this.generatedImageData = canvas.toDataURL('image/jpeg', 0.95);

            // Always show our custom modal instead of native share
            this.showShareModal();

        } catch (error) {
            console.error('Sharing failed:', error);
            this.showCustomMessage('⚠️ Sharing failed. Please try again.');
        } finally {
            // Restore button state
            const shareBtn = document.querySelector('.share-button');
            shareBtn.innerHTML = originalHTML;
            shareBtn.disabled = false;
        }
    }

    // Populate square share card with user data
    populateShareCard() {
        // Generate 8-digit ID
        const eightDigitId = this.generateEightDigitId(this.currentResults.userId);

        // Update title and ID
        const titleElement = document.getElementById('share-card-title');
        const userIdElement = document.getElementById('share-card-user-id');

        if (titleElement) {
            titleElement.textContent = this.t('share.card_title');
        }
        if (userIdElement) {
            userIdElement.textContent = this.t('share.card_id_prefix') + eightDigitId;
        }

        // Update section titles
        const dishesTitle = document.getElementById('share-card-dishes-title');
        const medalsTitle = document.getElementById('share-card-medals-title');

        if (dishesTitle) {
            dishesTitle.textContent = this.t('share.card_dishes_title');
        }
        if (medalsTitle) {
            medalsTitle.textContent = this.t('share.card_medals_title');
        }

        // Populate all dishes (no limit, no placeholders)
        const dishesContainer = document.getElementById('share-card-dishes');
        dishesContainer.innerHTML = '';
        const dishItems = document.querySelectorAll('.dish-item');

        if (dishItems.length === 0) {
            // If no dishes, leave the container empty
            dishesContainer.innerHTML = '';
        } else {
            // Show all dishes
            dishItems.forEach(dish => {
                const imgElement = dish.querySelector('.dish-circle img');
                const imgSrc = imgElement ? imgElement.src : '';
                const dishName = dish.querySelector('.dish-name').textContent.trim();

                dishesContainer.innerHTML += `
                    <div class="share-card-item">
                        <img src="${imgSrc}" alt="" class="share-card-image">
                        <p class="share-card-name">${dishName}</p>
                    </div>
                `;
            });
        }

        // Populate all earned medals (no limit, no placeholders)
        const medalsContainer = document.getElementById('share-card-medals');
        medalsContainer.innerHTML = '';
        const medalItems = document.querySelectorAll('.medal-item');

        if (medalItems.length === 0) {
            // If no medals, leave the container empty (just show empty space)
            medalsContainer.innerHTML = '';
        } else {
            // Show all earned medals
            medalItems.forEach(medal => {
                const imgElement = medal.querySelector('.medal-circle img');
                const imgSrc = imgElement ? imgElement.src : '';
                const medalName = medal.querySelector('.medal-name').textContent.trim();

                medalsContainer.innerHTML += `
                    <div class="share-card-item">
                        <img src="${imgSrc}" alt="" class="share-card-image">
                        <p class="share-card-name">${medalName}</p>
                    </div>
                `;
            });
        }
    }

    // Show share modal without image preview
    showShareModal() {
        const shareModal = document.getElementById('share-modal');
        const downloadButton = document.getElementById('download-image-button');

        // Set up download functionality
        downloadButton.onclick = () => this.downloadImage();

        // Show modal
        shareModal.classList.add('show');
    }

    // Download image function
    downloadImage() {
        try {
            if (!this.generatedImageData) {
                this.showCustomMessage('⚠️ Please generate the image first by clicking share.');
                return;
            }

            const eightDigitId = this.generateEightDigitId(this.currentResults.userId);
            const link = document.createElement('a');
            link.href = this.generatedImageData;
            link.download = `cooking-achievements-${eightDigitId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show download success message
            this.showCustomMessage(this.t('share.download_success'));
        } catch (error) {
            console.error('Download failed:', error);
            this.showCustomMessage('⚠️ Download failed. Please try again.');
        }
    }

    closeShareModal() {
        const shareModal = document.getElementById('share-modal');
        shareModal.classList.remove('show');
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 2000);
    }

    // FIXED Instagram sharing functionality
    shareToInstagram() {
        const shareText = this.t('share.instagram_copy_text');
        const currentUrl = window.location.href;

        // First, copy text to clipboard
        this.copyToClipboard(shareText).then(() => {
            this.showSuccessMessage();
            this.closeShareModal();

            // Try to open Instagram with improved approach
            this.openInstagramApp(currentUrl, shareText);
        }).catch(() => {
            // If clipboard fails, still try to open Instagram
            this.closeShareModal();
            this.openInstagramApp(currentUrl, shareText);
        });
    }

    // Improved Instagram app opening method
    openInstagramApp(url, text) {
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isAndroid = /Android/.test(userAgent);
        const isMobile = isIOS || isAndroid;

        if (isMobile) {
            // Strategy: Use simple app schemes that actually work
            let instagramUrl;

            if (isIOS) {
                // iOS: Use the basic Instagram app scheme
                instagramUrl = 'instagram://app';
            } else if (isAndroid) {
                // Android: Use the package-based intent
                instagramUrl = 'intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end';
            }

            // Try to open Instagram app
            this.tryOpenApp(instagramUrl, text);

        } else {
            // Desktop fallback
            this.instagramFallback(text);
        }
    }

    // Helper method to try opening the app with fallback
    tryOpenApp(appUrl, text) {
        const startTime = Date.now();
        const timeout = 2000; // 2 seconds

        // Track if user left the page (app opened)
        let appOpened = false;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                appOpened = true;
                clearTimeout(fallbackTimer);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Set up fallback timer
        const fallbackTimer = setTimeout(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (!appOpened) {
                this.instagramFallback(text);
            }
        }, timeout);

        // Try to open the app
        try {
            // Method 1: Try window.location (works better on iOS)
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                window.location.href = appUrl;
            } else {
                // Method 2: Try window.open (works better on Android)
                const newWindow = window.open(appUrl, '_blank');
                // Check if window opened (indicates app didn't launch)
                setTimeout(() => {
                    if (newWindow && !newWindow.closed) {
                        newWindow.close();
                        if (!appOpened) {
                            this.instagramFallback(text);
                        }
                    }
                }, 1000);
            }
        } catch (error) {
            console.log('Error opening Instagram app:', error);
            this.instagramFallback(text);
        }
    }

    // Improved fallback when Instagram app can't be opened
    instagramFallback(text) {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            // On mobile, open Instagram website
            const instagramWebUrl = 'https://www.instagram.com/';
            window.open(instagramWebUrl, '_blank');

            // Show helpful instruction
            setTimeout(() => {
                const message = this.t('share.instagram_instruction_mobile');
                this.showCustomMessage(message, 6000);
            }, 1000);
        } else {
            // On desktop, just show instructions
            const message = this.t('share.instagram_instruction_desktop');
            this.showCustomMessage(message, 5000);
        }
    }

    // Enhanced custom message display
    showCustomMessage(message, duration = 3000) {
        // Remove any existing messages first
        const existingMessages = document.querySelectorAll('.custom-share-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = 'custom-share-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #c1e4c3;
            border: 3px solid #000;
            border-radius: 15px;
            padding: 25px 30px;
            box-shadow: 10px 10px 0px 0px rgb(0, 0, 0);
            z-index: 2000;
            font-size: 1rem;
            font-weight: bold;
            color: #2d3436;
            max-width: 85vw;
            text-align: center;
            line-height: 1.6;
            white-space: pre-line;
            animation: slideInScale 0.3s ease-out;
            font-family: "Caviardreams", Arial, sans-serif;
        `;

        // Add animation styles if not already present
        if (!document.getElementById('custom-message-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-message-styles';
            style.textContent = `
                @keyframes slideInScale {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Auto remove after duration
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                messageDiv.style.animation = 'slideInScale 0.3s ease-out reverse';
                setTimeout(() => {
                    if (document.body.contains(messageDiv)) {
                        document.body.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, duration);

        // Allow manual close by clicking
        messageDiv.addEventListener('click', () => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        });
    }

    // Helper method to copy to clipboard with better error handling
    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(resolve)
                    .catch(reject);
            } else {
                // Fallback method for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful) {
                        resolve();
                    } else {
                        reject(new Error('Copy command failed'));
                    }
                } catch (err) {
                    document.body.removeChild(textArea);
                    reject(err);
                }
            }
        });
    }

    shareToFacebook() {
        const currentUrl = window.location.href;
        const shareText = this.t('share.share_text');

        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;

        window.open(facebookUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
    }

    shareToTwitter() {
        const currentUrl = window.location.href;
        const shareText = this.t('share.share_text');

        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;

        window.open(twitterUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
    }

    shareToLine() {
        const currentUrl = window.location.href;
        const shareText = this.t('share.share_text');

        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

        window.open(lineUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
    }

    // Load recipes and medals data
    async loadData() {
        try {
            // Load recipes data directly
            this.recipes = [
                { "id": 0, "name": "Pasta Carbonara", "description": "A rich, creamy pasta with bacon and cheese.", "imagePath": "images/dishes/pasta_carbonara.png", "category": "PASTA", "necessaryIngredient": "SPAGHETTI", "optionalIngredient": "EGG", "farm": "LIVESTOCK", "nutrition": ["PROTEIN"] },
                { "id": 1, "name": "Vongole Bianco", "description": "A simple pasta bursting with the flavor of clams.", "imagePath": "images/dishes/vongole_bianco.png", "category": "PASTA", "necessaryIngredient": "SPAGHETTI", "optionalIngredient": "SHELLFISH", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 2, "name": "Pasta Napolitana", "description": "A pasta with the perfect bland of tomato sweetness and sausage flavor.", "imagePath": "images/dishes/pasta_napolitana.png", "category": "PASTA", "necessaryIngredient": "SPAGHETTI", "optionalIngredient": "TOMATO", "farm": "VEGETABLES", "nutrition": ["VITAMINS"] },
                { "id": 3, "name": "Spinach Cream Pasta", "description": "A creamy pasta with the aroma of spinach and bacon.", "imagePath": "images/dishes/spinach_cream_pasta.png", "category": "PASTA", "necessaryIngredient": "SPAGHETTI", "optionalIngredient": "SPINACH", "farm": "VEGETABLES", "nutrition": ["VITAMINS"] },
                { "id": 4, "name": "Tuna Sushi", "description": "Sushi made with fresh tuna.", "imagePath": "images/dishes/tuna_sushi.png", "category": "SUSHI", "necessaryIngredient": "RICE", "optionalIngredient": "TUNA", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 5, "name": "Shrimp Sushi", "description": "Sushi made with plump shrimp.", "imagePath": "images/dishes/shrimp_sushi.png", "category": "SUSHI", "necessaryIngredient": "RICE", "optionalIngredient": "SHRIMP", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 6, "name": "Shellfish Sushi", "description": "Sushi made with fresh, crunchy shellfish.", "imagePath": "images/dishes/shellfish_sushi.png", "category": "SUSHI", "necessaryIngredient": "RICE", "optionalIngredient": "SHELLFISH", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 7, "name": "Egg Sushi", "description": "Sushi made with fluffy, slightly sweet omelet.", "imagePath": "images/dishes/egg_sushi.png", "category": "SUSHI", "necessaryIngredient": "RICE", "optionalIngredient": "EGG", "farm": "LIVESTOCK", "nutrition": ["PROTEIN"] },
                { "id": 8, "name": "BLT Sandwich", "description": "A luxurious sandwich with bacon, lettuce, and tomato.", "imagePath": "images/dishes/blt_sandwich.png", "category": "SANDWICH", "necessaryIngredient": "BREAD", "optionalIngredient": "TOMATO", "farm": "VEGETABLES", "nutrition": ["VITAMINS"] },
                { "id": 9, "name": "Egg Sandwich", "description": "A sandwich with fluffy, creamy egg filling.", "imagePath": "images/dishes/egg_sandwich.png", "category": "SANDWICH", "necessaryIngredient": "BREAD", "optionalIngredient": "EGG", "farm": "LIVESTOCK", "nutrition": ["PROTEIN"] },
                { "id": 10, "name": "Tuna Sandwich", "description": "A sandwich with rich, creamy tuna filling.", "imagePath": "images/dishes/tuna_sandwich.png", "category": "SANDWICH", "necessaryIngredient": "BREAD", "optionalIngredient": "TUNA", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 11, "name": "Pork Cutlet Sandwich", "description": "A sandwich with a crispy, extra-thick pork cutlet.", "imagePath": "images/dishes/pork_cutlet_sandwich.png", "category": "SANDWICH", "necessaryIngredient": "BREAD", "optionalIngredient": "MEAT", "farm": "LIVESTOCK", "nutrition": ["PROTEIN"] },
                { "id": 12, "name": "Chili Bean Tacos", "description": "A taco packed with the rich flavor of beans.", "imagePath": "images/dishes/chili_bean_tacos.png", "category": "TACOS", "necessaryIngredient": "CORN", "optionalIngredient": "BEANS", "farm": "VEGETABLES", "nutrition": ["PROTEIN", "VITAMINS"] },
                { "id": 13, "name": "Cholizo Tacos", "description": "A spicy taco with cholizo sausage.", "imagePath": "images/dishes/cholizo_tacos.png", "category": "TACOS", "necessaryIngredient": "CORN", "optionalIngredient": "MEAT", "farm": "LIVESTOCK", "nutrition": ["PROTEIN"] },
                { "id": 14, "name": "Tuna Tacos", "description": "A taco with the perfect match of tuna and avocado.", "imagePath": "images/dishes/tuna_tacos.png", "category": "TACOS", "necessaryIngredient": "CORN", "optionalIngredient": "TUNA", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 15, "name": "Vegetable Tacos", "description": "A healthy taco with spinach dough and plenty of vegetables.", "imagePath": "images/dishes/vegetable_tacos.png", "category": "TACOS", "necessaryIngredient": "CORN", "optionalIngredient": "SPINACH", "farm": "VEGETABLES", "nutrition": ["VITAMINS"] },
                { "id": 16, "name": "Shrimp Curry", "description": "A curry with the rich flavor of shrimp.", "imagePath": "images/dishes/shrimp_curry.png", "category": "CURRY", "necessaryIngredient": "HOT_PEPPER", "optionalIngredient": "SHRIMP", "farm": "SEAFOOD", "nutrition": ["PROTEIN"] },
                { "id": 17, "name": "Chickpea Curry", "description": "Rich and flavorful spicy chickpea curry.", "imagePath": "images/dishes/chickpea_curry.png", "category": "CURRY", "necessaryIngredient": "HOT_PEPPER", "optionalIngredient": "BEANS", "farm": "VEGETABLES", "nutrition": ["PROTEIN", "VITAMINS"] },
                { "id": 18, "name": "Butter Chicken Curry", "description": "A fragrant curry with the aroma of butter.", "imagePath": "images/dishes/butter_chicken_curry.png", "category": "CURRY", "necessaryIngredient": "HOT_PEPPER", "optionalIngredient": "MEAT", "farm": "LIVESTOCK", "nutrition": ["PROTEIN"] },
                { "id": 19, "name": "Spinach Cheese Curry", "description": "An Indian-style curry with the rich aroma of spinach and cheese.", "imagePath": "images/dishes/spinach_cheese_curry.png", "category": "CURRY", "necessaryIngredient": "HOT_PEPPER", "optionalIngredient": "SPINACH", "farm": "VEGETABLES", "nutrition": ["VITAMINS"] }
            ];

            // Load medals data
            this.medals = [
                { "id": "FOCUSED_ON_VARIETY", "name": "Focused on Variety", "description": "So, many ingredients! Your table has become colorful!", "imagePath": "images/medals/medal_focused_on_variety.png" },
                { "id": "NUTRITIONALLY_BALANCED", "name": "Nutritionally Balanced", "description": "Balanced meal: Carbs, Protein, and Vitamins", "imagePath": "images/medals/medal_nutritionally_balanced.png" },
                { "id": "BODY_BUILDER", "name": "Body Builder", "description": "You're swole from all that muscle food!", "imagePath": "images/medals/medal_body_builder.png" },
                { "id": "HEALTHY_FLOW", "name": "Healthy Flow", "description": "With all those veggies, your blood must be super smooth!", "imagePath": "images/medals/medal_super_healthy.png" },
                { "id": "PASTA_MAESTRO", "name": "Pasta Maestro", "description": "The paste wizard is born!", "imagePath": "images/medals/medal_pasta_maestro.png" },
                { "id": "SUSHI_CHEF", "name": "Sushi Chef", "description": "A true artisan who has mastered sushi!", "imagePath": "images/medals/medal_sushi_chef.png" },
                { "id": "SANDWICH_EARL", "name": "Sandwich Earl", "description": "Even Mr. Sandwich (John Montagu) would be surprised-what a noble palate!", "imagePath": "images/medals/medal_sandwich_earl.png" },
                { "id": "TACO_ESTETA", "name": "Taco Esteta", "description": "A gourmet of tacos. You wear that sombrero well!", "imagePath": "images/medals/medal_taco_esteta.png" },
                { "id": "CURRY_MAHARAJA", "name": "Curry Maharaja", "description": "You've built a kingdom of aromatic species!", "imagePath": "images/medals/medal_curry_maharaja.png" },
                { "id": "SELECTIVE_EATER", "name": "Selective Eater", "description": "That dedication to single-mindedly pursuing one flavor-so admirable!", "imagePath": "images/medals/medal_selective_eater.png" },
                { "id": "FISHERMAN", "name": "Fisherman", "description": "A true fisherman who knows all the blessings of the sea!", "imagePath": "images/medals/medal_fisherman.png" },
                { "id": "FARMER", "name": "Farmer", "description": "The strength of a farmer who lives with the soil has reaches your table!", "imagePath": "images/medals/medal_farmer.png" },
                { "id": "LIVESTOCK_FARMER", "name": "Livestock Farmer", "description": "A livestock farmer raising animals with a lots of love!", "imagePath": "images/medals/medal_livestock_farmer.png" },
                { "id": "HUMPTY_DUMPTY", "name": "Humpty Dumpty", "description": "An egg lover that would surprise even the always-smiling Humpty Dumpty!", "imagePath": "images/medals/medal_humpty_dumpty.png" },
                { "id": "MAES_TORO", "name": "Maes'Toro", "description": "Maes'Toro, master of tuna, wins thunderous applause again today!", "imagePath": "images/medals/medal_maes_toro.png" },
                { "id": "POPEYE", "name": "Popeye", "description": "Like power-packed Popeye, your nutrition is fully charged!", "imagePath": "images/medals/medal_popeye.png" },
                { "id": "COWBOY", "name": "Cowboy", "description": "Like a cowboy riding the wilds, an adventurer in pursuit of freedom and flavor!", "imagePath": "images/medals/medal_cowboy.png" },
                { "id": "QUICK_DECISION_MAKER", "name": "Quick Decision Maker", "description": "Amazing decision-making speed! You never hesitate, even in a pinch!", "imagePath": "images/medals/medal_quick_decision_maker.png" },
                { "id": "LAID_BACK_AND_STEADY", "name": "Laid Back and Steady", "description": "Controlling life at your own pace-now that's cool!", "imagePath": "images/medals/medal_laidback_and_steady.png" },
                { "id": "UNIQUE_PALATE", "name": "Unique Palate", "description": "Your sense of taste is one of a kind!", "imagePath": "images/medals/medal_unique_palate.png" },
                { "id": "REFINED_PALATE", "name": "Refined Palate", "description": "Oh, traveler with a refined palate, your tongue is truly first-class!", "imagePath": "images/medals/medal_refined_palate.png" }
            ];

        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    // Parse URL parameters to extract game results
    parseURLParameters() {
        console.log('🔍 DETAILED URL PARSING DEBUG');
        console.log('window.location.href:', window.location.href);
        console.log('window.location.search:', window.location.search);
        console.log('window.location.search length:', window.location.search.length);

        // Try manual parsing first
        const searchString = window.location.search;
        console.log('Raw search string:', JSON.stringify(searchString));

        // Check if we have any search parameters at all
        if (searchString.length === 0) {
            console.error('❌ NO SEARCH PARAMETERS FOUND!');
            console.log('Current full URL:', window.location.href);
            console.log('Expected format: yourpage.html?id=TestUser&dishes=0,4,16&time=45&count=1');
        }

        const urlParams = new URLSearchParams(window.location.search);
        console.log('URLSearchParams object:', urlParams);

        // Debug each parameter individually
        console.log('🎯 Testing each parameter:');
        const idParam = urlParams.get('id');
        console.log('  id parameter:', JSON.stringify(idParam));
        console.log('  id parameter type:', typeof idParam);
        console.log('  id parameter === null:', idParam === null);

        const dishesParam = urlParams.get('dishes');
        console.log('  dishes parameter:', JSON.stringify(dishesParam));

        const timeParam = urlParams.get('time');
        console.log('  time parameter:', JSON.stringify(timeParam));

        const countParam = urlParams.get('count');
        console.log('  count parameter:', JSON.stringify(countParam));

        // Show all available parameters
        console.log('🗂️ All available parameters:');
        let paramCount = 0;
        for (let [key, value] of urlParams.entries()) {
            console.log(`  ${key}: "${value}"`);
            paramCount++;
        }
        console.log(`Total parameters found: ${paramCount}`);

        // Alternative parsing method
        console.log('🔄 Alternative parsing test:');
        if (window.location.search.length > 0) {
            const params = new URLSearchParams(window.location.search.substring(1));
            console.log('Alternative id:', params.get('id'));
        }

        // Manual string parsing as backup
        if (window.location.search.includes('id=')) {
            const match = window.location.search.match(/[?&]id=([^&]*)/);
            console.log('Manual regex match for id:', match ? match[1] : 'no match');
        }

        // Extract parameters
        this.currentResults.userId = idParam || 'Unknown';
        console.log('🎯 FINAL userId set to:', this.currentResults.userId);

        this.currentResults.dishIds = dishesParam ?
            dishesParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        console.log('🎯 FINAL dishIds set to:', this.currentResults.dishIds);

        this.currentResults.remainingTime = parseInt(timeParam) || 0;
        this.currentResults.errorCount = parseInt(countParam) || 0;

        console.log('🏁 FINAL RESULTS:', this.currentResults);
        console.log('=== END URL PARSING DEBUG ===');

        if (this.currentResults.dishIds.length === 0) {
            console.warn('⚠️ No valid dish IDs found');
        }
    }

    // Display the game results
    displayResults() {
        console.log('Displaying results for dishes:', this.currentResults.dishIds);

        // Apply translations to static elements
        this.applyTranslations();

        // Update user ID
        this.updateUserId();

        // Display dishes and medals
        this.displayDishes();
        this.displayMedals();
    }

    // Update user ID with translation
    updateUserId() {
        const userIdElement = document.querySelector('.user-id');
        if (userIdElement) {
            const translatedText = this.t('header.user_id', { userId: this.currentResults.userId });
            userIdElement.textContent = translatedText;
        }
    }

    // Display dishes
    displayDishes() {
        const dishesGrid = document.querySelector('.dishes-grid');
        if (!dishesGrid) return;

        dishesGrid.innerHTML = '';

        const playerRecipes = this.getPlayerRecipes();

        if (playerRecipes.length === 0) {
            this.showNoDishesMessage(dishesGrid);
            return;
        }

        playerRecipes.forEach(recipe => {
            const dishElement = this.createDishElement(recipe);
            dishesGrid.appendChild(dishElement);
        });
    }

    // Get player recipes
    getPlayerRecipes() {
        return this.currentResults.dishIds
            .map(dishId => this.recipes.find(recipe => recipe.id === dishId))
            .filter(recipe => recipe !== undefined);
    }

    // Create dish element with localized content
    createDishElement(recipe) {
        const dishItem = document.createElement('div');
        dishItem.className = 'dish-item';

        // Get localized name and description
        const localizedRecipe = this.translations[this.currentLanguage].recipes[recipe.id];
        const dishName = localizedRecipe ? localizedRecipe.name : recipe.name;

        dishItem.innerHTML = `
            <div class="dish-circle">
                <img src="${recipe.imagePath}" alt="${dishName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="placeholder-text" style="display: none;">Dish Image</span>
            </div>
            <div class="dish-name">${dishName}</div>
        `;

        dishItem.addEventListener('click', () => {
            this.showRecipeModal(recipe);
        });

        return dishItem;
    }

    // Show recipe modal with localized content
    showRecipeModal(recipe) {
        const modal = document.getElementById('recipe-modal');
        const modalIngredientsContainer = document.getElementById('modal-ingredients');

        // Get localized content
        const localizedRecipe = this.translations[this.currentLanguage].recipes[recipe.id];
        const dishName = localizedRecipe ? localizedRecipe.name : recipe.name;
        const dishDescription = localizedRecipe ? localizedRecipe.description : recipe.description;

        document.getElementById('modal-image').src = recipe.imagePath;
        document.getElementById('modal-image').alt = dishName;
        document.getElementById('modal-title').textContent = dishName;
        document.getElementById('modal-description').textContent = dishDescription || this.t('messages.noDescription');

        // Add ingredients
        modalIngredientsContainer.innerHTML = this.createIngredientsHTML(recipe);

        modal.classList.add('show');

        // Close modal handlers
        modal.querySelector('.close-btn').onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    // Create ingredients HTML with translations
    createIngredientsHTML(recipe) {
        const necessaryIngredient = recipe.necessaryIngredient;
        const optionalIngredient = recipe.optionalIngredient;

        let ingredientsHTML = '';

        if (necessaryIngredient) {
            const displayName = this.t(`ingredients.${necessaryIngredient}`);
            ingredientsHTML += `
                <div class="ingredient-item">
                    <img src="${this.getIngredientImagePath(necessaryIngredient)}" 
                         alt="${necessaryIngredient}" 
                         class="ingredient-image"
                         onerror="this.style.display='none';">
                    <div class="ingredient-label">${displayName}</div>
                </div>
            `;
        }

        if (necessaryIngredient && optionalIngredient) {
            ingredientsHTML += '<div class="plus-icon">+</div>';
        }

        if (optionalIngredient) {
            const displayName = this.t(`ingredients.${optionalIngredient}`);
            ingredientsHTML += `
                <div class="ingredient-item">
                    <img src="${this.getIngredientImagePath(optionalIngredient)}" 
                         alt="${optionalIngredient}" 
                         class="ingredient-image"
                         onerror="this.style.display='none';">
                    <div class="ingredient-label">${displayName}</div>
                </div>
            `;
        }

        return ingredientsHTML;
    }

    // Get ingredient image path
    getIngredientImagePath(ingredient) {
        const ingredientMap = {
            'SPAGHETTI': 'spaghetti', 'RICE': 'rice', 'BREAD': 'bread', 'CORN': 'corn',
            'EGG': 'egg', 'SHELLFISH': 'shellfish', 'TOMATO': 'tomato', 'SPINACH': 'spinach',
            'TUNA': 'tuna', 'SHRIMP': 'shrimp', 'MEAT': 'meat', 'BEANS': 'beans', 'HOT_PEPPER': 'hot_pepper'
        };

        const fileName = ingredientMap[ingredient] || ingredient.toLowerCase();
        return `images/ingredients/${fileName}.png`;
    }

    // Show no dishes message
    showNoDishesMessage(container) {
        const noDishesText = this.t('messages.noDishes');
        const keepTryingText = this.t('messages.keepTrying');

        container.innerHTML = `
            <div class="dish-item">
                <div class="dish-circle">
                    <span class="placeholder-text">${noDishesText}</span>
                </div>
                <div class="dish-name">${keepTryingText}</div>
            </div>
        `;
    }

    // Display medals
    displayMedals() {
        const medalsGrid = document.querySelector('.medals-grid');
        if (!medalsGrid) return;

        const earnedMedals = this.calculateEarnedMedals();
        medalsGrid.innerHTML = '';

        if (earnedMedals.length === 0) {
            this.showNoMedalsMessage(medalsGrid);
            return;
        }

        earnedMedals.forEach(medal => {
            const medalElement = this.createMedalElement(medal);
            medalsGrid.appendChild(medalElement);
        });
    }

    // Calculate earned medals
    calculateEarnedMedals() {
        const playerRecipes = this.getPlayerRecipes();
        const { remainingTime, errorCount } = this.currentResults;

        return this.medals.filter(medal => {
            return this.checkMedalCondition(medal, playerRecipes, remainingTime, errorCount);
        });
    }

    // Check medal conditions
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

    // Create medal element with localized content
    createMedalElement(medal) {
        const medalItem = document.createElement('div');
        medalItem.className = 'medal-item';

        // Get localized medal name
        const localizedMedal = this.translations[this.currentLanguage].medals[medal.id];
        const medalName = localizedMedal ? localizedMedal.name : medal.name;

        medalItem.innerHTML = `
            <div class="medal-circle">
                <img src="${medal.imagePath}" alt="${medalName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="placeholder-text" style="display: none;">Medal Image</span>
            </div>
            <div class="medal-name">${medalName}</div>
        `;

        medalItem.addEventListener('click', () => {
            this.showMedalModal(medal);
        });

        return medalItem;
    }

    // Show medal modal with localized content
    showMedalModal(medal) {
        const modal = document.getElementById('recipe-modal');
        const modalIngredientsContainer = document.getElementById('modal-ingredients');

        // Get localized content
        const localizedMedal = this.translations[this.currentLanguage].medals[medal.id];
        const medalName = localizedMedal ? localizedMedal.name : medal.name;
        const medalDescription = localizedMedal ? localizedMedal.description : medal.description;

        document.getElementById('modal-image').src = medal.imagePath;
        document.getElementById('modal-image').alt = medalName;
        document.getElementById('modal-title').textContent = medalName;
        document.getElementById('modal-description').textContent = medalDescription || "Congratulations on earning this medal!";

        // Clear ingredients for medals
        modalIngredientsContainer.innerHTML = '';

        modal.classList.add('show');

        // Close modal handlers
        modal.querySelector('.close-btn').onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    // Show no medals message
    showNoMedalsMessage(container) {
        const noMedalsText = this.t('messages.noMedals');
        const keepTryingText = this.t('messages.keepTrying');

        container.innerHTML = `
            <div class="medal-item">
                <div class="medal-circle">
                    <span class="placeholder-text">${noMedalsText}</span>
                </div>
                <div class="medal-name">${keepTryingText}</div>
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameResults = new GameResults();
});

// Debug function to test with sample data
function testWithSampleData() {
    console.log('🎮 Setting up test data...');
    window.history.replaceState({}, '', `${window.location.pathname}?id=TestUser&dishes=0,4,16&time=45&count=1`);
    console.log('✅ URL updated to:', window.location.href);
    console.log('🔄 Reloading page...');
    location.reload();
}

// Helper function to show current URL status
function checkURLStatus() {
    console.log('=== URL STATUS CHECK ===');
    console.log('Current URL:', window.location.href);
    console.log('Has parameters:', window.location.search.length > 0);

    const urlParams = new URLSearchParams(window.location.search);
    console.log('Parameters found:');
    for (let [key, value] of urlParams.entries()) {
        console.log(`  ${key}: ${value}`);
    }
    console.log('=== END STATUS CHECK ===');
}