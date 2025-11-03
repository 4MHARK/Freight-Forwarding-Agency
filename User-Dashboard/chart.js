
console.log("ApexCharts script loaded."); // Should see this

// Basic data
const testData = [10, 41, 35, 51, 49, 62, 69, 91, 148];
const testLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// Options
const options = {
    series: [{
        name: "Series 1",
        data: testData
    }],
    chart: {
        height: '100%', // Use 100% height
        type: 'line',
        background: 'transparent', // Make background transparent to match parent
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeout', speed: 1000 }
    },
    colors: ['#00A757'],
    xaxis: { categories: testLabels, labels: { style: { colors: '#b3d4d6' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: '#b3d4d6' } }, min: 0, max: 150 },
    grid: { borderColor: '#4f7c80' },
    tooltip: { theme: 'dark' }
};

// Initialize and render
const testChartElement = document.getElementById('testLineChart');
if (testChartElement) {
    console.log("Test chart element found, initializing ApexCharts...");
    const chart = new ApexCharts(testChartElement, options);
    chart.render();
} else {
    console.error("Test chart element #testLineChart NOT found!");
}

// Basic resize handler for standalone test
window.addEventListener('resize', () => {
    if (chart) chart.resize();
});