import Image from "next/image";
import { Fragment } from "react";

function CurrencyItem(props) {
    return props.availability === true ? (
        <Fragment>
            <input
                type="radio"
                name="currencyItemList"
                value={props.shortName}
                id={props.shortName}
                onChange={props.currencyChangeFn}
                checked={props.defaultValue === props.shortName}
            />
            <label htmlFor={props.shortName} className="currencyItem">
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
            </label>
        </Fragment>
    ) : (
        <Fragment>
            <input
                type="radio"
                name="currencyItemList"
                value={props.shortName}
                id={props.shortName}
                onChange={props.currencyChangeFn}
                disabled="disabled"
            />
            <label htmlFor={props.shortName} className="currencyItem">
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
            </label>
        </Fragment>
    );
}

export default CurrencyItem;
