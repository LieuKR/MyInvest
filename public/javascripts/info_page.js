$(function(){
  'use strict';

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
        backgroundColor: 'rgba(255,255,255,.4)',
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
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 9,
        hoverRadius: 5,
      },
    },
    tooltips: {
      enabled: false,

      custom: function(tooltipModel) {
          // Tooltip Element
          var tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = "<table></table>";
              document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
          }

          // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform');
          if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
              tooltipEl.classList.add('no-transform');
          }

          function getBody(bodyItem) {
              return bodyItem.lines;
          }

          // Set Text
          if (tooltipModel.body) {
              var titleLines = tooltipModel.title || [];
              var bodyLines = tooltipModel.body.map(getBody);

              var innerHtml = '<thead>';

              titleLines.forEach(function(title) {
                  innerHtml += '<tr><th>' + title + '</th></tr>';
              });
              innerHtml += '</thead><tbody>';

              bodyLines.forEach(function(body, i) {
                  var colors = tooltipModel.labelColors[i];
                  var style = 'background:' + colors.backgroundColor;
                  style += '; border-color:' + colors.borderColor;
                  style += '; border-width: 2px';
                  var span = '<span style="' + style + '"></span>';
                  innerHtml += '<tr><td>' + span + body + '</td></tr>';
              });
              innerHtml += '</tbody>';

              var tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
          }

          // `this` will be the overall tooltip
          var position = this._chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
          tooltipEl.style.borderRadius = '3px';
          tooltipEl.style.color = 'white';
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
      }

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

  let max_data_numb_main = Math.min(30,asset_recode.length);

  for(let i = 0; i < max_data_numb_main; i++){
    labels[max_data_numb_main - i - 1] = asset_recode[i].time;
    data1[max_data_numb_main - i - 1] = asset_recode[i].price;
    data2[max_data_numb_main - i - 1] = asset_recode[i].average_bought_price;
  }



  var data = {
    labels: labels,
    datasets: [
      {
        label: '가격',
        backgroundColor: 'transparent',
        borderColor: 'blue',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: data1
      },
      {
        label: '평균 구매가',
        backgroundColor: 'transparent',
        borderColor: 'orange',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: data2
      },
    ]
  };

  var options = {
    maintainAspectRatio: false,
    legend: {
    },
    scales: {
      xAxes: [{
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
        radius: 2,
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
