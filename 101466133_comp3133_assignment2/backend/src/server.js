require("dotenv").config();

const { initApp } = require("./app");

const PORT = process.env.PORT || 4000;

initApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });