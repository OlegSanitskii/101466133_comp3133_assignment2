const { initApp } = require("../src/app");

module.exports = async (req, res) => {
  const app = await initApp();
  return app(req, res);
};