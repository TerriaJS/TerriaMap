export const randomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const lightness = Math.floor(Math.random() * 50) + 50;

  // Combine the values into an HSL string
  const hslString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Return the HSL string
  return hslString;
};

export const randomPoints = (n) => {
  const span = Math.floor(Math.random() * 50);
  const min = Math.floor(Math.random() * 50);
  return [...Array(n).keys()].map((i) => ({
    x: i,
    y: Math.floor(Math.random() * span) + min
  }));
};

export const randomData = (n, m) => {
  return [...Array(n).keys()].map((i) => ({
    id: i,
    color: randomColor(),
    data: randomPoints(m)
  }));
};

const randomArrayItem = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export const gridOptions = [
  "ec95d",
  "EGOMv20b",
  "hsofs",
  "NA",
  "nc_inundation_v9.99_w_rivers",
  "ncsc123",
  "NCSC_SAB_v1.23"
];

export const randomGrid = () => randomArrayItem(gridOptions);

export const cycleOptions = ["0", "6", "12", "18"];

export const randomCycle = () => randomArrayItem(cycleOptions);

export const instanceOptions = [
  "062018hiresr",
  "ec95d",
  "ec95d-nam-bob3",
  "ec95d-nam-bob-psc",
  "EGOMv20b_nam_jgf",
  "hsofs-nam-bob-2022-psc",
  "N/A",
  "ncsc123_gfs_sb55.01",
  "ncsc123-nam-sb",
  "ncsc123-nam-sb55.01",
  "ncsc123-nam-sbDNTK",
  "ncsc123-nam-sbDNTKa"
];

export const randomInstance = () => randomArrayItem(instanceOptions);

export const stormNameOptions = [
  "DANIELLE",
  "EARL",
  "FIONA",
  "IAN",
  "NICOLE",
  "SEVEN"
];
export const randomStormName = () => randomArrayItem(stormNameOptions);

export const advisoryOptions = [...Array(36).keys()].map((i) =>
  i.toString().padStart(2, "0")
);

export const randomAdvisory = () => randomArrayItem(advisoryOptions);
