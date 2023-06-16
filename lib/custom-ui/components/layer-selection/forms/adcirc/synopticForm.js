import React, { useRef, useState, useContext } from "react";
import { Get } from "react-axios";
import { Button, Divider, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { synopticSchema as schema, defaults } from "./config";
import { CycleField, GridField, InstanceField, DateField } from "./fields";
import { useLayers } from "../../../../context";
import { Match } from "./match";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

export const SynopticLayerSelectionForm = () => {
  const {
    panel,
    setPanel,
    catalogFromApi,
    setCatalogFromApi,
    contextViewState
  } = useLayers();
  const [dateValue, setDate] = useState("");
  const [gridValue, setGrid] = useState("");
  const [instanceValue, setInstance] = useState("");
  const [cycleValue, setCycle] = useState("");
  const [newOptions, setNewOptions] = useState(false);
  const [newParams, setNewParams] = useState([["met_class", "synoptic"]]);
  const [resetValue, setResetValue] = useState(false);
  const [matches, setMatches] = useState(false);

  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults }
  });

  const submitHandler = (event) => {
    setMatches(!matches);
    setPanel("synoptic");
    let date;
    if (dateValue !== "") {
      date = new Date(dateValue).toISOString().split("T")[0];
    }

    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${gridValue}&cycle=${cycleValue}&instance_name=${instanceValue}&run_date=${dateValue}`
    )
      .then((response) => response.json())
      .then((data) => {
        contextViewState.terria.catalog.userAddedDataGroup.addMembersFromJson(
          CommonStrata.definition,
          data.catalog
        );
        setCatalogFromApi(data);
      });
  };

  const submitReset = () => {
    setMatches(!matches);
    setResetValue(true);
    setNewParams([["met_class", "synoptic"]]);
  };

  const createParamData = (arr) => {
    const entries = new Map(arr);
    const obj = Object.fromEntries(entries);
    return obj;
  };

  return (
    <FormProvider {...methods}>
      <Stack
        spacing={2}
        component="form"
        // ref={formRef}
        // sx={{ display: "inline-block" }}
      >
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
                  <DateField
                    formOptions={newOptions}
                    setDate={setDate}
                    setNewParams={setNewParams}
                    newParams={newParams}
                  />
                  <CycleField
                    formOptions={newOptions}
                    setCycle={setCycle}
                    setNewParams={setNewParams}
                    newParams={newParams}
                    resetValue={resetValue}
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
      {matches && catalogFromApi.catalog && panel === "synoptic" && (
        <Stack
          sx={{ maxHeight: "400px", overflow: "auto", display: "inline-block" }}
        >
          {catalogFromApi.catalog.map((layer, i) => (
            <React.Fragment key={i}>
              <p style={{ fontWeight: "bold", fontSize: 20 }}>
                {"Synoptic: " + layer.id}
              </p>
              {layer.members.map((member, index) => {
                return (
                  <Match
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
