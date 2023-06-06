import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";

export const DateField = ({
  formOptions,
  setDate,
  setNewParams,
  newParams
}) => {
  const { control, formState } = useFormContext();

  const handleNameChange = (paramValue) => {
    let date = new Date(paramValue).toISOString().split("T")[0];
    setDate(date);
    setNewParams([...newParams, ["run_date", date]]);
  };

  return (
    <FormControl fullWidth>
      <Controller
        name="date"
        control={control}
        render={({ field, fieldState }) => (
          <DatePicker
            {...field}
            label="date"
            inputFormat="YYYY/MM/DD"
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
            // Validation is not fired with the default react-hook-form mode. So you need this custom onChange event handling.
            onChange={(date) => {
              field.onChange(date);
              handleNameChange(date);
            }}
          />
        )}
      />
      {"date" in formState.errors && (
        <FormHelperText>{formState.errors.date.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const CycleField = ({
  formOptions,
  setCycle,
  setNewParams,
  newParams,
  resetValue
}) => {
  const { control, formState, reset } = useFormContext();
  const handleNameChange = (paramValue) => {
    reset(paramValue);
    setCycle(paramValue);
    setNewParams([...newParams, ["cycle", paramValue]]);
  };

  if (resetValue) {
    reset("");
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="cycle-select-label">Cycle</InputLabel>
      <Controller
        name="cycle"
        control={control}
        render={({ field }) => (
          <Select
            labelId="cycle-select-label"
            id="cycle-select"
            label="Cycle"
            {...field}
            error={!!formState.errors.name}
            onChange={(data) => {
              field.onChange(data);
              handleNameChange(data.target.value);
            }}
          >
            {formOptions &&
              formOptions.cycles.map((option) => (
                <MenuItem key={`cycle-option-${option}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        )}
      />
      {"cycle" in formState.errors && (
        <FormHelperText>{formState.errors.cycle.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const GridField = ({
  formOptions,
  setGrid,
  setNewParams,
  newParams
}) => {
  const { control, formState } = useFormContext();

  const handleNameChange = (paramValue) => {
    setGrid(paramValue);
    setNewParams([...newParams, ["grid_type", paramValue]]);
    console.log(newParams);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="grid-select-label">Grid</InputLabel>
      <Controller
        name="grid"
        control={control}
        render={({ field }) => (
          <Select
            labelId="grid-select-label"
            id="grid-select"
            label="Grid"
            {...field}
            error={!!formState.errors.name}
            onChange={(data) => {
              field.onChange(data);
              handleNameChange(data.target.value);
            }}
          >
            {formOptions &&
              formOptions.grid_types.map((option) => (
                <MenuItem key={`grid-option-${option}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        )}
      />
      {"grid" in formState.errors && (
        <FormHelperText>{formState.errors.grid.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const InstanceField = ({
  formOptions,
  setInstance,
  setNewParams,
  newParams
}) => {
  const { control, formState } = useFormContext();

  const handleNameChange = (paramValue) => {
    setInstance(paramValue);
    setNewParams([...newParams, ["instance_name", paramValue]]);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="instance-select-label">Instance</InputLabel>
      <Controller
        name="instance"
        control={control}
        render={({ field }) => (
          <Select
            labelId="instance-select-label"
            id="instance-select"
            label="Instance"
            {...field}
            error={!!formState.errors.name}
            onChange={(data) => {
              field.onChange(data);
              handleNameChange(data.target.value);
            }}
          >
            {formOptions &&
              formOptions.instance_names.map((option) => (
                <MenuItem key={`instance-option-${option}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        )}
      />
      {"instance" in formState.errors && (
        <FormHelperText>{formState.errors.instance.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const StormNameField = ({
  formOptions,
  setStormName,
  setNewParams,
  newParams
}) => {
  const { control, formState } = useFormContext();

  const handleNameChange = (paramValue) => {
    setStormName(paramValue);
    setNewParams([...newParams, ["storm_name", paramValue]]);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="stormName-select-label">Storm Name</InputLabel>
      <Controller
        name="stormName"
        control={control}
        render={({ field }) => (
          <Select
            labelId="stormName-select-label"
            id="stormName-select"
            label="Storm Name"
            {...field}
            onChange={(event) => {
              field.onChange(event);
              handleNameChange(event.target.value);
            }}
            error={!!formState.errors.name}
          >
            {formOptions &&
              formOptions.storm_names.map((option) => (
                <MenuItem key={`stormName-option-${option}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        )}
      />
      {"stormName" in formState.errors && (
        <FormHelperText>{formState.errors.stormName.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const AdvisoryField = ({
  formOptions,
  setAdvisory,
  setNewParams,
  newParams
}) => {
  const { control, formState } = useFormContext();

  const handleNameChange = (paramValue) => {
    setAdvisory(paramValue);
    setNewParams([...newParams, ["advisory_number", paramValue]]);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="advisory-select-label">Advisory</InputLabel>
      <Controller
        name="advisory"
        control={control}
        render={({ field }) => (
          <Select
            labelId="advisory-select-label"
            id="advisory-select"
            label="Advisory"
            {...field}
            error={!!formState.errors.name}
            onChange={(data) => {
              field.onChange(data);
              handleNameChange(data.target.value);
            }}
          >
            {formOptions &&
              formOptions.advisory_numbers.map((option) => (
                <MenuItem key={`advisory-option-${option}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        )}
      />
      {"advisory" in formState.errors && (
        <FormHelperText>{formState.errors.advisory.message}</FormHelperText>
      )}
    </FormControl>
  );
};
