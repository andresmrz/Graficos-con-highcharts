
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

function verificarGrafico(modo,contenedor,titulo,subtitulo,datos,infoDrill,datosDrill) 
{
	if(datosDrill == undefined)
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
			infoDrill: infoDrill,
			drill: datosDrill
		};
	}
}


////// cambia dinamicamente el tipo de grafico

function cambiarTipoGrafico(tipo,contenedor)
{
	if(listaDeGraficos[contenedor] != undefined)
	{
		var datos = listaDeGraficos[contenedor];
		var listaDatos = datos['datos'].split('**');
		var infoDatos = listaDatos[0].split(';;');
		var drill = datos['drill'];

		if(drill == undefined)
		{
			if(infoDatos.length !== 3)
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
			pintarDiagramaDrill(tipo,contenedor,datos['titulo'],datos['subtitulo'],datos['datos'],datos['infoDrill'],datos['drill']);
		}
	}
}

/////////////  diagramas sin drill  /////////////////

// pinta los diagramas sin drill indicando el color de cada uno

function pintarDiagramaColores(modo,contenedor,titulo,subtitulo,datos)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos);

	var options3d = {alpha: 15};
	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.1f}%</span>'
		}
	};

	if(modo == 'pieinner')
	{
		modo = 'pie';
		series['innerSize'] = 50;
		options3d['enabled'] = true;
	}


	if(modo == 'pie3d')
	{
		modo = 'pie';
		options3d['enabled'] = true;
	}

	if(modo == 'cylinder')
	{
		options3d['enabled'] = true;
		options3d['beta'] = 0;
		options3d['depth'] = 50;
	}

	if(modo == 'pyramid3d')
	{
		options3d['enabled'] = true;
		options3d['alpha'] = 10;
		options3d['depth'] = 50;
		options3d['viewDistance'] = 200;
		series['width'] = '60%';
		series['height'] = '80%';
		series['center'] = ['50%', '45%'];
	}

	var line = (modo == 'line' || modo == 'spline' || modo == 'area' || modo == 'areaspline')?false:true;
	var hover = '';

	if(modo == 'pie')
	{
		hover = '{point.name}: ';
	}

	

	if(modo != 'column' && modo != 'column3d')
	{
		var lista = new Array();
		var listaDatos = datos.split('**');

		for(var i = 0;i < listaDatos.length;i++)
		{
			var infoDatos = listaDatos[i].split(';;');

			lista.push(
			{
				name: infoDatos[0],
				y: parseFloat(infoDatos[1]),
				color: infoDatos[2]
			});
		}

		var chart = new Highcharts.Chart(
		{
			chart: 
			{
				renderTo: contenedor,
				type: modo,
				options3d: options3d
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
				series: series
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
	var listaDatos = datos.split('**');

	for(var i = 0;i < listaDatos.length;i++)
	{
		var infoDatos = listaDatos[i].split(';;');

		lista.push(
		{
			name: infoDatos[0],
			y: parseFloat(infoDatos[1]),
			color: infoDatos[2]
		});
	}

	var d3 = (modo == 'column3d')?true:false;

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
            options3d: 
            {
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

	var options3d = {alpha: 15};
	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.1f}%</span>'
		}
	};

	if(modo == 'pieinner')
	{
		modo = 'pie';
		series['innerSize'] = 50;
		options3d['enabled'] = true;
	}

	if(modo == 'pie3d')
	{
		modo = 'pie';
		options3d['enabled'] = true;
	}

	if(modo == 'cylinder')
	{
		options3d['enabled'] = true;
		options3d['beta'] = 0;
		options3d['depth'] = 50;
	}

	if(modo == 'pyramid3d')
	{
		options3d['enabled'] = true;
		options3d['alpha'] = 10;
		options3d['depth'] = 50;
		options3d['viewDistance'] = 200;
		series['width'] = '60%';
		series['height'] = '80%';
		series['center'] = ['50%', '45%'];
	}

	var line = (modo == 'line' || modo == 'spline' || modo == 'area' || modo == 'areaspline')?false:true; 
	var hover = '';

	if(modo == 'pie')
	{
		hover = '{point.name}: ';
	}

	if(modo !== 'column' && modo !== 'column3d')
	{
		var lista = new Array();
		var listaDatos = datos.split('**');

		for(var i = 0;i < listaDatos.length;i++)
		{
			var infoDatos = listaDatos[i].split(';;');

			lista.push(
			{
				name: infoDatos[0],
				y: parseFloat(infoDatos[1])
			});
		}

		var chart = new Highcharts.Chart(
		{
			chart: 
			{
				renderTo: contenedor,
				type: modo,
				options3d: options3d
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
				series: series
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
	var listaDatos = datos.split('**');

	for(var i = 0;i < listaDatos.length;i++)
	{
		var infoDatos = listaDatos[i].split(';;');

		lista.push(
		{
			name: infoDatos[0],
			y: parseFloat(infoDatos[1])
		});
	}

	var d3 = (modo == 'column3d')?true:false;

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

function pintarDiagramaDrill(modo,contenedor,titulo,subtitulo,datos,infoDrill,datosDrill)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos,infoDrill,datosDrill);

	var inner = 0;
	var d3 = false;

	if(modo == 'pieinner')
	{
		modo = 'pie';
		inner = 50;
		d3 = true;
	}

	if(modo == 'pie3d')
	{
		modo = 'pie';
		d3 = true;
	}

	var line = (modo == 'line' || modo == 'area')?false:true; 
	var hover = '';

	if(modo == 'pie')
	{
		hover = '{point.name}: ';
	}

	if(modo !== 'column' && modo !== 'column3d')
	{
		var lista = new Array();
		var listaDrill = new Array();

		//// organizamos los valores a mostrar

		var datosInfoDrill = infoDrill.split('**');
		var valoresDrill = datosDrill.split('**');

		if(datosInfoDrill.length == valoresDrill.length)
		{
			for(var i = 0;i < datosInfoDrill.length;i++)
			{
				// estructura: nombreDelDato;;porcentaje;;idDrill**nombreDelDato;;porcentaje;;idDrill**....

				// estructura: nombreDelDato;;idDrill**nombreDelDato;;idDrill**....

				// estructura para cada dato: nombreDelDato;;porcentaje;;nombreDelDato;;porcentaje....
				// estructura completa: nombreDelDato;;porcentaje;;nombreDelDato;;porcentaje**nombreDelDato;;porcentaje;;nombreDelDato;;porcentaje....

				var infoFila = datosInfoDrill[i].split(';;');
				var valoresFila = valoresDrill[i].split(';;');
				var listaValores = new Array();

				for(var j = 0;j < valoresFila.length;j += 2)
				{
					listaValores.push([valoresFila[j],parseFloat(valoresFila[j + 1])]);
				}

				listaDrill.push(
				{
					name: infoFila[0],
					id: infoFila[1],
					data: listaValores
				});
			}

			var listaDatos = datos.split('**');

			for(var i = 0;i < listaDatos.length;i++)
			{
				var infoFila = listaDatos[i].split(';;');

				lista.push(
				{
					name: infoFila[0],
					y: parseFloat(infoFila[1]),
					drilldown: infoFila[2]
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
		}
		else
		{
			alert('La cantidad de datos del drill no coincide con la cantidad de informacion del drill');
		}

	}else
	{
		pintarColumnaDrill(modo,contenedor,titulo,subtitulo,datos,infoDrill,datosDrill);
	}
}

function pintarColumnaDrill(modo,contenedor,titulo,subtitulo,datos,infoDrill,datosDrill)
{
	verificarGrafico(modo,contenedor,titulo,subtitulo,datos,infoDrill,datosDrill);

	var lista = new Array();
	var listaDrill = new Array();

	//// organizamos los valores a mostrar

	var datosInfoDrill = infoDrill.split('**');
	var valoresDrill = datosDrill.split('**');

	for(var i = 0;i < datosInfoDrill.length;i++)
	{
		// estructura: nombreDelDato;;porcentaje;;idDrill**nombreDelDato;;porcentaje;;idDrill**....

		// estructura: nombreDelDato;;idDrill**nombreDelDato;;idDrill**....

		// estructura para cada dato: nombreDelDato;;porcentaje;;nombreDelDato;;porcentaje....
		// estructura completa: nombreDelDato;;porcentaje;;nombreDelDato;;porcentaje**nombreDelDato;;porcentaje;;nombreDelDato;;porcentaje....

		var infoFila = datosInfoDrill[i].split(';;');
		var valoresFila = valoresDrill[i].split(';;');
		var listaValores = new Array();

		for(var j = 0;j < valoresFila.length;j += 2)
		{
			listaValores.push([valoresFila[j],parseFloat(valoresFila[j + 1])]);
		}

		listaDrill.push(
		{
			name: infoFila[0],
			id: infoFila[1],
			data: listaValores
		});
	}

	var listaDatos = datos.split('**');

	for(var i = 0;i < listaDatos.length;i++)
	{
		var infoFila = listaDatos[i].split(';;');

		lista.push(
		{
			name: infoFila[0],
			y: parseFloat(infoFila[1]),
			drilldown: infoFila[2]
		});
	}

	var d3 = (modo == 'column3d')?true:false;

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