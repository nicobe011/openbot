import { existsSync } from "node:fs";
import { join } from "node:path";
import { app } from "electron";

export const EVOLUTION_BUILD_MARKER = "evolution-build.json";

export function isEvolutionBuild(): boolean {
  return app.isPackaged && existsSync(join(process.resourcesPath, EVOLUTION_BUILD_MARKER));
}

export function configureEvolutionIdentity(): boolean {
  if (!isEvolutionBuild()) return false;
  app.setPath("userData", join(app.getPath("appData"), "OpenBot Evolution"));
  app.setName("OpenBot Evolution");
  if (process.platform === "win32") app.setAppUserModelId("app.openbot.evolution.desktop");
  return true;
}
