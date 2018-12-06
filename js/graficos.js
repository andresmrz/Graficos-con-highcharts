
/**
*
 * (c) 2018 Mauricio
 * Author: Andrés M. Rodríguez Z.
 *
 * License: no disponible
 */

/**
*
* TIPOS DE GRAFICO
*
* pie: Diagrama circular
* pieinner : Diagrama circular tipo rosquilla
* pie3d: Diagrama circular en 3 dimensión
* bar: Diagrama de barras horizontal
* column: Diagrama de barras vertical
* column3d: Diagrama de barras vertical en 3 dimensión
* line: Diagrama lineal
* area: Diagrama de area
*
 */

//// almacena los graficos que ve van generando

let listaDeGraficos = new Array(); 


////////// verifica si el grafico ya esta almacenado, de lo contrario lo almacena

function verificarGrafico(modo,contenedor,titulo,subtitulo,datos,datosDrill) 
{
	if(listaDeGraficos[contenedor] === undefined)
	{
		if(datosDrill === undefined)
		{
			listaDeGraficos[contenedor] = 
			{
				titulo: titulo,
				subtitulo: subtitulo,
				datos: datos
			};
		}
		else
		{
			listaDeGraficos[contenedor] = 
			{
				titulo: titulo,
				subtitulo: subtitulo,
				datos: datos,
				drill: datosDrill
			};
		}
	}
}


////// cambia dinamicamente el tipo de grafico

function cambiarTipoGrafico(tipo,contenedor)
{
	if(listaDeGraficos[contenedor] !== undefined)
	{
		var datos = listaDeGraficos[contenedor];
		var color = datos['datos'][0]['color'];
		var drill = datos['drill'];

		if(drill === undefined)
		{
			if(color === undefined)
			{
				pintarDiagrama(tipo,contenedor,datos['titulo'],datos['subtitulo'],datos['datos']);
			}
			else
			{
				pintarDiagramaColores(tipo,contenedor,datos['titulo'],datos['subtitulo'],datos['datos']);
			}
		}
		else
		{
			pintarDiagramaDrill(tipo,contenedor,datos['titulo'],datos['subtitulo'],datos['datos'],datos['drill']);
		}
	}
}

/////////////  diagramas sin drill  /////////////////

// pinta los diagramas sin drill indicando el color de cada uno

function pintarDiagramaColores(modo,contenedor,titulo,subtitulo,datos)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos);

	var inner = 0;
	var d3 = false;

	if(modo === 'pieinner')
	{
		modo = 'pie';
		inner = 50;
		d3 = true;
	}

	if(modo === 'pie3d')
	{
		modo = 'pie';
		d3 = true;
	}

	var line = (modo === 'line' || modo === 'area')?false:true; 
	var hover = '';

	if(modo === 'pie')
	{
		hover = '{point.name}: ';
	}

	if(modo !== 'column' && modo !== 'column3d')
	{
		var lista = new Array();

		for(var i = 0;i < datos.length;i++)
		{
			lista.push({
							name: datos[i]['dato'],
							y: parseFloat(datos[i]['porcentaje']),
							color: datos[i]['color']
						});
		}

		var chart = new Highcharts.Chart(
		{
			chart: 
			{
				renderTo: contenedor,
				type: modo,
				options3d: 
				{
					enabled: d3,
					alpha: 25,
					beta: 0
				}
			},
			title: 
			{
				text: titulo
			},
			xAxis: 
			{
				type: 'category'
			},
			yAxis: 
			{
				title: 
				{
					text: 'Porcentaje'
				}
			},
			legend: 
			{
				enabled: false
			},
			tooltip: 
			{
				headerFormat: '',
		        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">'
		        				+ subtitulo + ': <b>{point.y:.2f}%</b></span><br/>'
			},
			plotOptions: 
			{
				series: 
				{
					innerSize: inner,
					borderRadius: 3,
					depth: 65,
					borderWidth: 0,
					dataLabels: 
					{
						enabled: true,
						format: '{point.name}: <span style="font-weight:normal">{point.y:.1f}%</span>'
					}
				}
			},
			series: 
			[
				{
					name: subtitulo,
					colorByPoint: false,
					allowPointSelect: true,
					data: lista
				}
			]
		});

	}else
	{
		pintarColumnaColores(modo,contenedor,titulo,subtitulo,datos);
	}
}

