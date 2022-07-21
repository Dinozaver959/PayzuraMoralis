import CurrencyItem from "./currency-item";

function CurrencyList(props) {
    return (
        <div className="currenciesList">
            {props.CurrenciesData.map((item) => (
                <CurrencyItem
                    key={item.id}
                    id={item.id}
                    icon={item.icon}
                    shortName={item.shortName}
                    name={item.name}
                    availability={item.availability}
                    currencyChangeFn={props.currencyChangeFn}
                    defaultValue={props.defaultValue}
                />
            ))}
        </div>
    );
}

export default CurrencyList;
