// =============================================
// GameASG - نظام متكامل في ملف واحد
// =============================================

console.log('🚀 بدء تحميل نظام GameASG...');

// قاعدة المعرفة الكاملة
const aiKnowledgeBase = {
    "general": {
        "welcome": {
            "question": "مرحباً",
            "ai_responses": [
                "مرحباً بك في GameASG! كيف يمكنني مساعدتك اليوم في اختيار تجميعتك القادمة؟",
                "أهلاً بك! أنا مساعدك الذكي، جاهز للإجابة على استفساراتك حول الهاردوير والألعاب.",
                "يا هلا! تفضل بطرح سؤالك عن التجميعات أو قطع البي سي."
            ],
            "keywords": ["مرحبا", "هلا", "سلام", "هاي", "السلام"]
        },
        "about": {
            "question": "من أنتم؟",
            "ai_responses": [
                "نحن GameASG، متجر متخصص في تجميعات ألعاب الكمبيوتر الاحترافية. نقدم أفضل المكونات مع ضمان ذهبي ودعم فني متواصل.",
                "GameASG هي وجهتك الأولى لتجميعات الجيمنج في المملكة. نجمع لك الأداء القوي مع السعر المنافس."
            ],
            "keywords": ["من انتم", "نبذة", "عن المتجر", "ايش المتجر"]
        },
        "location": {
            "question": "أين موقعكم؟",
            "ai_responses": [
                "مقرنا الرئيسي في الرياض، ونوفر خدمة الشحن السريع لجميع مناطق المملكة.",
                "نحن متجر إلكتروني مع مستودعات في الرياض، ونخدم كافة مدن السعودية."
            ],
            "keywords": ["موقع", "مكان", "عنوان", "وين"]
        }
    },
    "components": {
        "gpu_advice": {
            "question": "ما هو أفضل كرت شاشة؟",
            "ai_responses": [
                "يعتمد ذلك على ميزانيتك ودقة الشاشة. للعب على 4K ننصح بـ RTX 4090 أو 4080. لدقة 2K يعتبر RTX 4070 Ti خياراً ممتازاً. وللعب على 1080p، كرت RTX 4060 Ti يقدم أداء رائع.",
                "الأفضل حالياً هو RTX 4090 بلا منازع، لكنه مكلف. إذا كنت تبحث عن أفضل قيمة مقابل سعر، فإن RTX 4070 Super هو الخيار الذهبي حالياً."
            ],
            "keywords": ["كرت شاشة", "gpu", "rtx", "أفضل كرت", "جرافيك"]
        },
        "cpu_advice": {
            "question": "ما هو أفضل معالج للألعاب؟",
            "ai_responses": [
                "ملك الألعاب حالياً هو AMD Ryzen 7 7800X3D بفضل تقنية 3D V-Cache. من جانب إنتل، i9-13900K و i7-13700K هما الأقوى.",
                "إذا كان هدفك الألعاب فقط، أنصحك بـ Ryzen 7 7800X3D. إذا كنت صانع محتوى وتلعب، فمعالج Intel Core i7-14700K خيار متوازن وممتاز."
            ],
            "keywords": ["معالج", "cpu", "بروسيسور", "i5", "i7", "i9", "ryzen"]
        },
        "ram_advice": {
            "question": "كم رام أحتاج؟",
            "ai_responses": [
                "للألعاب الحديثة، 16GB هو الحد الأدنى، لكن 32GB أصبح المعيار الجديد لضمان سلاسة اللعب وتشغيل برامج في الخلفية.",
                "أنصحك بـ 32GB DDR5 لضمان أن جهازك جاهز للمستقبل وللألعاب الثقيلة مثل Hogwarts Legacy و Cyberpunk."
            ],
            "keywords": ["رام", "ram", "ذاكرة", "16gb", "32gb"]
        },
        "storage_advice": {
            "question": "ما الفرق بين SSD و HDD؟",
            "ai_responses": [
                "الـ SSD (خاصة NVMe) أسرع بـ 10-50 مرة من HDD، مما يعني تشغيل الويندوز والألعاب في ثوانٍ. الـ HDD جيد فقط لتخزين الملفات الكبيرة والأرشيف.",
                "دائماً اجعل النظام والألعاب على SSD M.2 NVMe. استخدم HDD فقط لتخزين الصور والفيديوهات القديمة."
            ],
            "keywords": ["ssd", "hdd", "تخزين", "هارد", "nvme"]
        }
    },
    "peripherals": {
        "monitor_advice": {
            "question": "كيف أختار شاشة؟",
            "ai_responses": [
                "ركز على ثلاثة أشياء: الدقة (1080p/2K/4K)، معدل التحديث (144Hz فما فوق للألعاب التنافسية)، ونوع اللوحة (IPS للألوان، VA للتباين، TN للسرعة).",
                "لألعاب الشوتر، خذ شاشة 24 بوصة 1080p بـ 240Hz. لألعاب القصة، خذ شاشة 27 بوصة 2K بـ 144Hz أو 165Hz."
            ],
            "keywords": ["شاشة", "monitor", "هرتز", "hz", "دقة"]
        },
        "keyboard_advice": {
            "question": "ما الفرق بين الكيبورد الميكانيكي والعادي؟",
            "ai_responses": [
                "الكيبورد الميكانيكي يستخدم مفاتيح مستقلة (سويتشات) تعطي استجابة أسرع وشعوراً أفضل بالكتابة واللعب، وهو عمره أطول بكثير من الكيبورد العادي (Membrane).",
                "الميكانيكي أفضل بمراحل! يمكنك اختيار السويتش المناسب لك: الأحمر (خطي وسريع)، الأزرق (صوت عالي)، أو البني (متوازن)."
            ],
            "keywords": ["كيبورد", "لوحة مفاتيح", "ميكانيكي", "سويتش"]
        }
    },
    "support": {
        "warranty": {
            "question": "كيف الضمان؟",
            "ai_responses": [
                "نقدم ضماناً ذهبياً لمدة سنتين على جميع القطع والتجميعات. الضمان يشمل العيوب المصنعية والأعطال الفنية.",
                "ضماننا سنتين شامل. في حال حدوث أي مشكلة، تواصل معنا وسنقوم بصيانة الجهاز أو استبدال القطعة المعيبة فوراً."
            ],
            "keywords": ["ضمان", "كفالة", "خرب", "عطل", "صيانة"]
        },
        "payment": {
            "question": "طرق الدفع",
            "ai_responses": [
                "نقبل: مدى، فيزا، ماستركارد، Apple Pay، التحويل البنكي، والدفع عند الاستلام (داخل الرياض).",
                "وسائل الدفع المتاحة: البطاقات الائتمانية، مدى، Apple Pay، وخدمة التقسيط عبر تابي وتمارا (قريباً)."
            ],
            "keywords": ["دفع", "فلوس", "اقساط", "فيزا", "مدى"]
        },
        "shipping": {
            "question": "كم يستغرق التوصيل؟",
            "ai_responses": [
                "داخل الرياض: توصيل في نفس اليوم أو اليوم التالي. باقي مدن المملكة: 2-4 أيام عمل.",
                "الشحن سريع! 24 ساعة في الرياض، ومن 2 إلى 4 أيام لباقي المناطق عبر سمسا أو أرامكس."
            ],
            "keywords": ["توصيل", "شحن", "متى يوصل", "وقت"]
        }
    },
    "gaming": {
        "fps_tips": {
            "question": "كيف أزيد الفريمات؟",
            "ai_responses": [
                "تأكد من تحديث تعريف كرت الشاشة، أغلق البرامج في الخلفية، وفعل خيار DLSS أو FSR في إعدادات اللعبة إذا كان مدعوماً.",
                "قلل إعدادات الظلال (Shadows) وتنعيم الحواف (Anti-Aliasing) فهي تستهلك الكثير من الموارد. وتأكد أن حرارة جهازك طبيعية."
            ],
            "keywords": ["فريمات", "fps", "لاق", "تقطيع", "بطيء"]
        },
        "bottleneck": {
            "question": "ما هو عنق الزجاجة؟",
            "ai_responses": [
                "عنق الزجاجة (Bottleneck) يحدث عندما تكون قطعة واحدة (غالباً المعالج) أضعف بكثير من الأخرى (كرت الشاشة)، مما يمنع الكرت من العمل بكامل طاقته.",
                "يعني أن معالجك لا يستطيع مجاراة سرعة كرت الشاشة، فلا تحصل على الفريمات الكاملة التي يستطيع الكرت إنتاجها."
            ],
            "keywords": ["عنق زجاجة", "bottleneck", "بوتل نيك"]
        }
    }
};

