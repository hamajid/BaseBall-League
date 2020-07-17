# Project 6: Make Effective Data Visualization (Baseball Player Performance)

## Summary

In this project, our goal is to create an exploratory chart from a CSV dataset using learned skills for d3.js or dimple.js
The data set contains basic information about player such height, weight and his handedness as well as his performance such as total home runs and his batting average. those informations were parsed and explored programmatic to create an interactive data visualization using D3 library in combination with common web development languages (HTML5, CSS3, JavasScript). 

## Data Cleaning

Our focus on this analysis is the average batting and the total home runs by player. So I deleted all data entries that have 0 either in home runs or average batting directly from the CSV file using excel.

## Design

The scatter chart is more appropriate to show the correlation between the home runs and average batting for each player. The horizontal axis scaled to the batting average while the vertical axis is showing the sum of the home runs. 
The data set is filtered by handedness to show the performance difference. 
Each dot is presenting a player and by clicking the dot a tooltip shows more information about the player and his performance 

## Feedback

Feed back collected: 

- Can the subtitle be changed to something more meaningful? a brief statement or small introduction explaining the chart? 
	
	The subtitle changed to a brief introduction with some information about the chart and emphasizing the finding.
	
- Why there is dot in red while the blue color is selected, in other word two left handed players shows up when the right handed players are selected?

	I checked my code and I notice that I used the name as a key because I assumed that will be unique but It's not the case in our data set so I had to add a new field id and I use it as unique key to filter data.  
	
- It a little hard for me to see the blue dot ?

	I removed the SVG background so the blue dot appears more clearly, I had the option to change the dot colors but when I tried warmer colors I lost the lightness and smoothness of the page.  

## Resources

- https://www.w3schools.com/
- https://www.lynda.com/search?q=d3.js ( 3 courses)
- https://canvasjs.com/docs/charts/basics-of-creating-html5-chart/
- https://developer.mozilla.org/en-US/docs/Web/SVG