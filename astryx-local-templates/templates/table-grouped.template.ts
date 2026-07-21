import {createBlockTemplate} from "@astryxdesign/cli/template";

export default createBlockTemplate({
  name: "Table Grouped",
  description:
    "A grouped data table with collapsible section headers and count summaries.",
  category: "data-display",
  componentsUsed: ["Table", "Card", "Heading", "Text"]
});
