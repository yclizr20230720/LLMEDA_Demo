// Data Lineage JavaScript
let currentViewMode = 'lineage';
let selectedNode = null;
let lineageGraph = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLineageGraph();
});

// Initialize the lineage graph
function initializeLineageGraph() {
    const container = d3.select('#graphContent');
    const width = container.node().getBoundingClientRect().width;
    const height = container.node().getBoundingClientRect().height;

    // Clear existing content
    container.selectAll('*').remove();

    // Create SVG
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    // Define sample lineage data
    const nodes = [
        { id: 'mes-db', label: 'MES\nDatabase', type: 'source', x: 50, y: 100 },
        { id: 'wat-system', label: 'WAT\nSystem', type: 'source', x: 50, y: 200 },
        { id: 'fdc-sensors', label: 'FDC\nSensors', type: 'source', x: 50, y: 300 },
        { id: 'etl-pipeline', label: 'ETL\nPipeline', type: 'process', x: 200, y: 200 },
        { id: 'data-lake', label: 'Data Lake\n(MinIO)', type: 'storage', x: 350, y: 150 },
        { id: 'data-warehouse', label: 'Data Warehouse\n(Greenplum)', type: 'storage', x: 350, y: 250 },
        { id: 'analytics-engine', label: 'Analytics\nEngine', type: 'process', x: 500, y: 200 },
        { id: 'wafer-result', label: 'Wafer Test\nResult', type: 'output', x: 650, y: 200 }
    ];

    const links = [
        { source: 'mes-db', target: 'etl-pipeline', type: 'data-flow' },
        { source: 'wat-system', target: 'etl-pipeline', type: 'data-flow' },
        { source: 'fdc-sensors', target: 'etl-pipeline', type: 'data-flow' },
        { source: 'etl-pipeline', target: 'data-lake', type: 'data-flow' },
        { source: 'etl-pipeline', target: 'data-warehouse', type: 'data-flow' },
        { source: 'data-lake', target: 'analytics-engine', type: 'data-flow' },
        { source: 'data-warehouse', target: 'analytics-engine', type: 'data-flow' },
        { source: 'analytics-engine', target: 'wafer-result', type: 'data-flow' }
    ];

    // Create arrow marker
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
        .attr('fill', '#667eea');

    // Draw links
    const linkElements = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#667eea')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')
        .style('opacity', 0.7);

    // Draw nodes
    const nodeGroups = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .style('cursor', 'pointer');

    // Add node circles
    nodeGroups.append('circle')
        .attr('r', 30)
        .attr('fill', d => getNodeColor(d.type))
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');

    // Add node labels
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
        .attr('dy', (d, i) => i === 0 ? '-0.3em' : '1.2em')
        .text(d => d);

    // Add click handlers
    nodeGroups.on('click', function(event, d) {
        selectNode(d);
    });

    // Add hover effects
    nodeGroups.on('mouseenter', function(event, d) {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 35);
    });

    nodeGroups.on('mouseleave', function(event, d) {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 30);
    });

    lineageGraph = { svg, nodes, links };
}

// Get node color based on type
function getNodeColor(type) {
    const colors = {
        'source': '#3b82f6',      // Blue
        'process': '#10b981',     // Green
        'storage': '#f59e0b',     // Orange
        'output': '#ef4444'       // Red
    };
    return colors[type] || '#6b7280';
}

// Select a node and show details
function selectNode(node) {
    selectedNode = node;
    showNodeDetails(node);
    
    // Highlight selected node
    if (lineageGraph) {
        lineageGraph.svg.selectAll('.node circle')
            .attr('stroke-width', d => d.id === node.id ? 5 : 3)
            .attr('stroke', d => d.id === node.id ? '#667eea' : 'white');
    }
}

