// Language and Font Manager

class LanguageManager {
    constructor() {
        this.currentLanguage = 'ar'; // Default to Arabic
        this.fonts = {
            ar: 'Cairo',
            en: 'Inter'
        };
        this.translations = {};
        this.init();
    }

    async init() {
        console.log('Initializing LanguageManager...');
        
        try {
            // Load translations first
            await this.loadTranslations();
            
            // Check if translations loaded successfully
            if (!this.isTranslationsLoaded()) {
                throw new Error('Failed to load translations');
            }
            
            this.setupLanguageSwitcher();
            this.loadSavedLanguage();
            this.applyLanguage(this.currentLanguage);
            this.updateCheckboxes(this.currentLanguage);
            
            console.log('LanguageManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize LanguageManager:', error);
            // You can add a user-friendly error message here if needed
        }
    }

    async loadTranslations() {
        try {
            console.log('Loading translation files...');
            
            const [arResponse, enResponse] = await Promise.all([
                fetch('assets/translations/ar.json'),
                fetch('assets/translations/en.json')
            ]);
            
            if (!arResponse.ok || !enResponse.ok) {
                throw new Error('Failed to load translation files');
            }
            
            this.translations.ar = await arResponse.json();
            this.translations.en = await enResponse.json();
            
            console.log('Translation files loaded successfully:', this.translations);
        } catch (error) {
            console.error('Error loading translations:', error);
            throw error; // Re-throw the error to handle it properly
        }
    }

