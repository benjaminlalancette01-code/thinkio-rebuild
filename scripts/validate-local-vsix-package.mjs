import { access, readFile } from "node:fs/promises";

const allowlist = JSON.parse(await readFile("scripts/vsix-file-allowlist.json", "utf8"));
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const blockers = [];

if (!Array.isArray(allowlist.files) || allowlist.files.length === 0) {
  blockers.push("VSIX file allowlist must contain files.");
}

for (const file of allowlist.files ?? []) {
  try {
    await access(file);
  } catch {
    blockers.push(`VSIX allowlist file is missing: ${file}.`);
  }
}

for (const required of ["package.json", pkg.main?.replace(/^\.\//, ""), "media/thinkio.svg"]) {
  if (!allowlist.files.includes(required)) {
    blockers.push(`VSIX allowlist must include ${required}.`);
  }
}

if (pkg.private !== true) {
  blockers.push("Local VSIX packaging expects package.json private=true until marketplace policy is promoted.");
}

if (pkg.extensionDependencies?.length) {
  blockers.push("Local VSIX packaging must not depend on external VS Code view plugins.");
}

if (blockers.length > 0) {
  console.error(blockers.join("\n"));
  process.exit(1);
}

console.log("Local VSIX package allowlist validation passed.");
