// Root Cause Analysis JavaScript
let currentChart = 'pareto';
let currentCausalView = 'network';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWaferMap();
    initializeStatisticalChart();
    initializeCausalNetwork();
    initializeCorrelationMatrix();
});

// Initialize large wafer map
function initializeWaferMap() {
    const waferMap = document.getElementById('waferMapLarge');
    if (!waferMap) return;

    const gridSize = 12;
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    const radius = 5;

    // Clear existing content
    waferMap.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const distance = Math.sqrt(Math.pow(row - centerX, 2) + Math.pow(col - centerY, 2));
            
            if (distance <= radius) {
                const die = document.createElement('div');
                die.style.cssText = `
                    width: 100%;
                    height: 100%;
                    border-radius: 1px;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                `;
                
                // Simulate defect pattern - radial gradient with edge clustering
                const edgeDistance = Math.min(distance / radius, 1);
                const quadrant2Factor = (row < centerX && col >= centerY) ? 2 : 1; // Q2 clustering
                const defectProbability = Math.pow(edgeDistance, 0.5) * 0.15 * quadrant2Factor;
                
                if (distance > radius - 0.3) {
                    die.style.backgroundColor = '#6b7280'; // Edge
                    die.title = `Edge Die (${row}, ${col})`;
                } else if (Math.random() < defectProbability) {
                    die.style.backgroundColor = '#ef4444'; // Fail
                    die.title = `Failed Die (${row}, ${col}) - Defect detected`;
                } else {
                    die.style.backgroundColor = '#10b981'; // Pass
                    die.title = `Passing Die (${row}, ${col})`;
                }
                
                die.addEventListener('click', function() {
                    showDieDetails(row, col, die.title);
                });
                
                die.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.2)';
                    this.style.zIndex = '10';
                });
                
                die.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.zIndex = '1';
                });
                
                waferMap.appendChild(die);
            }
        }
    }
}

// Show die details
function showDieDetails(row, col, status) {
    const details = {
        position: `(${row}, ${col})`,
        status: status.includes('Failed') ? 'Failed' : status.includes('Edge') ? 'Edge' : 'Pass',
        testResults: {
            'Electrical Test': status.includes('Failed') ? 'FAIL' : 'PASS',
            'Resistance': status.includes('Failed') ? '2.5kΩ (FAIL)' : '1.8kΩ (PASS)',
            'Leakage Current': status.includes('Failed') ? '15nA (FAIL)' : '2nA (PASS)',
            'Threshold Voltage': status.includes('Failed') ? '0.85V (FAIL)' : '0.72V (PASS)'
        },
        defectType: status.includes('Failed') ? 'Contact resistance anomaly' : 'N/A',
        rootCause: status.includes('Failed') ? 'CVD temperature spike impact' : 'N/A'
    };
    
    let detailsText = `Die Position: ${details.position}\nStatus: ${details.status}\n\nTest Results:\n`;
    for (const [test, result] of Object.entries(details.testResults)) {
        detailsText += `• ${test}: ${result}\n`;
    }
    detailsText += `\nDefect Type: ${details.defectType}\nRoot Cause: ${details.rootCause}`;
    
    alert(detailsText);
}

