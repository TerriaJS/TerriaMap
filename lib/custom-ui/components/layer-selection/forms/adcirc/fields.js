import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DateField as MuiDateField } from "@mui/x-date-pickers";
import React from "react";

export const DateField = ({ formOptions }) => {
  const { control, formState } = useFormContext();

  return (
    <FormControl fullWidth>
      <Controller
        name="date"
        defaultValue={new Date()}
        control={control}
        render={({ field }) => (
          <MuiDateField {...field} inputRef={field.ref} label="Date" />
        )}
      />
      {"date" in formState.errors && (
        <FormHelperText>{formState.errors.date.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const CycleField = ({ formOptions }) => {
  const { control, formState } = useFormContext();

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
          >
            {formOptions.cycles.map((option) => (
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

export const GridField = ({ formOptions }) => {
  const { control, formState } = useFormContext();

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
          >
            {formOptions.grid_types.map((option) => (
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

export const InstanceField = ({ formOptions }) => {
  const { control, formState } = useFormContext();

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
          >
            {formOptions.instance_names.map((option) => (
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

export const StormNameField = ({ formOptions }) => {
  const { control, formState } = useFormContext();

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
            error={!!formState.errors.name}
          >
            {formOptions.storm_names.map((option) => (
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

export const AdvisoryField = ({ formOptions }) => {
  const { control, formState } = useFormContext();

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
          >
            {formOptions.advisory_numbers.map((option) => (
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
