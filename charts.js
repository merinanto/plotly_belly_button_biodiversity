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

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // Create a variable that holds the samples array. 
    var sampledata = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampledata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var sampleresult = sampleArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_Array = sampleresult.otu_ids;
    var otu_labels_Array = sampleresult.otu_labels;
    var sample_values_Array = sampleresult.sample_values;

    var otu_idsliceArray = otu_ids_Array.slice(0,10);

    var otu_lblsliceArray = otu_labels_Array.slice(0,10);

    var samplevalsliceArray = sample_values_Array.slice(0,10);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    var prefix = 'OTU ';

    var yticks = otu_idsliceArray.map(el => prefix + el);
    
    var trace1 =  {
      x:samplevalsliceArray.sort(function(a, b){return a-b}), 
      y:yticks,
      text : otu_lblsliceArray,
      type: "bar", orientation: 'h'
     };

    // Create the trace for the bar chart. 
    var barData = [trace1
      
    ];
    // Create the layout for the bar chart. 
    var barLayout = {title: "Top 10 Bacteria Cultures Found" ,font :{size: 14}};

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otu_ids_Array,
      y: sample_values_Array,
      text:otu_labels_Array,
      mode: 'markers',
      marker: {
        color: otu_ids_Array,
        size: sample_values_Array
      }
    };

    var bubbleData = [trace2
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title: 'Bacteria Cultures Per Sample',xaxis :{
      title: 'OTU ID', display: true,
      font: {
        family: 'Courier New, monospace',
        size: 36,
        color: '#7f7f7f'
      }
    },
   //  showlegend: false,
    height: 600,
    width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    var metadataArray = data.metadata;
    var metaArray = metadataArray.filter(sampleObj => sampleObj.id == sample);
    var resultMeta = metaArray[0];

    console.log(resultMeta);
    var washfreq = resultMeta.wfreq;
    console.log(washfreq);

    washfreqfloat = Number(washfreq);
    console.log(washfreqfloat);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreqfloat,
        title: { text: "Belly Button Washing Frequency <br><sub> Scurbs Per Week </sub> " },
        type: "indicator",
        mode: "gauge+number",
        //delta: { reference: 380 },
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 450, margin: { t: 0, b: 0 }     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    
  });
}
