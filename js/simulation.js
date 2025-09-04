// Simulation JavaScript
let currentTab = 'parameters';
let selectedRecipe = 'current';
let simulationRunning = false;
let yieldChart = null;

// Parameter baseline values
const baselineParams = {
    'cvd-temp': 450,
    'stepper-temp': 23,
    'pressure': 1.0,
    'flow-rate': 100,
    'rf-power': 1000,
    'process-time': 120
};

// Current parameter values
let currentParams = { ...baselineParams };

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeYieldChart();
    updateAllParameterImpacts();
});

// Show tab content
function showTab(tabName) {
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').style.display = 'block';
    currentTab = tabName;
}

// Update parameter value and impact
function updateParameter(paramName, value) {
    currentParams[paramName] = parseFloat(value);
    
    // Update display value
    document.getElementById(paramName + '-value').textContent = value;
    
    // Calculate and update impact
    updateParameterImpact(paramName, value);
    
    // Update overall simulation preview
    updateSimulationPreview();
}

// Update parameter impact
function updateParameterImpact(paramName, value) {
    const baseline = baselineParams[paramName];
    const current = parseFloat(value);
    const deviation = ((current - baseline) / baseline) * 100;
    
    const impactElement = document.getElementById(paramName + '-impact');
    
    if (Math.abs(deviation) < 2) {
        impactElement.textContent = 'Baseline';
        impactElement.style.color = '#10b981';
    } else if (Math.abs(deviation) < 10) {
        impactElement.textContent = deviation > 0 ? 'Slight Increase' : 'Slight Decrease';
        impactElement.style.color = '#f59e0b';
    } else {
        impactElement.textContent = deviation > 0 ? 'Significant Increase' : 'Significant Decrease';
        impactElement.style.color = '#ef4444';
    }
}

// Update all parameter impacts
function updateAllParameterImpacts() {
    Object.keys(currentParams).forEach(paramName => {
        updateParameterImpact(paramName, currentParams[paramName]);
    });
}

// Update simulation preview
function updateSimulationPreview() {
    // Calculate predicted yield based on parameter changes
    let yieldImpact = 0;
    
    // CVD temperature impact (most critical)
    const cvdDeviation = (currentParams['cvd-temp'] - baselineParams['cvd-temp']) / baselineParams['cvd-temp'];
    yieldImpact += cvdDeviation * -15; // Negative impact for temperature deviation
    
    // Pressure impact
    const pressureDeviation = (currentParams['pressure'] - baselineParams['pressure']) / baselineParams['pressure'];
    yieldImpact += pressureDeviation * -5;
    
    // RF Power impact
    const powerDeviation = (currentParams['rf-power'] - baselineParams['rf-power']) / baselineParams['rf-power'];
    yieldImpact += powerDeviation * -3;
    
    // Flow rate impact
    const flowDeviation = (currentParams['flow-rate'] - baselineParams['flow-rate']) / baselineParams['flow-rate'];
    yieldImpact += flowDeviation * -2;
    
    // Calculate predicted yield
    const baselineYield = 94.2;
    const predictedYield = Math.max(85, Math.min(98, baselineYield + yieldImpact));
    
    // Update yield change indicator
    const yieldChange = predictedYield - baselineYield;
    const yieldChangeElement = document.getElementById('yieldChange');
    
    if (Math.abs(yieldChange) < 0.1) {
        yieldChangeElement.textContent = 'No Change';
        yieldChangeElement.className = 'prediction-change';
    } else if (yieldChange > 0) {
        yieldChangeElement.textContent = `+${yieldChange.toFixed(1)}%`;
        yieldChangeElement.className = 'prediction-change positive';
    } else {
        yieldChangeElement.textContent = `${yieldChange.toFixed(1)}%`;
        yieldChangeElement.className = 'prediction-change negative';
    }
    
    // Update predicted yield display
    document.getElementById('predictedYield').textContent = predictedYield.toFixed(1) + '%';
    
    // Update confidence based on parameter deviation
    const totalDeviation = Math.abs(cvdDeviation) + Math.abs(pressureDeviation) + Math.abs(powerDeviation);
    const confidence = Math.max(60, Math.min(95, 90 - totalDeviation * 100));
    document.getElementById('yieldConfidence').textContent = confidence.toFixed(0) + '%';
}

