import { NS } from "@ns";
import { ServerFreeRam } from "types/common";
import { getFreeRam } from "lib/ram";

/**
 * The general purpose depth-first search algorithm to traverse the network.
 * @remarks RAM cost: 0.2 GB
 * @param ns {NS}
 * @param parent The parent server you want to traverse from.
 * @param discovered A set which will be modified to contain all the servers that were discovered.
 * @param condition A callback function which determines whether a server is viable to be traversed to.
 */
export function dfs(
  ns: NS,
  parent: string,
  discovered: Set<string>,
  condition: (server: string) => boolean = () => true
): void {
  discovered.add(parent);

  const adjacent = ns.scan(parent);

  adjacent.forEach((server) => {
    if (!discovered.has(server) && condition(server)) {
      dfs(ns, server, discovered, condition);
    }
  });
}

/**
 * @param ns {NS}
 * @param ramNeeded - The amount of RAM needed to run the scripts.
 * @param parent - The parent server you want to traverse from.
 *
 * Throws an error if there is not enough RAM on the network to run the script.
 *
 * @returns List of server hostnames and their free RAM. And total ram of the list.
 */
export function dfsFreeRam(
  ns: NS,
  ramNeeded: number,
  parent?: string
): [ServerFreeRam[], number] {
  let needed = ramNeeded;
  const discovered = new Set<string>();

  const condition = (server: string) => {
    const freeRam = getFreeRam(ns, server);

    if (freeRam > 0) {
      return true;
    }

    return false;
  };

  dfs(ns, parent ?? ns.getHostname(), discovered, condition);

  const result: ServerFreeRam[] = [];

  for (const server of discovered) {
    if (needed <= 0) break;

    const freeRam = getFreeRam(ns, server);
    result.push({ host: server, free: freeRam });
    needed -= freeRam;
  }

  return [result, ramNeeded - needed];
}

/**
 * Get all servers that are connected to the current server.
 */
export function getAllServersInNetwork(ns: NS): {
  allServers: string[];
  ramAvailable: number;
} {
  const servers = new Set<string>();

  dfs(ns, ns.getHostname(), servers);

  const totalRamAvailable = Array.from(servers).reduce(
    (acc, server) => acc + ns.getServerMaxRam(server),
    0
  );

  return { allServers: Array.from(servers), ramAvailable: totalRamAvailable };
}
