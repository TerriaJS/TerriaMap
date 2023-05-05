import { useRef, useContext } from "react";
import { Get } from "react-axios";
import { Button, Divider, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tropicalSchema as schema, defaults } from "./config";
import {
  AdvisoryField,
  StormNameField,
  GridField,
  InstanceField
} from "./fields";
import { Match } from "./match";
import { Context } from "../../../../../context/context";
import React from "react";
//

export const TropicalLayerSelectionForm = ({ viewState }) => {
  const formRef = useRef();
  const { layers, setLayerData } = useContext(Context);

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  const submitHandler = (event) => {
    const data = new FormData(formRef.current);
    let grid = data.get("grid");
    let advisory = data.get("advisory");
    let name = data.get("stormName");
    let instance = data.get("instance");

    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=tropical&grid_type=${grid}&advisory=${advisory}&instance_name=${instance}&storm_name=${name}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} component="form" ref={formRef}>
        <Get
          url="https://apsviz-ui-data-dev.apps.renci.org/get_pulldown_data"
          params={{ met_class: "tropical" }}
        >
          {(error, response, isLoading, makeRequest, axios) => {
            if (error) {
              return <div>Failed to fetch form option data</div>;
            } else if (isLoading) {
              return <div>Loading...</div>;
            } else if (response !== null) {
              return (
                <>
                  <AdvisoryField formOptions={response.data} />
                  <StormNameField formOptions={response.data} />
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
        <>
          <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
            {layers.catalog.map((layer) => (
              <>
                <p style={{ fontWeight: "bold", fontSize: 18 }}>
                  {"Tropical: " + layer.id}
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
              </>
            ))}
          </Stack>
        </>
      )}
    </FormProvider>
  );
};
