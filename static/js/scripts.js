function onload(){
  $(document).ready( function() {
      $('#fechaFin').val(new Date().getFullYear()+"-"+
      (((new Date().getMonth()+1)<10)?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1))+"-"+
      ((new Date().getDate()<10)?"0"+new Date().getDate():new Date().getDate()));    
  });
};
function gr (contenedor,series,nombre){
      var myChart = Highcharts.chart(contenedor, {
            chart: {
                type: 'pie'
            },
            title: {
                text: nombre
            },
            xAxis: {
                categories: ['Positivos', 'Negativos', 'Neutros']
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },credits: {
              enabled: false
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            credits: {
              enabled: false
            },
            plotOptions: {
            pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                connectorColor: 'silver'
            }
        }
    },
            series: [{
              name: nombre,
              data: series
            }]
        });
}

function grln (contenedor,series,nombre,metodo,color){
      var myChart = Highcharts.chart(contenedor, {
        
            chart: {
                zoomType: 'x'
            },
            subtitle: {
              text: document.ontouchstart === undefined ?
                'Click y arrastra en el area del grafico para acercar' : 'Toca el grafico para acercar'
            },
            title: {
                text: nombre
            },
            xAxis: {
                type: 'datetime'
            }, 
            yAxis: {
              title: {
                text: 'Polaridad'
              },
              categories: {'-1':'-1 Negativo','0':'0 Neutro','1':'1 Positivo'}
            },credits: {
              enabled: false
            },
            plotOptions: {
              area: {
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                  },
                  stops: [
                    [0, Highcharts.getOptions().colors[color]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[color]).setOpacity(0).get('rgba')]
                  ]
                },
                marker: {
                  radius: 2
                },
                lineWidth: 1,
                states: {
                  hover: {
                    lineWidth: 1
                  }
                },
                threshold: null
                }
              },         
            series: [{
              name: metodo,
              data: series,
              type: 'area',
              color: Highcharts.getOptions().colors[color]
            }]
        });
}

