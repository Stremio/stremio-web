const { languageNames } = require('stremio/common');

// Comprehensive map of ISO 639-2/T (3-letter) codes to ISO 639-1 (2-letter) codes for Google Translate
// Covers 100+ languages supported by Google Translate
const LANG_CODE_MAP = {
    // Major languages
    'eng': 'en', 'spa': 'es', 'fra': 'fr', 'deu': 'de', 'ita': 'it',
    'por': 'pt', 'rus': 'ru', 'jpn': 'ja', 'kor': 'ko', 'zho': 'zh',
    'ara': 'ar', 'hin': 'hi', 'ben': 'bn', 'pol': 'pl', 'ukr': 'uk',
    'tur': 'tr', 'nld': 'nl', 'swe': 'sv', 'dan': 'da', 'fin': 'fi',
    'nor': 'no', 'ces': 'cs', 'hun': 'hu', 'ron': 'ro', 'tha': 'th',
    'vie': 'vi', 'ind': 'id', 'heb': 'he', 'ell': 'el', 'bul': 'bg',

    // European languages
    'cat': 'ca', 'hrv': 'hr', 'lit': 'lt', 'lav': 'lv', 'slk': 'sk',
    'slv': 'sl', 'srp': 'sr', 'est': 'et', 'msa': 'ms', 'isl': 'is',
    'gle': 'ga', 'sqi': 'sq', 'bos': 'bs', 'mkd': 'mk', 'mlt': 'mt',
    'eus': 'eu', 'glg': 'gl', 'cym': 'cy', 'bel': 'be', 'aze': 'az',

    // Asian languages
    'fil': 'tl', 'tel': 'te', 'tam': 'ta', 'mar': 'mr', 'guj': 'gu',
    'kan': 'kn', 'mal': 'ml', 'urd': 'ur', 'nep': 'ne', 'sin': 'si',
    'pan': 'pa', 'khm': 'km', 'lao': 'lo', 'mya': 'my', 'kat': 'ka',
    'hye': 'hy', 'mon': 'mn', 'uzb': 'uz', 'kaz': 'kk', 'tgk': 'tg',

    // African languages
    'swa': 'sw', 'amh': 'am', 'hau': 'ha', 'yor': 'yo', 'ibo': 'ig',
    'zul': 'zu', 'xho': 'xh', 'som': 'so', 'afr': 'af',

    // Other languages
    'fas': 'fa', 'pus': 'ps', 'kur': 'ku', 'snd': 'sd', 'uig': 'ug',
    'tuk': 'tk', 'kir': 'ky', 'tat': 'tt', 'orm': 'om', 'tir': 'ti',
    'mlg': 'mg', 'ceb': 'ceb', 'hmn': 'hmn', 'haw': 'haw', 'sun': 'su',
    'jav': 'jv', 'mri': 'mi', 'smo': 'sm', 'cos': 'co', 'fry': 'fy',
    'ltz': 'lb', 'lat': 'la', 'epo': 'eo', 'sna': 'sn', 'hat': 'ht',
    'nya': 'ny', 'sot': 'st', 'tgl': 'tl', 'kin': 'rw', 'que': 'qu'
};

