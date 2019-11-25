
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
* pie3d: Diagrama circular en 3 dimensiones
* bar: Diagrama de barras horizontal
* cylinder: Diagrama tipo cilindro
* pyramid3d: Diagrama tipo piramide en 3 dimensiones
* column: Diagrama de barras vertical
* column3d: Diagrama de barras vertical en 3 dimensiones
* line: Diagrama lineal
* spline: Diagrama lineal con curvatura
* area: Diagrama de area lineal
* areaspline: Diagrama de area con curvatura
*
*/

//// almacena los graficos que se van generando

let listaDeGraficos = new Array();
let estadoDegrado = false;

//// activa degrado en los colores de los graficos ////////

function activarDegrado()
{
	if(!estadoDegrado)
	{
		Highcharts.setOptions(
		{
		    colors: Highcharts.map(Highcharts.getOptions().colors, function (color)
		    {
		    	var salida = 
		    	{
		            radialGradient:
		            {
		                cx: 0.5,
		                cy: 0.3,
		                r: 0.7
		            },
		            stops:
		            [
		                [0, color],
		                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')]
		            ]
		        };

		        return salida; 
		    })
		});

		estadoDegrado = true;
	}
	else
	{
		alert('Esta opción ya se encuentra activada.');
	}
}

function getEstadoDegrado()
{
	return estadoDegrado;
}

////////// verifica si el grafico ya esta almacenado, de lo contrario lo almacena

function verificarGrafico(modo,contenedor,titulo,datos,configuracion) 
{
	listaDeGraficos[contenedor] = 
	{
		titulo: titulo,
		datos: datos,
		configuracion
	};
}

function verificarGraficoDrill(modo,contenedor,titulo,datos,infoDrill,datosDrill,configuracion) 
{
	listaDeGraficos[contenedor] = 
	{
		titulo: titulo,
		datos: datos,
		infoDrill: infoDrill,
		drill: datosDrill,
		configuracion
	};
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
		var configuracion = datos['configuracion'];

		if(drill == undefined)
		{
			if(infoDatos.length !== 3)
			{
				pintarDiagrama(tipo,contenedor,datos['titulo'],datos['datos'],configuracion);
			}
			else
			{
				pintarDiagramaColores(tipo,contenedor,datos['titulo'],datos['datos'],configuracion);
			}
		}
		else
		{
			pintarDiagramaDrill(tipo,contenedor,datos['titulo'],datos['datos'],datos['infoDrill'],datos['drill'],configuracion);
		}
	}
}

/////////////  diagramas sin drill  /////////////////

// pinta los diagramas sin drill indicando el color de cada uno

function pintarDiagramaColores(modo,contenedor,titulo,datos,configuracion)
{
	verificarGrafico(modo,contenedor,titulo,datos,configuracion);

	///////////// variables de configuracion ////////////////////////

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
	};

	////////////////////////////////////////////////////////////////

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

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}

		if(configuracion['yAxis'] != undefined)
		{
			if(configuracion['yAxis']['title'] != undefined)
			{
				yAxis['title'] = configuracion['yAxis']['title'];
			}
		}
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
			yAxis: yAxis,
			legend: 
			{
				enabled: false
			},
			tooltip: tooltip,
			plotOptions: 
			{
				series: series
			},
			series: 
			[
				{
					cursor: 'pointer',
					colorByPoint: false,
					allowPointSelect: true,
					data: lista
				}
			]
		});

	}else
	{
		pintarColumnaColores(modo,contenedor,titulo,datos,configuracion);
	}
}

function pintarColumnaColores(modo,contenedor,titulo,datos,configuracion)
{
	verificarGrafico(modo,contenedor,titulo,datos,configuracion);

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

	///////////// variables de configuracion ////////////////////////

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
	};

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}

		if(configuracion['yAxis'] != undefined)
		{
			if(configuracion['yAxis']['title'] != undefined)
			{
				yAxis['title'] = configuracion['yAxis']['title'];
			}
		}
	}

	////////////////////////////////////////////////////////////////

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
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
        plotOptions: 
        {
            series: series
        },

        tooltip: tooltip,

        series: 
        [
        	{
				cursor: 'pointer',
				colorByPoint: false,
				allowPointSelect: true,
				data: lista
			}
        ]  
    });
}

////////////////////////////

// pinta los diagramas sin drill y sin indicar el color de cada uno

function pintarDiagrama(modo,contenedor,titulo,datos,configuracion)
{
	verificarGrafico(modo,contenedor,titulo,datos,configuracion);

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
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

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}

		if(configuracion['yAxis'] != undefined)
		{
			if(configuracion['yAxis']['title'] != undefined)
			{
				yAxis['title'] = configuracion['yAxis']['title'];
			}
		}
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
			yAxis: yAxis,
			legend: 
			{
				enabled: false
			},
			tooltip: tooltip,
			plotOptions: 
			{
				series: series
			},
			series: 
			[
				{
					cursor: 'pointer',
					colorByPoint: line,
					allowPointSelect: true,
					data: lista
				}
			]
		});

	}else
	{
		pintarColumna(modo,contenedor,titulo,datos,configuracion);
	}
}

