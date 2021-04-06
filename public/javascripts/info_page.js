$(function(){
  'use strict';

  //convert Hex to RGBA
  function convertHex(hex,opacity){
    hex = hex.replace('#','');
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);

    var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
  }


  // asset_recode


  // Data push labels for chart1,2 (현재 가격, 보유 수량) && data for chart 1
  var labels = [];
  var data = [];
  let max_data_numb = Math.min(15,asset_recode.length);

  for(let i = 0; i < max_data_numb; i++){
    labels[max_data_numb - i - 1] = asset_recode[i].time;
    data[max_data_numb - i - 1] = asset_recode[i].price;
  }
  
  var data = {
    labels: labels,
    datasets: [
      {
        label: ' 가격 ',
        backgroundColor: 'rgba(255,255,255,.3)',
        borderColor: 'rgba(255,255,255,.55)',
        data: data
      },
    ]
  };
  var options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }],
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        radius: 4,
        hitRadius: 15,
        hoverRadius: 4,
      },
    },
    tooltips: {
        

      }

  };
  var ctx = $('#card-chart1');
  var cardChart1 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });

  // push data for chart2 (보유 수량)
  var data = [];
  for(let i = 0; i < max_data_numb; i++){
    data[max_data_numb - i - 1] = asset_recode[i].after_count
  }

  var data = {
    labels: labels,
    datasets: [
      {
        label: ' 보유 수량 ',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: data
      },
    ]
  };

  var ctx = $('#card-chart2');
  var cardChart2 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });

  // Data push chart3 (평균 구매가, 총 실현손익)
  var data = [];

  for(let i = 0; i < max_data_numb; i++){
    data[max_data_numb - i - 1] = asset_recode[i].average_bought_price;
  }
  
  var data = {
    labels: labels,
    datasets: [
      {
        label: ' 평균 구매가 ',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: data
      },
    ]
  };
  var ctx = $('#card-chart3');
  var cardChart3 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });

  // Data push =for chart 4 (총 실현손익))
  var data = [];

  for(let i = 0; i < max_data_numb; i++){
    data[max_data_numb - i - 1] = asset_recode[i].actural_earn;
  }

  var data = {
    labels: labels,
    datasets: [
      {
        label: ' 총 실현손익 ',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: data
      },
    ]
  };
  var ctx = $('#card-chart4');
  var cardChart4 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });

  
  //Main Chart

  // Data push labels for chart
  var labels = [];
  var data1 = [];
  var data2 = [];
  var data3 = [];

  let max_data_numb_main = Math.min(30,asset_recode.length);

  for(let i = 0; i < max_data_numb_main; i++){
    labels[max_data_numb_main - i - 1] = asset_recode[i].time;
    data1[max_data_numb_main - i - 1] = asset_recode[i].price;
    data2[max_data_numb_main - i - 1] = asset_recode[i].average_bought_price;
    data3[max_data_numb_main - i - 1] = asset_recode[i].actural_earn;
  }



  var data = {
    labels: labels,
    datasets: [
      {
        label: '가격',
        backgroundColor: 'transparent',
        borderColor: $.brandInfo,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: data1
      },
      {
        label: '평균 구매가',
        backgroundColor: 'transparent',
        borderColor: $.brandSuccess,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: data2
      },
      {
        label: '총 실현 손익',
        backgroundColor: 'transparent',
        borderColor: $.brandDanger,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 1,
        borderDash: [8, 5],
        data: data3
      }
    ]
  };

  var options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
        }
      }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
  };
  var ctx = $('#main-chart');
  var mainChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });

});
