// filtering data by handedness
function filterByHand(data, hand) {
	"use strict";
	var filtered = data.filter(function (d) {
		if (hand === null) {
			return true;
		}
		return d.handedness === hand;
	});
	return filtered;
}

// converting hand options text to value
function convertCategory(category) {
	"use strict";
	switch (category) {
		case "Both":
			return "B";
		case "Left":
			return "L";
		case "Right":
			return "R";
		default:
			return null;
	}
}

// drawing the scatter plot
function draw(data) {
	"use strict";
	var margin = {top: 20, right: 20, bottom: 20, left: 40};
	var buffer = 50;
	var chartWidth = window.innerWidth ;
	var chartHeight = window.innerHeight ;
	var width = chartWidth - margin.left - margin.right - buffer;
	var height = chartHeight - margin.top - margin.bottom - buffer;
	
	// batting avg (Horizontal axis )
	var xValue = function (d) { return d.avg; };
	var xScale = d3.scale.linear().range([0, width]);
	var xMap = function (d) { return xScale(xValue(d)); };
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// total home runs (Vertical axis)
	var yValue = function (d) { return d.HR; };
	var yScale = d3.scale.linear().range([height, 0]);
	var yMap = function (d) { return yScale(yValue(d)); };
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	// filling colors
	var handOptions = ["Left", "Right", "Both", "All"];
	var cValue = function (d) { return d.handedness; };
	var colors = ["#FC998E", '#99C1DC', "#53970D", "#FDC381"];
	var color = d3.scale.ordinal().domain(["L", "R", "B", ""]);
	color.range(colors);

	// adding the graph canvas
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// adding the tooltip area
	var tooltip = d3.select("body").append("div");
	tooltip.attr("class", "tooltip")
		.style("opacity", 0);

	// Checking the fit of tooltip 
	function inBounds(value, axis) {
		if (axis === "height" && value < 100) {
			return value + 150;
		}
		if (axis === "width" && value > width - 100) {
			return value - 125;
		}
		return value;
	}

	// converting string to number 
	data.forEach(function (d) {
		d.weight = +d.weight;
		d.height = +d.height;
		d.avg = +d.avg;
		d.HR = +d.HR;
		d.id = +d.id;
	});

	// stopping overlaps (dot/axis) 
	xScale.domain([d3.min(data, xValue) - 0.01, d3.max(data, xValue) + 0.01]);
	yScale.domain([d3.min(data, yValue) - 10, d3.max(data, yValue) + 50]);
	
	// horizontal-axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Batting Average");

	// vertical-axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("# of Home Runs");
	
	
	
	// draw toggle options
	var buttons = d3.select("body")
		.append("div")
		.attr("class", "hand_buttons")
		.selectAll("div")
		.data(handOptions)
		.enter()
		.append("div")
		.attr("class", "hand_button")
		.style("background-color", color)
		.text(function (d) { return d; });
	
	buttons.on("click", function (d) {
		
		// update data on button click
		render(d);
		
		// style all buttons to normal
		d3.selectAll('.hand_button')
			.transition().duration(500)
			.style("opacity", 0.5)
			.style("color", "#000000");

		// change style of clicked button
		d3.select(this)
			.transition().duration(500)
			.style("opacity", 1)
			.style("color", "#FFFFFF");
		
		});
	
	// fade in toggle options
	buttons.style("opacity", 0)
		.transition().duration(1500)
		.style("opacity", 0.75);
	
	function render(category) {
		// convert category to correct field value
		category = convertCategory(category);
		
		// Filter data by handedness
		var filtered = filterByHand(data, category);
		
		var circles = svg.selectAll("circle")
			.data(filtered, function (d) {return d.id; });
		
		// fade out and clear data
		circles.exit()
			.transition()
			.duration(750)
			.style("opacity", 0)
			.remove();
		
		// fade in and append data 
		circles.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.style("fill", function (d) { return color(cValue(d)); })
			.style("stroke", "none")
			.style("opacity", 0)
			.transition().duration(750)
			.style("opacity", 0.5);
		
		circles.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 1);
			
			// set up outline of preview tooltip
			tooltip.html("<div id='tooltip'><div class='resultDiv'><h2 id='player' class='result'></h2></div></div>")
				.style("left", inBounds(d3.event.pageX + 10, "width") + "px")
				.style("top", (d3.event.pageY - 10) + "px");
			
			// import player name in preview tooltip
			document.getElementById("player").innerHTML = d.name;

			d3.select(this)
				.transition()
				.duration(200)
				.style("stroke", "#FFFFFF")
				.style("opacity", 0.9)
				.style("cursor", "pointer");

		})
			.on("click", function (d) {
				// set up outline of overview tooltip
				tooltip.html(
					"<div id='tooltip'><div class='resultDiv'><h2 id='player' class='result'></h2></div> \
					<div class='resultDiv'><h2>Batting Avg:&nbsp;<h2 id='avg' class='result'></h2></h2></div> \
					<div class='resultDiv'><h2>Home Runs:&nbsp;</h2><h2 id='hr' class='result'></h2></div> \
					<div class='resultDiv'><h2>Height:&nbsp;</h2><h2 id='height' class='result'></h2></div> \
					<div class='resultDiv'><h2>Weight:&nbsp;</h2><h2 id='weight' class='result'></h2></div></div>"
				)
					.style("left", inBounds(d3.event.pageX + 10, "width") + "px")
					.style("top", inBounds(d3.event.pageY - 170, "height") + "px")
					.style("color", color(cValue(d)))
					.style("opacity", 0.5)
					.transition().duration(300)
					.style("opacity", 1);

				// import fields to overview tooltip
				document.getElementById("player").innerHTML = d.name;
				document.getElementById("avg").innerHTML = d.avg;
				document.getElementById("hr").innerHTML = d.HR;
				document.getElementById("height").innerHTML = d.height + " in";
				document.getElementById("weight").innerHTML = d.weight + " lbs";
				document.getElementById("handedness").innerHTML = d.handedness;
		
				d3.select(this)
					.transition()
					.duration(200)
					.attr("r", 8)
					.style("opacity", 1);
			})
			.on("mouseout", function (d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", 0);

				d3.select(this)
					.transition()
					.duration(200)
					.attr("r", 5)
					.style("stroke", "none")
					.style("opacity", 0.5)
					.style("cursor", "default");
			});
		
		
	}
	//  draw initial chart with all data points
	render("All");
		
}
