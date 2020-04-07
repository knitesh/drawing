import { ExcalidrawElement } from "../element/types";
import { AppState } from "../types";
import { cleanAppStateForExport } from "../appState";

import { fileOpen } from "browser-nativefs";
import { save } from "save-file";
import { loadFromBlob } from "./blob";

export function serializeAsJSON(
  elements: readonly ExcalidrawElement[],
  appState: AppState,
): string {
  return JSON.stringify(
    {
      type: "excalidraw",
      version: 1,
      source: window.location.origin,
      elements: elements.filter((element) => !element.isDeleted),
      appState: cleanAppStateForExport(appState),
    },
    null,
    2,
  );
}

export async function saveAsJSON(
  elements: readonly ExcalidrawElement[],
  appState: AppState,
) {
  const serialized = serializeAsJSON(elements, appState);

  const name = `${window.localStorage.getItem("name")}.json`;
  await save(new Blob([serialized], { type: "application/json" }), name);
  // await fileSave(
  //   new Blob([serialized], { type: "application/json" }),
  //   {
  //     fileName: name,
  //     description: "Excalidraw file",
  //   },
  //   (window as any).handle,
  // );
}
export async function loadFromJSON() {
  const blob = await fileOpen({
    description: "Excalidraw files",
    extensions: ["json", "excalidraw"],
    mimeTypes: ["application/json"],
  });
  return loadFromBlob(blob);
}
