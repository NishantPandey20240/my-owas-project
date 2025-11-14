import { owasProcessSteps, postureOptions, riskCategories, riskLookupTable, frequencyRiskRules } from './owas-data.js';

let frequencyRiskChart;

// --- Tab Management ---
export function activateTab(tabId) {
    document.querySelectorAll('.nav-button').forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    document.querySelectorAll('#pills-tabContent > div').forEach(content => content.classList.toggle('active', content.id === tabId));
}

export function initTabs() {
    const tabs = document.querySelectorAll('.nav-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            activateTab(e.target.getAttribute('data-tab'));
        });
    });
}

// --- "The OWAS Process" Tab ---
export function initProcessView() {
    const container = document.querySelector('#process .grid');
    container.innerHTML = owasProcessSteps.map(step => `
        <div class="step-card bg-white p-6 rounded-xl border-2 border-transparent shadow-md" data-step-id="${step.id}">
            <div class="flex items-center mb-3">
                <span class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mr-4">${step.id}</span>
                <h3 class="text-xl font-semibold text-gray-800">${step.title}</h3>
            </div>
            <p class="text-gray-600">${step.description}</p>
        </div>`
    ).join('');
    
    const cards = container.querySelectorAll('.step-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// --- "Posture Coder" Tab ---
export function initCoderView(appState) {
    const createOptionGroup = (part, options) => {
        const container = document.getElementById(`${part}-options`);
        container.innerHTML = `
            <h3 class="text-xl font-bold capitalize text-gray-700 mb-3">${part} Posture</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                ${options.map(opt => `
                    <div class="posture-option border-2 rounded-lg p-4 text-center bg-white shadow-sm" data-part="${part}" data-code="${opt.code}">
                        <p class="font-semibold">${opt.text}</p>
                    </div>`
                ).join('')}
            </div>`;
    };

    ['back', 'arms', 'legs', 'load'].forEach(part => createOptionGroup(part, postureOptions[part]));

    document.querySelectorAll('.posture-option').forEach(el => {
        el.addEventListener('click', () => {
            const { part, code } = el.dataset;
            appState.selectedPosture[part] = parseInt(code);
            document.querySelectorAll(`.posture-option[data-part="${part}"]`).forEach(opt => opt.classList.remove('selected'));
            el.classList.add('selected');
            updateCoderResult(appState.selectedPosture);
        });
    });
}

export function updateCoderResult(selectedPosture) {
    const { back, arms, legs, load } = selectedPosture;
    ['back', 'arms', 'legs', 'load'].forEach(part => {
        document.getElementById(`code-${part}`).textContent = selectedPosture[part] || '?';
    });

    const riskResultContainer = document.getElementById('risk-result');
    if (back && arms && legs && load) {
        const codeString = `${back}${arms}${legs}${load}`;
        const riskCategory = riskLookupTable[codeString];
        if (riskCategory) {
            const categoryInfo = riskCategories[riskCategory];
            riskResultContainer.innerHTML = `
                <div class="risk-card-${riskCategory} bg-white p-4 rounded-lg shadow">
                    <p class="text-lg font-bold text-gray-500">Risk Category ${riskCategory}</p>
                    <h4 class="text-2xl font-bold my-1 text-gray-800">${categoryInfo.text}</h4>
                    <p class="text-md text-gray-600">${categoryInfo.description}</p>
                </div>`;
        } else {
            riskResultContainer.innerHTML = `<p class="text-red-500 font-semibold">Invalid posture combination.</p>`;
        }
    } else {
        riskResultContainer.innerHTML = `<p class="text-gray-500">Select a posture for each body part to see the risk analysis.</p>`;
    }
}


// --- "Frequency Analyzer" Tab ---
export function initAnalyzerView() {
    const bodyPartSelect = document.getElementById('body-part-select');
    const postureSelect = document.getElementById('posture-select');
    const addBtn = document.getElementById('add-analyzer-btn');
    const slidersContainer = document.getElementById('analyzer-sliders-container');

    const populatePostureSelect = () => {
        const part = bodyPartSelect.value;
        const stressfulPostures = postureOptions[part];
        postureSelect.innerHTML = stressfulPostures.map(p => `<option value="${p.code}">${p.text}</option>`).join('');
    };

    bodyPartSelect.innerHTML = Object.keys(postureOptions).filter(p => p !== 'load').map(p => `<option value="${p}">${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('');
    bodyPartSelect.addEventListener('change', populatePostureSelect);

    addBtn.addEventListener('click', () => {
        const part = bodyPartSelect.value;
        const code = postureSelect.value;
        if (!code) return;
        const text = postureSelect.options[postureSelect.selectedIndex].text;
        const sliderId = `slider-${part}-${code}`;
        if (document.getElementById(sliderId)) {
            alert('This posture is already being analyzed.');
            return;
        }
        if (slidersContainer.querySelector('p')) {
            slidersContainer.innerHTML = '';
        }
        const sliderHTML = `
            <div id="${sliderId}" class="analyzer-item" data-part="${part}" data-code="${code}" data-text="${text}">
                <div class="flex justify-between items-center mb-2">
                    <label class="font-semibold text-gray-700">${part.charAt(0).toUpperCase() + part.slice(1)}: ${text}</label>
                    <button class="remove-btn text-red-500 hover:text-red-700 font-bold">✕</button>
                </div>
                <div class="flex items-center space-x-4">
                    <input type="range" min="0" max="100" value="0" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                    <span class="value-label font-bold text-lg w-16 text-right">0%</span>
                    <span class="risk-label font-bold w-24 text-center rounded-full px-2 py-1 text-sm bg-gray-200">Risk 1</span>
                </div>
            </div>`;
        slidersContainer.insertAdjacentHTML('beforeend', sliderHTML);

        const newSlider = document.getElementById(sliderId);
        newSlider.querySelector('input[type="range"]').addEventListener('input', updateFrequencyAnalysis);
        newSlider.querySelector('.remove-btn').addEventListener('click', () => {
            newSlider.remove();
            if (slidersContainer.children.length === 0) {
                slidersContainer.innerHTML = '<p class="text-center text-gray-500">No postures added for analysis yet.</p>';
            }
            updateFrequencyAnalysis();
        });
        updateFrequencyAnalysis();
    });

    const ctx = document.getElementById('frequencyRiskChart').getContext('2d');
    frequencyRiskChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Risk Level', data: [], backgroundColor: [], borderWidth: 1 }] },
        options: {
            animation: { duration: 0 },
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: { y: { beginAtZero: true, max: 4, ticks: { stepSize: 1, callback: value => `Level ${value}` } } }
        }
    });

    populatePostureSelect();
}

function getRiskFromFrequency(part, code, value) {
    const rules = frequencyRiskRules[`${part}_${code}`] || [];
    for (const rule of rules) {
        if (value >= rule.threshold) return rule.risk;
    }
    return 1;
}

function updateFrequencyAnalysis() {
    const riskColors = { 1: '#4ade80', 2: '#facc15', 3: '#f97316', 4: '#ef4444' };
    const newLabels = [];
    const newData = [];
    const newColors = [];

    document.querySelectorAll('.analyzer-item').forEach(item => {
        const { part, code, text } = item.dataset;
        const slider = item.querySelector('input[type="range"]');
        const value = parseInt(slider.value);
        const valueLabel = item.querySelector('.value-label');
        const riskLabel = item.querySelector('.risk-label');
        valueLabel.textContent = `${value}%`;

        const riskLevel = getRiskFromFrequency(part, code, value);
        riskLabel.textContent = `Risk ${riskLevel}`;
        riskLabel.style.backgroundColor = riskColors[riskLevel];
        riskLabel.style.color = riskLevel > 2 ? 'white' : '#1f2937';

        newLabels.push(`${part.charAt(0).toUpperCase()}: ${text}`);
        newData.push(riskLevel);
        newColors.push(riskColors[riskLevel]);
    });

    frequencyRiskChart.data.labels = newLabels;
    frequencyRiskChart.data.datasets[0].data = newData;
    frequencyRiskChart.data.datasets[0].backgroundColor = newColors;
    frequencyRiskChart.update();
}

// --- "AI Analyzer" Tab ---
export function displayAiResults(aiGeneratedResults, currentVideoFile) {
    const summaryEl = document.getElementById('ai-summary');
    const resultsEl = document.getElementById('ai-results-container');
    const statusEl = document.getElementById('ai-status');

    statusEl.innerHTML = `<span class="text-green-600 font-bold">Analysis Complete! Report is ready.</span>`;

    if (!aiGeneratedResults || aiGeneratedResults.results.length === 0) {
        resultsEl.innerHTML = `<p>Could not detect any postures in the video.</p>`;
        summaryEl.innerHTML = '';
        return;
    }
    
    const { results, totalFrames, loadCode } = aiGeneratedResults;
    const mostFrequent = results[0];
    const highRiskPostures = results.filter(([key, count]) => {
        const fullCode = `${key}${loadCode}`;
        return (riskLookupTable[fullCode] || 0) >= 3;
    });

    summaryEl.innerHTML = `
        <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            Analysis of <strong>${currentVideoFile.name}</strong> found <strong>${results.length}</strong> unique postures. 
            The most frequent posture was <strong>${mostFrequent[0].split('').join(',')}</strong>, observed in <strong>${((mostFrequent[1]/totalFrames)*100).toFixed(1)}%</strong> of the task. 
            <strong>${highRiskPostures.length}</strong> high-risk postures (Category 3 or 4) were identified.
        </p>`;
    
    let tableHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-3">Posture (B,A,L,F)</th>
                        <th scope="col" class="px-4 py-3">Frequency</th>
                        <th scope="col" class="px-4 py-3">Risk Category</th>
                    </tr>
                </thead>
                <tbody>`;
                
    results.forEach(([key, count]) => {
        const fullCode = `${key}${loadCode}`;
        const riskCategory = riskLookupTable[fullCode] || 0;
        const percentage = ((count / totalFrames) * 100).toFixed(1);
        const riskInfo = riskCategories[riskCategory] || { text: 'N/A' };
        
        tableHTML += `
            <tr class="border-b">
                <td class="px-4 py-2 font-medium text-gray-900">${key.split('').join(',')},${loadCode}</td>
                <td class="px-4 py-2">${percentage}%</td>
                <td class="px-4 py-2 font-bold" style="color: ${getRiskColor(riskCategory)}">${riskInfo.text} (Cat. ${riskCategory})</td>
            </tr>`;
    });
    tableHTML += `</tbody></table></div>`;
    resultsEl.innerHTML = tableHTML;
}

function getRiskColor(risk) {
    if (risk === 1) return '#22c55e';
    if (risk === 2) return '#facc15';
    if (risk === 3) return '#f97316';
    if (risk === 4) return '#ef4444';
    return '#6b7280';
}
