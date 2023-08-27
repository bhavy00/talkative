import { Button } from "@mui/material";
import React from "react";

export default function Main() {
  const [bait, setBait] = React.useState(0);

  return (
    <>
      <h1>{bait}</h1>
      <Button
        onClick={()=>{setBait((prev) => {
          prev+=1;
          console.log(bait);
        })}}
      >
        vds
      </Button>
      dsvcdsc sdf
    </>
  );
}
