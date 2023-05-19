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
  const { panel, setPanel } = useLayers();
  const [dateValue, setDate] = useState("");
  const [gridValue, setGrid] = useState("");
  const [instanceValue, setInstance] = useState("");
  const [cycleValue, setCycle] = useState("");
  const { setLayerData, layers } = useContext(Context);

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  const submitHandler = (event) => {
    setPanel("synoptic");
    let date;
    if (dateValue !== "") {
      date = new Date(dateValue).toISOString().split("T")[0];
    }

    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${gridValue}&cycle=${cycleValue}&instance_name=${instanceValue}&run_date=${dateValue}`
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
                  {/* <DateField formOptions={response.data} setDate={setDate} />
                  <CycleField formOptions={response.data} setCycle={setCycle} />
                  <GridField formOptions={response.data} setGrid={setGrid} />
                  <InstanceField
                    formOptions={response.data}
                    setInstance={setInstance}
                  /> */}
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
      {layers.catalog && panel === "synoptic" && (
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
