function onload(){
  $(document).ready( function() {
      $('#fechaFin').val(new Date().getFullYear()+"-"+
      (((new Date().getMonth()+1)<10)?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1))+"-"+
      ((new Date().getDate()<10)?"0"+new Date().getDate():new Date().getDate()));    

      $.ajax({
        url: '/api',
        type: 'POST',
        success: function(msg){
          //Grafica Covid 19
          grcovid('container6',unir(msg[4],msg[0]),unir(msg[4],msg[1]),unir(msg[4],msg[2]),unir(msg[4],msg[3]),'Covid 19');
        },
        error :function(err){
          console.log(err);
          }
      });
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
  /* Nube de palabras personalizadas
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
        text: 'Nube de Palabras sobre los Tweets'
    }
});
}

function graficar(event){
   if(validar(event)){
    $('#loadingmessage').show();
    $('#boton').attr("disabled", true);
    //Ocultar todo
    $('#tablat,#container,#container1,#container2,#container3,#container4,#container5,#container7,#container8,#container9,#container10,#container11').hide();
    $('#tablat tbody tr').remove();
    vaciarPorcentaje();
    $.ajax({
        url:'/lit1',
        data:{cant : $('#cantidad').val(),fechaInicio : $('#fechaInicio').val(),fechaFin : $('#fechaFin').val()},
        type: 'POST',
      
        success: function(msg){
          $('#loadingmessage').hide();
          $('#boton').attr("disabled", false);
          //Lenar Tabla porcentaje
          tporcentaje=['#jp','#jn','#jne','#jt','#cp','#cn','#cne','#ct','#tbp','#tbn','#tbne','#tbt','#svmp','#svmn','#svmne','#svmt','#vp','#vn','#vne','#vt'] 
          //Graficos Pastel
          titulos = ['Similitud Jaccard','Similitud Coseno','Text Blob','SVM','Voting'];
          contenedores = ['container','container1','container2','container3','container4']
          let pivote = 0
          for(let i = 2; i < 7; i++ ){  
                let datos = [
                  {name: 'Positivos',y:contar(msg[i],"Positivo")},
                  {name: 'Negativos',y:contar(msg[i],"Negativo")},
                  {name: 'Neutros',y:contar(msg[i],"Neutro")} 
                ];
                gr(contenedores[i-2],datos,titulos[i-2]);
                pivote = (i-2)*4
                $(tporcentaje[pivote]).text((contar(msg[i],"Positivo")/msg[i].length).toFixed(2)+'%');
                $(tporcentaje[pivote+1]).text((contar(msg[i],"Negativo")/msg[i].length).toFixed(2)+'%');
                $(tporcentaje[pivote+2]).text((contar(msg[i],"Neutro")/msg[i].length).toFixed(2)+'%');
                $(tporcentaje[pivote+3]).text(msg[i].length);
          }

            //Llenar Tabla
          let tabla = ''
          for(let i = 0; i < msg[0].length; i++ ){
            tabla += `<tr><td>${i+1}</td><td>${new Date(msg[0][i]).toLocaleDateString()}</td><td>${msg[1][i]}</td><td>${msg[2][i]}</td><td>${msg[3][i]}</td><td>${msg[4][i]}</td><td>${msg[5][i]}</td><td>${msg[6][i]}</td></tr>`; 
          }

          //Mostrar elementos
          $('#tablat,#container,#container1,#container2,#container3,#container4,#container5,#container7,#container8,#container9,#container10,#container11').show();
          $('#tablat tbody tr').remove();
          $('#tablat').append(tabla);
  

          //Grafico wordcloud
          grnube('container5',msg[8]);

          //Grafica Sentimientos
          grln('container7',unir(msg[0],msg[2]),'Analisis de Sentimientos (Jaccard)','Jaccard',0);
          grln('container8',unir(msg[0],msg[3]),'Analisis de Sentimientos (Coseno)','Coseno',6);
          grln('container9',unir(msg[0],msg[4]),'Analisis de Sentimientos (TextBlob)','TextBlob',2);
          grln('container10',unir(msg[0],msg[5]),'Analisis de Sentimientos (SVM)','SVM',3);
          grln('container11',unir(msg[0],msg[6]),'Analisis de Sentimientos (Voting)','Voting',7);

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

function vaciarPorcentaje(){
  tporcentaje=['#jp','#jn','#jne','#jt','#cp','#cn','#cne','#ct','#tbp','#tbn','#tbne','#tbt','#svmp','#svmn','#svmne','#svmt','#vp','#vn','#vne','#vt'] 
  for(let i = 0; i<tporcentaje.length;i++){
    if( ((i+1)%4) == 0 )
      $(tporcentaje[i]).text("0")
    else
      $(tporcentaje[i]).text("0%")
  }
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


  
