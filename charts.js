function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  console.log(data)
    // 3. Create a variable that holds the samples array. 
  var samples = data.samples 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
  var resultArray  = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
  console.log(resultArray)
  var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var result_otu_ids = result['otu_ids'];
    var result_otu_labels = result['otu_labels'];
    var result_sample_values = result['sample_values'];

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    results_for_otu_ids= result_otu_ids.map(otu=>`OTU ${otu}`).slice(0,10).reverse();
    results_for_otu_labels= result_otu_labels.slice(0,10).reverse();
    results_for_otu_sample_values= result_sample_values.slice(0,10).reverse();

    console.log(results_for_otu_ids);
    console.log(results_for_otu_labels);
    console.log(results_for_otu_sample_values);
  
    var yticks = results_for_otu_ids;
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: results_for_otu_sample_values,
      y: results_for_otu_ids,
      text: results_for_otu_labels,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU ID"}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData,barLayout,yticks);

  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x:result_otu_ids,
    y:result_sample_values,
    text: result_otu_labels,
    mode: "markers",
    marker: {
      color: result_otu_ids,
      size: result_sample_values
    },
    type: "bubble"  
  }];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
  title: 'Bacteria Cultures Per Samples',
  xaxis :result_otu_ids,
  hovermode: "closest",
  height: 600,
  width: 1000
  };

  // 3. Use Plotly to plot the data with the layout.

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
  // });

  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var resultMetaArray  = data.metadata.filter(sampleObj => sampleObj.id == sample);  
    // Create a variable that holds the first sample in the array.
    console.log(resultMetaArray)
    var result_met = resultMetaArray[0];

  
   var Washing_frequency= parseFloat(result_met.wfreq);
  
  //   // 4. Create the trace for the gauge chart.
    var gaugeData = [{
    domain: { x:[0,1], y:[0,1]},
    value: Washing_frequency,
    type:"indicator",
    mode: "gauge+number",
    title: { text:"<b>Belly Button Washing frequency</b><br>Scurbs per week"},
    gauge: {axis:{range:[null,10]},
      bar:{color:"black"},
      steps:[
        {range:[0,2],color:"red"},
        {range:[2,4],color:"green"},
        {range:[4,6],color:"orange"},
        {range:[6,8],color:"blue"},
        {range:[8,10],color:"yellow"},
      ]  
  }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width:500,
      height:450,
      margin:{t:0,b:0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });

}