    setupLanguageSwitcher() {
        // Handle language checkboxes in dropdown
        const arabicCheckbox = document.getElementById('arabicCheckbox');
        const englishCheckbox = document.getElementById('englishCheckbox');
        
        if (arabicCheckbox) {
            arabicCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (englishCheckbox) englishCheckbox.checked = false;
                    this.changeLanguage('ar');
                }
            });
        }
        
        if (englishCheckbox) {
            englishCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (arabicCheckbox) arabicCheckbox.checked = false;
                    this.changeLanguage('en');
                }
            });
        }

        // Handle clicking on language labels
        document.querySelectorAll('.image_navbar_langge').forEach(label => {
            label.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const checkbox = label.querySelector('input[type="checkbox"]') || 
                               document.getElementById(label.getAttribute('for'));
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });

        // Handle clicking on dropdown items (entire row)
        document.querySelectorAll('.dropdown-item[data-language]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const language = item.getAttribute('data-language');
                if (language === 'ar') {
                    if (arabicCheckbox) arabicCheckbox.checked = true;
                    if (englishCheckbox) englishCheckbox.checked = false;
                    this.changeLanguage('ar');
                } else if (language === 'en') {
                    if (arabicCheckbox) arabicCheckbox.checked = false;
                    if (englishCheckbox) englishCheckbox.checked = true;
                    this.changeLanguage('en');
                }
            });
        });

        // Handle clicking on offcanvas language options
        document.querySelectorAll('.language-option[data-language]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const language = item.getAttribute('data-language');
                if (language === 'ar') {
                    if (arabicCheckbox) arabicCheckbox.checked = true;
                    if (englishCheckbox) englishCheckbox.checked = false;
                    this.changeLanguage('ar');
                } else if (language === 'en') {
                    if (arabicCheckbox) arabicCheckbox.checked = false;
                    if (englishCheckbox) englishCheckbox.checked = true;
                    this.changeLanguage('en');
                }
            });
        });

        // Handle flag dropdown (if exists)
        document.querySelectorAll('.dropdown-item[data-flag]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const flag = e.currentTarget.dataset.flag;
                const code = e.currentTarget.dataset.code;
                
                if (code === 'SA') {
                    this.changeLanguage('ar');
                } else if (code === 'US') {
                    this.changeLanguage('en');
                }
                
                this.updateFlagDisplay(flag, code);
            });
        });
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.saveLanguage();
        this.applyLanguage(lang);
        this.updateUI(lang);
        this.updateLanguageDropdown(lang);
    }

    updateLanguageDropdown(lang) {
        // Force update of language dropdown text
        const translations = this.translations[lang];
        if (!translations || !translations.language) {
            console.error('No language translations found for:', lang);
            return;
        }
        
        // Update dropdown text immediately using the t() method
        const arabicText = this.t('language.arabic', lang);
        const englishText = this.t('language.english', lang);
        
        const arabicSpans = document.querySelectorAll('[data-translate="language.arabic"]');
        const englishSpans = document.querySelectorAll('[data-translate="language.english"]');
        
        arabicSpans.forEach(span => {
            span.textContent = arabicText;
        });
        
        englishSpans.forEach(span => {
            span.textContent = englishText;
        });
        
        // Update checkboxes based on selected language
        this.updateCheckboxes(lang);
        
        // Force re-render of dropdown
        const dropdown = document.querySelector('.h_langage_change');
        if (dropdown) {
            dropdown.style.display = 'none';
            setTimeout(() => {
                dropdown.style.display = '';
            }, 10);
        }
    }

    updateCheckboxes(lang) {
        const arabicCheckbox = document.getElementById('arabicCheckbox');
        const englishCheckbox = document.getElementById('englishCheckbox');
        
        if (arabicCheckbox && englishCheckbox) {
            // Remove checked attribute from both first
            arabicCheckbox.checked = false;
            englishCheckbox.checked = false;
            
            // Then set the correct one
            if (lang === 'ar') {
                arabicCheckbox.checked = true;
            } else {
                englishCheckbox.checked = true;
            }
            
            // Force CSS update
            arabicCheckbox.style.display = 'none';
            englishCheckbox.style.display = 'none';
            setTimeout(() => {
                arabicCheckbox.style.display = '';
                englishCheckbox.style.display = '';
            }, 10);
        }
    }

    applyLanguage(lang) {
        const html = document.documentElement;
        const body = document.body;

        // Update HTML attributes
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update font family
        const fontFamily = this.fonts[lang];
        body.style.fontFamily = fontFamily + ', sans-serif';

        // Update CSS variables
        document.documentElement.style.setProperty('--font-primary', fontFamily + ', sans-serif');

        // Update meta tags
        this.updateMetaTags(lang);

        // Update text content
        this.updateTextContent(lang);
    }

    updateMetaTags(lang) {
        const translations = this.translations[lang];
        if (!translations) return;

        // Update title
        document.title = translations.meta.title;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = translations.meta.description;

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = translations.meta.keywords;
    }

    updateTextContent(lang) {
        const translations = this.translations[lang];
        if (!translations) {
            console.error('No translations found for language:', lang);
            return;
        }
        
        // Update navigation
        this.updateElementText('[data-translate="nav.home"]', translations.navigation?.home);
        this.updateElementText('[data-translate="nav.categories"]', translations.navigation?.categories);
        this.updateElementText('[data-translate="nav.about"]', translations.navigation?.about);
        this.updateElementText('[data-translate="nav.gallery"]', translations.navigation?.gallery);
        this.updateElementText('[data-translate="nav.blog"]', translations.navigation?.blog);
        this.updateElementText('[data-translate="nav.contact"]', translations.navigation?.contact);
        this.updateElementText('[data-translate="nav.orderHelp"]', translations.navigation?.orderHelp);
        this.updateElementText('[data-translate="nav.close"]', translations.navigation?.close);
        this.updateElementText('[data-translate="nav.myAccount"]', translations.navigation?.myAccount);
        this.updateElementText('[data-translate="nav.myOrders"]', translations.navigation?.myOrders);
        this.updateElementText('[data-translate="nav.logout"]', translations.navigation?.logout);

        // Update hero section
        this.updateElementText('[data-translate="hero.title"]', translations.hero.title);
        this.updateElementText('[data-translate="hero.subtitle"]', translations.hero.subtitle);
        this.updateElementText('[data-translate="hero.browsePackages"]', translations.hero.browsePackages);
        this.updateElementText('[data-translate="hero.orderNow"]', translations.hero.orderNow);
        this.updateElementText('[data-translate="hero.previous"]', translations.hero.previous);
        this.updateElementText('[data-translate="hero.next"]', translations.hero.next);

        // Update steps section
        this.updateElementText('[data-translate="steps.title"]', translations.steps.title);
        this.updateElementText('[data-translate="steps.step1.title"]', translations.steps.step1.title);
        this.updateElementText('[data-translate="steps.step1.description"]', translations.steps.step1.description);
        this.updateElementText('[data-translate="steps.step2.title"]', translations.steps.step2.title);
        this.updateElementText('[data-translate="steps.step2.description"]', translations.steps.step2.description);
        this.updateElementText('[data-translate="steps.step3.title"]', translations.steps.step3.title);
        this.updateElementText('[data-translate="steps.step3.description"]', translations.steps.step3.description);
        this.updateElementText('[data-translate="steps.step4.title"]', translations.steps.step4.title);
        this.updateElementText('[data-translate="steps.step4.description"]', translations.steps.step4.description);
        this.updateElementText('[data-translate="steps.step5.title"]', translations.steps.step5.title);
        this.updateElementText('[data-translate="steps.step5.description"]', translations.steps.step5.description);

        // Update about section
        this.updateElementText('[data-translate="about.title"]', translations.about.title);
        this.updateElementText('[data-translate="about.heading"]', translations.about.heading);
        this.updateElementText('[data-translate="about.description"]', translations.about.description);
        this.updateElementText('[data-translate="about.features.timeSaving"]', translations.about.features.timeSaving);
        this.updateElementText('[data-translate="about.features.costSaving"]', translations.about.features.costSaving);
        this.updateElementText('[data-translate="about.features.readyDelivery"]', translations.about.features.readyDelivery);
        this.updateElementText('[data-translate="about.cta"]', translations.about.cta);

        // Update form section
        this.updateElementText('[data-translate="form.title"]', translations.form.title);
        this.updateElementText('[data-translate="form.subtitle"]', translations.form.subtitle);
        this.updateElementText('[data-translate="form.unitType"]', translations.form.unitType);
        this.updateElementText('[data-translate="form.finishPattern"]', translations.form.finishPattern);
        this.updateElementText('[data-translate="form.designNeed"]', translations.form.designNeed);
        this.updateElementText('[data-translate="form.colorHelp"]', translations.form.colorHelp);
        this.updateElementText('[data-translate="form.submit"]', translations.form.submit);

        // Update form options
        this.updateSelectOptions('[data-translate="form.unitTypes.studio"]', translations.form.unitTypes.studio);
        this.updateSelectOptions('[data-translate="form.unitTypes.oneRoom"]', translations.form.unitTypes.oneRoom);
        this.updateSelectOptions('[data-translate="form.unitTypes.twoRooms"]', translations.form.unitTypes.twoRooms);
        this.updateSelectOptions('[data-translate="form.unitTypes.unknown"]', translations.form.unitTypes.unknown);

        // Update packages section
        this.updateElementText('[data-translate="packages.title"]', translations.packages.title);
        this.updateElementText('[data-translate="packages.subtitle"]', translations.packages.subtitle);
        this.updateElementText('[data-translate="packages.card.title"]', translations.packages.card.title);
        this.updateElementText('[data-translate="packages.card.pieces"]', translations.packages.card.pieces);
        this.updateElementText('[data-translate="packages.card.description"]', translations.packages.card.description);
        this.updateElementText('[data-translate="packages.card.startingFrom"]', translations.packages.card.startingFrom);
        this.updateElementText('[data-translate="packages.card.includes"]', translations.packages.card.includes);
        this.updateElementText('[data-translate="packages.card.availableColors"]', translations.packages.card.availableColors);
        this.updateElementText('[data-translate="packages.card.executionTime"]', translations.packages.card.executionTime);
        this.updateElementText('[data-translate="packages.card.service"]', translations.packages.card.service);
        this.updateElementText('[data-translate="packages.card.paymentPlan"]', translations.packages.card.paymentPlan);
        this.updateElementText('[data-translate="packages.card.decoration"]', translations.packages.card.decoration);
        this.updateElementText('[data-translate="packages.card.sendPrice"]', translations.packages.card.sendPrice);
        this.updateElementText('[data-translate="packages.card.viewDetails"]', translations.packages.card.viewDetails);
        this.updateElementText('[data-translate="packages.card.readyForDelivery"]', translations.packages.card.readyForDelivery);

        // Update process section
        this.updateElementText('[data-translate="process.title"]', translations.process.title);
        this.updateElementText('[data-translate="process.subtitle"]', translations.process.subtitle);
        this.updateElementText('[data-translate="process.cta"]', translations.process.cta);
        this.updateElementText('[data-translate="process.orderStatus.title"]', translations.process.orderStatus.title);
        this.updateElementText('[data-translate="process.orderStatus.status"]', translations.process.orderStatus.status);

        // Update why us section
        this.updateElementText('[data-translate="whyUs.title"]', translations.whyUs.title);
        this.updateElementText('[data-translate="whyUs.subtitle"]', translations.whyUs.subtitle);

        // Update order tracking section
        this.updateElementText('[data-translate="orderTracking.title"]', translations.orderTracking.title);
        this.updateElementText('[data-translate="orderTracking.subtitle"]', translations.orderTracking.subtitle);

        // Update CTA section
        this.updateElementText('[data-translate="cta.title"]', translations.cta.title);
        this.updateElementText('[data-translate="cta.subtitle"]', translations.cta.subtitle);
        this.updateElementText('[data-translate="cta.whatsapp"]', translations.cta.whatsapp);
        this.updateElementText('[data-translate="cta.orderNow"]', translations.cta.orderNow);

        // Update testimonials section
        this.updateElementText('[data-translate="testimonials.title"]', translations.testimonials.title);
        this.updateElementText('[data-translate="testimonials.subtitle"]', translations.testimonials.subtitle);

        // Update gallery section
        this.updateElementText('[data-translate="gallery.title"]', translations.gallery.title);
        this.updateElementText('[data-translate="gallery.subtitle"]', translations.gallery.subtitle);

        // Update FAQ section
        this.updateElementText('[data-translate="faq.title"]', translations.faq.title);
        this.updateElementText('[data-translate="faq.subtitle"]', translations.faq.subtitle);

        // Update footer section
        this.updateElementText('[data-translate="footer.vision"]', translations.footer.vision);
        this.updateElementText('[data-translate="footer.quickLinks"]', translations.footer.quickLinks);
        this.updateElementText('[data-translate="footer.contactInfo"]', translations.footer.contactInfo);
        this.updateElementText('[data-translate="footer.followUs"]', translations.footer.followUs);
        this.updateElementText('[data-translate="footer.copyright"]', translations.footer.copyright);

        // Update modal content
        this.updateElementText('[data-translate="modal.login"]', translations.modal.login);
        this.updateElementText('[data-translate="modal.register"]', translations.modal.register);
        this.updateElementText('[data-translate="modal.close"]', translations.modal.close);
        this.updateElementText('[data-translate="modal.form.fullName"]', translations.modal.form.fullName);
        this.updateElementText('[data-translate="modal.form.phone"]', translations.modal.form.phone);
        this.updateElementText('[data-translate="modal.form.email"]', translations.modal.form.email);
        this.updateElementText('[data-translate="modal.form.continue"]', translations.modal.form.continue);
        this.updateElementText('[data-translate="modal.form.search"]', translations.modal.form.search);

        // Update placeholders
        this.updatePlaceholders('[data-translate="modal.form.fullNamePlaceholder"]', translations.modal.form.fullNamePlaceholder);
        this.updatePlaceholders('[data-translate="modal.form.phonePlaceholder"]', translations.modal.form.phonePlaceholder);
        this.updatePlaceholders('[data-translate="modal.form.emailPlaceholder"]', translations.modal.form.emailPlaceholder);

        // Update language dropdown
        this.updateElementText('[data-translate="language.arabic"]', translations.language.arabic);
        this.updateElementText('[data-translate="language.english"]', translations.language.english);
    }

    updateElementText(selector, text) {
        if (!text) {
            console.warn('No text provided for selector:', selector);
            return;
        }
        
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn('No elements found for selector:', selector);
            return;
        }
        
        elements.forEach(element => {
            if (element) {
                element.textContent = text;
            }
        });
    }

    updateSelectOptions(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && text) {
                element.textContent = text;
            }
        });
    }

    updatePlaceholders(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && text) {
                element.placeholder = text;
            }
        });
    }

    updateFlagDisplay(flag, code) {
        const flagElement = document.getElementById('selected-flag');
        const codeElement = document.getElementById('selected-code');
        
        if (flagElement) {
            flagElement.className = `fi fi-${flag}`;
        }
        
        if (codeElement) {
            codeElement.textContent = code;
        }
    }

    updateUI(lang) {
        // Update RTL/LTR specific styles
        if (lang === 'ar') {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }

        // Update Bootstrap classes for RTL
        this.updateBootstrapRTL(lang);
    }

    updateBootstrapRTL(lang) {
        // Update Bootstrap classes for RTL support
        const rtlElements = document.querySelectorAll('[class*="me-"], [class*="ms-"]');
        
        rtlElements.forEach(element => {
            const classes = element.className.split(' ');
            classes.forEach(className => {
                if (className.startsWith('me-')) {
                    const newClass = className.replace('me-', lang === 'ar' ? 'ms-' : 'me-');
                    element.classList.remove(className);
                    element.classList.add(newClass);
                } else if (className.startsWith('ms-')) {
                    const newClass = className.replace('ms-', lang === 'ar' ? 'me-' : 'ms-');
                    element.classList.remove(className);
                    element.classList.add(newClass);
                }
            });
        });
    }

    saveLanguage() {
        localStorage.setItem('sofa-language', this.currentLanguage);
    }

    loadSavedLanguage() {
        const savedLanguage = localStorage.getItem('sofa-language');
        if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
            this.currentLanguage = savedLanguage;
        } else {
            // Default to Arabic if no saved language
            this.currentLanguage = 'ar';
            localStorage.setItem('sofa-language', 'ar');
        }
        
        // Update checkboxes - this will be handled by updateLanguageDropdown
        // which is called after applyLanguage
    }

    // Utility method to get translation by key
    t(key, lang = null) {
        const targetLang = lang || this.currentLanguage;
        const keys = key.split('.');
        let value = this.translations[targetLang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key} for language: ${targetLang}`);
                return key; // Return key if translation not found
            }
        }
        
        return value;
    }

    // Method to reload translations
    async reloadTranslations() {
        console.log('Reloading translations...');
        await this.loadTranslations();
        this.applyLanguage(this.currentLanguage);
    }

    // Method to check if translations are loaded
    isTranslationsLoaded() {
        return this.translations.ar && this.translations.en;
    }

    // Method to test translations
    testTranslations() {
        console.log('Testing translations...');
        console.log('Current language:', this.currentLanguage);
        console.log('Arabic translations:', this.translations.ar);
        console.log('English translations:', this.translations.en);
        
        // Test specific keys
        const testKeys = ['navigation.home', 'language.arabic', 'language.english'];
        testKeys.forEach(key => {
            console.log(`Testing key "${key}":`, this.t(key));
        });
    }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
    
    // Test translations after initialization
    setTimeout(() => {
        if (window.languageManager) {
            window.languageManager.testTranslations();
        }
    }, 1000);
});

// Export for global use
window.LanguageManager = LanguageManager; 