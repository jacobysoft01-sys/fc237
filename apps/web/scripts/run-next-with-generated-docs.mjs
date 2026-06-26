import { spawn } from "node:child_process";

const mode = process.argv[2];
const isWindows = process.platform === "win32";
const pnpm = isWindows ? "pnpm.cmd" : "pnpm";

if (mode !== "build" && mode !== "dev") {
  console.error("Usage: node ./scripts/run-next-with-generated-docs.mjs <build|dev>");
  process.exit(1);
}

function run(args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(pnpm, args, {
      stdio: "inherit",
      env,
      shell: isWindows,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${args.join(" ")} exited with code ${code ?? 1}`));
    });
  });
}

const nextArgs = mode === "build"
  ? ["exec", "next", "build", "--webpack"]
  : ["exec", "next", "dev", "--webpack", "--port", "3001"];

const nextEnv = isWindows
  ? { ...process.env, _FUMADOCS_MDX: "1" }
  : process.env;

try {
  await run(["exec", "fumadocs-mdx"]);
  await run(nextArgs, nextEnv);
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
