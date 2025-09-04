// AI Chat Functionality
let chatHistory = [];
let isTyping = false;

// Mock AI responses for different types of questions
const aiResponses = {
    yield: {
        keywords: ['yield', 'trend', 'analysis', 'performance'],
        responses: [
            {
                text: `Based on the latest data analysis, here's the yield trend for the past 24 hours:

📊 **Current Status:**
- Overall yield: 94.2% (+2.1% vs yesterday)
- Peak yield: 95.1% at 14:30
- Lowest yield: 92.8% at 06:15

📈 **Trend Analysis:**
- Steady improvement since 08:00
- Strong correlation with Stepper-01 stability (r=0.87)
- CVD-02 temperature variance impacting downstream yield

🔮 **Prediction:**
- Expected to reach 95.5% by end of shift
- Confidence level: 89%
- Key risk factor: CVD-02 maintenance window

**Recommendations:**
1. Continue monitoring Stepper-01 parameters
2. Schedule CVD-02 preventive maintenance
3. Optimize recipe parameters for Lot W2024-003`,
                charts: ['yield-trend-24h'],
                actions: ['View Detailed Report', 'Set Alert Threshold', 'Export Data']
            }
        ]
    },
    equipment: {
        keywords: ['equipment', 'tool', 'stepper', 'etcher', 'cvd', 'performance', 'maintenance'],
        responses: [
            {
                text: `🔧 **Equipment Performance Analysis**

**Critical Attention Required:**
- **CVD-02**: Temperature deviation detected (485°C vs 450°C target)
  - Status: Maintenance required
  - Impact: 0.8% yield loss potential
  - Action: Immediate calibration needed

**Performance Leaders:**
- **Stepper-01**: 92% utilization, excellent stability
- **Etcher-03**: 88% utilization, within spec

**Optimization Opportunities:**
- **Stepper-03**: Throughput 15% below target
  - Root cause: Recipe parameter drift
  - Solution: Adjust exposure time by -3%
  - Expected benefit: +12% throughput

**Maintenance Schedule:**
- CVD-02: Immediate (overdue)
- Implanter-04: Due in 3 days
- Stepper-02: Due in 7 days`,
                charts: ['equipment-oee', 'maintenance-schedule'],
                actions: ['Schedule Maintenance', 'View Equipment Details', 'Generate Work Order']
            }
        ]
    },
    rootcause: {
        keywords: ['root cause', 'defect', 'failure', 'analysis', 'lot'],
        responses: [
            {
                text: `🔍 **Root Cause Analysis: Lot W2024-001**

**Multi-Modal Analysis Results:**

📊 **Statistical Analysis:**
- Defect pattern: Edge exclusion (78% of failures)
- Spatial correlation: Strong clustering in quadrant 2
- Temporal pattern: Defects increased after 10:30

🖼️ **Wafer Map Analysis:**
- Pattern type: Radial gradient
- Severity: Moderate (5.8% yield loss)
- Similar pattern detected in Lots W2024-002, W2024-003

🔗 **Causal Inference:**
- **Primary cause (87% confidence)**: CVD-02 temperature instability
- **Secondary cause (65% confidence)**: Stepper-01 focus drift
- **Contributing factor**: Recipe parameter interaction

**Evidence Chain:**
1. CVD-02 temperature spike at 10:25 (+15°C)
2. Downstream impact on film uniformity
3. Stepper exposure compensation insufficient
4. Edge die failure cascade

**Recommended Actions:**
1. Immediate CVD-02 calibration
2. Stepper-01 focus adjustment
3. Recipe optimization for edge compensation
4. Implement real-time temperature monitoring`,
                charts: ['defect-pareto', 'wafer-map', 'correlation-matrix'],
                actions: ['Generate RCA Report', 'Create CAPA', 'Schedule Review Meeting']
            }
        ]
    },
    prediction: {
        keywords: ['predict', 'forecast', 'future', 'next', 'hours', 'days'],
        responses: [
            {
                text: `🔮 **Yield Prediction Forecast**

**Next 8 Hours Prediction:**
- **Hour 1-2**: 94.5% ± 0.3% (High confidence)
- **Hour 3-4**: 94.8% ± 0.5% (High confidence)
- **Hour 5-6**: 95.1% ± 0.7% (Medium confidence)
- **Hour 7-8**: 95.3% ± 1.0% (Medium confidence)

**Model Performance:**
- Algorithm: Ensemble (XGBoost + LSTM + Causal)
- Training data: 90 days, 2.1M wafers
- Accuracy: 94.2% (±1% tolerance)
- Last update: 15 minutes ago

**Key Influencing Factors:**
1. **Equipment stability** (40% weight)
   - Stepper-01: Stable trend
   - CVD-02: Risk factor (maintenance needed)
2. **Process parameters** (35% weight)
   - Temperature variance: Within control
   - Pressure stability: Good
3. **Environmental conditions** (15% weight)
   - Cleanroom: Optimal
   - Utilities: Stable
4. **Recipe interactions** (10% weight)
   - Current recipe: Optimized

**Risk Assessment:**
- **Low risk**: Next 4 hours
- **Medium risk**: Hours 5-8 (CVD-02 dependency)
- **Mitigation**: Preventive maintenance window`,
                charts: ['prediction-confidence', 'factor-importance'],
                actions: ['Set Prediction Alerts', 'View Model Details', 'Export Forecast']
            }
        ]
    },
    correlation: {
        keywords: ['correlate', 'correlation', 'parameter', 'relationship'],
        responses: [
            {
                text: `📊 **Parameter Correlation Analysis**

**Strong Correlations Detected:**

🔴 **Negative Correlations (Yield Impact):**
1. **CVD-02 Temperature Variance ↔ Yield** (r = -0.78)
   - 1°C variance = 0.5% yield loss
   - Critical threshold: ±5°C
   - Current status: 8°C variance (ALERT)

2. **Stepper Focus Drift ↔ CD Uniformity** (r = -0.65)
   - 10nm drift = 2% CD variation
   - Impact on downstream yield: 0.3%

🟢 **Positive Correlations (Performance Drivers):**
1. **Chamber Pressure Stability ↔ Film Quality** (r = +0.82)
   - Stable pressure = uniform deposition
   - Current performance: Excellent

2. **Recipe Optimization Score ↔ Throughput** (r = +0.71)
   - Optimized recipes show 15% better throughput

**Causal Relationships:**
- CVD temperature → Film stress → Wafer bow → Stepper focus
- Pressure stability → Deposition rate → Thickness uniformity
- Recipe parameters → Process window → Yield stability

**Actionable Insights:**
1. Implement tighter CVD temperature control (±2°C)
2. Enhance stepper autofocus algorithms
3. Optimize recipe parameter interactions
4. Add real-time correlation monitoring`,
                charts: ['correlation-heatmap', 'causal-graph'],
                actions: ['View Correlation Matrix', 'Set Monitoring Rules', 'Generate Analysis Report']
            }
        ]
    },
    lineage: {
        keywords: ['lineage', 'data', 'source', 'trace', 'origin'],
        responses: [
            {
                text: `🗂️ **Data Lineage: Wafer Test Results**

**Complete Data Journey:**

**📥 Source Systems:**
1. **MES Database** → Lot tracking, recipe data
2. **WAT System** → Electrical test results
3. **FDC Sensors** → Real-time process parameters
4. **Metrology Tools** → Physical measurements

**🔄 Processing Pipeline:**
1. **Raw Data Ingestion** (Every 5 minutes)
   - Format: JSON, CSV, Binary
   - Volume: ~50GB/day
   - Quality checks: 99.8% pass rate

2. **Data Transformation** (Spark ETL)
   - Standardization to unified schema
   - Quality validation and cleansing
   - Feature engineering and enrichment

3. **Data Storage**
   - **Data Lake**: Raw and curated data (MinIO)
   - **Data Warehouse**: Structured analytics (Greenplum)
   - **Real-time**: Streaming data (Kafka)

**🎯 Current Test Result Lineage:**
- **Wafer ID**: W2024-001-15
- **Test Station**: WAT-03
- **Test Time**: 2024-01-25 14:30:15
- **Recipe**: Standard_Test_v3.2
- **Operator**: Auto (System)

**Data Quality Metrics:**
- Completeness: 99.9%
- Accuracy: 99.7%
- Timeliness: <2 minutes lag
- Consistency: 100%

**Audit Trail:**
✅ All data transformations logged
✅ Version control for all schemas
✅ Automated quality monitoring
✅ Compliance with data governance`,
                charts: ['lineage-flow', 'quality-metrics'],
                actions: ['View Full Lineage', 'Download Audit Report', 'Check Data Quality']
            }
        ]
    }
};

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    setupEventListeners();
});

