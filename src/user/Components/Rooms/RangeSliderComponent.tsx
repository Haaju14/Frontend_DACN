import React, { useState } from "react";

const RangeSliderComponent: React.FC<{
  onChange: (range: [number, number]) => void;
}> = ({ onChange }) => {
  const [minValue, setMinValue] = useState<number>(25000);
  const [maxValue, setMaxValue] = useState<number>(50000);

  const handleMinRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxValue - 1);
    setMinValue(value);
    onChange([value, maxValue]);
  };

  const handleMaxRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minValue + 1);
    setMaxValue(value);
    onChange([minValue, value]);
  };

  const handleMinNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.min(Number(event.target.value), maxValue - 1);
    setMinValue(value);
    onChange([value, maxValue]);
  };

  const handleMaxNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(Number(event.target.value), minValue + 1);
    setMaxValue(value);
    onChange([minValue, value]);
  };

  return (
    <div className="range-slider">
      <div>
        <input
          type="number"
          value={minValue}
          min={0}
          max={120000}
          step={500}
          onChange={handleMinNumberChange}
        />
        -
        <input
          type="number"
          value={maxValue}
          min={0}
          max={120000}
          step={500}
          onChange={handleMaxNumberChange}
        />
      </div>
      <div>
        <input
          type="range"
          value={minValue}
          min={0}
          max={120000}
          step={500}
          onChange={handleMinRangeChange}
        />
        <input
          type="range"
          value={maxValue}
          min={0}
          max={120000}
          step={500}
          onChange={handleMaxRangeChange}
        />
      </div>
    </div>
  );
};

export default RangeSliderComponent;
