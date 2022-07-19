import CurrencyItem from "./currency-item";
import ETHIcon from "./../images/ETH.webp";
import USDCIcon from "./../images/USDC.webp";

const CurrenciesData = [
    {
        id: 1,
        icon: ETHIcon,
        shortName: "ETH",
        name: "Ethereum",
        availability: "available",
    },
    {
        id: 2,
        icon: USDCIcon,
        shortName: "USDC",
        name: "USD Coin",
        availability: "available",
    },
    {
        id: 3,
        icon: USDCIcon,
        shortName: "APE",
        name: "APEcoin",
        availability: "not available",
    },
    {
        id: 4,
        icon: USDCIcon,
        shortName: "WBTC",
        name: "Wrapped Bitcoin",
        availability: "not available",
    },
    {
        id: 5,
        icon: USDCIcon,
        shortName: "SHIB",
        name: "Shiba Inu coin",
        availability: "not available",
    },
];

function CurrencyList() {
    return (
        <div className="currenciesList">
            {CurrenciesData.map((item) => (
                <CurrencyItem
                    key={item.id}
                    id={item.id}
                    icon={item.icon}
                    shortName={item.shortName}
                    name={item.name}
                    availability={item.availability}
                />
            ))}
        </div>
    );
}

export default CurrencyList;
