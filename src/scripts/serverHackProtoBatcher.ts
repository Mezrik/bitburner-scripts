import { NS } from "@ns";
import { growThreads, hackThreads, weakenThreads } from "/lib/analyzeHacking";
import { checkTargetArg } from "/lib/commandChecks";
import { distributeExecScript } from "/lib/script";

const weakenScript = "scripts/hack/weaken.js";
const growScript = "scripts/hack/grow.js";
const hackScript = "scripts/hack/hack.js";

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0];

  if (!checkTargetArg(ns, target)) return;

  const weakenRamCost = ns.getScriptRam(weakenScript);
  const growRamCost = ns.getScriptRam(growScript);
  const hackRamCost = ns.getScriptRam(hackScript);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const weakenThreadsNeeded = weakenThreads(ns, target);
    const growThreadsNeeded = growThreads(ns, target);
    const hackThreadsNeeded = hackThreads(ns, target);

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
          weakenThreadsNeeded
        );
      } else if (growThreadsNeeded) {
        await distributeExecScript(
          ns,
          target,
          growScript,
          growRamCost,
          growThreadsNeeded
        );
      } else {
        await distributeExecScript(
          ns,
          target,
          hackScript,
          hackRamCost,
          hackThreadsNeeded
        );
      }
    } catch (e) {
      if (e instanceof Error) ns.tprint(e.message);

      return;
    }
  }
}
