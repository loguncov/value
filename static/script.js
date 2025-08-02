// static/script.js
let portfolioData = [
  { ticker:'LKOH','name':'ЛУКОЙЛ','currentPrice':5910.5,'buyZone':{'min':5200,'max':6500},'fairZone':{'min':6200,'max':9200},'sellZone':{'min':8800,'max':10000},'avgPrice':null },
  { ticker:'TRNFP','name':'Транснефть ап','currentPrice':1311,'buyZone':{'min':1150,'max':1350},'fairZone':{'min':1300,'max':1700},'sellZone':{'min':1650,'max':1800},'avgPrice':null },
  { ticker:'TATNP','name':'Татнефть ап','currentPrice':610.6,'buyZone':{'min':580,'max':670},'fairZone':{'min':650,'max':780},'sellZone':{'min':750,'max':820},'avgPrice':null },
  { ticker:'SIBN','name':'Газпром нефть','currentPrice':506.05,'buyZone':{'min':480,'max':550},'fairZone':{'min':530,'max':680},'sellZone':{'min':650,'max':720},'avgPrice':null },
  { ticker:'SBER','name':'Сбербанк','currentPrice':304.22,'buyZone':{'min':290,'max':330},'fairZone':{'min':320,'max':420},'sellZone':{'min':400,'max':450},'avgPrice':null },
  { ticker:'CHMF','name':'Северсталь','currentPrice':996.4,'buyZone':{'min':950,'max':1080},'fairZone':{'min':1050,'max':1350},'sellZone':{'min':1300,'max':1450},'avgPrice':null },
  { ticker:'PLZL','name':'Полюс','currentPrice':10000.4,'buyZone':{'min':1850,'max':2050},'fairZone':{'min':2000,'max':2450},'sellZone':{'min':2400,'max':2600},'avgPrice':null },
  { ticker:'ROSN','name':'Роснефть','currentPrice':416.85,'buyZone':{'min':400,'max':470},'fairZone':{'min':450,'max':550},'sellZone':{'min':520,'max':580},'avgPrice':null },
  { ticker:'PHOR','name':'ФосАгро','currentPrice':6485,'buyZone':{'min':6200,'max':6700},'fairZone':{'min':6600,'max':7600},'sellZone':{'min':7500,'max':8000},'avgPrice':null },
  { ticker:'RAGR','name':'РусАгро','currentPrice':104.74,'buyZone':{'min':100,'max':125},'fairZone':{'min':120,'max':150},'sellZone':{'min':145,'max':170},'avgPrice':null }
];

let chart = null;

function getCurrentZone(price,b,f,s){
  if(price>=b.min&&price<=b.max) return {key:'buy',label:'Покупка'};
  if(price>=f.min&&price<=f.max) return {key:'fair',label:'Справедливо'};
  if(price>=s.min) return {key:'sell',label:'Фиксация'};
  return {key:'outside',label:'Вне зоны'};
}

function updateTable(){
  const tbody=document.getElementById('tableBody');
  tbody.innerHTML='';
  portfolioData.forEach((stock,i)=>{
    const zone=getCurrentZone(stock.currentPrice,stock.buyZone,stock.fairZone,stock.sellZone);
    const row=document.createElement('tr');
    row.innerHTML=`
<td><strong>${stock.ticker}</strong></td>
<td>${stock.name}</td>
<td>${stock.currentPrice.toFixed(2)}</td>
<td><input type="number" step="0.01" class="avg-input" data-index="${i}" value="${stock.avgPrice===null?'':stock.avgPrice}" /></td>
<td>${stock.buyZone.min}–${stock.buyZone.max}</td>
<td>${stock.fairZone.min}–${stock.fairZone.max}</td>
<td>${stock.sellZone.min}–${stock.sellZone.max}</td>
<td><span class="zone-${zone.key}">${zone.label}</span></td>`;
    tbody.appendChild(row);
  });
  document.querySelectorAll('.avg-input').forEach(input=>{
    input.addEventListener('input', async e => {
      const idx=+e.target.dataset.index;
      const v=parseFloat(e.target.value);
      portfolioData[idx].avgPrice=isNaN(v)?null:v;
      updateTable();
      renderChart();
      await saveAvgPrices();
    });
  });
}

