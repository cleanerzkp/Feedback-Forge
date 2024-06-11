"use client";

import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(event.target.value, 10));
  };

  return (
    <div className="star-rating-slider flex flex-col items-center mb-4">
      <div className="flex mb-2">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`h-8 w-8 cursor-pointer ${index < value ? "text-primary" : "text-gray-300"}`}
            onClick={() => onChange(index + 1)}
          />
        ))}
      </div>
      <input
        type="range"
        min="0"
        max="5"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
};

export default Slider;
