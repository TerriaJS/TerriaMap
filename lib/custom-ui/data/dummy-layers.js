import { faker } from "@faker-js/faker";
import {
  randomColor,
  randomCycle,
  randomGrid,
  randomData,
  randomAdvisory,
  randomInstance,
  randomStormName
} from "./util";

const randomDate = () => {
  const theDate = faker.date.past();
  const mm =
    theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth();
  const dd =
    theDate.getDate() < 9 ? `0${theDate.getDate()}` : theDate.getDate();
  const yyyy =
    theDate.getFullYear() < 9
      ? `0${theDate.getFullYear()}`
      : theDate.getFullYear();
  const dateString = `${mm}/${dd}/${yyyy}`;
  return dateString;
};

const layerGenerator = (n) => {
  return [...Array(n).keys()].map(() => ({
    id: faker.datatype.uuid(),
    name: faker.lorem.sentence(2),
    opacity: 1.0,
    color: randomColor(),
    date: randomDate(),
    cycle: randomCycle(),
    grid: randomGrid(),
    advisory: randomAdvisory(),
    stormName: randomStormName(),
    instance: randomInstance(),
    data: randomData(20, 24)
  }));
};

export const dummyLayers = layerGenerator(100);