const ClickActionHandler = {
    // Convert 3-letter language code to 2-letter code for Google Translate
    convertLangCode(code) {
        if (!code || code === 'auto') return code;
        if (code.length === 2) return code;
        return LANG_CODE_MAP[code.toLowerCase()] || code;
    },

    async handleWordClick(word, actionType, config = {}) {
        switch (actionType) {
            case 'COPY':
                return this.handleCopy(word);
            case 'WEBHOOK':
                return this.handleWebhook(word, config.webhookUrl);
            case 'TRANSLATE':
            default:
                return this.handleTranslate(word, config);
        }
    },

    async handleCopy(word) {
        try {
            await navigator.clipboard.writeText(word);
            return { type: 'COPY', success: true, message: 'Copied!' };
        } catch (err) {
            console.error('Failed to copy:', err);
            return { type: 'COPY', success: false, message: 'Copy failed' };
        }
    },

    async handleWebhook(word, url) {
        if (!url) {
            return { type: 'WEBHOOK', success: false, message: 'No URL configured' };
        }
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word, timestamp: Date.now() }),
            });
            return { type: 'WEBHOOK', success: true, message: 'Sent!' };
        } catch (err) {
            console.error('Webhook failed:', err);
            return { type: 'WEBHOOK', success: false, message: 'Failed' };
        }
    },

    async handleTranslate(word, config = {}) {
        const provider = config.provider || 'GOOGLE';
        const sourceLang = config.sourceLang || 'auto';
        const targetLang = config.targetLang || 'en';

        try {
            switch (provider) {
                case 'GOOGLE':
                    return await this.translateGoogle(word, sourceLang, targetLang);
                case 'GEMINI':
                    return await this.translateGemini(word, config);
                case 'OPENAI':
                    return await this.translateOpenAI(word, config);
                case 'CLAUDE':
                    return await this.translateClaude(word, config);
                case 'OLLAMA':
                    return await this.translateOllama(word, config);
                case 'OPENROUTER':
                    return await this.translateOpenRouter(word, config);
                case 'CUSTOM':
                    return await this.translateCustom(word, config);
                default:
                    return this.translateGoogle(word, sourceLang, targetLang);
            }
        } catch (err) {
            console.error('Translation failed:', err);
            return {
                type: 'TRANSLATE',
                word,
                provider,
                error: true,
                translation: `Error: ${err.message}`,
                externalLink: `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(word)}`
            };
        }
    },

    async translateGoogle(word, sourceLang, targetLang) {
        const sl = this.convertLangCode(sourceLang) || 'auto';
        const tl = this.convertLangCode(targetLang);

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(word)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const translation = data[0]?.[0]?.[0] || 'No translation found';

            return {
                type: 'TRANSLATE',
                word,
                provider: 'GOOGLE',
                translation,
                externalLink: `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(word)}&op=translate`
            };
        } catch (_) {
            // Fallback to link only
            return {
                type: 'TRANSLATE',
                word,
                provider: 'GOOGLE',
                translation: `Click to translate "${word}"`,
                externalLink: `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(word)}&op=translate`
            };
        }
    },

    resolveTargetLangName(code) {
        return languageNames[code] || code || 'English';
    },

    constructPrompt(word, config) {
        const targetLangs = config.targetLangs || [config.targetLang || 'en'];
        const targetLangNames = targetLangs.map((code) => this.resolveTargetLangName(code));
        const targetLangName = this.resolveTargetLangName(config.targetLang);

        // Get provider-specific prompt or fallback to general prompt
        const provider = config.provider || 'GOOGLE';
        const prompt = config.providerPrompts?.[provider] || 'Define "{word}" briefly in {targetLang}.';

        return prompt
            .replace('{word}', word)
            .replace('{targetLang}', targetLangName)
            .replace('{targetLangs}', targetLangNames.join(', '));
    },

    async translateOpenAI(word, config) {
        const apiKey = config.providerApiKeys?.OPENAI || config.apiKey;
        if (!apiKey) {
            return { type: 'TRANSLATE', word, provider: 'OPENAI', error: true, translation: 'API Key not configured' };
        }

        const prompt = this.constructPrompt(word, config);
        const baseUrl = config.providerUrls?.OPENAI || 'https://api.openai.com/v1';
        const model = config.providerModels?.OPENAI || 'gpt-4o-mini';

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return {
            type: 'TRANSLATE',
            word,
            provider: 'OPENAI',
            translation: data.choices?.[0]?.message?.content || 'No response'
        };
    },

    async translateClaude(word, config) {
        const apiKey = config.providerApiKeys?.CLAUDE || config.apiKey;
        if (!apiKey) {
            return { type: 'TRANSLATE', word, provider: 'CLAUDE', error: true, translation: 'API Key not configured' };
        }

        const prompt = this.constructPrompt(word, config);
        const baseUrl = config.providerUrls?.CLAUDE || 'https://api.anthropic.com/v1';
        const model = config.providerModels?.CLAUDE || 'claude-sonnet-4-20250514';

        const response = await fetch(`${baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 150,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return {
            type: 'TRANSLATE',
            word,
            provider: 'CLAUDE',
            translation: data.content?.[0]?.text || 'No response'
        };
    },

    async translateOllama(word, config) {
        const baseUrl = config.providerUrls?.OLLAMA || 'http://localhost:11434';
        const model = config.providerModels?.OLLAMA || 'llama3.2';

        const prompt = this.constructPrompt(word, config);

        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();

        return {
            type: 'TRANSLATE',
            word,
            provider: 'OLLAMA',
            translation: data.response || 'No response'
        };
    },

    async translateOpenRouter(word, config) {
        const apiKey = config.providerApiKeys?.OPENROUTER || config.apiKey;
        if (!apiKey) {
            return { type: 'TRANSLATE', word, provider: 'OPENROUTER', error: true, translation: 'API Key not configured' };
        }

        const prompt = this.constructPrompt(word, config);
        const baseUrl = config.providerUrls?.OPENROUTER || 'https://openrouter.ai/api/v1';
        const model = config.providerModels?.OPENROUTER || 'openai/gpt-4o-mini';

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return {
            type: 'TRANSLATE',
            word,
            provider: 'OPENROUTER',
            translation: data.choices?.[0]?.message?.content || 'No response'
        };
    },

    async translateGemini(word, config) {
        const apiKey = config.providerApiKeys?.GEMINI || config.apiKey;
        if (!apiKey) {
            return { type: 'TRANSLATE', word, provider: 'GEMINI', error: true, translation: 'API Key not configured' };
        }

        const prompt = this.constructPrompt(word, config);
        const baseUrl = config.providerUrls?.GEMINI || 'https://generativelanguage.googleapis.com/v1beta';
        const model = config.providerModels?.GEMINI || 'gemma-3-27b-it';

        const response = await fetch(`${baseUrl}/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 200, temperature: 0.3 }
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

        return {
            type: 'TRANSLATE',
            word,
            provider: 'GEMINI',
            translation: text
        };
    },

    async translateCustom(word, config) {
        const apiKey = config.providerApiKeys?.CUSTOM || config.apiKey;
        if (!apiKey) {
            return { type: 'TRANSLATE', word, provider: 'CUSTOM', error: true, translation: 'API Key not configured' };
        }
        const baseUrl = config.providerUrls?.CUSTOM;
        if (!baseUrl) {
            return { type: 'TRANSLATE', word, provider: 'CUSTOM', error: true, translation: 'Base URL not configured' };
        }

        const prompt = this.constructPrompt(word, config);
        const model = config.providerModels?.CUSTOM || 'gpt-4o-mini';

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return {
            type: 'TRANSLATE',
            word,
            provider: 'CUSTOM',
            translation: data.choices?.[0]?.message?.content || 'No response'
        };
    }
};

module.exports = ClickActionHandler;

