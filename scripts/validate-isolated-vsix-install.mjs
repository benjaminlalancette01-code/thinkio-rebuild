import { access, readFile } from "node:fs/promises";

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const vsixPath = `local-vsix/${pkg.name}-${pkg.version}.vsix`;
const extensionId = `${pkg.publisher}.${pkg.name}`;
const execute = process.argv.includes("--execute");
const blockers = [];

try {
  await access(vsixPath);
} catch {
  blockers.push(`VSIX package is missing: ${vsixPath}. Run npm run package:extension first.`);
}

if (!pkg.private) blockers.push("Isolated install validation expects private local package metadata.");
if (!pkg.engines?.vscode) blockers.push("VSIX install validation requires engines.vscode.");

const plan = [
  `code --uninstall-extension ${extensionId}`,
  `code --install-extension ${vsixPath} --force`,
  `code --uninstall-extension ${extensionId}`,
  `code --install-extension ${vsixPath} --force`
];

if (execute) {
  blockers.push("Execution mode is intentionally disabled until a real isolated VS Code sandbox path is approved.");
}

if (blockers.length > 0) {
  console.error(blockers.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, mode: "dry-run", extensionId, vsixPath, installUninstallReinstallPlan: plan }, null, 2));
