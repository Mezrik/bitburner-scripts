import { NS } from "@ns";
import { getAllServersInNetwork } from "/lib/graph";

/**
 * List details about purchased servers
 * @param ns {NS}
 */
export async function main(ns: NS): Promise<void> {
  const network = getAllServersInNetwork(ns);

  ns.tprint(`Total available RAM in network: ${network.ramAvailable} GB`);
}
