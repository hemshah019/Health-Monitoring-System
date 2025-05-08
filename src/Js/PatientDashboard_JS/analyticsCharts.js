// Initialize Tab Switching Events
document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to each tab link
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Automatically load heart rate data on first load
    const heartRateTab = document.getElementById('heart-rate-tab');
    if (heartRateTab) {
        loadHeartRateData();
    }
});

// Handle Tab Switching and Chart Load
function switchTab(tabName) {
    // Deactivate all panels and tabs
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.classList.remove('active');
    });

    // Activate the selected panel and tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-link[data-tab="${tabName}"]`).classList.add('active');

    // Load respective chart data based on tab selected
    if (tabName === 'heart-rate-tab') {
        loadHeartRateData();
    }
    if (tabName === 'oxygen-tab') {
        loadSpO2Data();
    }
    if (tabName === 'temperature-tab') {
        loadTemperatureData();
    }
    if (tabName === 'fall-detection-tab') {
        loadFallDetectionData();
    }
}

// Load Heart Rate Chart and Stats
function loadHeartRateData() {
    const patientId = parseInt(document.querySelector('body').getAttribute('data-patient-id'));
    
    fetch(`/analytics/heart-rate/${patientId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderHeartRateCharts(data);
                updateHeartRateStats(data);
            } else {
                console.error('Error loading heart rate data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching heart rate data:', error);
        });
}

// Load SpO2 Chart and Stats
function loadSpO2Data() {
    const patientId = parseInt(document.querySelector('body').getAttribute('data-patient-id'));
    fetch(`/analytics/spo2/${patientId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderSpO2Charts(data);
                updateStatBox(data, 'SpO2', '%');
            }
        });
}

// Load Temperature Chart and Stats
function loadTemperatureData() {
    const patientId = parseInt(document.querySelector('body').getAttribute('data-patient-id'));
    fetch(`/analytics/temperature/${patientId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderTemperatureCharts(data);
                updateStatBox(data, 'Temperature', '°C');
            }
        });
}

// Load Fall Detection Chart and Stats
function loadFallDetectionData() {
    const patientId = parseInt(document.querySelector('body').getAttribute('data-patient-id'));
    fetch(`/analytics/fall-detection/${patientId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderFallDetectionCharts(data);
                updateFallDetectionStats(data);
            }
        });
}

