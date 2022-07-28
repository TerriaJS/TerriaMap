import data from "../wwwroot/init/apsviz.json";

const extractors = {
  /*
   *   getEventTypes: returns distinct list of event types from the apsviz.json catalog.
   *   This list is used to populate the Forecast Type dropdown menu on the UI
   */
  getEventTypes: () => {
    const eventTypes = [];

    data.catalog.map(catalogItem => {
      catalogItem.members.map(catalogMember => {
        if (catalogMember.info) {
          const event = catalogMember.info.filter(
            ({ name }) => name === "Event Type"
          );

          if (event.length) {
            eventTypes.push(event[0].content);
          }
        }
      });
    });

    return {
      eventTypes: [...new Set(eventTypes)]
    };
  },
  /*
   *   getGridTypes: returns distinct list of grid types from the apsviz.json catalog
   *   This list is used to populate the ADCIRC Grid dropdown menu on the UI
   */
  getGridTypes: () => {
    const gridTypes = [];

    data.catalog.map(catalogItem => {
      catalogItem.members.map(catalogMember => {
        if (catalogMember.info) {
          const grid = catalogMember.info.filter(
            ({ name }) => name === "Grid Type"
          );

          if (grid.length) {
            gridTypes.push(grid[0].content);
          }
        }
      });
    });

    return {
      gridTypes: [...new Set(gridTypes)]
    };
  },
  /*
   *   getInstanceNames: returns distinct list of instance names from the apsviz.json catalog
   *   This list is used to populate the Instance Name dropdown menu on the UI
   */
  getInstanceNames: () => {
    const instanceNames = [];

    data.catalog.map(catalogItem => {
      catalogItem.members.map(catalogMember => {
        if (catalogMember.info) {
          const instance = catalogMember.info.filter(
            ({ name }) => name === "Instance Name"
          );

          if (instance.length) {
            instanceNames.push(instance[0].content);
          }
        }
      });
    });

    return {
      instanceNames: [...new Set(instanceNames)]
    };
  }
};

export const getDistinctEventTypes = () => {
  return extractors.getEventTypes();
};

export const getDistinctGridTypes = () => {
  return extractors.getGridTypes();
};

export const getDistinctInstanceNames = () => {
  return extractors.getInstanceNames();
};
export default {
  getDistinctEventTypes,
  getDistinctGridTypes,
  getDistinctInstanceNames
};
