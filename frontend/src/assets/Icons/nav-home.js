import * as React from "react";

const SVGComponent = (props) => {
  const color = props.color

  return(
  <svg 
    width={20} 
    height={20} 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <path
      d="M8 0H1C.4 0 0 .4 0 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11H1c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1ZM19 0h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1Z"
      fill={color}
    />
  </svg>
  )
};
export default SVGComponent;