import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.exec("scripts/hack/", "n00dles", 1, "joesguns");
  await ns.sleep(100000);
}
