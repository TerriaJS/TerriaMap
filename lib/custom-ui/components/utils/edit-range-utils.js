// takes viewstate terria item object as input
export default function setDefaultParameters(items) {
  const MAXELE_RANGE_MAX = 10;
  const MAXWVEL_RANGE_MAX = 100;
  const SWAN_RANGE_MAX = 30;

  const range_values = {};

  // The following ranges are tightly coupled to the respective styles
  // must be updated if the styles change on GeoServer
  // style names are: maxele_env_style_v2, maxwvel_env_style & swan_env_style

  // (style: maxele_env_style)
  //const maxele_range = [
  // 0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25,
  //3.5, 3.75, 4.0
  //];
  // new one requested by Brian (style: maxele_env_style_v2).
  const maxele_range = [
    0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0, 1.125, 1.25, 1.375,
    1.5, 1.625, 1.75, 1.875, 2.0
  ];

  const maxwvel_range = [
    0.0, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0, 27.0, 30.0, 33.0, 36.0,
    39.0, 42.0, 45.0, 48.0, 51.0, 54.0, 57.0, 60.0
  ];

  const swan_range = [
    0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0,
    14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0
  ];

  // collect all relevent range info
  let range_list = [];
  let default_max = 0;
  let max_range = 0;
  let range_step = 0;
  let marks = [];

  for (let idx in items) {
    let layer_id = items[idx].uniqueId;
    if (layer_id.includes("obs")) {
      continue;
    }
    if (layer_id.includes("maxwvel")) {
      range_list = maxwvel_range;
      max_range = MAXWVEL_RANGE_MAX;
      default_max = maxwvel_range.slice(-1)[0];
      range_step = maxwvel_range[1] - maxwvel_range[0];
      let label3 = default_max + " m/s";
      let label4 = max_range + " m/s";
      marks = [
        { value: 0, label: "0 m/s" },
        { value: 0, label: "0 m/s" },
        { value: default_max, label: label3 },
        { value: max_range, label: label4 }
      ];
    } else if (layer_id.includes("swan")) {
      range_list = swan_range;
      max_range = SWAN_RANGE_MAX;
      default_max = swan_range.slice(-1)[0];
      range_step = swan_range[1] - swan_range[0];
      let label3 = default_max + " m";
      let label4 = max_range + " m";
      marks = [
        { value: 0, label: "0 m" },
        { value: 0, label: "0 m" },
        { value: default_max, label: label3 },
        { value: max_range, label: label4 }
      ];
    } else {
      range_list = maxele_range;
      max_range = MAXELE_RANGE_MAX;
      default_max = maxele_range.slice(-1)[0];
      range_step = maxele_range[1] - maxele_range[0];
      let label3 = default_max + " m";
      let label4 = max_range + " m";
      marks = [
        { value: 0, label: "0 m" },
        { value: 0, label: "0 m" },
        { value: default_max, label: label3 },
        { value: max_range, label: label4 }
      ];
    }

    const build_params = (range) => {
      let param_str = "";
      let range_len = range.length;

      for (let i = 0; i < range_len; i++) {
        param_str +=
          "q" + (i + 1) + ":" + range[i] + ";" + "l" + (i + 1) + ":" + range[i];
        if (i + 1 < range_len) {
          param_str += ";";
        }
      }
      let params = { env: param_str };

      return params;
    };

    const params = build_params(range_list);
    items[idx].setTrait("definition", "parameters", params);
  }
}

// returns currently set max and min values for a given item object
// as an array
export function getCurrentParametersRange(item) {
  const trait = item.getTrait("definition", "parameters");
  const params = trait.env;
  // will look something like this ...
  // "q1:0;l1:0;q2:0.125;l2:0.125;q3:0.25;l3:0.25;q4:0.375;l4:0.375;q5:0.5;l5:0.5;
  //  q6:0.625;l6:0.625;q7:0.75;l7:0.75;q8:0.875;l8:0.875;q9:1;l9:1;q10:1.125;
  //  l10:1.125;q11:1.25;l11:1.25;q12:1.375;l12:1.375;q13:1.5;l13:1.5;q14:1.625;
  //  l14:1.625;q15:1.75;l15:1.75;q16:1.875;l16:1.875;q17:2;l17:2"

  const params_split = params.split(";");
  const min_range = params_split[0].split(":")[1];
  const last_param_idx = params_split.length - 1;
  const max_range = params_split[last_param_idx].split(":")[1];

  return [min_range, max_range];
}
