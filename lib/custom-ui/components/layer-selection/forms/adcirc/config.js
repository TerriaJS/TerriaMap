import * as yup from "yup";
import {
  advisoryOptions,
  cycleOptions,
  gridOptions,
  instanceOptions,
  stormNameOptions
} from "../../../../data/util";

export const options = {
  advisory: advisoryOptions,
  cycle: cycleOptions,
  grid: gridOptions,
  instance: instanceOptions,
  stormName: stormNameOptions
};

export const defaults = {
  advisory: "",
  cycle: "",
  date: "",
  grid: "",
  instance: "",
  stormName: ""
};

export const tropicalSchema = yup.object().shape({
  stormName: yup
    .string()
    .oneOf(options.stormName)
    .required("Please select a storm name."),
  advisory: yup
    .string()
    .oneOf(options.advisory)
    .required("Please select an advisory."),
  grid: yup.string().oneOf(options.grid).required("Please select a grid."),
  instance: yup
    .string()
    .oneOf(options.instance)
    .required("Please select an instance.")
});

export const synopticSchema = yup.object().shape({
  date: yup.date().required("Please select a date."),
  cycle: yup.string().oneOf(options.cycle).email("Please select a cycle"),
  grid: yup.string().oneOf(options.grid).required("Please select a grid."),
  instance: yup
    .string()
    .oneOf(options.instance)
    .required("Please select an instance.")
});
