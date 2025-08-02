# app.py
from flask import Flask, render_template, jsonify, request
import requests
import json
import os

app = Flask(__name__)

AVG_FILE = 'avg_prices.json'

# Начальные данные портфеля
portfolio_data = [
    {'ticker':'LKOH','name':'ЛУКОЙЛ','currentPrice':5910.5,'buyZone':{'min':5200,'max':6500},'fairZone':{'min':6200,'max':9200},'sellZone':{'min':8800,'max':10000},'avgPrice':None},
    {'ticker':'TRNFP','name':'Транснефть ап','currentPrice':1311,'buyZone':{'min':1150,'max':1350},'fairZone':{'min':1300,'max':1700},'sellZone':{'min':1650,'max':1800},'avgPrice':None},
    {'ticker':'TATNP','name':'Татнефть ап','currentPrice':610.6,'buyZone':{'min':580,'max':670},'fairZone':{'min':650,'max':780},'sellZone':{'min':750,'max':820},'avgPrice':None},
    {'ticker':'SIBN','name':'Газпром нефть','currentPrice':506.05,'buyZone':{'min':480,'max':550},'fairZone':{'min':530,'max':680},'sellZone':{'min':650,'max':720},'avgPrice':None},
    {'ticker':'SBER','name':'Сбербанк','currentPrice':304.22,'buyZone':{'min':290,'max':330},'fairZone':{'min':320,'max':420},'sellZone':{'min':400,'max':450},'avgPrice':None},
    {'ticker':'CHMF','name':'Северсталь','currentPrice':996.4,'buyZone':{'min':950,'max':1080},'fairZone':{'min':1050,'max':1350},'sellZone':{'min':1300,'max':1450},'avgPrice':None},
    {'ticker':'PLZL','name':'Полюс','currentPrice':1966.4,'buyZone':{'min':1850,'max':2050},'fairZone':{'min':2000,'max':2450},'sellZone':{'min':2400,'max':2600},'avgPrice':None},
    {'ticker':'ROSN','name':'Роснефть','currentPrice':416.85,'buyZone':{'min':400,'max':470},'fairZone':{'min':450,'max':550},'sellZone':{'min':520,'max':580},'avgPrice':None},
    {'ticker':'PHOR','name':'ФосАгро','currentPrice':6485,'buyZone':{'min':6200,'max':6700},'fairZone':{'min':6600,'max':7600},'sellZone':{'min':7500,'max':8000},'avgPrice':None},
    {'ticker':'RAGR','name':'РусАгро','currentPrice':104.74,'buyZone':{'min':100,'max':125},'fairZone':{'min':120,'max':150},'sellZone':{'min':145,'max':170},'avgPrice':None}
]

# Создать файл avg_prices.json, если отсутствует
if not os.path.exists(AVG_FILE):
    with open(AVG_FILE, 'w', encoding='utf-8') as f:
        json.dump({s['ticker']: None for s in portfolio_data}, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/prices')
def prices():
    tickers = ','.join(s['ticker'] for s in portfolio_data)
    url = (
        'https://iss.moex.com/iss/engines/stock/markets/shares/securities.json'
        '?iss.meta=off&iss.only=marketdata'
        '&marketdata.columns=SECID,LAST'
        f'&securities={tickers}'
    )
    r = requests.get(url)
    data = r.json().get('marketdata', {}).get('data', [])
    price_map = {sec: float(last) for sec, last in data if last is not None}
    return jsonify(price_map)

@app.route('/api/avg', methods=['GET'])
def get_avg():
    with open(AVG_FILE, 'r', encoding='utf-8') as f:
        avg_map = json.load(f)
    return jsonify(avg_map)

@app.route('/api/avg', methods=['POST'])
def save_avg():
    avg_map = request.json
    with open(AVG_FILE, 'w', encoding='utf-8') as f:
        json.dump(avg_map, f, ensure_ascii=False, indent=2)
    return '', 204

if __name__ == '__main__':
    # Доступ по локальному IP, порт 5000
    app.run(host='0.0.0.0', port=5000, debug=True)