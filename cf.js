d3.csv('fev.csv')
	.row(function(d) {
		d.Age = +d.Age;
		d.FEV = +d.FEV;
		d.Height = +d.Height;
		return d; })
	.get(function(error, rows) {
		if (error) { console.error('Error: ' + error.status + ' ' + error.statusText); }
		else { load_visualizations(rows); };
	} );


	// Helper function from http://www.codeproject.com/Articles/693841/Making-Dashboards-with-Dc-js-Part-1-Using-Crossfil
	// used for debugging.
	function print_filter(filter){
		var f=eval(filter);
		if (typeof(f.length) != "undefined") {}else{}
		if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
		if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
		console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
	}


function load_visualizations(rows) {
	// Remove "loading..." messages
	Array.map( document.getElementsByClassName('crossfilter_loading'),
		function(e){e.style.display='none'} )

	// object for crossfiltering
	var fev = crossfilter(rows);


	/* *** Helper functions for grouping into bins and rounding for the brush *** */
	// Round to nearest (binSize) to the left
	var roundToBin = function(binSize) { return function(x) Math.floor(x/binSize)*binSize };
	// count bins in domain [start, end]
	var countBins  = function(binSize) { return function(start, end, xDomain) { return (end - start) / binSize; }; };
	// Round domain to whole bins
	function roundDomainToBins(domain, binSize){
		var l=domain[0], r=domain[1];
		return [ Math.floor(l/binSize)*binSize, Math.ceil(r/binSize)*binSize];
		};


	// Set up the charts
	
	/* *** fev - forced expiratory volume ***
	 * The data points are grouped/binned to nearest 0.1 to the left. */

	// Set up the bins
	var fevBinSize    = .1;
	var fevRoundToBin = roundToBin(fevBinSize);
	var fevCountBins  = countBins(fevBinSize);

	var fevDim      = fev.dimension( function(d) { return d.FEV; } );
	var fevGrouping = fevDim.group( fevRoundToBin ); // group (count) the values by the bins they end up in
	var fevDomain   = roundDomainToBins(d3.extent(rows.map( function(r) { return r.FEV; } )), fevBinSize);
	var fevBarChart = dc.barChart("#cf_barchart-fev")
		//~ .width(1267)
		.height(200) // There is an odd (buggy?) behaviour when no height is set and the chart is redrawn
		.dimension(fevDim)
		.group(fevGrouping)
		.x(d3.scale.linear().domain(fevDomain))
		.xUnits( fevCountBins ) // Used by dc to calculate number of bars (bins)
		.round( fevRoundToBin ) // align the brush to nearest bin to the left
		//~ .elasticY(true)
		//~ .renderTitle(true)
		//~ .title(function(d) { console.log(d);return d.key; })
		// Reset filter and current filter
		.controlsUseVisibility(true)
		fevBarChart.yAxis().tickFormat(d3.format("d"))//.ticks(5); // integer y-axis
		fevBarChart.xAxis().ticks(20);
		//~ fevBarChart.xAxis().tickFormat(d3.format(".3f")).ticks(20);


	/* *** Age (whole years) *** */

	var ageDim      = fev.dimension( function(d) { return d.Age; } );
	var ageGrouping = ageDim.group();
	var ageDomain   = d3.extent( rows.map( function(r) { return r.Age; } ) );
	var ageBarChart = dc.barChart("#cf_barchart-age")
		//~ .width(1267)
		.height(200)
		.dimension(ageDim)
		.group(ageGrouping)
		.x(d3.scale.linear().domain(ageDomain))
		.round(Math.floor) // snap brush to integers
		.elasticY(true)
		//~ .elasticX(true)
		//~ .renderTitle(true)
		//~ .title(function(d) { console.log(d);return d.key; })
		// Reset filter and current filter
		//~ .turnOnControls(true)
		.controlsUseVisibility(true);


	/* *** height ***
	 * Grouped (binned) to nearest centimetre (towards zero) */

	var heightBinSize    = .1;
	var heightRoundToBin = roundToBin(heightBinSize);
	var heightCountBins  = countBins(heightBinSize);
	
	var heightDim        = fev.dimension( function(d) { return d.Height; } );
	var heightGrouping   = heightDim.group( heightRoundToBin ); // group to nearest cm below
	var heightDomain     = d3.extent( rows.map( function(r) { return r.Height; } ) );
	var heightBarChart   = dc.barChart("#cf_barchart-height")
		//~ .width(1267)
		.height(200)
		.dimension(heightDim)
		.group(heightGrouping)
		.x(d3.scale.linear().domain(heightDomain))
		//~ .xUnits(heightCountBins) // the data is so spread out that it looks better without
		.round(heightRoundToBin)
		//~ .elasticY(true)
		//~ .elasticX(true)
		//~ .renderTitle(true)
		//~ .title(function(d) { console.log(d);return d.key; })
		// Reset filter and current filter
		.controlsUseVisibility(true)


	/* *** Exposure to smoking *** */

	var exposureDim      = fev.dimension( function(d) { return d.Smoke; } );
	var exposureGrouping = exposureDim.group();
	var exposureDomain   = d3.extent( rows.map( function(r) { return r.Smoke; } ) );
	var exposureBarChart = dc.barChart("#cf_barchart-exposure")
		//~ .width(1267)
		.height(200)
		.dimension(exposureDim)
		.group(exposureGrouping)
		.x(d3.scale.ordinal().domain(exposureDomain))
		.xUnits(dc.units.ordinal)
		.elasticY(true)
		//~ .renderTitle(true)
		//~ .title(function(d) { console.log(d);return d.key; })
		// Reset filter and current filter
		.controlsUseVisibility(true)


	/* *** Gender *** */

	var genderDim      = fev.dimension( function(d) { return d.Gender; } );
	var genderGrouping = genderDim.group();
	var genderDomain   = d3.extent( rows.map( function(r) { return r.Gender; } ) );
	var genderBarChart = dc.barChart("#cf_barchart-gender")
		//~ .width(1267)
		.height(200)
		.dimension(genderDim)
		.group(genderGrouping)
		.x(d3.scale.ordinal().domain(genderDomain))
		.xUnits(dc.units.ordinal)
		.elasticY(true)
		//~ .renderTitle(true)
		//~ .title(function(d) { console.log(d);return d.key; })
		// Reset filter and current filter
		.controlsUseVisibility(true)


	dc.renderAll();


	/* *** Expose two functions to manipulate the charts from the text *** */
	window.CF_filter = function(fevFilter, ageFilter, heightFilter, exposureFilter, genderFilter) {
		fevBarChart.filter(fevFilter);
		ageBarChart.filter(ageFilter);
		heightBarChart.filter(heightFilter);
		exposureBarChart.filter(exposureFilter);
		genderBarChart.filter(genderFilter);

		dc.redrawAll();
	}

	window.CF_reset = function(name) {
		switch(name){
			case 'fev':
				fevBarChart.filterAll();
				break;
			case 'age':
				ageBarChart.filterAll();
				break;
			case 'height':
				heightBarChart.filterAll();
				break;
			case 'exposure':
				exposureBarChart.filterAll();
				break;
			case 'gender':
				genderBarChart.filterAll();
				break;
			case 'all':
				dc.filterAll();
				break;
			default:
				console.error('Bad argument to CF_reset');
		}
		dc.redrawAll();
		console.log('yay');
	}

};
