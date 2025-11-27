// =============================================
// GameASG - نظام متكامل في ملف واحد
// =============================================

console.log('🚀 بدء تحميل نظام GameASG...');

// قاعدة المعرفة الكاملة
const aiKnowledgeBase = {
    "questions": {
        "1": {
            "question": "ما هي أهم ميزة تفتخر بها في متجرك؟",
            "ai_responses": [
                "أشكرك على سؤالك الذكي! في الحقيقة، هذا المتجر هو نموذج توضيحي تم إنشاؤه لعرض مهارات المطور في تصميم الواجهات وبرمجة المساعد الذكي. نحن نفتخر بالإبداع التقني والتصميم المتميز الذي يقدم تجربة مستخدم فريدة.",
                "سعيد بسؤالك المميز! بكل شفافية، هذا المشروع هو عرض لقدرات المطور في إنشاء حلول ويب متكاملة. نفتخر بالابتكار في التصميم والذكاء في التفاعل الذي يضفي طابعًا احترافيًا على التجربة الرقمية.",
                "نفتخر بالإبداع التقني والتصميم المتقن في هذا النموذج التوضيحي الذي يعرض قدرات المطور المتميزة."
            ],
            "keywords": ["ميزة", "تفتخر", "أهم", "تميز", "مطور"]
        },
        "2": {
            "question": "كيف تختلف عن المنافسين في سوق مكونات الألعاب؟",
            "ai_responses": [
                "ما يميزنا أن هذه المنصة تم تطويرها كتجربة احترافية توضح قدرة المطور على إنشاء أي نموذج متجر متكامل مع مساعد ذكي متطور، مما يضمن تقديم تجربة فريدة للعملاء وفهم كامل للخدمات المقدمة.",
                "نتميز بأن هذه الصفحة التجريبية تثبت موهبة المطور في تصميم حلول مخصصة لأي متجر، مع دمج ذكاء اصطناعي يساعد العملاء على فهم الخدمات بشكل شامل ومبتكر.",
                "تميزنا يكمن في القدرة على إنشاء نماذج متاجر مخصصة مدعومة بذكاء اصطناعي يشرح الخدمات للعملاء بفعالية."
            ],
            "keywords": ["مختلف", "منافسين", "تميز", "فرق", "قدرات"]
        },
        "3": {
            "question": "ما هو أكثر منتج تبيعه ولماذا يعجب العملاء؟",
            "ai_responses": [
                "الميزة الأبرز هي الذكاء الاصطناعي الذي يعمل كموجه للعملاء، يشرح طريقة التصفح ويجيب على الاستفسارات، مما يزيد الأرباح كبديل فعال للدعم البشري ويضمن فهمًا أسرع للموقع.",
                "نفتخر بذكائنا الاصطناعي الذي يوجه الزوار ويجيب على أسئلتهم، محققًا أعلى معدلات تحويل كبديل مبتكر للدعم البشري التقليدي.",
                "ذكاؤنا الاصطناعي يوجه العملاء ويزيد الأرباح كبديل فعال للدعم البشري."
            ],
            "keywords": ["منتج", "أكثر", "عملاء", "مبيع", "ذكاء", "اصطناعي"]
        }
    },
    "technical_answers": {
        "4": {
            "question": "ما الفرق بين كروت الشاشة RTX 4080 و RTX 4090؟",
            "ai_responses": [
                "في هذا النموذج الاستعراضي، يمكنني إفادتك أن RTX 4090 يقدم أداءً أعلى بنسبة 60-90% من RTX 4080 في الألعاب مع استهلاك طاقة أكبر وسعر أعلى، بينما RTX 4080 يوفر أداءً مذهلاً بتكلفة أكثر معقولية.",
                "كجزء من هذه الصفحة التوضيحية، أذكر أن RTX 4090 هو الخيار الأقوى للألعاب عالية الدقة، بينما RTX 4080 يوفر توازنًا رائعًا بين الأداء والسعر.",
                "في هذا العرض: RTX 4090 أقوى بأداء أعلى 60-90% من 4080، لكن 4080 يوفر توازن أفضل بين السعر والأداء."
            ],
            "keywords": ["كروت", "شاشة", "RTX", "4080", "4090", "أداء"]
        }
    },
    "fallback_responses": [
        "شكرًا لك على سؤالك! هذا النموذج يهدف لعرض القدرات التقنية للمطور في إنشاء حلول ويب متكاملة.",
        "سعيد بتفاعلك! هذه الصفحة تجريبية تظهر إمكانيات المطور في البرمجة والتصميم.",
        "أقدر فضولك! هذا المشروع توضيحي لعرض مهارات المطور في الذكاء الاصطناعي وتصميم الواجهات."
    ]
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
    
    console.log('🔍 عناصر المساعد:', {
        toggle: !!aiToggle,
        chat: !!aiChat,
        send: !!aiSend,
        input: !!aiInput,
        messages: !!aiMessages,
        clear: !!aiClear
    });
    
    if (!aiToggle || !aiChat || !aiSend || !aiInput || !aiMessages) {
        console.error('❌ عناصر المساعد الذكي غير موجودة!');
        return;
    }
    
    console.log('✅ جميع عناصر المساعد الذكي موجودة');
    
    let chatOpen = false;
    
    // زر فتح/إغلاق الشات
    aiToggle.addEventListener('click', function(event) {
        console.log('🎯 تم النقر على زر المساعد!');
        event.stopPropagation();
        
        chatOpen = !chatOpen;
        
        if (chatOpen) {
            aiChat.classList.add('active');
            aiToggle.innerHTML = '<i class="fas fa-times"></i>';
            console.log('✅ تم فتح نافذة المحادثة');
            
            setTimeout(() => {
                aiInput.focus();
            }, 100);
        } else {
            aiChat.classList.remove('active');
            aiToggle.innerHTML = '<i class="fas fa-robot"></i>';
            console.log('❌ تم إغلاق نافذة المحادثة');
        }
    });
    
    // زر إرسال الرسالة
    aiSend.addEventListener('click', function(event) {
        console.log('📤 تم النقر على زر الإرسال!');
        event.stopPropagation();
        sendMessage();
    });
    
    // إرسال بالإنتر
    aiInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            console.log('⌨️ تم الضغط على Enter!');
            event.stopPropagation();
            sendMessage();
        }
    });
    
    // زر مسح المحادثة
    if (aiClear) {
        aiClear.addEventListener('click', function(event) {
            console.log('🗑️ تم النقر على زر المسح!');
            event.stopPropagation();
            aiMessages.innerHTML = '<div class="message bot-message">مرحباً! أنا مساعد GameASG الذكي. كيف يمكنني مساعدتك؟</div>';
        });
    }
    
    function sendMessage() {
        const userText = aiInput.value.trim();
        console.log('📝 نص الرسالة:', userText);
        
        if (userText === '') {
            console.log('⚠️ نص الرسالة فارغ');
            return;
        }
        
        // إضافة رسالة المستخدم
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = userText;
        aiMessages.appendChild(userMessage);
        
        // مسح حقل الإدخال
        aiInput.value = '';
        
        // التمرير للأسفل
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // عرض مؤشر الكتابة
        showTypingIndicator();
        
        // محاكاة الكتابة ثم إرسال الرد
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateResponse(userText);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = botResponse;
            aiMessages.appendChild(botMessage);
            
            // التمرير للأسفل
            aiMessages.scrollTop = aiMessages.scrollHeight;
            console.log('🤖 تم إرسال الرد:', botResponse);
        }, 1500);
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span>يكتب...</span>
        `;
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function generateResponse(userInput) {
        console.log('🧠 معالجة السؤال:', userInput);
        
        const input = userInput.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;
        
        // البحث في جميع الأسئلة
        const allQuestions = {
            ...aiKnowledgeBase.questions,
            ...aiKnowledgeBase.technical_answers
        };
        
        for (const [key, questionData] of Object.entries(allQuestions)) {
            let score = 0;
            
            // الكلمات المفتاحية
            questionData.keywords.forEach(keyword => {
                if (input.includes(keyword.toLowerCase())) {
                    score += 2;
                }
            });
            
            // التطابق مع السؤال
            if (input.includes(questionData.question.toLowerCase())) {
                score += 5;
            }
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = questionData;
            }
        }
        
        if (bestMatch && highestScore >= 2) {
            console.log('✅ تم العثور على تطابق:', bestMatch.question);
            const responses = bestMatch.ai_responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        console.log('❌ لا يوجد تطابق، استخدام رد افتراضي');
        const fallbackResponses = aiKnowledgeBase.fallback_responses;
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    console.log('✅ المساعد الذكي - جاهز للعمل!');
}

// نظام عداد التنازلي مع إعادة التشغيل
function initializeCountdown() {
    console.log('⏱️ جاري تهيئة عداد التنازلي...');
    
    let countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 3); // 3 أيام من الآن
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        if (distance < 0) {
            // إعادة تشغيل العداد تلقائياً
            console.log('🔄 إعادة تشغيل العداد...');
            countdownDate = new Date();
            countdownDate.setDate(countdownDate.getDate() + 3);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // تحديث العناصر
        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");
        
        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // التحديث الفوري ثم كل ثانية
    updateTimer();
    setInterval(updateTimer, 1000);
    
    console.log('✅ عداد التنازلي - يعمل بنجاح مع إعادة التشغيل');
}

// تأثيرات الأزرار
function initializeButtonEffects() {
    console.log('🎯 جاري تهيئة تأثيرات الأزرار...');
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // تأثيرات البطاقات
    const cards = document.querySelectorAll('.feature-card, .product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(106, 17, 203, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    console.log('✅ تأثيرات الواجهة - مفعلة');
}

// التمرير السلس
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a, .footer-section a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    console.log('🔍 التمرير السلس - مفعل');
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 الصفحة محملة بالكامل، بدء تهيئة المكونات...');
    
    // تهيئة جميع المكونات
    try {
        initializeAIAssistant();
        console.log('✅ تم تهيئة المساعد الذكي بنجاح');
    } catch (error) {
        console.error('❌ فشل تهيئة المساعد الذكي:', error);
    }
    
    try {
        initializeCountdown();
        console.log('✅ تم تهيئة عداد التنازلي بنجاح');
    } catch (error) {
        console.error('❌ فشل تهيئة عداد التنازلي:', error);
    }
    
    try {
        initializeButtonEffects();
        console.log('✅ تم تهيئة تأثيرات الأزرار بنجاح');
    } catch (error) {
        console.error('❌ فشل تهيئة تأثيرات الأزرار:', error);
    }
    
    try {
        initializeSmoothScroll();
        console.log('✅ تم تهيئة التمرير السلس بنجاح');
    } catch (error) {
        console.error('❌ فشل تهيئة التمرير السلس:', error);
    }
    
    console.log('🎉 جميع المكونات جاهزة للعمل!');
    
    // التأكد من ظهور زر المساعد
    const aiToggle = document.getElementById('aiToggle');
    if (aiToggle) {
        aiToggle.style.display = 'flex';
        aiToggle.style.visibility = 'visible';
        aiToggle.style.opacity = '1';
    }
});

// منع إغلاق النافذة عند النقر داخلها
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

console.log('🚀 GameASG System - Loaded Successfully!');