function renderChart(){
  const labels = portfolioData.map(s => s.ticker);
  const buyMin  = portfolioData.map(s => s.buyZone.min);
  const buyMax  = portfolioData.map(s => s.buyZone.max);
  const fairMin = portfolioData.map(s => s.fairZone.min);
  const fairMax = portfolioData.map(s => s.fairZone.max);
  const sellMin = portfolioData.map(s => s.sellZone.min);
  const sellMax = portfolioData.map(s => s.sellZone.max);
  const current = portfolioData.map(s => s.currentPrice);
  const avg     = portfolioData.map(s => s.avgPrice);

  if(chart){ chart.destroy(); chart = null; }
  const ctx = document.getElementById('zonesChart').getContext('2d');

  chart = new Chart(ctx, {
    data: {
      labels,
      datasets: [
        { type:'bar', label:'Зона покупки',      data: buyMax,  backgroundColor:'rgba(72,187,120,0.6)', stack:'zones' },
        { type:'bar', label:'',                   data: buyMin.map((v,i)=>buyMax[i]-v), backgroundColor:'rgba(72,187,120,0.3)', stack:'zones' },
        { type:'bar', label:'Справедливая стоимость', data: fairMax, backgroundColor:'rgba(237,137,54,0.6)', stack:'zones' },
        { type:'bar', label:'',                   data: fairMin.map((v,i)=>fairMax[i]-v), backgroundColor:'rgba(237,137,54,0.3)', stack:'zones' },
        { type:'bar', label:'Зона фиксации',      data: sellMax, backgroundColor:'rgba(229,62,62,0.6)', stack:'zones' },
        { type:'bar', label:'',                   data: sellMin.map((v,i)=>sellMax[i]-v), backgroundColor:'rgba(229,62,62,0.3)', stack:'zones' },
        { type:'scatter', label:'Текущая цена', data: labels.map((_,i)=>({x:current[i], y:i})), backgroundColor:'#3182ce', pointRadius:6 },
        { type:'scatter', label:'Средняя цена',  data: labels.map((_,i)=>avg[i]!=null?{x:avg[i], y:i}:null).filter(d=>d), backgroundColor:'#6b46c1', pointStyle:'triangle', pointRadius:8 }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'logarithmic',
          title: { display: true, text: 'Логарифмическая шкала цены, ₽' },
          ticks: {
            callback: value => value.toLocaleString()
          }
        },
        y: {
          type: 'category',
          title: { display: true, text: 'Акции' }
        }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            title(items){ return portfolioData[items[0].dataIndex].name; },
            label(item){
              const idx = item.dataIndex;
              const stock = portfolioData[idx];
              if(item.dataset.label==='Текущая цена') return `Текущая: ${stock.currentPrice.toFixed(2)} ₽`;
              if(item.dataset.label==='Средняя цена') return `Средняя: ${stock.avgPrice.toFixed(2)} ₽`;
              return null;
            }
          }
        }
      }
    }
  });
}



async function refreshPrices(){
  try{
    const res=await fetch('/api/prices');
    if(!res.ok) throw new Error(res.statusText);
    const data=await res.json();
    portfolioData.forEach(s=>{ if(data[s.ticker]!=null) s.currentPrice=data[s.ticker]; });
    updateTable();
    renderChart();
    updateLastUpdateTime();
    alert('Цены успешно обновлены');
  }catch(err){
    console.error('Ошибка fetch:',err);
    alert('Ошибка при получении данных: '+err.message);
  }
}

async function loadAvgPrices(){
  const res=await fetch('/api/avg');
  const avgMap=await res.json();
  portfolioData.forEach(s=>{ s.avgPrice=avgMap[s.ticker]; });
}

async function saveAvgPrices(){
  const avgMap=Object.fromEntries(portfolioData.map(s=>[s.ticker,s.avgPrice]));
  await fetch('/api/avg',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(avgMap)});
}

function updateLastUpdateTime(){
  const now=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  document.getElementById('lastUpdate').textContent=`Последнее обновление: ${now}`;
}

function saveData(){
  const blob=new Blob([JSON.stringify(portfolioData,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='portfolio_data.json'; a.click(); URL.revokeObjectURL(a.href);
}

function loadData(){
  document.getElementById('fileJson').click();
}
function handleFileLoad(e){
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      portfolioData=JSON.parse(ev.target.result);
      updateTable();
      renderChart();
      updateLastUpdateTime();
    }catch{
      alert('Неверный формат JSON');
    }
  };
  reader.readAsText(file);
}

document.getElementById('refreshBtn').addEventListener('click',refreshPrices);
document.getElementById('saveBtn').addEventListener('click',saveData);
document.getElementById('loadJsonBtn').addEventListener('click',loadData);
document.getElementById('fileJson').addEventListener('change',handleFileLoad);

window.addEventListener('DOMContentLoaded', async ()=>{
  await loadAvgPrices();
  updateTable();
  renderChart();
});