function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

function setupEventListeners() {
    // Hide suggested questions after first user message
    document.addEventListener('userMessageSent', function() {
        const suggestions = document.getElementById('suggestedQuestions');
        if (suggestions && chatHistory.filter(msg => msg.type === 'user').length === 1) {
            suggestions.style.display = 'none';
        }
    });
}

function askQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = question;
    sendMessage();
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('userMessageSent'));
    
    // Show typing indicator and generate AI response
    showTypingIndicator();
    setTimeout(() => {
        generateAIResponse(message);
    }, 1500 + Math.random() * 1000);
}

function addMessage(text, type, options = {}) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    if (type === 'ai') {
        avatar.textContent = '🤖';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    if (type === 'ai' && options.charts) {
        // Add charts section
        const chartsSection = document.createElement('div');
        chartsSection.className = 'message-charts';
        chartsSection.innerHTML = `
            <div class="charts-header">📊 Related Visualizations:</div>
            <div class="chart-links">
                ${options.charts.map(chart => `
                    <button class="chart-link" onclick="viewChart('${chart}')">
                        📈 ${chart.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                `).join('')}
            </div>
        `;
        messageText.appendChild(chartsSection);
    }
    
    // Convert markdown-like formatting to HTML
    const formattedText = formatMessageText(text);
    const textContent = document.createElement('div');
    textContent.innerHTML = formattedText;
    messageText.appendChild(textContent);
    
    if (type === 'ai' && options.actions) {
        // Add action buttons
        const actionsSection = document.createElement('div');
        actionsSection.className = 'message-actions';
        actionsSection.innerHTML = `
            <div class="actions-header">⚡ Quick Actions:</div>
            <div class="action-buttons">
                ${options.actions.map(action => `
                    <button class="action-button" onclick="performAction('${action}')">
                        ${action}
                    </button>
                `).join('')}
            </div>
        `;
        messageText.appendChild(actionsSection);
    }
    
    content.appendChild(messageText);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString();
    content.appendChild(messageTime);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store in chat history
    chatHistory.push({
        type: type,
        text: text,
        timestamp: new Date(),
        options: options
    });
}

function formatMessageText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
            const level = hashes.length;
            return `<h${level}>${content}</h${level}>`;
        });
}

