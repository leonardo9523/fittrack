const { defineConfig } = require("cypress");
console.log('CYPRESS ENV FILE TEST:', process.cwd())

module.exports = defineConfig({
  e2e: {}
});