// Initialize statistical chart
function initializeStatisticalChart() {
    const ctx = document.getElementById('statisticalChart');
    if (!ctx) return;

    const paretoData = {
        labels: ['Edge Exclusion', 'Contact Resistance', 'Threshold Shift', 'Leakage Current', 'Open Circuit'],
        datasets: [
            {
                type: 'bar',
                label: 'Defect Count',
                data: [113, 28, 15, 8, 3],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Cumulative %',
                data: [67.7, 84.4, 93.4, 98.2, 100],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    window.statisticalChart = new Chart(ctx, {
        type: 'bar',
        data: paretoData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Defect Count'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Cumulative %'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Show different chart types
function showChart(chartType) {
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentChart = chartType;
    
    let newData;
    switch(chartType) {
        case 'pareto':
            newData = {
                labels: ['Edge Exclusion', 'Contact Resistance', 'Threshold Shift', 'Leakage Current', 'Open Circuit'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Defect Count',
                        data: [113, 28, 15, 8, 3],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: '#ef4444',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Cumulative %',
                        data: [67.7, 84.4, 93.4, 98.2, 100],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            };
            break;
        case 'trend':
            newData = {
                labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                datasets: [{
                    label: 'Defect Rate %',
                    data: [1.2, 1.5, 4.8, 5.8, 5.9, 5.8],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            };
            break;
        case 'distribution':
            newData = {
                labels: ['0-1%', '1-2%', '2-3%', '3-4%', '4-5%', '5-6%', '6-7%', '7-8%'],
                datasets: [{
                    label: 'Wafer Count',
                    data: [2, 5, 8, 3, 4, 2, 1, 0],
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            };
            break;
    }
    
    if (window.statisticalChart) {
        window.statisticalChart.data = newData;
        window.statisticalChart.update();
    }
}

// Initialize causal network
function initializeCausalNetwork() {
    const container = document.getElementById('causalNetwork');
    if (!container) return;

    // Create SVG for causal network
    const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 600 400');

    // Define nodes
    const nodes = [
        { id: 'cvd-temp', label: 'CVD-02\nTemperature', type: 'equipment', x: 100, y: 100 },
        { id: 'film-stress', label: 'Film\nStress', type: 'parameter', x: 250, y: 100 },
        { id: 'wafer-bow', label: 'Wafer\nBow', type: 'parameter', x: 400, y: 100 },
        { id: 'stepper-focus', label: 'Stepper\nFocus', type: 'parameter', x: 250, y: 200 },
        { id: 'cd-uniformity', label: 'CD\nUniformity', type: 'parameter', x: 400, y: 200 },
        { id: 'yield-loss', label: 'Yield\nLoss', type: 'outcome', x: 500, y: 150 }
    ];

    // Define edges with causal strength
    const edges = [
        { source: 'cvd-temp', target: 'film-stress', strength: 0.85 },
        { source: 'film-stress', target: 'wafer-bow', strength: 0.72 },
        { source: 'wafer-bow', target: 'stepper-focus', strength: 0.68 },
        { source: 'stepper-focus', target: 'cd-uniformity', strength: 0.65 },
        { source: 'film-stress', target: 'yield-loss', strength: 0.78 },
        { source: 'cd-uniformity', target: 'yield-loss', strength: 0.45 }
    ];

    // Draw edges
    svg.selectAll('.edge')
        .data(edges)
        .enter()
        .append('line')
        .attr('class', 'edge')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', d => d.strength > 0.7 ? '#ef4444' : d.strength > 0.4 ? '#f59e0b' : '#6b7280')
        .attr('stroke-width', d => d.strength * 4)
        .attr('marker-end', 'url(#arrowhead)');

    // Define arrowhead marker
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#333');

    // Draw nodes
    const nodeGroups = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    nodeGroups.append('circle')
        .attr('r', 25)
        .attr('fill', d => {
            switch(d.type) {
                case 'equipment': return '#3b82f6';
                case 'parameter': return '#f59e0b';
                case 'outcome': return '#ef4444';
                default: return '#6b7280';
            }
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .selectAll('tspan')
        .data(d => d.label.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i === 0 ? '-0.2em' : '1em')
        .text(d => d);

    // Add click handlers
    nodeGroups.on('click', function(event, d) {
        showNodeDetails(d);
    });
}

// Show causal view
function showCausalView(viewType) {
    // Update button states
    document.querySelectorAll('.card-controls .view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentCausalView = viewType;
    
    // For demo purposes, just show a message
    const container = document.getElementById('causalNetwork');
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
    overlay.textContent = `Loading ${viewType} view...`;
    container.style.position = 'relative';
    container.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 1500);
}

// Show node details
function showNodeDetails(node) {
    const details = {
        'cvd-temp': {
            name: 'CVD-02 Temperature',
            type: 'Equipment Parameter',
            currentValue: '485°C',
            targetValue: '450°C ± 5°C',
            deviation: '+15°C (300% of tolerance)',
            impact: 'Primary root cause of yield loss',
            recommendation: 'Immediate calibration required'
        },
        'film-stress': {
            name: 'Film Stress',
            type: 'Process Parameter',
            currentValue: '2.8 GPa',
            targetValue: '2.0 GPa ± 0.3 GPa',
            deviation: '+0.8 GPa (267% of tolerance)',
            impact: 'Causes wafer bow and downstream issues',
            recommendation: 'Monitor after CVD calibration'
        },
        'yield-loss': {
            name: 'Yield Loss',
            type: 'Process Outcome',
            currentValue: '5.8%',
            targetValue: '<1.0%',
            deviation: '+4.8% above target',
            impact: 'Direct financial impact: $125k/day',
            recommendation: 'Address root causes immediately'
        }
    };
    
    const detail = details[node.id];
    if (detail) {
        alert(`${detail.name}
        
Type: ${detail.type}
Current Value: ${detail.currentValue}
Target: ${detail.targetValue}
Deviation: ${detail.deviation}
Impact: ${detail.impact}
Recommendation: ${detail.recommendation}`);
    }
}

// Initialize correlation matrix
function initializeCorrelationMatrix() {
    const container = document.getElementById('correlationMatrix');
    if (!container) return;

    const parameters = ['CVD Temp', 'Pressure', 'Flow Rate', 'RF Power', 'Yield'];
    const correlationData = [
        [1.00, -0.23, 0.15, -0.08, -0.78],
        [-0.23, 1.00, 0.45, 0.32, 0.82],
        [0.15, 0.45, 1.00, 0.67, 0.34],
        [-0.08, 0.32, 0.67, 1.00, 0.28],
        [-0.78, 0.82, 0.34, 0.28, 1.00]
    ];

    container.innerHTML = '';

    for (let i = 0; i < parameters.length; i++) {
        for (let j = 0; j < parameters.length; j++) {
            const cell = document.createElement('div');
            cell.className = 'correlation-cell';
            
            const value = correlationData[i][j];
            const absValue = Math.abs(value);
            
            // Color based on correlation strength
            if (absValue >= 0.7) {
                cell.style.backgroundColor = value > 0 ? '#10b981' : '#ef4444';
            } else if (absValue >= 0.4) {
                cell.style.backgroundColor = value > 0 ? '#34d399' : '#f87171';
            } else {
                cell.style.backgroundColor = '#6b7280';
            }
            
            cell.textContent = value.toFixed(2);
            cell.title = `${parameters[i]} vs ${parameters[j]}: ${value.toFixed(3)}`;
            
            container.appendChild(cell);
        }
    }
}

// Set time range for timeline
function setTimeRange(range) {
    // Update button states
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // For demo purposes, just show a message
    console.log(`Time range set to: ${range}`);
}

// Filter recommendations by priority
function filterPriority(priority) {
    // Update button states
    document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const recommendations = document.querySelectorAll('.recommendation-item');
    
    recommendations.forEach(item => {
        if (priority === 'all') {
            item.style.display = 'flex';
        } else {
            const itemPriority = item.classList.contains(priority);
            item.style.display = itemPriority ? 'flex' : 'none';
        }
    });
}

// Run analysis
function runAnalysis() {
    const btn = event.target;
    const originalText = btn.textContent;
    
    btn.textContent = '🔄 Analyzing...';
    btn.disabled = true;
    
    // Simulate analysis time
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        
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
        message.textContent = 'Analysis complete! Results updated.';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }, 3000);
}

// Export report
function exportReport() {
    const reportData = {
        timestamp: new Date().toISOString(),
        lot: 'W2024-001',
        analysis: {
            confidence: 87,
            primaryCause: 'CVD-02 Temperature Instability',
            yieldLoss: 5.8,
            affectedWafers: 15,
            totalWafers: 25
        },
        recommendations: [
            {
                priority: 'Critical',
                title: 'Immediate CVD-02 Calibration',
                impact: 'Prevent 5-8% yield loss',
                effort: '2 hours',
                cost: '$500'
            },
            {
                priority: 'High',
                title: 'Stepper Focus Optimization',
                impact: 'Improve CD control by 40%',
                effort: '1 day',
                cost: '$2,000'
            }
        ]
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rca-report-${reportData.lot}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show export confirmation
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
    message.textContent = 'Report exported successfully!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

