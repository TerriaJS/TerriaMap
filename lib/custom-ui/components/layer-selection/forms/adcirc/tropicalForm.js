import { useRef, useContext, useState } from "react";
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
import { useLayers } from "../../../../context";
import { Context } from "../../../../../context/context";
import React from "react";
//

export const TropicalLayerSelectionForm = ({ viewState }) => {
  const formRef = useRef();
  const { layers, setLayerData } = useContext(Context);
  const [advisoryValue, setAdvisory] = useState("");
  const [newOptions, setNewOptions] = useState(false);
  const [newParams, setNewParams] = useState([["met_class", "tropical"]]);
  const [gridValue, setGrid] = useState("");
  const [instanceValue, setInstance] = useState("");
  const [stormNameValue, setStormName] = useState("");
  const { panel, setPanel } = useLayers();

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  const submitHandler = (event) => {
    setPanel("tropical");
    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=tropical&grid_type=${gridValue}&advisory_number=${advisoryValue}&instance_name=${instanceValue}&storm_name=${stormNameValue}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
  };

  const submitReset = () => {
    setNewParams([["met_class", "tropical"]]);
    setStormName("");
  };

  const createParamData = (arr) => {
    const entries = new Map(arr);
    const obj = Object.fromEntries(entries);
    console.log(obj);
    return obj;
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} component="form" ref={formRef}>
        <Get
          url="https://apsviz-ui-data-dev.apps.renci.org/get_pulldown_data"
          params={createParamData(newParams)}
        >
          {(error, response, isLoading, makeRequest, axios) => {
            if (error) {
              return <div>Failed to fetch form option data</div>;
            } else if (isLoading) {
              return <div>Loading...</div>;
            } else if (response !== null) {
              {
                setNewOptions(response.data);
              }
              return (
                <>
                  <StormNameField
                    formOptions={newOptions}
                    setStormName={setStormName}
                    setNewParams={setNewParams}
                    newParams={newParams}
                  />
                  <AdvisoryField
                    formOptions={newOptions}
                    setAdvisory={setAdvisory}
                    setNewParams={setNewParams}
                    newParams={newParams}
                  />
                  <GridField
                    formOptions={newOptions}
                    setGrid={setGrid}
                    setNewParams={setNewParams}
                    newParams={newParams}
                  />
                  <InstanceField
                    formOptions={newOptions}
                    setInstance={setInstance}
                    setNewParams={setNewParams}
                    newParams={newParams}
                  />
                </>
              );
            }
            return <div>Loading form options.</div>;
          }}
        </Get>
        <Button variant="contained" onClick={submitHandler}>
          Search
        </Button>
        <Button variant="contained" onClick={submitReset}>
          Reset
        </Button>
      </Stack>

      <br />
      <Divider />
      <br />
      {layers.catalog && panel === "tropical" && (
        <>
          <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
            {layers.catalog.map((layer, i) => (
              <React.Fragment key={i}>
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
              </React.Fragment>
            ))}
          </Stack>
        </>
      )}
    </FormProvider>
  );
};
