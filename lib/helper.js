import data from "../wwwroot/init/apsviz.json";

const extractors = {
  getEventTypes: () => {
    const eventTypes = [];

    data.catalog.map(catalogItem => {
      catalogItem.members.map(catalogMember => {
        if (catalogMember.info) {
          const event = catalogMember.info.filter(
            ({ name }) => name === "Event Type"
          );
          eventTypes.push(event[0].content);
        }
      });
    });

    return {
      eventTypes: [...new Set(eventTypes)]
    };
  },
  getGridTypes: () => {
    const gridTypes = [];

    data.catalog.map(catalogItem => {
      catalogItem.members.map(catalogMember => {
        if (catalogMember.info) {
          const grid = catalogMember.info.filter(
            ({ name }) => name === "Grid Type"
          );
          gridTypes.push(grid[0].content);
        }
      });
    });

    return {
      gridTypes: [...new Set(gridTypes)]
    };
  }
};

export const getDistinctEventTypes = () => {
  return extractors.getEventTypes();
};

export const getDistinctGridTypes = () => {
  return extractors.getGridTypes();
};

export default {
  getDistinctEventTypes,
  getDistinctGridTypes
};
