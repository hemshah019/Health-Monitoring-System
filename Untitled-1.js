// // Modify the renderHeartRateCharts function - pie chart section
// const pieCtx = document.getElementById('heartRatePieChart');
// if (pieCtx) {
//     new Chart(pieCtx, {
//         type: 'pie',
//         data: {
//             labels: data.pieChartData.map(item => `${item.status} (${item.percentage}%)`),
//             datasets: [{
//                 data: data.pieChartData.map(item => item.count),
//                 backgroundColor: [
//                     'rgba(75, 192, 75, 0.7)',    // Green for Normal
//                     'rgba(255, 206, 86, 0.7)',   // Yellow for Low
//                     'rgba(255, 99, 132, 0.7)'    // Red for High
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 75, 1)',      // Green border
//                     'rgba(255, 206, 86, 1)',     // Yellow border
//                     'rgba(255, 99, 132, 1)'      // Red border
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'right',
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: function(context) {
//                             const label = context.label || '';
//                             const value = context.raw || 0;
//                             return `${label.split(' (')[0]}: ${value} readings`;
//                         },
//                         footer: function(tooltipItems) {
//                             const totalReadings = data.lineChartData.length;
//                             return `Total readings: ${totalReadings}`;
//                         }
//                     }
//                 },
//                 title: {
//                     display: true,
//                     text: `Total readings: ${data.lineChartData.length}`,
//                     position: 'bottom',
//                     font: {
//                         size: 14
//                     }
//                 }
//             }
//         }
//     });
// }