import { useRef, useState } from "react";
import { Button, Divider, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tropicalSchema as schema, defaults } from "./config";
import {
  // DateField,
  CycleField,
  GridField,
  InstanceField
} from "./fields";
import { useLayers } from "../../../../context";
import { Match } from "./match";
import React from "react";
//

export const TropicalLayerSelectionForm = () => {
  const formRef = useRef();
  const { layers } = useLayers();
  const [filteredLayers, setFilteredLayers] = useState([]);

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  const filterLayers = (filter) => {
    const filterObj = Object.fromEntries(filter);

    if (Object.values(filterObj).join("") === "") {
      return layers;
    }

    return layers.filter(
      (layer) =>
        layer.date === filterObj.date ||
        layer.cycle === filterObj.cycle ||
        layer.grid === filterObj.grid ||
        layer.instance === filterObj.instance
    );
  };

  const submitHandler = (event) => {
    const data = new FormData(formRef.current);
    let grid = data.get("grid");
    let advisory = data.get("advisory");
    let name = data.get("name");
    let instance = data.get("instance");

    // for (const pair of data.entries()) {
    //   console.log(`${pair[0]}, ${pair[1]}`);

    // }
    // event.preventDefault();
    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=tropical&grid_type=${grid}&advisory=${advisory}&instance_name=${instance}&storm_name=${name}`
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
    setFilteredLayers(filterLayers(data));
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} component="form" ref={formRef}>
        {/* <DateField /> */}
        <CycleField />
        <GridField />
        <InstanceField />
        <Button variant="contained" onClick={submitHandler}>
          Search
        </Button>
      </Stack>

      <br />
      <Divider />
      <br />

      <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
        {filteredLayers.map((layer) => (
          <Match key={`result-${layer.id}`} {...layer} />
        ))}
      </Stack>
    </FormProvider>
  );
};
