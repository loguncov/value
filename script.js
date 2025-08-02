// Данные портфеля
let portfolioData = [
    {
        ticker: 'LKOH',
        name: 'ЛУКОЙЛ',
        currentPrice: 5910.5,
        buyZone: { min: 5200, max: 6500 },
        fairZone: { min: 6200, max: 9200 },
        sellZone: { min: 8800, max: 10000 }
    },
    {
        ticker: 'TRNFP',
        name: 'Транснефть ап',
        currentPrice: 1311,
        buyZone: { min: 1150, max: 1350 },
        fairZone: { min: 1300, max: 1700 },
        sellZone: { min: 1650, max: 1800 }
    },
    {
        ticker: 'TATNP',
        name: 'Татнефть ап',
        currentPrice: 610.6,
        buyZone: { min: 580, max: 670 },
        fairZone: { min: 650, max: 780 },
        sellZone: { min: 750, max: 820 }
    },
    {
        ticker: 'SIBN',
        name: 'Газпром нефть',
        currentPrice: 506.05,
        buyZone: { min: 480, max: 550 },
        fairZone: { min: 530, max: 680 },
        sellZone: { min: 650, max: 720 }
    },
    {
        ticker: 'SBER',
        name: 'Сбербанк',
        currentPrice: 304.22,
        buyZone: { min: 290, max: 330 },
        fairZone: { min: 320, max: 420 },
        sellZone: { min: 400, max: 450 }
    },
    {
        ticker: 'CHMF',
        name: 'Северсталь',
        currentPrice: 996.4,
        buyZone: { min: 950, max: 1080 },
        fairZone: { min: 1050, max: 1350 },
        sellZone: { min: 1300, max: 1450 }
    },
    {
        ticker: 'PLZL',
        name: 'Полюс',
        currentPrice: 1966.4,
        buyZone: { min: 1850, max: 2050 },
        fairZone: { min: 2000, max: 2450 },
        sellZone: { min: 2400, max: 2600 }
    },
    {
        ticker: 'ROSN',
        name: 'Роснефть',
        currentPrice: 416.85,
        buyZone: { min: 400, max: 470 },
        fairZone: { min: 450, max: 550 },
        sellZone: { min: 520, max: 580 }
    },
    {
        ticker: 'PHOR',
        name: 'ФосАгро',
        currentPrice: 6485,
        buyZone: { min: 6200, max: 6700 },
        fairZone: { min: 6600, max: 7600 },
        sellZone: { min: 7500, max: 8000 }
    },
    {
        ticker: 'RAGR',
        name: 'РусАгро',
        currentPrice: 104.74,
        buyZone: { min: 100, max: 125 },
        fairZone: { min: 120, max: 150 },
        sellZone: { min: 145, max: 170 }
    }
];

// Определение текущей зоны
function getCurrentZone(price, buyZone, fairZone, sellZone) {
    if (price >= buyZone.min && price <= buyZone.max) return 'buy';
    if (price >= fairZone.min && price <= fairZone.max) return 'fair';
    if (price >= sellZone.min) return 'sell';
    return 'outside';
}

