import React, { Fragment, useState, useEffect } from "react";
import Navigation from "../components/Navigation.js";
import BarChart from '../components/Charts/BarChart.js'
import LineChart from '../components/Charts/LineChart.js'
import PieChart from '../components/Charts/PieChart.js'
import DoughnutChart from '../components/Charts/DoughnutChart.js'
import { UserData } from "../components/Charts/Chart_Data.js";
import ETHIc from "../components/icons/eth.js";
import USDCIc from "../components/icons/usdc.js";

export default function Home(props) {


  // --------------------------------------------------------------------------------------------------------------------
  // Pure Data
  const [data, setData] = useState([]);                       // raw Data from API
  const [dataDays, setDataDays] = useState([]);               // set of days
  const [contractsMade, setContractsMade] = useState([]);     // OfferAcceptedBuyer + OfferAcceptedSeller    for each day
  const [disputesClosed, setDisputesClosed] = useState([]);   // Disputes closed for each day
  const [ETHValueTransacted, setETHValueTransacted] = useState([]);               // ETH Value for each day
  const [USDCValueTransacted, setUSDCValueTransacted] = useState([]);             // USDC Value for each day

  const [cumulativeETHTotal, setCumulativeETHTotal] = useState();
  const [cumulativeUSDCTotal, setCumulativeUSDCTotal] = useState();


  const [ETHValueLocked, setETHValueLocked] = useState([]);               // ETH Value Locked for each day
  const [USDCValueLocked, setUSDCValueLocked] = useState([]);             // USDC Value Locked for each day

  const [totalNumberOfUsers, setTotalNumberOfUsers] = useState();         // TotalNumberOfUsers
  const [totalNumberOfDisputesStarted, setTotalNumberOfDisputesStarted] = useState(); // TotalNumberOfDisputesStarted
  const [totalNumberOfContracts, setTotalNumberOfContracts] = useState(); // TotalNumberOfContract




  // Chart Set Data
  const [ContractsMadeAndDisputedBarChart, setContractsMadeAndDisputedBarChart] = useState({
    labels: "", 
    datasets: [{}]
  });   
  const [ContractsMadeAndDisputedLineChart, setContractsMadeAndDisputedLineChart] = useState({
    labels: "", 
    datasets: [{}]
  });  

  const [ETHValueTransactedLineChart, setETHValueTransactedLineChart] = useState({
    labels: "", 
    datasets: [{}]
  });  
  const [USDCValueTransactedLineChart, setUSDCValueTransactedLineChart] = useState({
    labels: "", 
    datasets: [{}]
  });  
  const [FrequencyOfDisputesDoughnutChart, setFrequencyOfDisputesDoughnutChart] = useState({
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

    const GetTotalNumberOfUsers = async () => {
      const data = await fetch(`./api/api-getTotalNumberOfUsers`)
      .then((res) => res.json())
      .then((json) => setTotalNumberOfUsers(json));
    }

    const GetTotalNumberOfContracts = async () => {
      const data = await fetch(`./api/api-getTotalNumberOfContracts`)
      .then((res) => res.json())
      .then((json) => setTotalNumberOfContracts(json));
    }

    getCollectionsDetails().catch(console.error);
    GetTotalNumberOfUsers().catch(console.error);
    GetTotalNumberOfContracts().catch(console.error);
  },[]);

  useEffect(() => {
    PrepareContractsMade();
    PrepareDisputesClosed();
    PrepareETHvalueTransacted();
    PrepareUSDCvalueTransacted();
    PrepareETHvalueLocked();
    PrepareUSDCvalueLocked();
    PrepareTotalNumberOfDisputes();
    PrepareDays();
  }, [data]);

  useEffect(() => {
    const cumulativeContractsMade = accumulate(contractsMade);
    const cumulativeDisputesClosed = accumulate(disputesClosed);
    const cumulativeETHValueTransacted = accumulate(ETHValueTransacted);
    const cumulativeUSDCValueTransacted = accumulate(USDCValueTransacted);

    setCumulativeETHTotal(cumulativeETHValueTransacted[cumulativeETHValueTransacted.length - 1]);
    setCumulativeUSDCTotal(cumulativeUSDCValueTransacted[cumulativeUSDCValueTransacted.length - 1]);

    setContractsMadeAndDisputedBarChart({
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

    setContractsMadeAndDisputedLineChart({
      labels: dataDays,
      datasets: [{
        label: "New Contracts Made",
        data: contractsMade,
        backgroundColor: ["#99CC33"],
        borderColor: "#99CC33",
        borderWidth: "3",
      },
      {
        label: "Disputes Solved",
        data: disputesClosed,
        backgroundColor: ["#FF6633"],
        borderColor: "#FF6633",
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
 
    setETHValueTransactedLineChart({
      labels: dataDays,
      datasets: [{
        label: "ETH Value Transacted",
        data: ETHValueTransacted,
        backgroundColor: ["#FDD061"],
        borderColor: "#FDD061",
        borderWidth: "3",
      },
      {
        label: "Cumulative ETH Value Transacted",
        data: cumulativeETHValueTransacted,
        backgroundColor: ["#2F499D"],
        borderColor: "#2F499D",
        borderWidth: "3",
      },
      {
        label: "ETH Value Locked",
        data: ETHValueLocked,
        backgroundColor: ["#99CC33"],
        borderColor: "#99CC33",
        borderWidth: "3",
      }]
    });

    setUSDCValueTransactedLineChart({
      labels: dataDays,
      datasets: [{
        label: "USDC Value Transacted",
        data: USDCValueTransacted,
        backgroundColor: ["#FDD061"],
        borderColor: "#FDD061",
        borderWidth: "3",
      },
      {
        label: "Cumulative USDC Value Transacted",
        data: cumulativeUSDCValueTransacted,
        backgroundColor: ["#2F499D"],
        borderColor: "#2F499D",
        borderWidth: "3",
      },
      {
        label: "USDC Value Locked",
        data: USDCValueLocked,
        backgroundColor: ["#99CC33"],
        borderColor: "#99CC33",
        borderWidth: "3",
      }]
    });

    setFrequencyOfDisputesDoughnutChart({
      labels: ["undisputed contracts", "disputes"],
      datasets: [{
        label: "Frequency of Disputes...",
        data: [ totalNumberOfContracts, totalNumberOfDisputesStarted ],
        borderWidth: "1",
        backgroundColor: [
          '#2F499D', //'rgb(54, 162, 235)',
          '#FF6633', //'rgb(255, 99, 132)',
        ],
        hoverOffset: 4,
      }]
    });
  }, [dataDays]);


  // prepare data for Charts
  function PrepareContractsMade() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i].OfferAcceptedSeller + data[i].OfferAcceptedBuyer);
    }

    setContractsMade(array);
  };

  function PrepareDays() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i].block_day);
    }

    setDataDays(array);
  };

  function PrepareDisputesClosed() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i].DisputeClosed);
    }

    setDisputesClosed(array);
  };

  function PrepareTotalNumberOfDisputes(){
    
    var sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].DisputeStarted;
    }

    setTotalNumberOfDisputesStarted(sum);
  }

  function PrepareETHvalueTransacted() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push((data[i].valueSellerAccepted_0x0000000000000000000000000000000000000000 + data[i].valueBuyerAccepted_0x0000000000000000000000000000000000000000) / (10**18));
    }

    
    console.log("PrepareETHvalueTransacted:");
    console.log(array);

    setETHValueTransacted(array);
  };

  function PrepareUSDCvalueTransacted() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push((data[i].valueSellerAccepted_0x2791bca1f2de4661ed88a30c99a7a9449aa84174 + data[i].valueBuyerAccepted_0x2791bca1f2de4661ed88a30c99a7a9449aa84174) / (10**6));
    }

    console.log("PrepareUSDCvalueTransacted:");
    console.log(array);


    setUSDCValueTransacted(array);
  };



  function PrepareETHvalueLocked() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push((
        data[i].valueSellerAccepted_0x0000000000000000000000000000000000000000 
        + data[i].valueBuyerAccepted_0x0000000000000000000000000000000000000000
        - data[i].valueFundsClaimed_0x0000000000000000000000000000000000000000 
        - data[i].valuePaymentReturned_0x0000000000000000000000000000000000000000  
        - data[i].valueDeliveryConfirmed_0x0000000000000000000000000000000000000000 
        - data[i].valueDisputeClosed_0x0000000000000000000000000000000000000000 
      ) / (10**18));
    }

    setETHValueLocked(array);
  };

  function PrepareUSDCvalueLocked() {

    var array = [];
    for (let i = 0; i < data.length; i++) {
      array.push((
        data[i].valueSellerAccepted_0x2791bca1f2de4661ed88a30c99a7a9449aa84174         
        + data[i].valueBuyerAccepted_0x2791bca1f2de4661ed88a30c99a7a9449aa84174  
        - data[i].valueFundsClaimed_0x2791bca1f2de4661ed88a30c99a7a9449aa84174
        - data[i].valuePaymentReturned_0x2791bca1f2de4661ed88a30c99a7a9449aa84174
        - data[i].valueDeliveryConfirmed_0x2791bca1f2de4661ed88a30c99a7a9449aa84174
        - data[i].valueDisputeClosed_0x2791bca1f2de4661ed88a30c99a7a9449aa84174
      ) / (10**6));
    }

    setUSDCValueLocked(array);
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

        <div className="noteText"><strong>Note:</strong>Note: the contracts are still in constant development and with every new contract deployed we would need to redo the graphs on Dune Analytics. Hence these are just examples for now.</div>

        {/* 
          DUNE ANALYTICS ChartS

          <div className="ContainerDashboard">
            <iframe src="https://dune.com/embeds/984240/1705287/3684dc7f-f06b-4579-ba59-d3d498b81c10" height="500" width="500" title="chart 1"></iframe>

            <iframe src="https://dune.com/embeds/1019187/1759672/84fd7fda-e023-41d6-a43a-5d15364d4037" height="500" width="500" title="chart 1"></iframe>

            <iframe src="https://dune.com/embeds/1019187/1759668/ac505790-6db9-45cb-ae6f-a4f4509c5ed2" height="500" width="500" title="chart 1"></iframe>
          </div>
        */}


        {/* MORALIS EVENT SYNC ChartS */}
        <div className="dashboardBlocks">


          <div className="blockMain">
            <div className="blockIcon">
              <ETHIc size="52" color="white" />
            </div>
            <div className="blockValue">
              <h3>{totalNumberOfContracts}</h3>
              <div className="blockItemLabel">Total number of Contracts</div>
            </div>
          </div>

          <div className="blockMain">
            <div className="blockIcon">
              <ETHIc size="52" color="white" />
            </div>
            <div className="blockValue">
              <h3>{totalNumberOfUsers}</h3>
              <div className="blockItemLabel">Total number of Users</div>
            </div>
          </div>

          <div className="blockMain">
            <div className="blockIcon">
              <ETHIc size="52" color="white" />
            </div>
            <div className="blockValue">
              <h3>
                {cumulativeETHTotal?.toFixed(3)} ETH <br />
                {cumulativeUSDCTotal?.toFixed(3)} USDC
              </h3>
              <div className="blockItemLabel">Total amount Transacted</div>
            </div>
          </div>

          <div className="blockMain">
            <div className="blockIcon">
              <ETHIc size="52" color="white" />
            </div>
            <div className="blockValue">
              <h3>
                {(ETHValueLocked[ETHValueLocked.length - 1])?.toFixed(3)} ETH<br />
                {(USDCValueLocked[USDCValueLocked.length - 1])?.toFixed(3)} USDC
              </h3>
              <div className="blockItemLabel">Total amount Locked</div>
            </div>
          </div>


        </div>

        <div className="chartContainer">

          {/*
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">Contracts Made and Disputes solved</div>
              </div>
              <div className="cardBody">
                <BarChart 
                  chartData={ContractsMadeAndDisputedBarChart}
                  options={{
                    maintainAspectRatio: false,
                    scales: {y: {beginAtZero: true}},
                    plugins:{
                      title: {display: false, text: 'Contracts Made and Disputes solved'},
                      legend: {position: 'top', align: 'end',
                        labels: {boxWidth: 10, boxHeight: 10,
                          font: {
                            weight: 100
                          }
                        },
                      },
                    }
                  }}
                  />
              </div>
            </div>
           */}



          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">Frequency of disputes</div>
            </div>
            <div className="cardBody">
              <DoughnutChart chartData={FrequencyOfDisputesDoughnutChart} 
                options = {{            
                  maintainAspectRatio: false,
                  scales: {
                    y: {grid: {display:false, drawBorder: false}, ticks: {display: false}}, 
                    x: {grid: {display:false, drawBorder: false}, ticks: {display: false}}
                  },
                  plugins:{
                    title: {display: false, text: 'Frequency of disputes'},
                    legend: {position: 'top', align: 'end',
                      labels: {boxWidth: 10, boxHeight: 10,
                        font: {
                          weight: 100
                        }
                      },
                    },
                  },
                  cutout: 90,
                }}
              />
            </div>
          </div>

          <div className="card" /* fullWidth */>
            <div className="cardHeader">
              <div className="cardTitle">Contracts Made and Disputes solved</div>
            </div>
            <div className="cardBody">
              <LineChart chartData={ContractsMadeAndDisputedLineChart} 
                options={{            
                  maintainAspectRatio: false,
                  scales: {y: {beginAtZero: true}},
                  plugins:{
                    title: {display: false, text: 'Contracts Made and Disputes solved'},
                    legend: {position: 'top', align: 'end',
                      labels: {boxWidth: 10, boxHeight: 10,
                        font: {
                          weight: 100
                        }
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">ETH locked in contracts</div>
            </div>
            <div className="cardBody">
              <LineChart chartData={ETHValueTransactedLineChart} 
                options={{            
                  maintainAspectRatio: false,
                  scales: {y: {beginAtZero: true}},
                  plugins:{
                    title: {display: false, text: 'ETH locked in contracts'},
                    legend: {position: 'top', align: 'end',
                      labels: {boxWidth: 10, boxHeight: 10,
                        font: {
                          weight: 100
                        }
                      },
                    },
                  }
                }}
              />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">USDC locked in contracts</div>
            </div>
            <div className="cardBody">
              <LineChart chartData={USDCValueTransactedLineChart} 
                options={{            
                  maintainAspectRatio: false,
                  scales: {y: {beginAtZero: true}},
                  plugins:{
                    title: {display: false, text: 'USDC locked in contracts'},
                    legend: {position: 'top', align: 'end',
                      labels: {boxWidth: 10, boxHeight: 10,
                        font: {
                          weight: 100
                        }
                      },
                    },
                  }
                }}
              />
            </div>
          </div>


        </div>

      </div>
    </Fragment>
  );
}
