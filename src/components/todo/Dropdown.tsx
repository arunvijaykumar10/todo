import React, { useState } from "react";
import "./Dropdown.css";

interface Option {
  label: string;
}

interface Props {
  options: Option[];
  defaultValue: string;
}

function Dropdown(props: Props) {
  const { options, defaultValue } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const downOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (label: string) => {
    setSelected(label);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="header" onClick={downOptions}>
        {selected}
      </div>
      {isOpen && (
        <div className="body">
          {options.map((option) => (
            <div className="option" onClick={() => handleClick(option.label)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
