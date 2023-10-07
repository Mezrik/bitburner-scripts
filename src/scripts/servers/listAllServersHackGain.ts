import { NS } from "@ns";
import { getAnalyzedServers } from "/lib/analyzeHacking";

/**
 * List relative momentary money gain rate for servers per second
 * @param ns {NS}
 */
export async function main(ns: NS): Promise<void> {
  const servers = getAnalyzedServers(ns);

  servers.forEach((server) => {
    ns.tprint(`Server: ${server.hostname}`);
    ns.tprint(`Gain rate: ${server.gainRate}/sec`);
    ns.tprint(`----------------------------------------`);
  });
}
