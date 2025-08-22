let currentChart;

document.getElementById("simulate-btn").addEventListener("click", simulate);

const simulations = 40;

function boxMuller() {
    let u = Math.random();
    let v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function simulate() {
    let initialAmount = parseFloat(document.getElementById("initial-amount").value);
    let annualExpense = parseFloat(document.getElementById("annual-expense").value);
    let annualReturn = parseFloat(document.getElementById("annual-return").value) / 100;
    let volatility = parseFloat(document.getElementById("volatility").value) / 100;
    let inflationRate = parseFloat(document.getElementById("inflation-rate").value) / 100;
    let yearsLeft = parseInt(document.getElementById("years-left").value);

    let successCount = 0;
    let chartData = [];

    for (let i = 0; i < simulations; i++) {
        let amount = initialAmount;
        let yearlyData = [initialAmount];

        for (let j = 0; j < yearsLeft; j++) {
            let realReturn = ((1 + annualReturn + volatility * boxMuller()) / (1 + inflationRate)) - 1;
            amount += realReturn * amount - annualExpense;
            yearlyData.push(amount);
            if (amount <= 0) break;
        }

        if (yearlyData[yearlyData.length - 1] > 0) successCount++;
        chartData.push(yearlyData);
    }

    let successRate = (successCount / simulations) * 100;
    document.getElementById("success-rate").innerText = successRate.toFixed(2) + "%";

    displayChart(chartData, yearsLeft);
}

function displayChart(data, yearsLeft) {
    let ctx = document.getElementById('chart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    let datasets = data.map((yearlyData, idx) => ({
        data: yearlyData,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
        fill: false
    }));

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: yearsLeft + 1 }, (_, i) => i),
            datasets: datasets
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        min: 0,
                        max: yearsLeft
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