function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const chatMessages = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span>Manus AI is analyzing...</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function generateAIResponse(userMessage) {
    hideTypingIndicator();
    
    const response = findBestResponse(userMessage);
    addMessage(response.text, 'ai', {
        charts: response.charts,
        actions: response.actions
    });
}

function findBestResponse(message) {
    const messageLower = message.toLowerCase();
    
    // Find the best matching response category
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [category, data] of Object.entries(aiResponses)) {
        const score = data.keywords.reduce((acc, keyword) => {
            return acc + (messageLower.includes(keyword) ? 1 : 0);
        }, 0);
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = category;
        }
    }
    
    if (bestMatch && bestScore > 0) {
        const responses = aiResponses[bestMatch].responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default response for unmatched queries
    return {
        text: `I understand you're asking about "${message}". 

While I can help with semiconductor manufacturing analysis, I might need more specific information to provide the most accurate insights. 

Here are some areas where I excel:
- 📊 Yield trend analysis and predictions
- 🔧 Equipment performance optimization  
- 🔍 Root cause analysis for defects
- 📈 Process parameter correlations
- ⚡ Real-time anomaly detection
- 📋 SOP and best practice recommendations

Could you please rephrase your question or provide more context? For example:
- "What's the yield trend for Lot W2024-001?"
- "Which equipment needs attention?"
- "Analyze defects in the last 24 hours"`,
        charts: [],
        actions: ['View Dashboard', 'Browse Knowledge Base', 'Contact Support']
    };
}

function viewChart(chartId) {
    alert(`Opening chart: ${chartId}\n\nThis would display an interactive visualization showing detailed data for ${chartId.replace('-', ' ')}.`);
}

