import { useRef, useState, useContext } from "react";
import { Button, Divider, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { synopticSchema as schema, defaults } from "./config";
import { CycleField, GridField, InstanceField, DateField } from "./fields";
import { useLayers } from "../../../../context";
import { Match } from "./match";
import React from "react";
import { Context } from "../../../../../context/context";
//

export const SynopticLayerSelectionForm = () => {
  const formRef = useRef();
  // const { layers } = useLayers();
  const [filteredLayers, setFilteredLayers] = useState([]);
  const { layers, setLayerData } = useContext(Context);

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
        layer.stormName === filterObj.stormName ||
        layer.grid === filterObj.grid ||
        layer.instance === filterObj.instance
    );
  };

  const submitHandler = (event) => {
    const data = new FormData(formRef.current);
    let grid = data.get("grid");
    let cycle = data.get("cycle");
    // let date = data.get("date");
    let date = "05/03/2023";
    let instance = data.get("instance");

    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${grid}&cycle=${cycle}&instance_name=${instance}&run_date=${date}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
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
      {layers.catalog && (
        <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
          {layers.catalog.map((layer) => (
            <>
              <p style={{ fontWeight: "bold", fontSize: 20 }}>{layer.id}</p>
              {layer.members.map((member, index) => {
                return (
                  <Match key={`result-${member.name + index}`} {...member} />
                );
              })}
            </>
          ))}
        </Stack>
      )}
    </FormProvider>
  );
};
