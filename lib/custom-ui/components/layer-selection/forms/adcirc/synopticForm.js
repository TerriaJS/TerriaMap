import { useRef, useState } from "react";
import { Button, Divider, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { synopticSchema as schema, defaults } from "./config";
import {
  AdvisoryField,
  GridField,
  InstanceField,
  StormNameField
} from "./fields";
import { useLayers } from "../../../../context";
import { Match } from "./match";
import React from "react";
//

export const SynopticLayerSelectionForm = () => {
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
        layer.advisory === filterObj.advisory ||
        layer.stormName === filterObj.stormName ||
        layer.grid === filterObj.grid ||
        layer.instance === filterObj.instance
    );
  };

  const submitHandler = () => {
    const data = new FormData(formRef.current);
    setFilteredLayers(filterLayers(data));
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} component="form" ref={formRef}>
        <AdvisoryField />
        <StormNameField />
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