function pintarColumna(modo,contenedor,titulo,datos,configuracion)
{
	verificarGrafico(modo,contenedor,titulo,datos,configuracion);

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

	///////////// variables de configuracion ////////////////////////

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
	};

	if(modo == 'column3d')
	{
		modo = 'column3d';
		options3d['enabled'] = true;
		options3d['beta'] = 0;
		options3d['depth'] = 50;
	}

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}

		if(configuracion['yAxis'] != undefined)
		{
			if(configuracion['yAxis']['title'] != undefined)
			{
				yAxis['title'] = configuracion['yAxis']['title'];
			}
		}
	}

	////////////////////////////////////////////////////////////////

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
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
        plotOptions: 
        {
            series: series
        },

        tooltip: tooltip,

        series: 
        [
        	{
				cursor: 'pointer',
				colorByPoint: true,
				allowPointSelect: true,
				data: lista
			}
        ]  
    });
}

//////////////// drilldown ///////////////////////

// pinta los diagramas con drill

function pintarDiagramaDrill(modo,contenedor,titulo,datos,infoDrill,datosDrill,configuracion)
{
	verificarGraficoDrill(modo,contenedor,titulo,datos,infoDrill,datosDrill,configuracion);

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
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

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}
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
					options3d: options3d
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
				yAxis: yAxis,
				legend: 
				{
					enabled: false
				},
				tooltip: tooltip,
				plotOptions: 
				{
					series: series
				},
				series: 
				[
					{
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
		pintarColumnaDrill(modo,contenedor,titulo,datos,infoDrill,datosDrill,configuracion);
	}
}

function pintarColumnaDrill(modo,contenedor,titulo,datos,infoDrill,datosDrill,configuracion)
{
	verificarGraficoDrill(modo,contenedor,titulo,datos,infoDrill,datosDrill,configuracion);

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

	///////////// variables de configuracion ////////////////////////

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
	};

	if(modo == 'column3d')
	{
		modo = 'column3d';
		options3d['enabled'] = true;
		options3d['beta'] = 0;
		options3d['depth'] = 50;
	}

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}
	}

	////////////////////////////////////////////////////////////////

    Highcharts.chart(contenedor,
    {
        chart: 
        {
            type: 'column',
            options3d: options3d
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
        yAxis: yAxis,
        legend: 
        {
            enabled: false
        },
        plotOptions: 
        {
            series: series
        },

        tooltip: tooltip,

        series: 
        [
        	{
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

///////////////////// individuales ////////////////

function pintarDiagramaCircular(modo,contenedor,titulo,datos,configuracion)
{
	///////////// variables de configuracion ////////////////////////

	var options3d = {alpha: 15};

	var tooltip = 
	{
		headerFormat: '',
        pointFormat: '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br><span style="color:{point.color}">Porcentaje: <b>{point.y:.2f}%</b></span><br/>'
	};

	var series =
	{
		borderRadius: 3,
		depth: 65,
		borderWidth: 0,
		dataLabels: 
		{
			enabled: true,
			format: '{point.name}: <span style="font-weight:normal">{point.y:.2f}%</span>'
		}
	};

	var yAxis = 
	{
		title: 'Porcentaje'
	};

	////////////////////////////////////////////////////////////////

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

	if(configuracion != undefined)
	{
		if(configuracion['tooltip'] != undefined)
		{
			if(configuracion['tooltip']['pointFormat'] != undefined)
			{
				var salida = '';

				for(var i = 0;i < (configuracion['tooltip']['pointFormat']).length;i++)
				{
					salida += '<span style="color:{point.color}">' + configuracion['tooltip']['pointFormat'][i]['nombre'] + ': <b>{point.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'number')?'y':'percentage') + ':.' 
							+ ((configuracion['tooltip']['pointFormat'][i]['decimales'] == undefined)?0:configuracion['tooltip']['pointFormat'][i]['decimales']) 
							+'f}' + ((configuracion['tooltip']['pointFormat'][i]['tipo'] == 'percentage')?'%':'') + '</b></span><br/>';
				}

				tooltip['pointFormat'] = '<span style="font-size:11px;font-weight:bolder">{point.name}</span><br>' + salida;
			}
		}

		if(configuracion['series'] != undefined)
		{
			if(configuracion['series']['dataLabels'] != undefined)
			{
				if(configuracion['series']['dataLabels']['format'] != undefined)
				{
					series['dataLabels']['format'] = '{point.name}: <span style="font-weight:normal">{point.' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'number')?'y':'percentage') 
						+ ':.' + ((configuracion['series']['dataLabels']['format']['decimales'] == undefined)?0:configuracion['series']['dataLabels']['format']['decimales']) + 'f}' 
						+ ((configuracion['series']['dataLabels']['format']['tipo'] == 'percentage')?'%':'') +'</span>';
				}
			}
		}

		if(configuracion['yAxis'] != undefined)
		{
			if(configuracion['yAxis']['title'] != undefined)
			{
				yAxis['title'] = configuracion['yAxis']['title'];
			}
		}
	}

	if(modo == 'pie')
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
			yAxis: yAxis,
			legend: 
			{
				enabled: false
			},
			tooltip: tooltip,
			plotOptions: 
			{
				series: series
			},
			series: 
			[
				{
					cursor: 'pointer',
					colorByPoint: true,
					allowPointSelect: true,
					data: lista
				}
			]
		});
	}
	else
	{
		alert('Modo de grafico incorrecto');
	}
}
