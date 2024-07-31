import { EmitModes, Modes, type ConfigFileOptions } from "@odata2ts/odata2ts";

const config = {
  services: {
    odata: {
      source: "resources/model.xml",
      output: "webapp/model/types",
      prettier: true,
      mode: Modes["models"],
      emitMode: EmitModes["ts"],
    },
  },
} satisfies ConfigFileOptions;

export default config;