// Initialize yield chart
function initializeYieldChart() {
    const ctx = document.getElementById('yieldChart');
    if (!ctx) return;

    yieldChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Current', 'Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6'],
            datasets: [{
                label: 'Predicted Yield %',
                data: [94.2, 94.2, 94.2, 94.2, 94.2, 94.2, 94.2],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 90,
                    max: 98,
                    title: {
                        display: true,
                        text: 'Yield %'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}

// Select recipe
function selectRecipe(recipeType) {
    // Remove active class from all cards
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected card
    event.target.closest('.recipe-card').classList.add('active');
    
    selectedRecipe = recipeType;
    
    // Update simulation based on recipe selection
    updateRecipeImpact(recipeType);
}

// Update recipe impact
function updateRecipeImpact(recipeType) {
    const recipeImpacts = {
        'current': { yield: 0, throughput: 0, risk: 'Low' },
        'optimized': { yield: 1.6, throughput: 7, risk: 'Medium' },
        'experimental': { yield: 2.3, throughput: 13, risk: 'High' }
    };
    
    const impact = recipeImpacts[recipeType];
    
    // Update yield prediction
    const baseYield = 94.2;
    const newYield = baseYield + impact.yield;
    document.getElementById('predictedYield').textContent = newYield.toFixed(1) + '%';
    
    // Update yield change
    const yieldChangeElement = document.getElementById('yieldChange');
    if (impact.yield === 0) {
        yieldChangeElement.textContent = 'Baseline';
        yieldChangeElement.className = 'prediction-change';
    } else {
        yieldChangeElement.textContent = `+${impact.yield.toFixed(1)}%`;
        yieldChangeElement.className = 'prediction-change positive';
    }
    
    // Update throughput
    const baseThroughput = 85;
    const newThroughput = baseThroughput + impact.throughput;
    document.getElementById('wphValue').textContent = newThroughput;
    
    // Update throughput change
    const throughputChangeElement = document.getElementById('throughputChange');
    if (impact.throughput === 0) {
        throughputChangeElement.textContent = 'Baseline';
        throughputChangeElement.className = 'prediction-change';
    } else {
        throughputChangeElement.textContent = `+${impact.throughput} WPH`;
        throughputChangeElement.className = 'prediction-change positive';
    }
    
    // Update risk level
    document.getElementById('riskLevel').textContent = impact.risk;
    const riskElement = document.getElementById('riskLevel');
    riskElement.className = 'risk-level';
    if (impact.risk === 'Low') {
        riskElement.style.background = 'rgba(16, 185, 129, 0.1)';
        riskElement.style.color = '#10b981';
    } else if (impact.risk === 'Medium') {
        riskElement.style.background = 'rgba(245, 158, 11, 0.1)';
        riskElement.style.color = '#f59e0b';
    } else {
        riskElement.style.background = 'rgba(239, 68, 68, 0.1)';
        riskElement.style.color = '#ef4444';
    }
}

// Load template
function loadTemplate() {
    const templates = [
        'Yield Optimization Template',
        'Throughput Enhancement Template',
        'Cost Reduction Template',
        'Quality Improvement Template'
    ];
    
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Show loading message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    message.textContent = `Loading ${selectedTemplate}...`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
        
        // Reset parameters to template values
        if (selectedTemplate.includes('Yield')) {
            // Yield optimization template
            document.querySelector('input[oninput*="cvd-temp"]').value = 445;
            updateParameter('cvd-temp', 445);
            document.querySelector('input[oninput*="pressure"]').value = 0.8;
            updateParameter('pressure', 0.8);
        } else if (selectedTemplate.includes('Throughput')) {
            // Throughput template
            document.querySelector('input[oninput*="process-time"]').value = 100;
            updateParameter('process-time', 100);
            document.querySelector('input[oninput*="rf-power"]').value = 1100;
            updateParameter('rf-power', 1100);
        }
        
        // Show completion message
        const completion = document.createElement('div');
        completion.style.cssText = message.style.cssText;
        completion.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        completion.textContent = `${selectedTemplate} loaded successfully!`;
        document.body.appendChild(completion);
        
        setTimeout(() => {
            completion.remove();
        }, 2000);
    }, 1500);
}

// Save scenario
function saveScenario() {
    const scenarioData = {
        timestamp: new Date().toISOString(),
        name: `Scenario_${new Date().toISOString().split('T')[0]}`,
        parameters: currentParams,
        recipe: selectedRecipe,
        predictions: {
            yield: document.getElementById('predictedYield').textContent,
            throughput: document.getElementById('wphValue').textContent,
            confidence: document.getElementById('yieldConfidence').textContent
        }
    };
    
    const blob = new Blob([JSON.stringify(scenarioData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show save confirmation
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    message.textContent = 'Scenario saved successfully!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Run simulation
function runSimulation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    
    // Update status
    const statusElement = document.getElementById('simulationStatus');
    statusElement.textContent = 'Running...';
    statusElement.className = 'status-indicator running';
    
    // Update confidence
    const confidenceElement = document.getElementById('confidenceScore');
    confidenceElement.textContent = 'Confidence: Calculating...';
    
    // Disable run button
    const runButton = event.target;
    runButton.textContent = '🔄 Running Simulation...';
    runButton.disabled = true;
    
    // Simulate analysis time
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        runButton.textContent = `🔄 Running... ${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            completeSimulation();
        }
    }, 300);
}

// Complete simulation
function completeSimulation() {
    simulationRunning = false;
    
    // Update status
    const statusElement = document.getElementById('simulationStatus');
    statusElement.textContent = 'Complete';
    statusElement.className = 'status-indicator complete';
    
    // Calculate final results
    const finalYield = parseFloat(document.getElementById('predictedYield').textContent);
    const confidence = Math.floor(Math.random() * 15) + 80; // 80-95%
    
    // Update confidence
    const confidenceElement = document.getElementById('confidenceScore');
    confidenceElement.textContent = `Confidence: ${confidence}%`;
    
    // Update yield chart with simulation results
    if (yieldChart) {
        const simulatedData = [94.2];
        for (let i = 1; i <= 6; i++) {
            const variation = (Math.random() - 0.5) * 0.5;
            simulatedData.push(finalYield + variation);
        }
        
        yieldChart.data.datasets[0].data = simulatedData;
        yieldChart.update();
    }
    
    // Update other metrics
    updateSimulationResults();
    
    // Generate recommendations
    generateRecommendations();
    
    // Re-enable run button
    const runButton = document.querySelector('.control-btn.primary');
    runButton.textContent = '🚀 Run Simulation';
    runButton.disabled = false;
    
    // Show completion message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    message.textContent = `Simulation complete! Confidence: ${confidence}%`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Update simulation results
function updateSimulationResults() {
    // Update cycle time
    const baseTime = 42;
    const timeReduction = (currentParams['process-time'] - baselineParams['process-time']) / baselineParams['process-time'];
    const newCycleTime = Math.max(35, baseTime * (1 + timeReduction));
    document.getElementById('cycleTimeValue').textContent = Math.round(newCycleTime) + ' min';
    
    // Update OEE
    const baseOEE = 87.5;
    const oeeImprovement = Math.random() * 3 - 1; // -1% to +2%
    const newOEE = Math.max(80, Math.min(95, baseOEE + oeeImprovement));
    document.getElementById('oeeValue').textContent = newOEE.toFixed(1) + '%';
    
    // Update costs
    const baseMaterial = 1250;
    const baseEnergy = 320;
    const baseLab = 180;
    
    // Calculate cost changes based on parameters
    const energyChange = (currentParams['rf-power'] - baselineParams['rf-power']) / baselineParams['rf-power'];
    const timeChange = (currentParams['process-time'] - baselineParams['process-time']) / baselineParams['process-time'];
    
    const newEnergy = Math.round(baseEnergy * (1 + energyChange * 0.5));
    const newLabor = Math.round(baseLab * (1 + timeChange * 0.3));
    const newTotal = baseMaterial + newEnergy + newLabor;
    
    document.getElementById('energyCost').textContent = `$${newEnergy}`;
    document.getElementById('laborCost').textContent = `$${newLabor}`;
    document.getElementById('totalCost').textContent = `$${newTotal}`;
    
    // Update cost change indicator
    const costChange = newTotal - (baseMaterial + baseEnergy + baseLab);
    const costChangeElement = document.getElementById('costChange');
    
    if (Math.abs(costChange) < 10) {
        costChangeElement.textContent = 'No Change';
        costChangeElement.className = 'prediction-change';
    } else if (costChange > 0) {
        costChangeElement.textContent = `+$${costChange}`;
        costChangeElement.className = 'prediction-change negative';
    } else {
        costChangeElement.textContent = `-$${Math.abs(costChange)}`;
        costChangeElement.className = 'prediction-change positive';
    }
}

// Generate recommendations
function generateRecommendations() {
    const recommendations = [];
    
    // Analyze parameter deviations and generate recommendations
    const cvdDeviation = Math.abs(currentParams['cvd-temp'] - baselineParams['cvd-temp']);
    const pressureDeviation = Math.abs(currentParams['pressure'] - baselineParams['pressure']);
    const powerDeviation = Math.abs(currentParams['rf-power'] - baselineParams['rf-power']);
    
    if (cvdDeviation > 10) {
        recommendations.push({
            title: 'CVD Temperature Optimization',
            description: 'Current CVD temperature deviates significantly from baseline. Consider gradual adjustment to minimize thermal stress impact.',
            impact: 'Potential yield improvement: +1.2%'
        });
    }
    
    if (pressureDeviation > 0.2) {
        recommendations.push({
            title: 'Chamber Pressure Fine-tuning',
            description: 'Pressure settings show potential for optimization. Recommend controlled testing within ±0.1 mTorr range.',
            impact: 'Potential uniformity improvement: +15%'
        });
    }
    
    if (powerDeviation > 50) {
        recommendations.push({
            title: 'RF Power Calibration',
            description: 'RF power levels may benefit from recalibration. Consider equipment maintenance and parameter validation.',
            impact: 'Potential process stability improvement: +8%'
        });
    }
    
    if (selectedRecipe === 'experimental') {
        recommendations.push({
            title: 'Risk Mitigation Strategy',
            description: 'Experimental recipe shows promise but carries higher risk. Recommend pilot testing on limited lots before full deployment.',
            impact: 'Risk reduction while maintaining benefits'
        });
    }
    
    // Always add a general recommendation
    recommendations.push({
        title: 'Continuous Monitoring',
        description: 'Implement real-time parameter monitoring and automated alerts for early detection of process deviations.',
        impact: 'Proactive quality assurance and yield protection'
    });
    
    // Display recommendations
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = '';
    
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';
        recElement.innerHTML = `
            <div class="recommendation-title">${rec.title}</div>
            <div class="recommendation-description">${rec.description}</div>
            <div class="recommendation-impact">${rec.impact}</div>
        `;
        recommendationList.appendChild(recElement);
    });
}