function performAction(action) {
    const actionMessages = {
        'View Detailed Report': 'Opening detailed analytics report...',
        'Set Alert Threshold': 'Configuring alert thresholds...',
        'Export Data': 'Preparing data export...',
        'Schedule Maintenance': 'Opening maintenance scheduler...',
        'View Equipment Details': 'Loading equipment diagnostics...',
        'Generate Work Order': 'Creating maintenance work order...',
        'Generate RCA Report': 'Generating root cause analysis report...',
        'Create CAPA': 'Opening CAPA (Corrective and Preventive Action) form...',
        'Schedule Review Meeting': 'Scheduling review meeting with stakeholders...',
        'Set Prediction Alerts': 'Configuring prediction-based alerts...',
        'View Model Details': 'Opening ML model performance dashboard...',
        'Export Forecast': 'Exporting forecast data...',
        'View Correlation Matrix': 'Opening correlation analysis dashboard...',
        'Set Monitoring Rules': 'Configuring real-time monitoring rules...',
        'Generate Analysis Report': 'Generating comprehensive analysis report...',
        'View Full Lineage': 'Opening complete data lineage visualization...',
        'Download Audit Report': 'Preparing audit trail report...',
        'Check Data Quality': 'Running data quality assessment...',
        'View Dashboard': 'Redirecting to main dashboard...',
        'Browse Knowledge Base': 'Opening knowledge base search...',
        'Contact Support': 'Opening support ticket system...'
    };
    
    const message = actionMessages[action] || `Executing action: ${action}`;
    
    // Show action feedback
    const feedback = document.createElement('div');
    feedback.className = 'action-feedback';
    feedback.style.cssText = `
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
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        
        // For demo purposes, redirect to dashboard for certain actions
        if (action === 'View Dashboard') {
            window.location.href = 'index.html';
        }
    }, 2000);
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    const suggestedQuestions = document.getElementById('suggestedQuestions');
    
    // Keep only the welcome message
    const welcomeMessage = chatMessages.querySelector('.ai-message');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage);
    }
    
    // Show suggested questions again
    if (suggestedQuestions) {
        suggestedQuestions.style.display = 'block';
    }
    
    // Clear chat history
    chatHistory = [];
}

function exportChat() {
    const chatData = {
        timestamp: new Date().toISOString(),
        user: 'Engineer Chen',
        session_id: 'demo-session-' + Date.now(),
        messages: chatHistory
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function attachFile() {
    alert('File attachment feature would allow you to:\n\n• Upload wafer maps for analysis\n• Attach log files for troubleshooting\n• Share SOP documents\n• Upload test data for correlation analysis\n\nThis would integrate with the unified data model for comprehensive analysis.');
}

function startVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            const btn = document.querySelector('[onclick="startVoiceInput()"]');
            btn.style.background = 'rgba(239, 68, 68, 0.1)';
            btn.textContent = '🔴';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
        };
        
        recognition.onend = function() {
            const btn = document.querySelector('[onclick="startVoiceInput()"]');
            btn.style.background = 'transparent';
            btn.textContent = '🎤';
        };
        
        recognition.start();
    } else {
        alert('Voice input is not supported in this browser. Please use Chrome or Edge for voice input functionality.');
    }
}

function togglePanel() {
    const panel = document.querySelector('.context-panel');
    const isCollapsed = panel.style.width === '60px';
    
    if (isCollapsed) {
        panel.style.width = '350px';
        panel.querySelector('.panel-toggle').textContent = '⚙️';
    } else {
        panel.style.width = '60px';
        panel.querySelector('.panel-toggle').textContent = '📊';
    }
}

// Add CSS for message charts and actions
const additionalCSS = `
.message-charts {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.charts-header {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.chart-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.chart-link {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #667eea;
    border-radius: 6px;
    color: #667eea;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.chart-link:hover {
    background: #667eea;
    color: white;
}

.message-actions {
    margin: 1rem 0 0 0;
    padding: 1rem;
    background: rgba(16, 185, 129, 0.05);
    border-radius: 8px;
    border-left: 4px solid #10b981;
}

.actions-header {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.action-button {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #10b981;
    border-radius: 6px;
    color: #10b981;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.action-button:hover {
    background: #10b981;
    color: white;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

