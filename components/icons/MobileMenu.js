function MobileMenuIc(props) {
    if (props.onClick) {
        return (
            <button onClick={props.onClick} className="linkButton" type="button">
                <svg
                    viewBox="0 0 47 29"
                    width={props.size}
                    height={props.size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill={props.color}
                        d="M20.000,29.000 L20.000,26.000 L47.000,26.000 L47.000,29.000 L20.000,29.000 ZM10.000,13.000 L47.000,13.000 L47.000,16.000 L10.000,16.000 L10.000,13.000 ZM0.000,0.000 L47.000,0.000 L47.000,3.000 L0.000,3.000 L0.000,0.000 Z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <svg
            viewBox="0 0 47 29"
            width={props.size}
            height={props.size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={props.color}
                d="M20.000,29.000 L20.000,26.000 L47.000,26.000 L47.000,29.000 L20.000,29.000 ZM10.000,13.000 L47.000,13.000 L47.000,16.000 L10.000,16.000 L10.000,13.000 ZM0.000,0.000 L47.000,0.000 L47.000,3.000 L0.000,3.000 L0.000,0.000 Z"
            />
        </svg>
    );
}

export default MobileMenuIc;
