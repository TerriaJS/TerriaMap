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

  const submitHandler = () => {
    const data = new FormData(formRef.current);
    console.log(data);
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