// Show node details in the panel
function showNodeDetails(node) {
    const panelContent = document.getElementById('panelContent');
    
    const nodeDetails = {
        'mes-db': {
            name: 'MES Database',
            type: 'Data Source',
            description: 'Manufacturing Execution System database containing lot tracking, recipe data, and process history',
            records: '1.2M records',
            updateFrequency: 'Real-time',
            schema: 'Lot, Wafer, Recipe, ProcessStep, Equipment',
            dataQuality: '99.8%',
            lastUpdate: '2024-01-25 15:30:15'
        },
        'wat-system': {
            name: 'WAT System',
            type: 'Data Source',
            description: 'Wafer Acceptance Test system providing electrical test results and parametric data',
            records: '450K test results',
            updateFrequency: 'Every 15 minutes',
            schema: 'TestResult, Parameter, Measurement, Specification',
            dataQuality: '99.7%',
            lastUpdate: '2024-01-25 15:28:42'
        },
        'fdc-sensors': {
            name: 'FDC Sensors',
            type: 'Data Source',
            description: 'Fault Detection and Classification sensors providing real-time equipment parameter monitoring',
            records: 'Streaming data',
            updateFrequency: 'Real-time (1Hz)',
            schema: 'Sensor, Timestamp, Value, Equipment, Parameter',
            dataQuality: '99.9%',
            lastUpdate: 'Live stream'
        },
        'etl-pipeline': {
            name: 'ETL Pipeline',
            type: 'Data Processing',
            description: 'Apache Spark-based ETL pipeline for data extraction, transformation, and loading',
            throughput: '47.2 GB/day',
            updateFrequency: 'Continuous',
            transformations: 'Standardization, Validation, Enrichment',
            dataQuality: '99.8%',
            lastRun: '2024-01-25 15:30:00'
        },
        'data-lake': {
            name: 'Data Lake (MinIO)',
            type: 'Data Storage',
            description: 'S3-compatible object storage for raw and curated data in multiple formats',
            capacity: '2.5 TB',
            updateFrequency: 'Continuous',
            formats: 'Parquet, JSON, CSV, Binary',
            dataQuality: '100%',
            lastBackup: '2024-01-25 02:00:00'
        },
        'data-warehouse': {
            name: 'Data Warehouse (Greenplum)',
            type: 'Data Storage',
            description: 'Distributed analytical database optimized for complex queries and reporting',
            capacity: '1.8 TB',
            updateFrequency: 'Every 5 minutes',
            tables: '156 tables',
            dataQuality: '99.9%',
            lastOptimization: '2024-01-24 22:00:00'
        },
        'analytics-engine': {
            name: 'Analytics Engine',
            type: 'Data Processing',
            description: 'AI/ML engine for advanced analytics, correlation analysis, and predictive modeling',
            models: '23 active models',
            updateFrequency: 'Continuous',
            capabilities: 'Prediction, Classification, Anomaly Detection',
            accuracy: '94.2%',
            lastTraining: '2024-01-24 18:00:00'
        },
        'wafer-result': {
            name: 'Wafer Test Result',
            type: 'Data Output',
            description: 'Final processed wafer test results with enriched metadata and quality scores',
            currentRecord: 'W2024-001-15',
            testDate: '2024-01-25 14:30:15',
            yieldScore: '94.2%',
            qualityGrade: 'A',
            confidence: '87%'
        }
    };
    
    const details = nodeDetails[node.id];
    if (!details) return;
    
    panelContent.innerHTML = `
        <div class="node-details">
            <div class="detail-section">
                <h4>📋 Basic Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${details.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${details.type}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${details.description}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>📊 Data Metrics</h4>
                ${details.records ? `
                <div class="detail-item">
                    <span class="detail-label">Records:</span>
                    <span class="detail-value">${details.records}</span>
                </div>` : ''}
                ${details.throughput ? `
                <div class="detail-item">
                    <span class="detail-label">Throughput:</span>
                    <span class="detail-value">${details.throughput}</span>
                </div>` : ''}
                ${details.capacity ? `
                <div class="detail-item">
                    <span class="detail-label">Capacity:</span>
                    <span class="detail-value">${details.capacity}</span>
                </div>` : ''}
                <div class="detail-item">
                    <span class="detail-label">Update Frequency:</span>
                    <span class="detail-value">${details.updateFrequency}</span>
                </div>
                ${details.dataQuality ? `
                <div class="detail-item">
                    <span class="detail-label">Data Quality:</span>
                    <span class="detail-value">${details.dataQuality}</span>
                </div>` : ''}
            </div>
            
            <div class="detail-section">
                <h4>🔧 Technical Details</h4>
                ${details.schema ? `
                <div class="detail-item">
                    <span class="detail-label">Schema:</span>
                    <span class="detail-value">${details.schema}</span>
                </div>` : ''}
                ${details.transformations ? `
                <div class="detail-item">
                    <span class="detail-label">Transformations:</span>
                    <span class="detail-value">${details.transformations}</span>
                </div>` : ''}
                ${details.formats ? `
                <div class="detail-item">
                    <span class="detail-label">Formats:</span>
                    <span class="detail-value">${details.formats}</span>
                </div>` : ''}
                ${details.models ? `
                <div class="detail-item">
                    <span class="detail-label">Models:</span>
                    <span class="detail-value">${details.models}</span>
                </div>` : ''}
                ${details.lastUpdate ? `
                <div class="detail-item">
                    <span class="detail-label">Last Update:</span>
                    <span class="detail-value">${details.lastUpdate}</span>
                </div>` : ''}
            </div>
        </div>
    `;
}