function pintarColumnaColores(modo,contenedor,titulo,subtitulo,datos)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos);

	var lista = new Array();

	for(var i = 0;i < datos.length;i++)
	{
		lista.push(
		{
			name: datos[i]['dato'],
			y: parseFloat(datos[i]['porcentaje']),
			color: datos[i]['color']
		});
	}

	var d3 = (modo === 'column3d')?true:false;

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
            options3d: {
                enabled: d3,
                alpha: 45,
                beta: 0,
                depth: 100
            }
        },
        title: 
        {
            text: titulo
        },
        xAxis: 
        {
            type: 'category'
        },
        yAxis: 
        {
            title: 
            {
                text: 'Porcentaje'
            }

        },
        legend: 
        {
            enabled: false
        },
        plotOptions: 
        {
            series: 
            {
                borderWidth: 0,
                dataLabels: 
                {
                    enabled: true,
                    format: '{point.y:.1f}%'
                },
                borderRadius: 5
            }
        },

        tooltip: 
        {
            headerFormat: '',
            pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">'
            				+ subtitulo + ': <b>{point.y:.2f}%</b></span><br/>'
        },

        series: 
        [
        	{
				name: subtitulo,
				colorByPoint: false,
				allowPointSelect: true,
				data: lista
			}
        ]  
    });
}

////////////////////////////

// pinta los diagramas sin drill y sin indicar el color de cada uno

function pintarDiagrama(modo,contenedor,titulo,subtitulo,datos)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos);

	var inner = 0;
	var d3 = false;

	if(modo === 'pieinner')
	{
		modo = 'pie';
		inner = 50;
		d3 = true;
	}

	if(modo === 'pie3d')
	{
		modo = 'pie';
		d3 = true;
	}

	var line = (modo === 'line' || modo === 'area')?false:true; 

	var hover = '';

	if(modo === 'pie')
	{
		hover = '{point.name}: ';
	}

	if(modo !== 'column' && modo !== 'column3d')
	{
		var lista = new Array();

		for(var i = 0;i < datos.length;i++)
		{
			lista.push(
			{
				name: datos[i]['dato'],
				y: parseFloat(datos[i]['porcentaje'])
			});
		}

		var chart = new Highcharts.Chart(
		{
			chart: 
			{
				renderTo: contenedor,
				type: modo,
				options3d: 
				{
					enabled: d3,
					alpha: 25,
					beta: 0
				}
			},
			title: 
			{
				text: titulo
			},
			xAxis: 
			{
				type: 'category'
			},
			yAxis: 
			{
				title: 
				{
					text: 'Porcentaje'
				}
			},
			legend: 
			{
				enabled: false
			},
			tooltip: 
			{
				headerFormat: '',
		        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">'
		        				+ subtitulo + ': <b>{point.y:.2f}%</b></span><br/>'
			},
			plotOptions: 
			{
				series: 
				{
					innerSize: inner,
					borderRadius: 3,
					depth: 65,
					borderWidth: 0,
					dataLabels: 
					{
						enabled: true,
						format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
					}
				}
			},
			series: 
			[
				{
					name: subtitulo,
					colorByPoint: line,
					allowPointSelect: true,
					data: lista
				}
			]
		});

	}else
	{
		pintarColumna(modo,contenedor,titulo,subtitulo,datos);
	}
}

function pintarColumna(modo,contenedor,titulo,subtitulo,datos)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos);

	var lista = new Array();

	for(var i = 0;i < datos.length;i++)
	{
		lista.push(
		{
			name: datos[i]['dato'],
			y: parseFloat(datos[i]['porcentaje'])
		});
	}

	var d3 = (modo === 'column3d')?true:false;

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
            options3d: {
                enabled: d3,
                alpha: 45,
                beta: 0,
                depth: 100
            }
        },
        title: 
        {
            text: titulo
        },
        xAxis: 
        {
            type: 'category'
        },
        yAxis: 
        {
            title: 
            {
                text: 'Porcentaje'
            }

        },
        legend: 
        {
            enabled: false
        },
        plotOptions: 
        {
            series: 
            {
                borderWidth: 0,
                dataLabels: 
                {
                    enabled: true,
                    format: '{point.y:.2f}%'
                },
                borderRadius: 5
            }
        },

        tooltip: 
        {
            headerFormat: '',
            pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">'
            				+ subtitulo + ': <b>{point.y:.2f}%</b></span><br/>'
        },

        series: 
        [
        	{
				name: subtitulo,
				colorByPoint: true,
				allowPointSelect: true,
				data: lista
			}
        ]  
    });
}


