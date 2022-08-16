import { Slider } from "@mui/material";

function RangeSlider(props) {
  const { value, changePrice } = props;

  return (
    <div className="priceSliderRoot">
      <Slider
        value={value}
        onChange={changePrice}
        valueLabelDisplay="on"
        min={0.001}
        max={5}
        classes={{
          thumb: "priceSliderThumb",
          rail: "priceSliderRail",
          track: "priceSliderTrack",
        }}
      />
    </div>
  );
}

export default RangeSlider;
