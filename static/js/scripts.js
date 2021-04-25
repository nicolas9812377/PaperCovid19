var Pconfirmados = 0;
var Pmuertos = 0;
var Precuperados = 0;
var Pactivos = 0;
function onload(){
  $(document).ready( function() {
      $('#fechaFin').val(new Date().getFullYear()+"-"+
      (((new Date().getMonth()+1)<10)?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1))+"-"+
      ((new Date().getDate()<10)?"0"+new Date().getDate():new Date().getDate()));    

      $.ajax({
        url: '/api',
        type: 'POST',
        success: function(msg){
          Pconfirmados = unir(msg[4],msg[0]);
          Pmuertos = unir(msg[4],msg[1]);
          Precuperados = unir(msg[4],msg[2]);
          Pactivos = unir(msg[4],msg[3]);
          //Grafica Covid 19
          //let referencia = [{name: "Confirmados",data: Pconfirmados},{name: "Muertos",data: Pmuertos},{name: "Recuperados",data: Precuperados},{name: "Activos",data: Pactivos}]
          //grcovid('container6',referencia,'Covid 19');
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
                'Click y arrastra en el área del gráfico para acercar' : 'Toca el gráfico para acercar'
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
              categories: {'-1':'-1 Negativo','0':'0 Neutro','1':'1 Positivo'},
              plotBands: [
                { // Negativo
                from: -1,
                to: 0,
                color: 'rgba(231, 76, 60, 0.1)',
                label: {
                    //text: 'Negativo',
                    //style: {
                    //    color: '#E74C3C'
                    //}
                }
              }, { // Positivo
                    from: 0,
                    to: 1,
                    color: 'rgba(46, 204, 113, 0.1)',
                    
                  }]
            },credits: {
              enabled: false
            },
            plotOptions: {
              area: {
                animation: true,
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                  },
                  stops: [
                    [0, Highcharts.color(Highcharts.getOptions().colors[color]).setOpacity(0.5).get('rgba')]
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

function grcovid (contenedor,datos,nombre){
      var myChart = Highcharts.chart(contenedor, {
        
            chart: {
                zoomType: 'x',
                plotBorderWidth: 1
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
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
            },
            xAxis: {
                type: 'datetime'
            },
            credits: {
              enabled: false
            }, 
            yAxis: [{
              title: {
                text: ''
              }
            }],
            plotOptions: {
              series: {
                animation: {enabled:true},
                label: {
                  connectorAllowed: true
                },
                pointStart: 0
              } 

            },         
            series: datos
        });
}

function grnube (contenedor,data1){
  var lines = data1.split(/[,\. ]+/g),
    data = Highcharts.reduce(lines, function (arr, word) {
        var obj = Highcharts.find(arr, function (obj) {
            return obj.name === word;
        });
        if (obj) {
            obj.weight += 4;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);
  
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
        //spiral: 'archimedean',
        data: data.splice(0,100),
        name: 'Ocurrencia',
        minFontSize: 8,
        maxFontSize: 27,
        style: {
            fontFamily: 'Arial',
            fontWeight: '600'
        },
        rotation: {
            from: -90,
            to: 180,
            orientations: 4
        },
        colors: ['#1B4F72', '#979A9A', '#148F77', '#515A5A ', '#1F618D']
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
    $('#tablat,#container,#container1,#container2,#container3,#container4,#container5,#container7,#container8,#container9,#container10,#container11,#container12').hide();
    $('#tablat tbody tr').remove();
    vaciarPorcentaje();
    $.ajax({
        url:'/lit1',
        data:{cant : $('#cantidad').val(),fechaInicio : $('#fechaInicio').val(),fechaFin : $('#fechaFin').val()},
        type: 'POST',
      
        success: function(msg){
          $('#loadingmessage').hide();
          $('#boton').attr("disabled", false);

          $('#LDA').html('<object type="text/html" data="https://analisis-sentimiento.herokuapp.com/topic" style="width:120%;height:850px;"></object>');

          //Lenar Tabla porcentaje
          tporcentaje=['#jp','#jn','#jne','#jt','#cp','#cn','#cne','#ct','#tbp','#tbn','#tbne','#tbt','#svmp','#svmn','#svmne','#svmt','#vp','#vn','#vne','#vt'] 
          //Graficos Pastel
          titulos = ['Similitud Jaccard','Similitud Coseno','Text Blob','SVM','Voting'];
          contenedores = ['container','container1','container2','container3','container4']
          let pivote = 0
          for(let i = 2; i < 7; i++ ){  
                let datos = [
                  {name: 'Positivos',y:contar(msg[i],1)},
                  {name: 'Negativos',y:contar(msg[i],-1)},
                  {name: 'Neutros',y:contar(msg[i],0)} 
                ];
                gr(contenedores[i-2],datos,titulos[i-2]);
                pivote = (i-2)*4
                $(tporcentaje[pivote]).text((contar(msg[i],1)/msg[i].length).toFixed(2)+'%');
                $(tporcentaje[pivote+1]).text((contar(msg[i],-1)/msg[i].length).toFixed(2)+'%');
                $(tporcentaje[pivote+2]).text((contar(msg[i],0)/msg[i].length).toFixed(2)+'%');
                $(tporcentaje[pivote+3]).text(msg[i].length);
          }

          //Llenar Tabla
          let tabla = ''
          for(let i = 0; i < msg[0].length; i++ ){
            tabla += `<tr><td>${i+1}</td><td>${new Date(msg[0][i]).toLocaleDateString()}</td><td>${msg[1][i]}</td><td>${significado(msg[2][i])}</td><td>${significado(msg[3][i])}</td><td>${significado(msg[4][i])}</td><td>${significado(msg[5][i])}</td><td>${significado(msg[6][i])}</td></tr>`; 
          }

          //Mostrar elementos
          $('#tablat,#container,#container1,#container2,#container3,#container4,#container5,#container7,#container8,#container9,#container10,#container11,#container12').show();
          $('#tablat tbody tr').remove();
          $('#tablat').append(tabla);

          

          //Grafico wordcloud
          grnube('container5',msg[7]);

          //Grafica Sentimientos
          grln('container7',unir(msg[0],msg[2]),'Análisis de Sentimientos (Jaccard)','Jaccard',0);
          grln('container8',unir(msg[0],msg[3]),'Análisis de Sentimientos (Coseno)','Coseno',6);
          grln('container9',unir(msg[0],msg[4]),'Análisis de Sentimientos (TextBlob)','TextBlob',2);
          grln('container10',unir(msg[0],msg[5]),'Análisis de Sentimientos (SVM)','SVM',3);
          grln('container11',unir(msg[0],msg[6]),'Análisis de Sentimientos (Voting)','Voting',7);

          //Para unir API COVID vs Voting
          let referencia = [
                            {
                              name: "Confirmados",
                              data: Pconfirmados,
                            },{
                              name: "Muertos",
                              data: Pmuertos,
                            },{
                              name: "Recuperados",
                              data: Precuperados,
                            },{
                              name: "Activos",
                              data: Pactivos,
                            },{
                              type: 'bubble',
                              name: "Polaridad Sentimiento",
                              data: unirt(msg[0],msg[6],Pconfirmados[Pconfirmados.length-1][1]),
                              tooltip: {
                                  headerFormat: '<b>{series.name}</b><br>',
                                  pointFormat: '{point.name}'
                              }
                            }];
          grcovid('container12',referencia,'Datos Covid Vs Análisis de Sentimientos'); 
        },timeout : 9000000,
        error :function(err){
          $('#loadingmessage').hide();
          $('#boton').attr("disabled", false);
          console.log(err);
          alert("Ha ocurrido un error");
          }
      })
    }
}

function unirt(fecha,datos,limite){
  vectorGrafico=[];
  for(let i=0;i<datos.length;i++){ 
    vectorGrafico.push({
      x: new Date(fecha[i]).getTime(),
      y: Math.random()* (limite - 0) + 0,
      color: (datos[i] == 1)? 'rgba(46, 204, 113, 0.9)': (datos[i] == 0)? 'rgba(186, 191, 188,0.9)' : 'rgba(231, 76, 60, 0.9)',
      name: (datos[i] == 1)? '1 Positivo': (datos[i] == 0)? '0 Neutro' : '-1 Negativo',
    });
  }
  return vectorGrafico;
}

function significado(datos){
    if(datos == 1)
      return "Positivo";
    else if(datos == 0)
      return "Neutro";
    else if(datos == -1)
      return "Negativo";
}

function unir(fecha,datos){
  vectorGrafico=[];
  for(let i=0;i<datos.length;i++){
    temp=[];
    temp.push(new Date(fecha[i]).getTime());
    if(datos[i] != "na")
      temp.push(datos[i]);
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


  
