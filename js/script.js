// Theme management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add theme toggle button listener
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Initial animations
    gsap.from('.glass', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    });
});

// Store partners data
let partners = [];
let totalTipsAmount = 0;

// DOM Elements
const addPartnerForm = document.getElementById('addPartnerForm');
const totalTipsForm = document.getElementById('totalTipsForm');
const partnersListDiv = document.getElementById('partnersList');
const mathBreakdownDiv = document.getElementById('mathBreakdown');

// Parallax effect for hero section
const heroParallax = document.getElementById('heroParallax');
document.addEventListener('mousemove', (e) => {
    if (heroParallax) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        heroParallax.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
});

// Add Partner Form Handler
addPartnerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('partnerName');
    const hoursInput = document.getElementById('partnerHours');
    
    // Validate inputs
    if (!nameInput.value || !hoursInput.value) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Add partner to array
    const partner = {
        name: nameInput.value,
        hours: parseFloat(hoursInput.value),
        id: Date.now()
    };
    
    partners.push(partner);
    
    // Add partner card to list
    addPartnerCard(partner);
    
    // Reset form
    addPartnerForm.reset();
    nameInput.focus();
    
    showNotification('Partner added successfully!', 'success');
    
    // Recalculate if we have total tips
    if (totalTipsAmount > 0) {
        calculateTips();
    }
});

// Create Partner Card
function addPartnerCard(partner) {
    const card = document.createElement('div');
    card.className = 'partner-card p-4 mb-4 relative animate-fade-in';
    card.dataset.partnerId = partner.id;
    
    card.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <h3 class="partner-name text-lg font-semibold text-starbucks-dark">${partner.name}</h3>
                <p class="text-sm text-gray-600">${partner.hours} hours</p>
            </div>
            <button onclick="deletePartner(${partner.id})" class="text-red-500 hover:text-red-700 transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
        ${partner.tips ? `
        <div class="mt-2 pt-2 border-t border-gray-200">
            <p class="text-starbucks-green font-semibold">Tips: $${partner.tips.toFixed(2)}</p>
        </div>
        ` : ''}
    `;
    
    partnersListDiv.appendChild(card);
}

// Delete Partner
function deletePartner(partnerId) {
    const index = partners.findIndex(p => p.id === partnerId);
    if (index > -1) {
        partners.splice(index, 1);
        document.querySelector(`[data-partner-id="${partnerId}"]`).remove();
        showNotification('Partner removed', 'info');
        
        if (totalTipsAmount > 0) {
            calculateTips();
        }
    }
}

// Calculate Tips
totalTipsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tipsInput = document.getElementById('totalTips');
    totalTipsAmount = parseFloat(tipsInput.value);
    
    if (!totalTipsAmount || totalTipsAmount <= 0) {
        showNotification('Please enter a valid tips amount', 'error');
        return;
    }
    
    if (partners.length === 0) {
        showNotification('Please add at least one partner', 'error');
        return;
    }
    
    calculateTips();
});

function calculateTips() {
    // Calculate total hours
    const totalHours = partners.reduce((sum, partner) => sum + partner.hours, 0);
    
    // Calculate tips per hour (rounded to 4 decimal places for accurate calculation)
    const tipsPerHour = Number((totalTipsAmount / totalHours).toFixed(4));
    
    // Calculate tips for each partner
    partners.forEach(partner => {
        // Calculate tips and round to nearest penny (2 decimal places)
        partner.tips = Number((partner.hours * tipsPerHour).toFixed(2));
        
        // Update partner card
        const card = document.querySelector(`[data-partner-id="${partner.id}"]`);
        if (card) {
            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="partner-name text-lg font-semibold text-starbucks-dark">${partner.name}</h3>
                        <p class="text-sm text-gray-600">${partner.hours} hours</p>
                    </div>
                    <button onclick="deletePartner(${partner.id})" class="text-red-500 hover:text-red-700 transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200">
                    <p class="text-starbucks-green font-semibold">Tips: $${partner.tips.toFixed(2)}</p>
                </div>
            `;
        }
    });
    
    // Verify total distribution matches total tips amount (accounting for rounding)
    const totalDistributed = partners.reduce((sum, partner) => sum + partner.tips, 0);
    const roundingDifference = Number((totalTipsAmount - totalDistributed).toFixed(2));
    
    // If there's a rounding difference, distribute it to the partner with the most hours
    if (Math.abs(roundingDifference) > 0.01) {
        const partnerWithMostHours = partners.reduce((max, partner) => 
            partner.hours > max.hours ? partner : max, partners[0]);
        partnerWithMostHours.tips = Number((partnerWithMostHours.tips + roundingDifference).toFixed(2));
        
        // Update the card for the partner who received the rounding adjustment
        const card = document.querySelector(`[data-partner-id="${partnerWithMostHours.id}"]`);
        if (card) {
            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="partner-name text-lg font-semibold text-starbucks-dark">${partnerWithMostHours.name}</h3>
                        <p class="text-sm text-gray-600">${partnerWithMostHours.hours} hours</p>
                    </div>
                    <button onclick="deletePartner(${partnerWithMostHours.id})" class="text-red-500 hover:text-red-700 transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200">
                    <p class="text-starbucks-green font-semibold">Tips: $${partnerWithMostHours.tips.toFixed(2)}</p>
                </div>
            `;
        }
    }
    
    // Show math breakdown
    showMathBreakdown(totalHours, tipsPerHour);
}

function showMathBreakdown(totalHours, tipsPerHour) {
    mathBreakdownDiv.classList.remove('hidden');
    const breakdownHTML = `
        <div class="tips-calculation space-y-4">
            <div class="calculation-step">
                <h3 class="text-lg font-semibold text-starbucks-dark mb-2">Total Tips</h3>
                <p class="text-2xl font-bold text-starbucks-green">$${totalTipsAmount.toFixed(2)}</p>
            </div>
            
            <div class="calculation-step">
                <h3 class="text-lg font-semibold text-starbucks-dark mb-2">Total Hours</h3>
                <p class="text-2xl font-bold text-starbucks-green">${totalHours.toFixed(2)} hours</p>
            </div>
            
            <div class="calculation-step">
                <h3 class="text-lg font-semibold text-starbucks-dark mb-2">Tips per Hour</h3>
                <p class="text-2xl font-bold text-starbucks-green">$${tipsPerHour.toFixed(2)}/hour</p>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-starbucks-dark mb-4">Individual Breakdowns</h3>
                ${partners.map(partner => `
                    <div class="partner-breakdown mb-4">
                        <p class="font-semibold">${partner.name}</p>
                        <p class="text-gray-600">${partner.hours} hours × $${tipsPerHour.toFixed(2)} = $${partner.tips.toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    mathBreakdownDiv.querySelector('.tips-calculation').innerHTML = breakdownHTML;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
        type === 'error' ? 'bg-red-500' :
        type === 'success' ? 'bg-starbucks-green' :
        'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
