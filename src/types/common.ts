import { NS } from "/../NetscriptDefinitions";

export type HackPrograms = {
  file: string;
  command: keyof NS;
};

export type ServerFreeRam = { host: string; free: number };
