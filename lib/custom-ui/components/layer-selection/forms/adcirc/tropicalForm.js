import React, { useRef, useContext, useState } from "react";
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
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

export const TropicalLayerSelectionForm = ({ viewState }) => {
  const formRef = useRef();
  const [advisoryValue, setAdvisory] = useState("");
  const [newOptions, setNewOptions] = useState(false);
  const [newParams, setNewParams] = useState([["met_class", "tropical"]]);
  const [gridValue, setGrid] = useState("");
  const [instanceValue, setInstance] = useState("");
  const [stormNameValue, setStormName] = useState("");
  const { panel, setPanel, catalogFromApi, setCatalogFromApi } = useLayers();
  const [matches, setMatches] = useState(false);
  const [resetField, setResetField] = useState(false);
  const [resetValue, setResetValue] = useState(false);

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  // the url for the get_ui_data api in defined
  // as a plugin in the wwwroot/config.json file (dataFilterURL)
  // these plugin parameters are automatically pulled into
  // the terria viewState as of terriajs lib version 8.2.21
  // the get_pulldown_data endpoint is also constructed from
  // the dataFilterURL config parameter
  const filter_data_base_url =
    "https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?";
  let url = new URL(filter_data_base_url);
  const puldown_data_url =
    url.protocol + "//" + url.host + "/get_pulldown_data";

  const submitHandler = (event) => {
    setMatches(!matches);
    setPanel("tropical");
    fetch(
      `${filter_data_base_url}met_class=tropical&grid_type=${gridValue}&advisory_number=${advisoryValue}&instance_name=${instanceValue}&storm_name=${stormNameValue}`
    )
      .then((response) => response.json())
      .then((data) => {
        viewState.terria.catalog.userAddedDataGroup.addMembersFromJson(
          CommonStrata.definition,
          data.catalog
        );
        setCatalogFromApi(data);
      });
  };

  const submitReset = () => {
    setAdvisory("");
    setGrid("");
    setInstance("");
    setStormName("");
    setResetField(true);
    setMatches(false);
    setResetValue(true);
    setNewParams([["met_class", "tropical"]]);
  };

  const createParamData = (arr) => {
    const entries = new Map(arr);
    const obj = Object.fromEntries(entries);
    return obj;
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} component="form" ref={formRef}>
        <Get url={puldown_data_url} params={createParamData(newParams)}>
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
                    resetField={resetField}
                    setResetField={setResetField}
                  />
                  <AdvisoryField
                    formOptions={newOptions}
                    setAdvisory={setAdvisory}
                    setNewParams={setNewParams}
                    newParams={newParams}
                    resetField={resetField}
                    setResetField={setResetField}
                  />
                  <GridField
                    formOptions={newOptions}
                    setGrid={setGrid}
                    setNewParams={setNewParams}
                    newParams={newParams}
                    resetField={resetField}
                    setResetField={setResetField}
                  />
                  <InstanceField
                    formOptions={newOptions}
                    setInstance={setInstance}
                    setNewParams={setNewParams}
                    newParams={newParams}
                    resetField={resetField}
                    setResetField={setResetField}
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
      {matches && catalogFromApi.catalog && panel === "tropical" && (
        <>
          <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
            {catalogFromApi.catalog.map((layer, i) => (
              <React.Fragment key={i}>
                <p style={{ fontWeight: "bold", fontSize: 18 }}>
                  {"Tropical: " + layer.id}
                </p>
                {layer.members.map((member, index) => {
                  return (
                    <Match
                      layerMember={member}
                      key={`result-${member.name + index}`}
                      {...member}
                      viewState={viewState}
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
