import MultiRangeSlider from "../ui/MultiRangeSlider";
import RadioGroup from "../ui/RadioGroup";
import SelectDropdown from "../ui/SelectDropdown";

function FilterBar(props) {
  const {
    walletAddressFn,
    filterSide,
    setFilterSide,
    filterStates,
    setFilterStates,
    filterDelivery,
    setFilterDelivery,
    setFilterMaxPrice,
    setFilterMinPrice,
    filterSideValues,
    dropDownOptions,
    deliveryValues,
  } = props;

  return (
    <div className="filtersMain">
      <h2 className="sidebarHeader">Filters</h2>

      {/* Filter with Price */}
      <div className="filterOption">
        <h4 className="filterTitle">Price</h4>
        <MultiRangeSlider
          min={0}
          max={10}
          onChange={
            ({ min, max }) => {
              setFilterMaxPrice(`${max}`), setFilterMinPrice(`${min}`);
            }
            // console.log(`min = ${min}, max = ${max}`)
          }
        />
      </div>

      {/* Filter with Wallet Address */}
      <div className="filterOption">
        <h4 className="filterTitle">Wallet Address</h4>
        <input
          className="formInput"
          id="filterWalletAddress"
          placeholder="Wallet Address"
          type="text"
          onBlur={walletAddressFn}
        />
      </div>

      {/* Filter with Side */}
      <div className="filterOption">
        <h4 className="filterTitle">Side</h4>
        <RadioGroup
          listItem="radioList"
          selectedRadio={filterSide}
          setSelectedRadio={setFilterSide}
          values={filterSideValues}
        />
      </div>

      {/* Filter with States */}
      <div className="filterOption">
        <h4 className="filterTitle">States</h4>

        <SelectDropdown
          selectedOption={filterStates}
          setSelectedOption={setFilterStates}
          options={dropDownOptions}
        />
      </div>

      {/* Filter with Time to Deliver */}
      <div className="filterOption">
        <h4 className="filterTitle">Time to Deliver</h4>
        <RadioGroup
          selectedRadio={filterDelivery}
          setSelectedRadio={setFilterDelivery}
          values={deliveryValues}
        />
      </div>
    </div>
  );
}

export default FilterBar;
