// main.js - JavaScript for LuxEstate website

// Example: Smooth scroll for navigation links
$(document).ready(function() {
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
});

// Example: Add active class to navigation on scroll
$(window).on('scroll', function() {
    var scrollPos = $(document).scrollTop();
    $('nav a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position() && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('nav a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
});

// Scroll animation handler
let lastScrollTop = 0;
let ticking = false;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        const elementVisible = 200; // Trigger when element is 200px from viewport top
        
        // Element is in viewport (visible on screen)
        const isInViewport = elementTop < windowHeight && elementBottom > 0;
        // Element is entering viewport from bottom
        const isEntering = elementTop < windowHeight - elementVisible && elementTop > -elementHeight;
        // Element is leaving viewport from top (scrolling up past it)
        const isLeavingTop = elementBottom < 0 && scrollDirection === 'up';
        // Element is below viewport (not yet visible)
        const isBelowViewport = elementTop >= windowHeight;
        // Element is above viewport (scrolled past)
        const isAboveViewport = elementBottom < -50;

        if (isEntering && scrollDirection === 'down') {
            // Scrolling down - element entering viewport from right
            element.classList.add('animate-in');
            element.classList.remove('animate-out');
        } else if (isInViewport && scrollDirection === 'down') {
            // Scrolling down - element already in viewport, keep it visible
            element.classList.add('animate-in');
            element.classList.remove('animate-out');
        } else if (isLeavingTop) {
            // Scrolling up - element leaving viewport from top, animate out to left
            element.classList.add('animate-out');
            element.classList.remove('animate-in');
        } else if (isInViewport && scrollDirection === 'up') {
            // Scrolling up but element is still in viewport - keep it visible
            element.classList.add('animate-in');
            element.classList.remove('animate-out');
        } else if (isBelowViewport && scrollDirection === 'down') {
            // Element below viewport - reset for scroll down
            element.classList.remove('animate-in', 'animate-out');
        } else if (isAboveViewport && scrollDirection === 'up') {
            // Element above viewport - reset for scroll up
            element.classList.remove('animate-in', 'animate-out');
        }
    });

    ticking = false;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
}

// Initial check on page load
window.addEventListener('load', () => {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 150) {
            element.classList.add('animate-in');
        }
    });
});

// Listen for scroll events
window.addEventListener('scroll', requestTick, { passive: true });

// Budget Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Open budget calculator modal
    const calculateBudgetBtns = document.querySelectorAll('#calculateBudgetBtn');
    calculateBudgetBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('budgetCalculatorModal'));
            modal.show();
        });
    });

    // Calculate budget
    const calculateBtn = document.getElementById('calculateBudgetBtnModal');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateBudget();
        });
    }

    // Auto-calculate on input change
    const inputs = ['propertyPrice', 'downPayment', 'interestRate', 'loanTerm', 'propertyTax', 'homeInsurance'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateBudget);
        }
    });
});

function calculateBudget() {
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    const propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
    const homeInsurance = parseFloat(document.getElementById('homeInsurance').value) || 0;

    // Calculate down payment amount
    const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    
    // Calculate loan amount
    const loanAmount = propertyPrice - downPaymentAmount;
    
    // Calculate monthly interest rate
    const monthlyInterestRate = (interestRate / 100) / 12;
    
    // Calculate number of payments
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using mortgage formula
    let monthlyPayment = 0;
    if (loanAmount > 0 && monthlyInterestRate > 0) {
        monthlyPayment = loanAmount * 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }
    
    // Calculate total monthly payment (including tax and insurance)
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthly = monthlyPayment + monthlyTax + monthlyInsurance;

    // Update results
    document.getElementById('downPaymentAmount').textContent = '$' + downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('loanAmount').textContent = '$' + loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('totalMonthly').textContent = '$' + totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}