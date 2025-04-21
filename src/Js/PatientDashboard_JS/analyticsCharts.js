document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Load heart rate data when tab is active
    const heartRateTab = document.getElementById('heart-rate-tab');
    if (heartRateTab) {
        loadHeartRateData();
    }
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-link[data-tab="${tabName}"]`).classList.add('active');

    // Load data for the selected tab
    if (tabName === 'heart-rate-tab') {
        loadHeartRateData();
    }
}

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

function renderHeartRateCharts(data) {
    // Line Chart
    const lineCtx = document.getElementById('heartRateLineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: data.lineChartData.map(item => item.date),
                datasets: [{
                    label: 'Heart Rate (BPM)',
                    data: data.lineChartData.map(item => item.rate),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointBackgroundColor: data.lineChartData.map(item => 
                        item.status === 'High' ? 'rgba(255, 99, 132, 1)' :
                        item.status === 'Low' ? 'rgba(255, 206, 86, 1)' :
                        'rgba(75, 192, 75, 1)'
                    ),
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                return `Status: ${data.lineChartData[index].status}`;
                            }
                        }
                    },
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        formatter: function(value) {
                            return value;
                        },
                        font: {
                            weight: 'bold',
                            size: 10
                        },
                        color: function(context) {
                            return '#333';
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 50,
                        suggestedMax: 120
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // Pie Chart
    const pieCtx = document.getElementById('heartRatePieChart');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: data.pieChartData.map(item => item.status),
                datasets: [{
                    data: data.pieChartData.map(item => item.count),
                    backgroundColor: [
                        'rgba(75, 192, 75, 0.8)', 
                        'rgba(255, 206, 86, 0.8)', 
                        'rgba(255, 99, 132, 0.8)'  
                    ],
                    borderColor: '#fff',           
                    borderWidth: 2                   
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 12
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {                                   
                                        return {
                                            text: `${label}`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            hidden: false,
                                            index: i
                                        };
                                    });
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
                            size: 12
                        },
                        formatter: function(value, context) {
                            const label = context.chart.data.labels[context.dataIndex];
                            const percentage = Math.round((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                            return `${label}\n${percentage}%`;
                        },
                        anchor: 'center',
                        align: 'center',
                        offset: 0
                    }
                },
                layout: {
                    padding: 20
                }
            },
            plugins: [ChartDataLabels]
        });
        
        // Add total readings text below the chart
        const totalReadings = data.lineChartData.length;
        const chartContainer = pieCtx.parentElement;
        const totalElement = document.createElement('div');
        totalElement.className = 'total-readings';
        totalElement.textContent = `Total readings: ${totalReadings}`;
        totalElement.style.textAlign = 'center';
        totalElement.style.marginTop = '10px';
        totalElement.style.fontWeight = 'bold';
        chartContainer.appendChild(totalElement);
    }
}

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