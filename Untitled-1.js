// // Pie Chart
// const pieCtx = document.getElementById('heartRatePieChart');
// if (pieCtx) {
//     new Chart(pieCtx, {
//         type: 'pie',
//         data: {
//             labels: data.pieChartData.map(item => item.status),
//             datasets: [{
//                 data: data.pieChartData.map(item => item.count),
//                 backgroundColor: [
//                     'rgba(0, 187, 0, 0.8)', 
//                     'rgba(255, 183, 0, 0.8)', 
//                     'rgba(255, 0, 55, 0.8)'  
//                 ],
//                 borderColor: '#fff',           
//                 borderWidth: 2                   
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'right',
//                     labels: {
//                         boxWidth: 15,
//                         padding: 15,
//                         font: {
//                             size: 12
//                         },
//                         generateLabels: function(chart) {
//                             const data = chart.data;
//                             if (data.labels.length && data.datasets.length) {
//                                 return data.labels.map((label, i) => {                                   
//                                     return {
//                                         text: `${label}`,
//                                         fillStyle: data.datasets[0].backgroundColor[i],
//                                         hidden: false,
//                                         index: i
//                                     };
//                                 });
//                             }
//                             return [];
//                         }
//                     }
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: function(context) {
//                             const label = context.label || '';
//                             const value = context.raw || 0;
//                             const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
//                             const percentage = Math.round((value / total) * 100);
//                             return `${label}: ${value} readings (${percentage}%)`;
//                         }
//                     }
//                 },
//                 datalabels: {
//                     color: '#fff',
//                     font: {
//                         weight: 'bold',
//                         size: 12
//                     },
//                     formatter: function(value, context) {
//                         const label = context.chart.data.labels[context.dataIndex];
//                         const percentage = Math.round((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
//                         return `${label}\n${percentage}%`;
//                     },
//                     anchor: 'center',
//                     align: 'center',
//                     offset: 0
//                 }
//             },
//             layout: {
//                 padding: 20
//             }
//         },
//         plugins: [ChartDataLabels]
//     });
    
//     // Add total readings text below the chart
//     const totalReadings = data.lineChartData.length;
//     const chartContainer = pieCtx.parentElement;
    
//     // Remove any existing total readings element to prevent duplicates
//     const existingTotalElement = chartContainer.querySelector('.total-readings');
//     if (existingTotalElement) {
//         chartContainer.removeChild(existingTotalElement);
//     }
    
//     const totalElement = document.createElement('div');
//     totalElement.className = 'total-readings';
//     totalElement.textContent = `Total readings: ${totalReadings}`;
//     totalElement.style.textAlign = 'center';
//     totalElement.style.marginTop = '10px';
//     totalElement.style.fontWeight = 'bold';
//     chartContainer.appendChild(totalElement);
// }
