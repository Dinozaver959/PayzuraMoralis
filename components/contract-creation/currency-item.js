import Image from "next/image";

function CurrencyItem(props) {
    return (
        <div className="currencyItem">
            <div className="currencyIcon">
                <i className="currencyIc">
                    <Image
                        src={props.icon}
                        width={30}
                        height={30}
                        alt={props.icon}
                    />
                </i>
            </div>
            <div className="currencyDetails">
                <h2>{props.shortName}</h2>
                <h5>{props.name}</h5>
            </div>
            <div className="available">0</div>
        </div>
    );
}

export default CurrencyItem;
