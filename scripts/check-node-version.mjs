const requiredMajor = 22;
const version = process.versions.node;
const major = Number.parseInt(version.split(".")[0], 10);

if (Number.isNaN(major) || major < requiredMajor) {
  console.error(`Node too old: v${version}. ThinkIO requires Node >=${requiredMajor}.`);
  process.exit(1);
}

console.log(`Node OK: v${version}`);
