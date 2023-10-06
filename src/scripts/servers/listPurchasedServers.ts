import { NS } from "@ns";

/**
 * List details about purchased servers
 * @param ns {NS}
 */
export async function main(ns: NS): Promise<void> {
  const servers = ns
    .getPurchasedServers()
    .map((server) => ns.getServer(server));

  servers.forEach((server) => {
    ns.tprint(`Server: ${server.hostname}`);
    ns.tprint(`RAM: ${server.maxRam} GB`);
    ns.tprint(`----------------------------------------`);
  });

  ns.tprint(`Total servers: ${servers.length}`);
}