// نظام المساعد الذكي
function initializeAIAssistant() {
    console.log('🔧 جاري تهيئة المساعد الذكي...');
    
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.getElementById('aiChat');
    const aiSend = document.getElementById('aiSend');
    const aiInput = document.getElementById('aiInput');
    const aiMessages = document.getElementById('aiMessages');
    const aiClear = document.getElementById('aiClear');
    
    if (!aiToggle || !aiChat || !aiSend || !aiInput || !aiMessages) {
        console.error('❌ عناصر المساعد الذكي غير موجودة!');
        return;
    }
    
    let chatOpen = false;
    
    // زر فتح/إغلاق الشات
    aiToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        chatOpen = !chatOpen;
        
        if (chatOpen) {
            aiChat.classList.add('active');
            aiToggle.innerHTML = '<i class="fas fa-times"></i>';
            setTimeout(() => aiInput.focus(), 100);
        } else {
            aiChat.classList.remove('active');
            aiToggle.innerHTML = '<i class="fas fa-robot"></i>';
        }
    });
    
    // إرسال الرسالة
    function handleSend() {
        sendMessage();
    }

    aiSend.addEventListener('click', function(event) {
        event.stopPropagation();
        handleSend();
    });
    
    aiInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.stopPropagation();
            handleSend();
        }
    });
    
    if (aiClear) {
        aiClear.addEventListener('click', function(event) {
            event.stopPropagation();
            aiMessages.innerHTML = '<div class="message bot-message">مرحباً! أنا مساعد GameASG الذكي. كيف يمكنني مساعدتك؟</div>';
        });
    }
    
    function sendMessage() {
        const userText = aiInput.value.trim();
        if (userText === '') return;
        
        // إضافة رسالة المستخدم
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = userText;
        aiMessages.appendChild(userMessage);
        
        aiInput.value = '';
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateResponse(userText);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = botResponse;
            aiMessages.appendChild(botMessage);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }, 1000 + Math.random() * 500);
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
            <span>يكتب...</span>
        `;
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.remove();
    }
    
    function generateResponse(userInput) {
        const input = userInput.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;
        
        // تجميع كل الفئات في مكان واحد للبحث
        const allCategories = [
            aiKnowledgeBase.general,
            aiKnowledgeBase.components,
            aiKnowledgeBase.peripherals,
            aiKnowledgeBase.support,
            aiKnowledgeBase.gaming
        ];

        allCategories.forEach(category => {
            for (const [key, data] of Object.entries(category)) {
                let score = 0;
                
                // مطابقة الكلمات المفتاحية
                data.keywords.forEach(keyword => {
                    if (input.includes(keyword.toLowerCase())) {
                        score += 2;
                    }
                });
                
                // مطابقة السؤال نفسه (تطابق جزئي)
                if (input.includes(data.question.toLowerCase())) {
                    score += 3;
                }

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = data;
                }
            }
        });
        
        if (bestMatch && highestScore >= 2) {
            const responses = bestMatch.ai_responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // ردود افتراضية في حال عدم الفهم
        const fallbackResponses = [
            "عذراً، لم أفهم سؤالك تماماً. هل يمكنك السؤال عن المعالجات، كروت الشاشة، أو الضمان؟",
            "سؤال جيد، لكن ليس لدي إجابة دقيقة حالياً. هل تود معرفة أفضل التجميعات لدينا؟",
            "أنا مساعد ذكي متخصص في الهاردوير. يمكنك سؤالي عن 'أفضل كرت شاشة' أو 'كم رام أحتاج'.",
            "لست متأكداً من إجابة هذا السؤال. يمكنك التواصل مع الدعم الفني عبر الواتساب للمساعدة المفصلة."
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
}

// نظام عداد التنازلي
function initializeCountdown() {
    let countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 3);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        if (distance < 0) {
            countdownDate = new Date();
            countdownDate.setDate(countdownDate.getDate() + 3);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const els = {
            days: document.getElementById("days"),
            hours: document.getElementById("hours"),
            minutes: document.getElementById("minutes"),
            seconds: document.getElementById("seconds")
        };
        
        if (els.days) els.days.textContent = days.toString().padStart(2, '0');
        if (els.hours) els.hours.textContent = hours.toString().padStart(2, '0');
        if (els.minutes) els.minutes.textContent = minutes.toString().padStart(2, '0');
        if (els.seconds) els.seconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// تأثيرات الواجهة
function initializeUIEffects() {
    // أزرار
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-3px)'; });
        btn.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
    });
    
    // بطاقات
    document.querySelectorAll('.feature-card, .product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(106, 17, 203, 0.3)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // تمرير سلس
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// قائمة الحساب والتبويبات
function initializeAccountSystem() {
    const accountBtn = document.getElementById('accountBtn');
    const accountDropdown = document.getElementById('accountDropdown');
    
    if (accountBtn && accountDropdown) {
        accountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountDropdown.classList.toggle('active');
            accountBtn.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!accountBtn.contains(e.target) && !accountDropdown.contains(e.target)) {
                accountDropdown.classList.remove('active');
                accountBtn.classList.remove('active');
            }
        });
    }
    
    // التبويبات
    const tabLinks = document.querySelectorAll('.account-nav-link[data-tab]');
    const tabContents = document.querySelectorAll('.account-tab-content');
    
    if (tabLinks.length > 0) {
        function switchTab(tabId) {
            tabContents.forEach(c => c.classList.remove('active'));
            tabLinks.forEach(l => l.classList.remove('active'));
            
            const content = document.getElementById(tabId);
            const link = document.querySelector(`.account-nav-link[data-tab="${tabId}"]`);
            
            if (content) content.classList.add('active');
            if (link) link.classList.add('active');
        }
        
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                switchTab(tabId);
                history.pushState(null, null, link.getAttribute('href'));
            });
        });
        
        // التعامل مع الهاش في الرابط
        const hash = window.location.hash;
        if (hash) {
            const link = document.querySelector(`.account-nav-link[href="${hash}"]`);
            if (link) switchTab(link.getAttribute('data-tab'));
        }
    }
}

// التهيئة العامة
document.addEventListener('DOMContentLoaded', function() {
    try { initializeAIAssistant(); } catch(e) { console.error('AI Error', e); }
    try { initializeCountdown(); } catch(e) { console.error('Timer Error', e); }
    try { initializeUIEffects(); } catch(e) { console.error('UI Error', e); }
    try { initializeAccountSystem(); } catch(e) { console.error('Account Error', e); }
    
    console.log('✅ GameASG System Ready');
});

// إغلاق الشات عند النقر خارجه
document.addEventListener('click', function(event) {
    const aiChat = document.getElementById('aiChat');
    const aiToggle = document.getElementById('aiToggle');
    if (aiChat && aiToggle && aiChat.classList.contains('active')) {
        if (!aiChat.contains(event.target) && !aiToggle.contains(event.target)) {
            aiChat.classList.remove('active');
            aiToggle.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }
});