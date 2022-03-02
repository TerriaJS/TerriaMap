// Avoid installing on CI
const isCi = process.env.CI !== undefined;
if (!isCi) {
  require("husky").install();
}
