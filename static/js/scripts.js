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
              enabled: true
            },
            yAxis: {
                title: {
                    text: ''
                }
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

function grln (contenedor,series,nombre,metodo){
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
              enabled: true
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
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
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
              type: 'area'
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
            yAxis: {
              title: {
                text: ''
              },
            },credits: {
              enabled: true
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


function graficar(){
   $('#loadingmessage').show();
   $('#boton').attr("disabled", true);
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
     
     //Graficos Pastel
     titulos = ['Similitud Jaccard','Similitud Coseno','Text Blob','SVM'];
     contenedores = ['container','container1','container2','container3']
      for(let i = 2; i < 6; i++ ){
        let datos = [
          {name: 'Positivos',y:contar(msg[i],"Positivo")},
          {name: 'Negativos',y:contar(msg[i],"Negativo")},
          {name: 'Neutros',y:contar(msg[i],"Neutro")} 
        ];
        gr(contenedores[i-2],datos,titulos[i-2]);
      }

      //Llenar Tabla
      let tabla = ''
      for(let i = 0; i < msg[0].length; i++ ){
        tabla += `<tr><td>${i+1}</td><td>${new Date(msg[0][i]).toLocaleDateString()}</td><td>${msg[1][i]}</td><td>${msg[2][i]}</td><td>${msg[3][i]}</td><td>${msg[4][i]}</td><td>${msg[5][i]}</td></tr>`; 
      }

      //Mostrar elementos
      $('#tablat,#container,#container1,#container2,#container3,#container4,#container5,#container6,#container7,#container8').show();
      $('#tablat tbody tr').remove();
      $('#tablat').append(tabla);
      
      //Graficos Sentimientos y Covid 19
      grcovid('container4',unir(msg[11],msg[7]),unir(msg[11],msg[8]),unir(msg[11],msg[9]),unir(msg[11],msg[10]),'Covid 19');
      grln('container5',unir(msg[0],msg[2]),'Analisis de Sentimientos (Jaccard)','Jaccard');
      grln('container6',unir(msg[0],msg[3]),'Analisis de Sentimientos (Coseno)','Coseno');
      grln('container7',unir(msg[0],msg[4]),'Analisis de Sentimientos (TextBlob)','TextBlob');
      grln('container8',unir(msg[0],msg[5]),'Analisis de Sentimientos (SVM)','SVM');

    },timeout : 9000000,
    error :function(err){
      $('#loadingmessage').hide();
      $('#boton').attr("disabled", false);
      console.log(err);
      }
  })
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
      }      
    };

  
