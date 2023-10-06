import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0];

  if (!target || typeof target !== "string") {
    ns.tprint(`Invalid targer for ${ns.getScriptName()}`);
    return;
  }

  await ns.grow(target);
}
