import { useRef, useState, useContext } from "react";
import { Get } from "react-axios";
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

export const SynopticLayerSelectionForm = ({ viewState }) => {
  const formRef = useRef();
  // const { layers } = useLayers();
  const [dateValue, setDate] = useState("");
  const { layers, setLayerData } = useContext(Context);

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  const submitHandler = (event) => {
    const data = new FormData(formRef.current);
    let grid = data.get("grid");
    let cycle = data.get("cycle");
    let instance = data.get("instance");
    let date;

    if (dateValue !== "") {
      date = new Date(dateValue).toISOString().split("T")[0];
    }

    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${grid}&cycle=${cycle}&instance_name=${instance}&run_date=${dateValue}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} component="form" ref={formRef}>
        <Get
          url="https://apsviz-ui-data-dev.apps.renci.org/get_pulldown_data"
          params={{ met_class: "synoptic" }}
        >
          {(error, response, isLoading, makeRequest, axios) => {
            if (error) {
              return <div>Failed to fetch form option data</div>;
            } else if (isLoading) {
              return <div>Loading...</div>;
            } else if (response !== null) {
              return (
                <>
                  <DateField setDate={setDate} />
                  <CycleField formOptions={response.data} />
                  <GridField formOptions={response.data} />
                  <InstanceField formOptions={response.data} />
                </>
              );
            }
            return <div>Loading form options.</div>;
          }}
        </Get>
        <Button variant="contained" onClick={submitHandler}>
          Search
        </Button>
      </Stack>

      <br />
      <Divider />
      <br />
      {layers.catalog && (
        <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
          {layers.catalog.map((layer, i) => (
            <React.Fragment key={i}>
              <p style={{ fontWeight: "bold", fontSize: 20 }}>
                {"Synoptic: " + layer.id}
              </p>
              {layer.members.map((member, index) => {
                return (
                  <Match
                    viewState={viewState}
                    layerMember={member}
                    key={`result-${member.name + index}`}
                    {...member}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </Stack>
      )}
    </FormProvider>
  );
};
