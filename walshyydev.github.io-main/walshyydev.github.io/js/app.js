// Store partners data
let partners = [];
let totalTipsAmount = 0;

// DOM Elements
const addPartnerForm = document.getElementById('addPartnerForm');
const totalTipsForm = document.getElementById('totalTipsForm');
const partnersListDiv = document.getElementById('partnersList');
const mathBreakdownDiv = document.getElementById('mathBreakdown');
const mathStepsDiv = document.getElementById('mathSteps');
const resultsDiv = document.getElementById('results');
const tipResultsDiv = document.getElementById('tipResults');
const heroParallax = document.getElementById('heroParallax');

// Parallax effect for hero section
document.addEventListener('mousemove', (e) => {
    if (heroParallax) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        heroParallax.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
});

// Handle partner form submission
addPartnerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('partnerName');
    const hoursInput = document.getElementById('partnerHours');
    
    const partner = {
        name: nameInput.value,
        hours: parseFloat(hoursInput.value)
    };
    
    partners.push(partner);
    updatePartnersList();
    
    // Reset form
    nameInput.value = '';
    hoursInput.value = '';
    
    // Animate the new partner card
    const cards = document.querySelectorAll('.partner-card');
    const newCard = cards[cards.length - 1];
    if (newCard) {
        newCard.style.opacity = '0';
        newCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';
        }, 50);
    }
});

// Handle total tips form submission
totalTipsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipsInput = document.getElementById('totalTips');
    totalTipsAmount = parseFloat(tipsInput.value);
    
    if (partners.length === 0) {
        alert('Please add at least one partner before calculating tips.');
        return;
    }
    
    calculateAndDisplayTips();
});

// Handle Enter key navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]'));
        const currentIndex = inputs.indexOf(document.activeElement);
        
        if (currentIndex > -1) {
            // If we're on the hours input, submit the form
            if (document.activeElement.id === 'partnerHours') {
                document.getElementById('addPartnerForm').dispatchEvent(new Event('submit'));
                // Focus back to partner name input
                document.getElementById('partnerName').focus();
            } else {
                // Focus next input
                const nextInput = inputs[currentIndex + 1];
                if (nextInput) nextInput.focus();
            }
        }
    }
});

// Update partners list display
function updatePartnersList() {
    partnersListDiv.innerHTML = '';
    partners.forEach((partner, index) => {
        const partnerCard = document.createElement('div');
        partnerCard.className = 'partner-card p-3 bg-white rounded-lg shadow-sm flex justify-between items-center';
        partnerCard.innerHTML = `
            <div>
                <span class="font-medium">${partner.name}</span>
                <span class="text-sm text-gray-500 ml-2">${partner.hours} hours</span>
            </div>
            <button onclick="removePartner(${index})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times"></i>
            </button>
        `;
        partnersListDiv.appendChild(partnerCard);
    });
}

// Remove partner
function removePartner(index) {
    partners.splice(index, 1);
    updatePartnersList();
    if (totalTipsAmount > 0) {
        calculateAndDisplayTips();
    }
}

