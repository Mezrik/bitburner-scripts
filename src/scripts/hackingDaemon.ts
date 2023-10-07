import { NS } from "@ns";
import { getAnalyzedServers } from "/lib/analyzeHacking";

export async function main(ns: NS): Promise<void> {
  const servers = getAnalyzedServers(ns).filter(
    (server) => server.gainRate > 99
  );

  servers.forEach((server) =>
    ns.run("scripts/serverHackProtoBatcher.js", 1, server.hostname)
  );
}
