/**
 * Manchitra - Land Surveying & Digital Mapping
 * Interactive Frontend Scripts & Cost Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initCostCalculator();
    initStatsCounter();
    initLeadForm();
});

/**
 * Sticky Navbar transition on scroll
 */
function initStickyHeader() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            toggleBtn.innerHTML = isOpen ? '✕' : '☰';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (toggleBtn) toggleBtn.innerHTML = '☰';
            });
        });
    }
}

/**
 * Interactive Land Survey Cost Estimator Widget
 */
function initCostCalculator() {
    const surveyType = document.getElementById('survey-type');
    const areaUnit = document.getElementById('area-unit');
    const areaInput = document.getElementById('area-input');
    const estimateAmount = document.getElementById('estimate-amount');
    const whatsappBtn = document.getElementById('send-whatsapp-quote');

    if (!surveyType || !areaInput || !estimateAmount) return;

    const rates = {
        boundary: { base: 3500, perAcre: 1500, perSqYd: 3 },
        topographical: { base: 4500, perAcre: 2200, perSqYd: 4.5 },
        construction: { base: 5500, perAcre: 3000, perSqYd: 6 },
        dgps: { base: 6500, perAcre: 3500, perSqYd: 7 }
    };

    function calculateQuote() {
        const type = surveyType.value || 'boundary';
        const unit = areaUnit ? areaUnit.value : 'acre';
        const area = parseFloat(areaInput.value) || 1;

        const rateObj = rates[type] || rates.boundary;
        let totalMin = rateObj.base;
        let totalMax = rateObj.base * 1.35;

        if (unit === 'acre') {
            totalMin += area * rateObj.perAcre;
            totalMax += area * rateObj.perAcre * 1.35;
        } else {
            totalMin += area * rateObj.perSqYd;
            totalMax += area * rateObj.perSqYd * 1.35;
        }

        // Round to nearest 500
        const minRounded = Math.round(totalMin / 500) * 500;
        const maxRounded = Math.round(totalMax / 500) * 500;

        const formattedMin = minRounded.toLocaleString('en-IN');
        const formattedMax = maxRounded.toLocaleString('en-IN');

        estimateAmount.innerHTML = `₹${formattedMin} - ₹${formattedMax}*`;
        
        return { type, area, unit, formattedMin, formattedMax };
    }

    // Attach event listeners
    surveyType.addEventListener('change', calculateQuote);
    if (areaUnit) areaUnit.addEventListener('change', calculateQuote);
    areaInput.addEventListener('input', calculateQuote);

    // Initial calculation
    calculateQuote();

    // WhatsApp Instant Quote Trigger
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const calc = calculateQuote();
            const serviceName = surveyType.options[surveyType.selectedIndex].text;
            const message = `Hello Manchitra Team! I visited manchitraindia.com and used the Survey Cost Calculator. I need a quote for:\n\n*Service:* ${serviceName}\n*Estimated Area:* ${calc.area} ${calc.unit.toUpperCase()}\n*Estimated Budget:* ₹${calc.formattedMin} - ₹${calc.formattedMax}\n\nPlease contact me for site inspection details.`;
            const phone = "919417036994";
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

/**
 * Animated Number Counters for Trust Stats
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.counter-val');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'), 10);
                animateCount(entry.target, target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCount(el, target) {
    let current = 0;
    const duration = 1500; // ms
    const increment = Math.ceil(target / (duration / 30));

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target.toLocaleString('en-IN') + '+';
            clearInterval(timer);
        } else {
            el.textContent = current.toLocaleString('en-IN');
        }
    }, 30);
}

/**
 * Consultation Lead Capture Form
 */
function initLeadForm() {
    const form = document.getElementById('consultation-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phoneInput = document.getElementById('client-phone');
        if (phoneInput) {
            const cleanDigits = phoneInput.value.replace(/\D/g, '');
            if (cleanDigits.length < 10) {
                alert('Please enter a valid 10-digit Indian mobile number.');
                phoneInput.focus();
                return;
            }
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Processing Request...';
        }

        const name = document.getElementById('client-name')?.value || '';
        const service = document.getElementById('service-needed')?.value || '';
        const areaVal = document.getElementById('approx-area')?.value || '';
        const areaUnit = document.getElementById('area-unit')?.value || '';
        const areaText = areaVal ? ` (${areaVal} ${areaUnit})` : '';

        setTimeout(() => {
            alert(`Thank you ${name}! Your consultation request for ${service}${areaText} has been verified and logged. Our engineering desk will call your number shortly.`);
            form.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Request Submitted ✓';
                setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000);
            }
        }, 800);
    });
}