// Search lineage
function searchLineage() {
    const searchTerm = document.querySelector('.search-input').value;
    
    // Show search feedback
    const feedback = document.createElement('div');
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
    feedback.textContent = `Searching for: ${searchTerm}`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        
        // For demo, select the wafer result node
        if (lineageGraph) {
            const waferNode = lineageGraph.nodes.find(n => n.id === 'wafer-result');
            if (waferNode) {
                selectNode(waferNode);
            }
        }
    }, 1500);
}

// Trace lineage
function traceLineage() {
    const searchTerm = document.querySelector('.search-input').value;
    
    // Animate the lineage flow
    if (lineageGraph) {
        const links = lineageGraph.svg.selectAll('.link');
        
        // Reset all links
        links.style('opacity', 0.2)
             .attr('stroke-width', 1);
        
        // Highlight the path
        links.transition()
             .duration(500)
             .delay((d, i) => i * 200)
             .style('opacity', 0.9)
             .attr('stroke-width', 3)
             .attr('stroke', '#10b981');
        
        // Reset after animation
        setTimeout(() => {
            links.transition()
                 .duration(500)
                 .style('opacity', 0.7)
                 .attr('stroke-width', 2)
                 .attr('stroke', '#667eea');
        }, 3000);
    }
    
    // Show trace completion message
    setTimeout(() => {
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
        message.textContent = `Lineage trace complete for ${searchTerm}`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }, 3500);
}