// Обновление таблицы
function updateTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    portfolioData.forEach((stock, index) => {
        const zone = getCurrentZone(stock.currentPrice, stock.buyZone, stock.fairZone, stock.sellZone);
        const row = document.createElement('tr');
        
        const zoneNames = {
            'buy': 'Покупка',
            'fair': 'Справедливо',
            'sell': 'Фиксация',
            'outside': 'Вне зоны'
        };
        
        row.innerHTML = `
            <td><strong>${stock.ticker}</strong></td>
            <td>${stock.name}</td>
            <td><input type="number" class="price-input" value="${stock.currentPrice}" 
                onchange="updatePrice(${index}, this.value)" step="0.01"></td>
            <td>${stock.buyZone.min}–${stock.buyZone.max}</td>
            <td>${stock.fairZone.min}–${stock.fairZone.max}</td>
            <td>${stock.sellZone.min}–${stock.sellZone.max}</td>
            <td class="zone-${zone}">${zoneNames[zone]}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Обновление цены
function updatePrice(index, newPrice) {
    portfolioData[index].currentPrice = parseFloat(newPrice);
    updateTable();
    updateChart();
}

// Создание графика
function updateChart() {
    const traces = [];
    
    // Создаем горизонтальные полосы для каждой зоны
    portfolioData.forEach((stock, i) => {
        const y = i;
        
        // Зона покупки
        traces.push({
            x: [stock.buyZone.min, stock.buyZone.max],
            y: [y, y],
            mode: 'lines',
            line: { color: '#2ecc71', width: 20 },
            name: i === 0 ? 'Зона покупки' : '',
            legendgroup: 'buy',
            showlegend: i === 0,
            hovertemplate: `${stock.name}<br>Зона покупки: ${stock.buyZone.min}–${stock.buyZone.max} ₽<extra></extra>`
        });
        
        // Справедливая зона
        traces.push({
            x: [stock.fairZone.min, stock.fairZone.max],
            y: [y, y],
            mode: 'lines',
            line: { color: '#f39c12', width: 20 },
            name: i === 0 ? 'Справедливая стоимость' : '',
            legendgroup: 'fair',
            showlegend: i === 0,
            hovertemplate: `${stock.name}<br>Справедливо: ${stock.fairZone.min}–${stock.fairZone.max} ₽<extra></extra>`
        });
        
        // Зона фиксации
        traces.push({
            x: [stock.sellZone.min, stock.sellZone.max],
            y: [y, y],
            mode: 'lines',
            line: { color: '#e74c3c', width: 20 },
            name: i === 0 ? 'Зона фиксации' : '',
            legendgroup: 'sell',
            showlegend: i === 0,
            hovertemplate: `${stock.name}<br>Фиксация: ${stock.sellZone.min}–${stock.sellZone.max} ₽<extra></extra>`
        });
        
        // Текущая цена
        traces.push({
            x: [stock.currentPrice],
            y: [y],
            mode: 'markers',
            marker: { 
                color: '#3498db', 
                size: 12, 
                symbol: 'circle',
                line: { color: 'white', width: 2 }
            },
            name: i === 0 ? 'Текущая цена' : '',
            legendgroup: 'current',
            showlegend: i === 0,
            hovertemplate: `${stock.name}<br>Текущая цена: ${stock.currentPrice} ₽<extra></extra>`
        });
    });
    
    const layout = {
        title: {
            text: 'Зоны стоимости и текущие цены',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Цена (₽)',
            type: 'log',
            gridcolor: '#e0e0e0'
        },
        yaxis: {
            title: 'Активы',
            tickvals: portfolioData.map((_, i) => i),
            ticktext: portfolioData.map(stock => stock.name),
            gridcolor: '#e0e0e0'
        },
        hovermode: 'closest',
        legend: {
            x: 1,
            y: 1,
            bgcolor: 'rgba(255,255,255,0.8)'
        },
        margin: { l: 150, r: 50, t: 80, b: 60 },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white'
    };
    
    Plotly.newPlot('chart', traces, layout, { responsive: true });
}

// Симуляция обновления цен через API
async function updatePrices() {
    showStatus('Обновление цен...', 'loading');
    
    // Симуляция задержки API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Симуляция изменения цен (±5%)
    portfolioData.forEach(stock => {
        const change = (Math.random() - 0.5) * 0.1; // ±5%
        stock.currentPrice = Math.round(stock.currentPrice * (1 + change) * 100) / 100;
    });
    
    updateTable();
    updateChart();
    
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('ru-RU');
    showStatus('Цены обновлены успешно!', 'success');
    
    setTimeout(() => hideStatus(), 3000);
}

// Показать статус
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
}

// Скрыть статус
function hideStatus() {
    document.getElementById('status').style.display = 'none';
}

// Сохранение в файл
function saveToFile() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio_zones.json';
    link.click();
    URL.revokeObjectURL(url);
    
    showStatus('Данные сохранены!', 'success');
    setTimeout(() => hideStatus(), 2000);
}

// Загрузка из файла
function loadFromFile() {
    document.getElementById('fileInput').click();
}

// Обработчик загрузки файла
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                portfolioData = JSON.parse(e.target.result);
                updateTable();
                updateChart();
                showStatus('Данные загружены!', 'success');
                setTimeout(() => hideStatus(), 2000);
            } catch (error) {
                showStatus('Ошибка загрузки файла', 'error');
                setTimeout(() => hideStatus(), 3000);
            }
        };
        reader.readAsText(file);
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateTable();
    updateChart();
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('ru-RU');
});
