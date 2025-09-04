// Mock data for charts and visualizations
const mockData = {
    yieldTrend: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            label: 'Yield %',
            data: [92.1, 93.5, 94.2, 93.8, 94.5, 94.2],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }
};

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeYieldChart();
    initializeWaferMap();
    startRealTimeUpdates();
});

// Initialize yield trend chart
function initializeYieldChart() {
    const ctx = document.getElementById('yieldChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: mockData.yieldTrend,
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
                    max: 96,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

// Initialize wafer map visualization
function initializeWaferMap() {
    const waferMap = document.getElementById('waferMap');
    if (!waferMap) return;

    // Create wafer map grid
    const gridSize = 10;
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    const radius = 4;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const distance = Math.sqrt(Math.pow(row - centerX, 2) + Math.pow(col - centerY, 2));
            
            if (distance <= radius) {
                const die = document.createElement('div');
                die.style.cssText = `
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                    cursor: pointer;
                `;
                
                // Simulate die status
                const rand = Math.random();
                if (distance > radius - 0.5) {
                    die.style.backgroundColor = '#6b7280'; // Edge
                    die.title = 'Edge Die';
                } else if (rand < 0.05) {
                    die.style.backgroundColor = '#ef4444'; // Fail
                    die.title = 'Failed Die';
                } else {
                    die.style.backgroundColor = '#10b981'; // Pass
                    die.title = 'Passing Die';
                }
                
                die.addEventListener('click', function() {
                    showDieDetails(row, col, die.title);
                });
                
                waferMap.appendChild(die);
            }
        }
    }
}

// Show die details on click
function showDieDetails(row, col, status) {
    alert(`Die Position: (${row}, ${col})\nStatus: ${status}\nTest Results: Available in detailed view`);
}

// Start real-time updates simulation
function startRealTimeUpdates() {
    // Update KPI values every 30 seconds
    setInterval(updateKPIs, 30000);
    
    // Update timestamps every minute
    setInterval(updateTimestamps, 60000);
}

// Update KPI values with slight variations
function updateKPIs() {
    const yieldElement = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
    const efficiencyElement = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
    const wafersElement = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
    
    if (yieldElement) {
        const currentYield = parseFloat(yieldElement.textContent);
        const newYield = (currentYield + (Math.random() - 0.5) * 0.5).toFixed(1);
        yieldElement.textContent = newYield + '%';
    }
    
    if (efficiencyElement) {
        const currentEff = parseFloat(efficiencyElement.textContent);
        const newEff = (currentEff + (Math.random() - 0.5) * 2).toFixed(1);
        efficiencyElement.textContent = newEff + '%';
    }
    
    if (wafersElement) {
        const currentWafers = parseInt(wafersElement.textContent.replace(',', ''));
        const newWafers = currentWafers + Math.floor(Math.random() * 20) - 10;
        wafersElement.textContent = newWafers.toLocaleString();
    }
}

// Update alert timestamps
function updateTimestamps() {
    const timeElements = document.querySelectorAll('.alert-time');
    timeElements.forEach((element, index) => {
        const minutes = (index + 1) * 5 + Math.floor(Math.random() * 10);
        element.textContent = `${minutes} minutes ago`;
    });
}

// Open AI chat interface
function openAIChat() {
    window.location.href = 'ai-chat.html';
}

// Equipment status click handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.equipment-item')) {
        const equipmentName = e.target.closest('.equipment-item').querySelector('.equipment-name').textContent;
        showEquipmentDetails(equipmentName);
    }
});

