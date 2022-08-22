import React, { Fragment, useState, useEffect } from "react";
import Navigation from "../components/Navigation.js";
import BarChart from '../components/Charts/BarChart.js'
import LineChart from '../components/Charts/LineChart.js'
import PieChart from '../components/Charts/PieChart.js'
import { UserData } from "../components/Charts/Chart_Data.js";

export default function Home(props) {


  // --------------------------------------------------------------------------------------------------------------------
  // Pure Data
  const [data, setData] = useState([]);                       // raw Data from API
  const [dataDays, setDataDays] = useState([]);               // set of days
  const [contractsMade, setContractsMade] = useState([]);     // OfferAcceptedBuyer + OfferAcceptedSeller    for each day
  const [disputesClosed, setDisputesClosed] = useState([]);   // Disputes closed for each day
  const [ETHValue, setETHValue] = useState([]);               // ETH Value for each day
  const [USDCValue, setUSDCValue] = useState([]);             // USDC Value for each day

  const [cumulativeETHTotal, setCumulativeETHTotal] = useState();
  const [cumulativeUSDCTotal, setCumulativeUSDCTotal] = useState();


  // Graph Set Data
  const [ContractsMadeAndDisputedBarGraph, setContractsMadeAndDisputedBarGraph] = useState({
    labels: "", 
    datasets: [{}]
  });   
  const [ContractsMadeAndDisputedLineGraph, setContractsMadeAndDisputedLineGraph] = useState({
    labels: "", 
    datasets: [{}]
  });  

  const [ETHValueLineGraph, setETHValueLineGraph] = useState({
    labels: "", 
    datasets: [{}]
  });  
  const [USDCValueLineGraph, setUSDCValueLineGraph] = useState({
    labels: "", 
    datasets: [{}]
  });  

  useEffect(() => {
    const getCollectionsDetails = async () => {
      const data = await fetch(`./api/api-getAggregateData`)
      .then((res) => res.json())
      //.then((json) => console.log(json)) // uncomment this line to see the data in the console
      .then((json) => setData(json));
    }

    getCollectionsDetails().catch(console.error);
  },[]);

  useEffect(() => {
    PrepareContractsMade();
    PrepareDisputesClosed();
    PrepareETHvalue();
    PrepareUSDCvalue();
    PrepareDays();
  }, [data]);


  useEffect(() => {
    const cumulativeContractsMade = accumulate(contractsMade);
    const cumulativeDisputesClosed = accumulate(disputesClosed);
    const cumulativeETHValue = accumulate(ETHValue);
    const cumulativeUSDCValue = accumulate(USDCValue);

    setCumulativeETHTotal(cumulativeETHValue[cumulativeETHValue.length - 1]);
    setCumulativeUSDCTotal(cumulativeUSDCValue[cumulativeETHValue.length - 1]);

    setContractsMadeAndDisputedBarGraph({
      labels: dataDays,
      datasets: [{
        label: "New Contracts Made",
        data: contractsMade,
        backgroundColor: ["#FDD061"],
        borderColor: "#FDD061",
        borderWidth: "2",
        barThickness: 10,
        borderRadius: 20,
      },
      {
        label: "Disputes Solved",
        data: disputesClosed,
        backgroundColor: ["#2F499D"],
        borderColor: "#2F499D",
        borderWidth: "2",
        barThickness: 10,
        borderRadius: 20,
      }]
    });

    setContractsMadeAndDisputedLineGraph({
      labels: dataDays,
      datasets: [{
        label: "New Contracts Made",
        data: contractsMade,
        backgroundColor: ["#1ad797"],
        borderColor: "#1ad797",
        borderWidth: "3",
      },
      {
        label: "Disputes Solved",
        data: disputesClosed,
        backgroundColor: ["#f99700"],
        borderColor: "#f99700",
        borderWidth: "3",
      },
      {
        label: "Cumulative Contracts Made",
        data: cumulativeContractsMade,
        backgroundColor: ["#FDD061"],
        borderColor: "#FDD061",
        borderWidth: "3",
      },
      {
        label: "Cumulartive Disputes Solved",
        data: cumulativeDisputesClosed,
        backgroundColor: ["#2F499D"],
        borderColor: "#2F499D",
        borderWidth: "3",
      }]
    });
 
    setETHValueLineGraph({
      labels: dataDays,
      datasets: [{
        label: "New ETH Value Locked",
        data: ETHValue,
        backgroundColor: ["#FDD061"],
        borderColor: "#FDD061",
        borderWidth: "3",
      },
      {
        label: "Cumulative ETH Value Locked",
        data: cumulativeETHValue,
        backgroundColor: ["#2F499D"],
        borderColor: "#2F499D",
        borderWidth: "3",
      }]
    });

    setUSDCValueLineGraph({
      labels: dataDays,
      datasets: [{
        label: "New USDC Value Locked",
        data: USDCValue,
        backgroundColor: ["#FDD061"],
        borderColor: "#FDD061",
        borderWidth: "3",
      },
      {
        label: "Cumulative USDC Value Locked",
        data: cumulativeUSDCValue,
        backgroundColor: ["#2F499D"],
        borderColor: "#2F499D",
        borderWidth: "3",
      }]
    });
  }, [dataDays]);


  // prepare data for graphs
  function PrepareContractsMade() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i].OfferAcceptedSeller + data[i].OfferAcceptedBuyer);
    }

    setContractsMade(array);
  };

  function PrepareDays() {

    var array = [];

    console.log(`1. PrepareDays array.length: ${array.length}`);

    for (let i = 0; i < data.length; i++) {
      array.push(data[i].block_day);


      console.log(`data[${i}].block_day:`)
      console.log(data[i].block_day)
      console.log(`2. PrepareDays array.length: ${array.length}`);
    }

    console.log(`data.length: ${data.length}`);
    console.log(`3. PrepareDays array.length: ${array.length}`);

    console.log("PrepareDays:");
    console.log(array);

    console.log(`array[3]: ${array[3]}`);

    setDataDays(array);
  };

  function PrepareDisputesClosed() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i].DisputeClosed);
    }

    setDisputesClosed(array);
  };

  function PrepareETHvalue() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push((data[i].valueSeller_0x0000000000000000000000000000000000000000 + data[i].valueBuyer_0x0000000000000000000000000000000000000000) / (10**18));
    }

    console.log("PrepareETHvalue:");
    console.log(array);

    setETHValue(array);
  };

  function PrepareUSDCvalue() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push((data[i].valueSeller_0x2791bca1f2de4661ed88a30c99a7a9449aa84174 + data[i].valueBuyer_0x2791bca1f2de4661ed88a30c99a7a9449aa84174) / (10**6));
    }

    console.log("PrepareUSDCvalue:");
    console.log(array);

    setUSDCValue(array);
  };

  
  // cumulative function
  const accumulate = array_ => array_.map((sum => value => sum += value)(0));
  // --------------------------------------------------------------------------------------------------------------------



  return (
    <Fragment>
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
        dropdownOpen={props.dropdownOpen}
        setDropdownOpen={props.setDropdownOpen}
        OpenDropdownFn={props.OpenDropdownFn}
        hasMenuDrawer={props.hasMenuDrawer}
        setMenuDrawer={props.setMenuDrawer}
        mobileDrawerFn={props.mobileDrawerFn}
        currentAccount={props.currentAccount}
        setCurrentAccount={props.setCurrentAccount}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Dashboard</h1>
        </div>

        <main className="main">Note: the contracts are still in constant development and with every new contract deployed we would need to redo the graphs on Dune Analytics. Hence these are just examples for now.</main>
        <br></br>
        <br></br>


        {/* 
          DUNE ANALYTICS GRAPHS

          <div className="ContainerDashboard">
            <iframe src="https://dune.com/embeds/984240/1705287/3684dc7f-f06b-4579-ba59-d3d498b81c10" height="500" width="500" title="chart 1"></iframe>

            <iframe src="https://dune.com/embeds/1019187/1759672/84fd7fda-e023-41d6-a43a-5d15364d4037" height="500" width="500" title="chart 1"></iframe>

            <iframe src="https://dune.com/embeds/1019187/1759668/ac505790-6db9-45cb-ae6f-a4f4509c5ed2" height="500" width="500" title="chart 1"></iframe>
          </div>
        */}


        {/* MORALIS EVENT SYNC GRAPHS */}
        <div className="ContainerDashboard">

          <div className="Chart">
            <BarChart 
              chartData={ContractsMadeAndDisputedBarGraph} 
              options={{            
                maintainAspectRatio: false,
                scales: {y: {beginAtZero: true}},
                plugins:{
                  title: {display: true, text: 'Contracts Made and Disputes solved'},
                  legend: {position: 'bottom'},
                }
              }}/>
          </div>

          <div className="Chart">
            <LineChart chartData={ContractsMadeAndDisputedLineGraph} 
              options={{            
                maintainAspectRatio: false,
                scales: {y: {beginAtZero: true}},
                plugins:{
                  title: {display: true, text: 'Contracts Made and Disputes solved'},
                  legend: {position: 'bottom'},
                }
              }}
            />
          </div>
        </div>


        <div className="ContainerDashboard">
          <div className="Chart">
            <LineChart chartData={ETHValueLineGraph} 
              options={{            
                maintainAspectRatio: false,
                scales: {y: {beginAtZero: true}},
                plugins:{
                  title: {display: true, text: 'ETH locked in contracts'},
                  legend: {position: 'bottom'},
                }
              }}
            />
          </div>
          
          <div className="Chart">
            <LineChart chartData={USDCValueLineGraph} 
              options={{            
                maintainAspectRatio: false,
                scales: {y: {beginAtZero: true}},
                plugins:{
                  title: {display: true, text: 'USDC locked in contracts'},
                  legend: {position: 'bottom'},
                }
              }}
            />
          </div>
        </div>

        <div className="ContainerDashboard">  
          <div>
            Total amount transacted:   (Format this part in a nice way)
            <br></br>
            ETH: {cumulativeETHTotal?.toFixed(3)} 
            <br></br>
            USDC: {cumulativeUSDCTotal?.toFixed(3)}
          </div>
        </div>

      </div>
    </Fragment>
  );
}
