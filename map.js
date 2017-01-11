//Specify Dimensions
var width = 900,
    height = 600;

// Create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height);

// Define a geographical projection and scale the map 
var projection = d3.geo.mercator()
  .scale(1)

// Prepare a path object and apply the projection to it.
var path = d3.geo.path()
  .projection(projection);

// Load the features from the GeoJSON.
d3.json('data/ug_districts2.geojson', function(error, features) {

  // Get the scale and center parameters from the features.
  var scaleCenter = calculateScaleCenter(features);

  // Apply scale, center and translate parameters.
  projection.scale(scaleCenter.scale)
    .center(scaleCenter.center)
    .translate([width/2, height/2]);
    
  svg.append('g') // add a <g> element to the SVG element and give it a class to style later
    .attr('class', 'features')
    .selectAll('path')
    .data(features.features)
    .enter().append('path')
    .attr('d', path);

});



 /* 
 A way to Dynamically scale and position the map
 Thanks to: http://stackoverflow.com/a/17067379/841644
 
 */
function calculateScaleCenter(features) {
  // Get the bounding box of the paths (in pixels!) and calculate a
  // scale factor based on the size of the bounding box and the map
  // size.
  var bbox_path = path.bounds(features),
      scale = 0.95 / Math.max(
        (bbox_path[1][0] - bbox_path[0][0]) / width,
        (bbox_path[1][1] - bbox_path[0][1]) / height
      );

  // Get the bounding box of the features (in map units!) and use it
  // to calculate the center of the features.
  var bbox_feature = d3.geo.bounds(features),
      center = [
        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

  return {
    'scale': scale,
    'center': center
  };
}