// Show equipment details
function showEquipmentDetails(equipmentName) {
    const details = {
        'Stepper-01': {
            status: 'Running',
            utilization: '92%',
            temperature: '23.5°C',
            pressure: '1.2 mTorr',
            lastMaintenance: '2024-01-15',
            nextMaintenance: '2024-02-15'
        },
        'Etcher-03': {
            status: 'Running',
            utilization: '88%',
            temperature: '45.2°C',
            pressure: '0.8 mTorr',
            lastMaintenance: '2024-01-20',
            nextMaintenance: '2024-02-20'
        },
        'CVD-02': {
            status: 'Maintenance',
            utilization: '0%',
            temperature: 'N/A',
            pressure: 'N/A',
            lastMaintenance: '2024-01-25',
            nextMaintenance: 'In Progress'
        },
        'Implanter-04': {
            status: 'Idle',
            utilization: '15%',
            temperature: '22.1°C',
            pressure: '0.5 mTorr',
            lastMaintenance: '2024-01-10',
            nextMaintenance: '2024-02-10'
        }
    };
    
    const detail = details[equipmentName];
    if (detail) {
        alert(`Equipment: ${equipmentName}
Status: ${detail.status}
Utilization: ${detail.utilization}
Temperature: ${detail.temperature}
Pressure: ${detail.pressure}
Last Maintenance: ${detail.lastMaintenance}
Next Maintenance: ${detail.nextMaintenance}`);
    }
}

// Alert click handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.alert-item')) {
        const alertTitle = e.target.closest('.alert-item').querySelector('.alert-title').textContent;
        showAlertDetails(alertTitle);
    }
});

// Show alert details
function showAlertDetails(alertTitle) {
    const alertDetails = {
        'Temperature Deviation': {
            severity: 'Critical',
            equipment: 'CVD-02',
            parameter: 'Chamber Temperature',
            currentValue: '485°C',
            threshold: '450°C',
            recommendation: 'Immediate maintenance required'
        },
        'Pressure Anomaly': {
            severity: 'Critical',
            equipment: 'Etcher-01',
            parameter: 'Chamber Pressure',
            currentValue: '1.8 mTorr',
            threshold: '1.0 ± 0.2 mTorr',
            recommendation: 'Check vacuum system'
        },
        'Throughput Decline': {
            severity: 'Warning',
            equipment: 'Stepper-03',
            parameter: 'Wafers per Hour',
            currentValue: '85 WPH',
            threshold: '100 WPH',
            recommendation: 'Monitor for trend continuation'
        }
    };
    
    const detail = alertDetails[alertTitle];
    if (detail) {
        alert(`Alert: ${alertTitle}
Severity: ${detail.severity}
Equipment: ${detail.equipment}
Parameter: ${detail.parameter}
Current Value: ${detail.currentValue}
Threshold: ${detail.threshold}
Recommendation: ${detail.recommendation}`);
    }
}

// Insight click handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.insight-item')) {
        const insightText = e.target.closest('.insight-item').querySelector('.insight-text').textContent;
        showInsightDetails(insightText);
    }
});

// Show insight details
function showInsightDetails(insightText) {
    if (insightText.includes('Yield Prediction')) {
        alert(`Detailed Yield Prediction:
Current Trend: +2.1% improvement
Confidence: 87%
Key Factors: Stepper-01 stability, CVD-02 temperature control
Recommended Actions: Continue current parameters, monitor Stepper-01 closely
Expected Timeline: 4-6 hours to reach target`);
    } else if (insightText.includes('Correlation Detected')) {
        alert(`Correlation Analysis:
Variables: CVD-02 temperature variance vs downstream yield
Correlation Coefficient: -0.78 (strong negative)
Statistical Significance: p < 0.001
Impact: 1°C variance = 0.5% yield loss
Recommended Action: Implement tighter temperature control`);
    } else if (insightText.includes('Optimization Opportunity')) {
        alert(`Optimization Details:
Equipment: Etcher-03
Current Recipe: Standard_Etch_v2.1
Proposed Changes: Reduce etch time by 5%, increase RF power by 3%
Expected Benefits: +8% throughput, <0.1% yield impact
Risk Assessment: Low
Implementation: Can be tested on next lot`);
    }
}

// Time selector change handler
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('time-selector')) {
        updateChartTimeRange(e.target.value);
    }
});

// Update chart based on time range selection
function updateChartTimeRange(timeRange) {
    // This would typically fetch new data from the backend
    console.log(`Updating chart for time range: ${timeRange}`);
    
    // For demo purposes, just show a message
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10;
        `;
        overlay.textContent = `Loading data for ${timeRange}...`;
        chartContainer.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, 1500);
    }
}