//////////////// drilldown ///////////////////////

// pinta los diagramas con drill

function pintarDiagramaDrill(modo,contenedor,titulo,subtitulo,datos,datosDrill)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos,datosDrill);

	var inner = 0;
	var d3 = false;

	if(modo === 'pieinner')
	{
		modo = 'pie';
		inner = 50;
		d3 = true;
	}

	if(modo === 'pie3d')
	{
		modo = 'pie';
		d3 = true;
	}

	var line = (modo === 'line' || modo === 'area')?false:true; 
	var hover = '';

	if(modo === 'pie')
	{
		hover = '{point.name}: ';
	}

	if(modo !== 'column' && modo !== 'column3d')
	{
		var lista = new Array();
		var listaDrill = new Array();

		for(var i = 0;i < datos.length;i++)
		{
			lista.push(
			{
				name: datos[i]['dato'],
				y: parseFloat(datos[i]['porcentaje']),
				drilldown: datos[i]['drill']
			});
		}

		for(var i = 0;i < datosDrill.length;i++)
		{
			listaDrill.push(
			{
				name: datosDrill[i]['nombre'],
				id: datosDrill[i]['drill'],
				data: datosDrill[i]['datos']
			});
		}

		var chart = new Highcharts.Chart(
		{
			chart: 
			{
				renderTo: contenedor,
				type: modo,
				options3d: 
				{
					enabled: d3,
					alpha: 25,
					beta: 0
				}
			},
			title: 
			{
				text: titulo
			},
            subtitle: 
            {
                text: 'Click en las columnas para ver detalles.'
            },
			xAxis: 
			{
				type: 'category'
			},
			yAxis: 
			{
				title: 
				{
					text: 'Porcentaje'
				}
			},
			legend: 
			{
				enabled: false
			},
			tooltip: 
			{
				headerFormat: '',
		        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">'
		        				+ subtitulo + ': <b>{point.y:.2f}%</b></span><br/>'
			},
			plotOptions: 
			{
				series: 
				{
					innerSize: inner,
					borderRadius: 3,
					depth: 65,
					borderWidth: 0,
					dataLabels: 
					{
						enabled: true,
						format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
					}
				}
			},
			series: 
			[
				{
					name: subtitulo,
					colorByPoint: line,
					allowPointSelect: true,
					data: lista
				}
			],
			drilldown:
			{
				series: listaDrill
			}
		});

	}else
	{
		pintarColumnaDrill(modo,contenedor,titulo,subtitulo,datos,datosDrill);
	}
}

function pintarColumnaDrill(modo,contenedor,titulo,subtitulo,datos,datosDrill)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos,datosDrill);

	var lista = new Array();
	var listaDrill = new Array();

	for(var i = 0;i < datos.length;i++)
	{
		lista.push(
		{
			name: datos[i]['dato'],
			y: parseFloat(datos[i]['porcentaje']),
			drilldown: datos[i]['drill']
		});
	}

	for(var i = 0;i < datosDrill.length;i++)
	{
		listaDrill.push(
		{
			name: datosDrill[i]['nombre'],
			id: datosDrill[i]['drill'],
			data: datosDrill[i]['datos']
		});
	}

	var d3 = (modo === 'column3d')?true:false;

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
            options3d: {
                enabled: d3,
                alpha: 45,
                beta: 0,
                depth: 100
            }
        },
        title: 
        {
            text: titulo
        },
        subtitle: 
        {
            text: 'Click en las columnas para ver detalles.'
        },
        xAxis: 
        {
            type: 'category'
        },
        yAxis: 
        {
            title: 
            {
                text: 'Porcentaje'
            }

        },
        legend: 
        {
            enabled: false
        },
        plotOptions: 
        {
            series: 
            {
                borderWidth: 0,
                dataLabels: 
                {
                    enabled: true,
                    format: '{point.y:.2f}%'
                },
                borderRadius: 5
            }
        },

        tooltip: 
        {
            headerFormat: '',
            pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">'
            				+ subtitulo + ': <b>{point.y:.2f}%</b></span><br/>'
        },

        series: 
        [
        	{
				name: subtitulo,
				colorByPoint: true,
				allowPointSelect: true,
				data: lista
			}
        ],
		drilldown:
		{
			series: listaDrill
		}  
    });
}