// Render Heart Rate Line and Pie Charts
function renderHeartRateCharts(data) {
    // Line Chart of Heart Rate
    const lineCtx = document.getElementById('heartRateLineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: data.lineChartData.map(item => item.date),
                datasets: [{
                    label: 'Heart Rate (BPM)',
                    data: data.lineChartData.map(item => item.rate),
                    borderColor: 'rgb(255, 0, 55)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointBackgroundColor: data.lineChartData.map(item => 
                        item.status === 'High' ? 'rgba(255, 99, 132, 1)' :
                        item.status === 'Low' ? 'rgb(255, 183, 0)' :
                        'rgb(0, 186, 0)'
                    ),
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                layout: {
                  padding: {
                    left: 25,
                    right: 25
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: context => `Heart Rate: ${context.raw} BPM`,
                      afterLabel: context => {
                        const index = context.dataIndex;
                        return `Status: ${data.lineChartData[index].status}`;
                      }
                    }
                  },
                  datalabels: {
                    align: 'top',
                    anchor: 'end',
                    offset: 6,
                    clip: false,
                    formatter: value => `${value} BPM`,
                    font: {
                      weight: 'bold',
                      size: 14
                    },
                    color: '#333'
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Date & Time',
                      font: {
                        size: 16
                      }
                    }
                  },
                  y: {
                    beginAtZero: false,
                    suggestedMin: 40,
                    suggestedMax: 140,
                    ticks: {
                      callback: value => `${value} BPM`,
                      font: {
                        size: 14
                      }
                    },
                    title: {
                      display: true,
                      text: 'Heart Rate (BPM)',
                      font: {
                        size: 16
                      }
                    }
                  }
                }
              },
            plugins: [ChartDataLabels]
        });
    }

    // Pie Chart of HeartRate Status
    const pieCtx = document.getElementById('heartRatePieChart');
    if (pieCtx) {
        pieCtx.style.maxWidth = '650px';
        pieCtx.style.margin = '0 auto';

        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: data.pieChartData.map(item => item.status),
                datasets: [{
                    data: data.pieChartData.map(item => item.count),
                    backgroundColor: [
                        'rgba(0, 187, 0, 0.8)',     // Normal
                        'rgba(255, 183, 0, 0.8)',   // Low
                        'rgba(255, 0, 55, 0.8)'     // High
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: 10
                },
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => ({
                                        text: `${label}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    }));
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} readings (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 15
                        },
                        formatter: function(value, context) {
                            const label = context.chart.data.labels[context.dataIndex];
                            const percentage = Math.round((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                            return `${label}\n${percentage}%`;
                        },
                        anchor: 'center',
                        align: 'center',
                        offset: 0,
                        clip: false
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // Display total readings
        const totalReadings = data.lineChartData.length;
        const chartContainer = pieCtx.parentElement;

        // Avoid duplicate total count
        const existingTotalElement = chartContainer.querySelector('.total-readings');
        if (existingTotalElement) {
            chartContainer.removeChild(existingTotalElement);
        }

        const totalElement = document.createElement('div');
        totalElement.className = 'total-readings';
        totalElement.textContent = `Total Readings: ${totalReadings}`;
        totalElement.style.textAlign = 'center';
        totalElement.style.marginTop = '10px';
        totalElement.style.fontWeight = 'bold';
        chartContainer.appendChild(totalElement);
    }
}

// Render Heart Rate Stats
function updateHeartRateStats(data) {
    const avgElement = document.getElementById('avgHeartRate');
    if (avgElement) {
        avgElement.innerHTML = `${data.averageHeartRate} <span class="bpm-label">BPM</span>`;
    }
    
    const lastReading = data.lineChartData[data.lineChartData.length - 1];
    if (lastReading) {
        const lastElement = document.getElementById('lastHeartRate');
        if (lastElement) {
            lastElement.innerHTML = `${lastReading.rate} <span class="bpm-label">BPM</span>`;
            
            // Add appropriate color class based on status
            const statusClass = lastReading.status.toLowerCase();
            lastElement.className = `heart-rate-status ${statusClass}`;
            
            // Update status text
            const statusElement = document.getElementById('lastHeartRateStatus');
            if (statusElement) {
                statusElement.textContent = lastReading.status;
                statusElement.className = statusClass;
            }
        }
    }
}

// Render SpO2 Charts
function renderSpO2Charts(data) {
    // Line Chart of SpO2
    const lineCtx = document.getElementById('spO2LineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: data.lineChartData.map(item => item.date),
                datasets: [{
                    label: 'Oxygen Saturation (%)',
                    data: data.lineChartData.map(item => item.value),
                    borderColor: 'rgb(0, 123, 255)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointBackgroundColor: data.lineChartData.map(item =>
                        item.status === 'High' ? 'rgba(255, 99, 132, 1)' :
                        item.status === 'Low' ? 'rgb(255, 183, 0)' :
                        'rgb(0, 186, 0)'
                    ),
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                layout: {
                    padding: { left: 25, right: 25 }
                },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            afterLabel: context => `Status: ${data.lineChartData[context.dataIndex].status}`
                        }
                    },
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 6,
                        clip: false,
                        formatter: value => `${value}%`,
                        font: { weight: 'bold', size: 14 },
                        color: '#333'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date & Time',
                            font: { size: 16 }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        suggestedMin: 90,
                        suggestedMax: 102,
                        ticks: {
                            callback: value => `${value}%`,
                            font: { size: 14 }
                        },
                        title: {
                            display: true,
                            text: 'Oxygen Saturation (%)',
                            font: { size: 16 }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // Pie Chart of SpO2 Status
    const pieCtx = document.getElementById('spO2PieChart');
    if (pieCtx) {
        pieCtx.style.maxWidth = '650px';
        pieCtx.style.margin = '0 auto';

        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: data.pieChartData.map(item => item.status),
                datasets: [{
                    data: data.pieChartData.map(item => item.count),
                    backgroundColor: ['rgba(0, 187, 0, 0.8)', 'rgba(255, 183, 0, 0.8)', 'rgba(255, 0, 55, 0.8)'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: { padding: 10 },
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: { size: 16, weight: 'bold' },
                            generateLabels: chart => chart.data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }))
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} readings (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: { weight: 'bold', size: 15 },
                        formatter: (value, context) => {
                            const label = context.chart.data.labels[context.dataIndex];
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}\n${percentage}%`;
                        },
                        anchor: 'center',
                        align: 'center',
                        offset: 0,
                        clip: false
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // Display total readings
        const totalReadings = data.lineChartData.length;
        const chartContainer = pieCtx.parentElement;
        
        // Avoid duplicate total count
        const existingTotalElement = chartContainer.querySelector('.total-readings');
        if (existingTotalElement) {
            chartContainer.removeChild(existingTotalElement);
        }
        
        const totalElement = document.createElement('div');
        totalElement.className = 'total-readings';
        totalElement.textContent = `Total Readings: ${totalReadings}`;
        totalElement.style.textAlign = 'center';
        totalElement.style.marginTop = '10px';
        totalElement.style.fontWeight = 'bold';
        chartContainer.appendChild(totalElement)
    }
}

// Render Body Temperature Charts
function renderTemperatureCharts(data) {
    // Line Chart of Body Temperature
    const lineCtx = document.getElementById('temperatureLineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: data.lineChartData.map(item => item.date),
                datasets: [{
                    label: 'Body Temperature (°C)',
                    data: data.lineChartData.map(item => item.value),
                    borderColor: 'rgb(255, 247, 0)',
                    backgroundColor: 'rgba(221, 255, 0, 0.46)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointBackgroundColor: data.lineChartData.map(item =>
                        item.status === 'High' ? 'rgba(255, 99, 132, 1)' :
                        item.status === 'Low' ? 'rgb(255, 183, 0)' :
                        'rgb(0, 186, 0)'
                    ),
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                layout: {
                    padding: { left: 25, right: 25 }
                },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            afterLabel: context => `Status: ${data.lineChartData[context.dataIndex].status}`
                        }
                    },
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 6,
                        clip: false,
                        formatter: value => `${value}°C`,
                        font: { weight: 'bold', size: 14 },
                        color: '#333'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date & Time',
                            font: { size: 16 }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        suggestedMin: 35,
                        suggestedMax: 38,
                        ticks: {
                            callback: value => `${value}°C`,
                            font: { size: 14 }
                        },
                        title: {
                            display: true,
                            text: 'Body Temperature (°C)',
                            font: { size: 16 }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // Pie Chart of Body Temperature Status
    const pieCtx = document.getElementById('temperaturePieChart');
    if (pieCtx) {
        pieCtx.style.maxWidth = '650px';
        pieCtx.style.margin = '0 auto';

        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: data.pieChartData.map(item => item.status),
                datasets: [{
                    data: data.pieChartData.map(item => item.count),
                    backgroundColor: ['rgba(0, 187, 0, 0.8)', 'rgba(255, 183, 0, 0.8)', 'rgba(255, 0, 55, 0.8)'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: { padding: 10 },
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: { size: 16, weight: 'bold' },
                            generateLabels: chart => chart.data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }))
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} readings (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: { weight: 'bold', size: 15 },
                        formatter: (value, context) => {
                            const label = context.chart.data.labels[context.dataIndex];
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}\n${percentage}%`;
                        },
                        anchor: 'center',
                        align: 'center',
                        offset: 0,
                        clip: false
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // Display total readings
        const totalReadings = data.lineChartData.length;
        const chartContainer = pieCtx.parentElement;
        
        // Avoid duplicate total count
        const existingTotalElement = chartContainer.querySelector('.total-readings');
        if (existingTotalElement) {
            chartContainer.removeChild(existingTotalElement);
        }
        
        const totalElement = document.createElement('div');
        totalElement.className = 'total-readings';
        totalElement.textContent = `Total Readings: ${totalReadings}`;
        totalElement.style.textAlign = 'center';
        totalElement.style.marginTop = '10px';
        totalElement.style.fontWeight = 'bold';
        chartContainer.appendChild(totalElement)
    }
}

// Render SpO2 and Temp Stats
function updateStatBox(data, prefix, unitLabel) {
    const avgElem = document.getElementById(`avg${prefix}`);
    const lastElem = document.getElementById(`last${prefix}`);
    const statusElem = document.getElementById(`last${prefix}Status`);

    if (avgElem) avgElem.innerHTML = `${data[`average${prefix}`]} <span class="bpm-label">${unitLabel}</span>`;

    const last = data.lineChartData[data.lineChartData.length - 1];
    if (last) {
        lastElem.innerHTML = `${last.value} <span class="bpm-label">${unitLabel}</span>`;
        lastElem.className = `heart-rate-status ${last.status.toLowerCase()}`;
        statusElem.textContent = last.status;
        statusElem.className = last.status.toLowerCase();
    }
}


// // Render Fall Bar and Pie Charts
function renderFallDetectionCharts(data) {
    // Bar Chart of Total Fall in a day
    const lineCtx = document.getElementById('fallOverTimeChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'bar',
            data: {
                labels: data.lineChartData.map(item => item.date),
                datasets: [{
                    label: 'Number of Falls',
                    data: data.lineChartData.map(item => item.count),
                    backgroundColor: 'rgba(255, 0, 55, 0.6)',
                    borderColor: 'rgb(255, 0, 55)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.5
                }]
            },
            options: {
                responsive: true,
                layout: {
                    padding: { left: 20, right: 20, top: 10, bottom: 10 }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Falls: ${context.raw}`;
                            }
                        }
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'start',
                        color: '#333',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        formatter: value => `${value}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Falls',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            precision: 0
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // Pie Chart of Body Fall Direction
    const pieCtx = document.getElementById('fallDirectionPieChart');
    if (pieCtx) {
        pieCtx.style.maxWidth = '650px';
        pieCtx.style.margin = '0 auto';

        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: data.pieChartData.map(item => item.direction),
                datasets: [{
                    data: data.pieChartData.map(item => item.count),
                    backgroundColor: [
                        'rgba(255, 0, 55, 0.8)',  // Forward
                        'rgba(0, 123, 255, 0.8)', // Backward
                        'rgba(255, 183, 0, 0.8)', // Left
                        'rgba(0, 187, 0, 0.8)'    // Right
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: 10
                },
                plugins: {
                    legend: { 
                        position: 'right',
                        align: 'center',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => ({
                                        text: `${label}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    }));
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} falls (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: { weight: 'bold', size: 15 },
                        formatter: function(value, context) {
                            const label = context.chart.data.labels[context.dataIndex];
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}\n${percentage}%`;
                        },
                        anchor: 'center',
                        align: 'center',
                        offset: 0,
                        clip: false
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // Display total readings
        const totalReadings = data.lineChartData.length;
        const chartContainer = pieCtx.parentElement;

        // Avoid duplicate total count
        const existingTotalElement = chartContainer.querySelector('.total-readings');
        if (existingTotalElement) {
            chartContainer.removeChild(existingTotalElement);
        }

        const totalElement = document.createElement('div');
        totalElement.className = 'total-readings';
        totalElement.textContent = `Total Readings: ${totalReadings}`;
        totalElement.style.textAlign = 'center';
        totalElement.style.marginTop = '10px';
        totalElement.style.fontWeight = 'bold';
        chartContainer.appendChild(totalElement);
    }
}

// Render Fall Detection Stats
function updateFallDetectionStats(data) {
    const totalElem = document.getElementById('totalFalls');
    const lastDateElem = document.getElementById('lastFallDate');
    const lastDirectionElem = document.getElementById('lastFallDirection');

    if (totalElem) totalElem.textContent = data.totalFalls;
    if (lastDateElem && lastDirectionElem) {
        if (data.lastFall) {
            lastDateElem.textContent = data.lastFall.date;
            lastDirectionElem.textContent = data.lastFall.direction;
        } else {
            lastDateElem.textContent = 'N/A';
            lastDirectionElem.textContent = 'N/A';
        }
    }
}