// Filter by source
function filterBySource() {
    const source = event.target.value;
    console.log(`Filtering by source: ${source}`);
    
    // For demo purposes, just show a message
    if (source !== 'all') {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        message.textContent = `Filtered by: ${source.toUpperCase()}`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}

// Filter by time
function filterByTime() {
    const timeRange = event.target.value;
    console.log(`Filtering by time: ${timeRange}`);
}

// Change view mode
function changeViewMode() {
    const mode = event.target.value;
    currentViewMode = mode;
    
    console.log(`Changed view mode to: ${mode}`);
    
    // For demo purposes, just show a message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    message.textContent = `View mode: ${mode}`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Reset zoom
function resetZoom() {
    if (lineageGraph) {
        // Reset any transformations
        lineageGraph.svg.transition()
            .duration(500)
            .attr('transform', 'translate(0,0) scale(1)');
    }
}

// Export graph
function exportGraph() {
    const exportData = {
        timestamp: new Date().toISOString(),
        searchTerm: document.querySelector('.search-input').value,
        viewMode: currentViewMode,
        selectedNode: selectedNode ? selectedNode.id : null,
        nodes: lineageGraph ? lineageGraph.nodes : [],
        links: lineageGraph ? lineageGraph.links : []
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lineage-export-${new Date().toISOString().split('T')[0]}.json`;
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
    message.textContent = 'Lineage graph exported successfully!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Toggle layout
function toggleLayout() {
    // For demo purposes, just rearrange nodes slightly
    if (lineageGraph) {
        const nodes = lineageGraph.nodes;
        const svg = lineageGraph.svg;
        
        // Animate to new positions
        svg.selectAll('.node')
            .transition()
            .duration(1000)
            .attr('transform', (d, i) => {
                const newY = d.y + (Math.random() - 0.5) * 50;
                return `translate(${d.x}, ${newY})`;
            });
        
        // Update links
        svg.selectAll('.link')
            .transition()
            .duration(1000)
            .attr('y1', d => nodes.find(n => n.id === d.source).y + (Math.random() - 0.5) * 50)
            .attr('y2', d => nodes.find(n => n.id === d.target).y + (Math.random() - 0.5) * 50);
    }
}

// Close details panel
function closeDetails() {
    selectedNode = null;
    const panelContent = document.getElementById('panelContent');
    panelContent.innerHTML = `
        <div class="no-selection">
            <div class="no-selection-icon">🎯</div>
            <p>Click on any node in the lineage graph to view detailed information</p>
        </div>
    `;
    
    // Remove node highlighting
    if (lineageGraph) {
        lineageGraph.svg.selectAll('.node circle')
            .attr('stroke-width', 3)
            .attr('stroke', 'white');
    }
}

// Show model view
function showModelView(viewType) {
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all views
    document.getElementById('schemaView').style.display = 'none';
    document.getElementById('ontologyView').style.display = 'none';
    document.getElementById('relationshipsView').style.display = 'none';
    
    // Show selected view
    document.getElementById(viewType + 'View').style.display = 'block';
}

// Entity item click handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.entity-item')) {
        const entityName = e.target.closest('.entity-item').querySelector('.entity-name').textContent;
        showEntityDetails(entityName);
    }
});

// Show entity details
function showEntityDetails(entityName) {
    const entityDetails = {
        'Fab': {
            description: 'Top-level manufacturing facility entity',
            attributes: ['FabID', 'Name', 'Location', 'Capacity', 'Technology'],
            relationships: ['Contains Equipment', 'Processes Lots'],
            constraints: 'Unique FabID, Non-null Name'
        },
        'Equipment': {
            description: 'Manufacturing equipment and tools',
            attributes: ['EquipmentID', 'Type', 'Model', 'Status', 'Location'],
            relationships: ['Belongs to Fab', 'Executes Recipes', 'Processes Wafers'],
            constraints: 'Unique EquipmentID, Valid Status values'
        },
        'Lot': {
            description: 'Collection of wafers processed together',
            attributes: ['LotID', 'ProductType', 'Quantity', 'StartDate', 'Priority'],
            relationships: ['Contains Wafers', 'Follows Recipe', 'Processed by Equipment'],
            constraints: 'Unique LotID, Quantity > 0'
        },
        'Wafer': {
            description: 'Individual silicon wafer unit',
            attributes: ['WaferID', 'LotID', 'Position', 'Status', 'Diameter'],
            relationships: ['Belongs to Lot', 'Contains Dies', 'Has Test Results'],
            constraints: 'Unique WaferID, Valid Position in Lot'
        },
        'Recipe': {
            description: 'Process instructions and parameters',
            attributes: ['RecipeID', 'Name', 'Version', 'ProcessType', 'Parameters'],
            relationships: ['Defines Process Steps', 'Used by Equipment'],
            constraints: 'Unique RecipeID + Version, Valid Parameters'
        }
    };
    
    const details = entityDetails[entityName];
    if (details) {
        alert(`Entity: ${entityName}

Description: ${details.description}

Attributes: ${details.attributes.join(', ')}

Relationships: ${details.relationships.join(', ')}

Constraints: ${details.constraints}`);
    }
}

