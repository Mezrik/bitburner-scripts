import { NS } from "@ns";
import {
  growScript,
  hackScript,
  weakenScript,
} from "/constants/hackScriptPaths";
import {
  analyzeServerHackGainRate,
  growThreads,
  hackThreads,
  weakenThreads,
} from "/lib/analyzeHacking";
import { checkTargetArg } from "/lib/commandChecks";
import { distributeExecScript } from "/lib/script";

export async function main(ns: NS): Promise<void> {
  const flags = ns.flags([["log-term", false]]);

  const target = ns.args[0];

  if (!checkTargetArg(ns, target)) return;

  if (typeof flags["log-term"] !== "boolean") {
    ns.tprint("Invalid log flag provided.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} --log-term`);

    return;
  }

  const weakenRamCost = ns.getScriptRam(weakenScript);
  const growRamCost = ns.getScriptRam(growScript);
  const hackRamCost = ns.getScriptRam(hackScript);

  // eslint-disable-next-line no-constant-condition
  while (analyzeServerHackGainRate(ns, target) > 0) {
    const weakenThreadsNeeded = weakenThreads(ns, target);
    const growThreadsNeeded = growThreads(ns, target);
    const hackThreadsNeeded = hackThreads(ns, target);

    if (flags["log-term"])
      ns.tprint(
        `Threads needed - Weaken: ${weakenThreadsNeeded}, Grow: ${growThreadsNeeded}, Hack: ${hackThreadsNeeded}`
      );

    try {
      if (weakenThreadsNeeded) {
        await distributeExecScript(
          ns,
          target,
          weakenScript,
          weakenRamCost,
          weakenThreadsNeeded,
          ns.getWeakenTime(target),
          flags["log-term"]
        );
      } else if (growThreadsNeeded) {
        await distributeExecScript(
          ns,
          target,
          growScript,
          growRamCost,
          growThreadsNeeded,
          ns.getGrowTime(target),
          flags["log-term"]
        );
      } else {
        await distributeExecScript(
          ns,
          target,
          hackScript,
          hackRamCost,
          hackThreadsNeeded,
          ns.getHackTime(target),
          flags["log-term"]
        );
      }
    } catch (e) {
      if (e instanceof Error) ns.tprint(e.message);

      return;
    }
  }
}
