const url ="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use d3 library to read in samples.json 
function createCharts(sample){

    d3.json(url).then(function(data){
        let samples=data.samples
        console.log(samples)

        let sampleF=samples.filter(obj=>obj.id==sample)
        console.log(sampleF);
        let newSample=sampleF[0];
    
        // Create variables
        let otuId= newSample.otu_ids
        // console.log(otuId);
        let otuLabels=newSample.otu_labels;
        let sampleValues= newSample.sample_values;

        // Create trace for bar chart
        let bardata={
            x: sampleValues.slice(0,10).reverse(),
            y:otuId.slice(0,10).map(ids => `OTU ${ids}`).reverse(),
            text: otuLabels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h"
        };
        // Create layout for bar chart
        let layout= {
            title: "Top 10 Bateria"
        };
        // create Bar chart using Plyplot
        Plotly.newPlot("bar",[bardata],layout);


        // Create trace for bubble chart
        let btrace={
            x: otuId,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker:{
                size: sampleValues,
                color:otuId
            }
        };
        // create Layout for bubble chart
        let blayout={
            title:"Sample of Bacteria Culture",
            xaxis:{title:"OTU ID"},
            height: 500,
            width: 1200
        };
        //  Create Bubble chart using PLotly
        Plotly.newPlot("bubble",[btrace],blayout);
    });
};

// Create the demographic function
function metaData(sample){
    let select=d3.select("#sample-metadata");

    d3.json(url).then(function(data){
        let metaData=data.metadata;
        console.log(metaData);
        let metaDataF=metaData.filter(Obj=>Obj.id==sample);
        let newMetaData=metaDataF[0];

        select.html("");
        Object.entries(newMetaData).forEach(([key,value])=>{
            select.append("h3").text(`${key}:${value}`);
        });
    });
};

// Create dropdown selector 
function init(){
    let dropdown=d3.select("#selDataset");

    // populate list of sample name options
    d3.json(url).then(function(data){
        let sampleN=data.names;
        sampleN.forEach((sample)=>{
            dropdown.append("option").text(sample).property("value",sample);
        });

        let initSample= sampleN[0];
        createCharts(initSample);
        metaData(initSample)
    });
};

// Call init function
init();

// Create options function
function optionChanged(newSample){
    createCharts(newSample);
    metaData(newSample);
};
