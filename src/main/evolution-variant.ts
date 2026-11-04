import { isDynamicRecord } from "@openbot/contracts/runtime-values";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { app } from "electron";

let cachedEvolutionBuild: boolean | undefined;

export function isEvolutionBuild(): boolean {
  if (!app.isPackaged) return false;
  if (cachedEvolutionBuild !== undefined) return cachedEvolutionBuild;
  try {
    const metadata: unknown = JSON.parse(readFileSync(join(app.getAppPath(), "package.json"), "utf8"));
    cachedEvolutionBuild = isDynamicRecord(metadata) && metadata.openbotVariant === "evolution";
  } catch {
    cachedEvolutionBuild = false;
  }
  return cachedEvolutionBuild;
}

export function configureEvolutionIdentity(): boolean {
  if (!isEvolutionBuild()) return false;
  app.setPath("userData", join(app.getPath("appData"), "OpenBot Evolution"));
  app.setName("OpenBot Evolution");
  if (process.platform === "win32") app.setAppUserModelId("app.openbot.evolution.desktop");
  return true;
}