function grcovid (contenedor,confirmados,muertos,recuperados,activos,nombre){
      var myChart = Highcharts.chart(contenedor, {
        
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            subtitle: {
              text: document.ontouchstart === undefined ?
                'Click y arrastra en el area del grafico para acercar' : 'Toca el grafico para acercar'
            },
            title: {
                text: nombre
            },
            subtitle: {
                text: 'Fuente: https://covid19api.com/'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            xAxis: {
                type: 'datetime'
            },
            credits: {
              enabled: false
            }, 
            yAxis: {
              title: {
                text: ''
              },
            },
            plotOptions: {
              series: {
                label: {
                  connectorAllowed: false
                },
                pointStart: 2010
              }  
            },         
            series: [{
              name: "Confirmados",
              data: confirmados,
            },{
              name: "Muertos",
              data: muertos,
            },{
              name: "Recuperados",
              data: recuperados,
            },{
              name: "Activos",
              data: activos,
            }]
        });
}

function grnube (contenedor,data1){
  var lines = data1.split(/[,\. ]+/g),
    data = Highcharts.reduce(lines, function (arr, word) {
        var obj = Highcharts.find(arr, function (obj) {
            return obj.name === word;
        });
        if (obj) {
            obj.weight += 1;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);
  /*
  var makeScale = function (domain, range) {
    var minDomain = domain[0];
    var maxDomain = domain[1];
    var rangeStart = range[0];
    var rangeEnd = range[1];

    return (value) => {
        return rangeStart + (rangeEnd - rangeStart) * ((value - minDomain) / (maxDomain - minDomain));
    }
  };
  var minWeight = data.reduce((min, word) =>
    (word.weight < min ? word.weight : min),
    data[0].weight
  );
  var maxWeight = data.reduce((max, word) =>
      (word.weight > max ? word.weight : max),
      data[0].weight
  );
  var scale = makeScale([minWeight, maxWeight], [0.5, 1]);
  
  var scaledData = data.map(word =>
      ({ name: word.name, weight: word.weight, color: `rgba(60,170,200,${scale(word.weight)})` })
  );
  */ 
  var myChart = Highcharts.chart(contenedor, {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h5>{chartTitle}</h5>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{viewTableButton}</div>'
        }
    },
    credits: {
              enabled: false
    },
    series: [{
        type: 'wordcloud',
        data: data.slice(0,50),
        name: 'Ocurrencia',
        minFontSize: 7,
        rotation: {
            from: 0,
            to: 0,
        },
        style: {
            fontFamily: 'Arial',
        }
    }],
    title: {
        text: 'Wordcloud de Tweets'
    }
});
}

function graficar(event){
   $('#loadingmessage').show();
   $('#boton').attr("disabled", true);
   if(validar(event)){
      $.ajax({
        url:'/lit1',
        data:{cant : $('#cantidad').val(),fechaInicio : $('#fechaInicio').val(),fechaFin : $('#fechaFin').val()},
        type: 'POST',
      
        success: function(msg){
          $('#loadingmessage').hide();
          $('#boton').attr("disabled", false);

          //Lenar Tabla porcentaje
          //tporcentaje=[]
          $('#jp').text((contar(msg[2],"Positivo")/msg[2].length).toFixed(2)+'%');
          $('#jn').text((contar(msg[2],"Negativo")/msg[2].length).toFixed(2)+'%');
          $('#jne').text((contar(msg[2],"Neutro")/msg[2].length).toFixed(2)+'%');
          $('#jt').text(msg[2].length);
          $('#cp').text((contar(msg[3],"Positivo")/msg[3].length).toFixed(2)+'%');
          $('#cn').text((contar(msg[3],"Negativo")/msg[3].length).toFixed(2)+'%');
          $('#cne').text((contar(msg[3],"Neutro")/msg[3].length).toFixed(2)+'%');
          $('#ct').text(msg[3].length);
          $('#tbp').text((contar(msg[4],"Positivo")/msg[4].length).toFixed(2)+'%');
          $('#tbn').text((contar(msg[4],"Negativo")/msg[4].length).toFixed(2)+'%');
          $('#tbne').text((contar(msg[4],"Neutro")/msg[4].length).toFixed(2)+'%');
          $('#tbt').text(msg[4].length);
          $('#svmp').text((contar(msg[5],"Positivo")/msg[5].length).toFixed(2)+'%');
          $('#svmn').text((contar(msg[5],"Negativo")/msg[5].length).toFixed(2)+'%');
          $('#svmne').text((contar(msg[5],"Neutro")/msg[5].length).toFixed(2)+'%');
          $('#svmt').text(msg[5].length);
          $('#vp').text((contar(msg[7],"Positivo")/msg[7].length).toFixed(2)+'%');
          $('#vn').text((contar(msg[7],"Negativo")/msg[7].length).toFixed(2)+'%');
          $('#vne').text((contar(msg[7],"Neutro")/msg[7].length).toFixed(2)+'%');
          $('#vt').text(msg[7].length);
        
        //Graficos Pastel
        titulos = ['Similitud Jaccard','Similitud Coseno','Text Blob','SVM','','Voting'];
        contenedores = ['container','container1','container2','container3','','container4']
          for(let i = 2; i < 8; i++ ){
            //if temporal por parte del lda
            if(i !== 6){
              let datos = [
                {name: 'Positivos',y:contar(msg[i],"Positivo")},
                {name: 'Negativos',y:contar(msg[i],"Negativo")},
                {name: 'Neutros',y:contar(msg[i],"Neutro")} 
              ];
              gr(contenedores[i-2],datos,titulos[i-2]);
            }
          }

          //Llenar Tabla
          let tabla = ''
          for(let i = 0; i < msg[0].length; i++ ){
            tabla += `<tr><td>${i+1}</td><td>${new Date(msg[0][i]).toLocaleDateString()}</td><td>${msg[1][i]}</td><td>${msg[2][i]}</td><td>${msg[3][i]}</td><td>${msg[4][i]}</td><td>${msg[5][i]}</td><td>${msg[7][i]}</td></tr>`; 
          }

          //Mostrar elementos
          $('#tablat,#container,#container1,#container2,#container3,#container4,#container5,#container6,#container7,#container8,#container9,#container10,#container11').show();
          $('#tablat tbody tr').remove();
          $('#tablat').append(tabla);
          

          //Grafico wordcloud
          grnube('container5',msg[13]);

          //Grafica Covid 19
          grcovid('container6',unir(msg[12],msg[8]),unir(msg[12],msg[9]),unir(msg[12],msg[10]),unir(msg[12],msg[11]),'Covid 19');

          //Grafica Sentimientos
          grln('container7',unir(msg[0],msg[2]),'Analisis de Sentimientos (Jaccard)','Jaccard',0);
          grln('container8',unir(msg[0],msg[3]),'Analisis de Sentimientos (Coseno)','Coseno',6);
          grln('container9',unir(msg[0],msg[4]),'Analisis de Sentimientos (TextBlob)','TextBlob',2);
          grln('container10',unir(msg[0],msg[5]),'Analisis de Sentimientos (SVM)','SVM',3);
          grln('container11',unir(msg[0],msg[7]),'Analisis de Sentimientos (Voting)','Voting',7);

        },timeout : 9000000,
        error :function(err){
          $('#loadingmessage').hide();
          $('#boton').attr("disabled", false);
          console.log(err);
          }
      })
    }
}



function unir(fecha,datos){
  vectorGrafico=[];
  for(let i=0;i<datos.length;i++){
    temp=[];
    temp.push(new Date(fecha[i]).getTime());
    if(datos[i] == "Positivo")
      temp.push(1);
    else if(datos[i] == "Neutro")
      temp.push(0);
    else if(datos[i] == "Negativo")
      temp.push(-1);
    else if(datos[i] != "na")
      temp.push(datos[i])
    vectorGrafico.push(temp);
  }
  return vectorGrafico;
}

function contar(lista,polaridad){
  cont = 0;
  for(let i = 0; i < lista.length; i++ ){
    if(lista[i] === polaridad){
      cont++;
    }
  }
  return cont;
}
 function validar(event){
      if (!$('#cantidad').val().trim().length) {
        event.preventDefault();
        event.stopPropagation();
        alert('Ingrese la cantidad');
        return false;
      }
      if (!$('#fechaInicio').val().trim().length) {
        event.preventDefault();
        event.stopPropagation();
        alert('Ingrese la Fecha Inicio');
        return false;
      }
      if (!$('#fechaFin').val().trim().length) {
        event.preventDefault();
        event.stopPropagation();        
        alert('Ingrese la Fecha de Fin');
        return false;
      }
      var fechainicial = fechaInicio || $('#fechaInicio').val();
      var fechafinal = fechaFin || $('#fechaFin').val();
      if(Date.parse(fechafinal) < Date.parse(fechainicial)) {
        event.preventDefault();
        event.stopPropagation();        
        alert("La fecha final debe ser mayor a la fecha inicial");
        return false;
      } 
  return true;     
};


  
