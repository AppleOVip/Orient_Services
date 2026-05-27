// بنمسك العناصر من الـ ID بتاعها
const scrollIndicator = document.getElementById('scroll-indicator');
const floatingButtons = document.getElementById('floating-buttons');

// بنراقب حركة السكرول في الشاشة
window.addEventListener('scroll', () => {
    // لو اليوزر نزل أكتر من 200 بيكسل (تخطينا الهيرو سيكشن)
    if (window.scrollY > 200) {
        
        // 1. اخفي مؤشر السكرول بتاع الهيرو
        if(scrollIndicator) {
            scrollIndicator.classList.add('opacity-0', 'pointer-events-none');
        }
        
        // 2. أظهر زراير الواتساب والميل
        if(floatingButtons) {
            floatingButtons.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            floatingButtons.classList.add('opacity-100', 'translate-y-0');
        }

    } else {
        // لو رجع لفوق خالص (أول الصفحة)
        
        // 1. أظهر مؤشر السكرول تاني
        if(scrollIndicator) {
            scrollIndicator.classList.remove('opacity-0', 'pointer-events-none');
        }
        
        // 2. اخفي زراير الواتساب والميل عشان ميبقوش زحمة
        if(floatingButtons) {
            floatingButtons.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            floatingButtons.classList.remove('opacity-100', 'translate-y-0');
        }
    }
});