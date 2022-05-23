// Create a function which extract the json data from a url, can filter it by sample id and store it within the index.html file:
function MetaDash(sample) {
  
  // Use a json request to extract data from the url:
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    // Store the metadata within the extracted data under its own variable: 
    let metadata = data.metadata;

    // Use a filter to find the metadata dictionaries with the required sample id:
    let FilteredIDList = metadata.filter(sampleObj => sampleObj.id == sample);

    // Store the first dictionary in the array above under its own variable:
    let FirstMatch = FilteredIDList[0];

    // Use the select functionality in D3 to search the index.html file for the location with <div id> of #sample-metadata.
    let Dash = d3.select("#sample-metadata");

    // Replace any existing metadata in that spot with nothing (""), hence deleting it.
    Dash.html("");

    // Add each key and its corresponding data element to the index.html file in the location identifies above.
    Object.entries(FirstMatch).forEach(([key, value]) => {
      Dash.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Create a function which builds the required charts for each chosen sample:
function BuildGraphs(sample) {

  // Again, use a json request to extract data from the url: 
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    // This time we are concerned with this 'samples' within the data. Store the samples data under its own variable.
    let samples = data.samples;

    // Filter the 'samples' data for dictionaries that have the required sample id:
    let FilteredIDList = samples.filter(sampleObj => sampleObj.id == sample);

    // Store the first dictionary in the array above under its own variable:
    let FirstMatch = FilteredIDList[0];

    // Separate the three elements within the dictionary that will be used in chart construction: 
    let otu_ids = FirstMatch.otu_ids;
    let otu_labels = FirstMatch.otu_labels;
    let sample_values = FirstMatch.sample_values;

    // Construct the Bar Chart by first choosing the ten most frequently observed bacteria within a particular sample:
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let DataBarChart = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        // Select the orientation for the bar chart to be horizontal:
        orientation: "h",
      }
    ];

    let LayoutBarChart = {
      title: "Top 10 Microbes Found:",
      margin: { t: 40, l: 200 }
    };

    // Place the plot in the index.html section containing the term, "bar":
    Plotly.newPlot("bar", DataBarChart, LayoutBarChart);

    // Construct the Bubble Chart:  
    let LayoutBubbleChart = {
      title: "Microbes and their Quantity Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    let DataBubbleChart = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    // Place the plot in the index.html section containing the term, "bubble":
    Plotly.newPlot("bubble", DataBubbleChart, LayoutBubbleChart);
  });
}

// Create a function which graphs the first sample id's data automatically on opening the index.html file:
function init() {

  // Use D3 to select the dropdown menu. It has a <div id> containing "selDataset" in the index.html file. (Note, ids required a '#'.)
  let selector = d3.select("#selDataset");

  // Again, use a json request to extract data from the url: 
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    // This time we are concerned with this 'names' within the data. Store the names data under its own variable.
    let SampleNames = data.names;

    // Cycle through each name and add it to the dropdown list options: 
    SampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // By default, we want to use the first sample on the dropdown list for the initial graphs:
    let firstSample = SampleNames[0];
    BuildGraphs(firstSample);
    MetaDash(firstSample);
  });
}
// Write a function that imports the appropriate data set each when a new selection is made from the dropdown list:
function optionChanged(newSample) {
  BuildGraphs(newSample);
  MetaDash(newSample);
}

// Run the initialise function to start the website with its default data sets and charts in place:
init();
