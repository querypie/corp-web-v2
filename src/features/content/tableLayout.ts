import { Extension } from "@tiptap/core";

// Preserve the opt-in layout when an authored table is edited and saved.
export const ContentTableLayout = Extension.create({
  name: "contentTableLayout",
  addGlobalAttributes() {
    return [{
      types: ["table"],
      attributes: {
        layout: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-content-layout") === "profiles" ? "profiles" : null,
          renderHTML: (attributes) => attributes.layout === "profiles" ? { "data-content-layout": "profiles" } : {},
        },
      },
    }];
  },
});