// Calculate and display tips with enhanced math visualization
function calculateAndDisplayTips() {
    // Show the math breakdown and results sections
    mathBreakdownDiv.classList.remove('hidden');
    resultsDiv.classList.remove('hidden');
    
    // Clear previous results
    mathStepsDiv.innerHTML = '';
    tipResultsDiv.innerHTML = '';
    
    // Create paper-like container for math
    const mathPaper = document.createElement('div');
    mathPaper.className = 'math-paper';
    mathStepsDiv.appendChild(mathPaper);
    
    // Add title
    addMathStep('Tips Calculation', `Total Tips: $${totalTipsAmount.toFixed(2)}`, mathPaper);
    
    // Calculate total hours with detailed breakdown
    const totalHours = partners.reduce((sum, partner) => sum + partner.hours, 0);
    
    // Show hours calculation
    addMathStep('Total Hours Calculation:', '', mathPaper);
    partners.forEach((partner, index) => {
        const operation = document.createElement('div');
        operation.className = 'math-operation';
        operation.innerHTML = `
            <span class="math-symbol">${index === 0 ? '' : '+'}</span>
            <span><span class="partner-name">${partner.name}</span>: ${partner.hours} hours</span>
        `;
        mathPaper.appendChild(operation);
    });
    
    // Add total hours line and result
    const totalLine = document.createElement('div');
    totalLine.className = 'math-line';
    mathPaper.appendChild(totalLine);
    
    const totalResult = document.createElement('div');
    totalResult.className = 'math-result';
    totalResult.textContent = `Total Hours = ${totalHours.toFixed(2)}`;
    mathPaper.appendChild(totalResult);
    
    // Calculate and show tips per hour
    addMathStep('Tips Per Hour Calculation:', '', mathPaper);
    const tipsPerHour = totalTipsAmount / totalHours;
    
    const tipsPerHourCalc = document.createElement('div');
    tipsPerHourCalc.className = 'math-operation';
    tipsPerHourCalc.innerHTML = `
        <span class="math-symbol">÷</span>
        <span>$${totalTipsAmount.toFixed(2)} ÷ ${totalHours.toFixed(2)} hours</span>
    `;
    mathPaper.appendChild(tipsPerHourCalc);
    
    const tphLine = document.createElement('div');
    tphLine.className = 'math-line';
    mathPaper.appendChild(tphLine);
    
    const tphResult = document.createElement('div');
    tphResult.className = 'math-result';
    tphResult.textContent = `Tips Per Hour = $${tipsPerHour.toFixed(2)}`;
    mathPaper.appendChild(tphResult);
    
    // Calculate individual tips
    let remainingTips = totalTipsAmount;
    const results = partners.map((partner, index) => {
        const exactTips = partner.hours * tipsPerHour;
        const roundedTips = index === partners.length - 1 
            ? Math.round(remainingTips)
            : Math.round(exactTips);
            
        // Show individual calculation
        addMathStep(`${partner.name}'s Tips:`, '', mathPaper);
        const calculation = document.createElement('div');
        calculation.className = 'math-operation';
        calculation.innerHTML = `
            <span class="math-symbol">×</span>
            <span>${partner.hours} hours × $${tipsPerHour.toFixed(2)}/hour = $${exactTips.toFixed(2)}</span>
        `;
        mathPaper.appendChild(calculation);
        
        const roundingNote = document.createElement('div');
        roundingNote.className = 'math-result';
        const decimal = exactTips - Math.floor(exactTips);
        const roundingExplanation = decimal >= 0.5 
            ? `Rounded up to: <span class="math-highlight">$${roundedTips}</span> (${decimal.toFixed(2)} ≥ 0.50)`
            : `Rounded down to: <span class="math-highlight">$${roundedTips}</span> (${decimal.toFixed(2)} < 0.50)`;
        roundingNote.innerHTML = roundingExplanation;
        mathPaper.appendChild(roundingNote);
        
        remainingTips -= roundedTips;
        
        return {
            ...partner,
            tips: roundedTips,
            exactTips: exactTips,
            percentage: (partner.hours / totalHours) * 100
        };
    });
    
    // Display results
    results.forEach(result => {
        const resultCard = document.createElement('div');
        resultCard.className = 'bg-white p-4 rounded-lg shadow-sm';
        resultCard.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-semibold partner-name">${result.name}</h3>
                    <p class="text-sm text-gray-500">${result.hours} hours (${result.percentage.toFixed(1)}%)</p>
                </div>
                <div class="text-xl font-bold text-starbucks-green">$${result.tips}</div>
            </div>
        `;
        tipResultsDiv.appendChild(resultCard);
    });
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Add a math step with animation
function addMathStep(title, content, container = mathStepsDiv) {
    const step = document.createElement('div');
    step.className = 'math-step';
    step.innerHTML = `
        <h3 class="font-semibold">${title}</h3>
        ${content ? `<p class="text-gray-700">${content}</p>` : ''}
    `;
    container.appendChild(step);
    
    // Trigger animation
    setTimeout(() => step.classList.add('show'), 50);
}
