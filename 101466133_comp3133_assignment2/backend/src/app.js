require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType, Kind } = require("graphql");

const { connectDB } = require("./config/db");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const { authRequired } = require("./middleware/auth");
const { initCloudinary } = require("./config/cloudinary");

const app = express();

let isInitialized = false;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar (ISO string)",
  serialize(value) {
    return new Date(value).toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

async function initApp() {
  if (isInitialized) {
    return app;
  }

  initCloudinary();
  console.log("Cloudinary configured");

  await connectDB(process.env.MONGO_URI);

  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Date: DateScalar,
      ...resolvers,
    },
    context: ({ req }) => {
      let user = null;

      try {
        user = authRequired(req);
      } catch {
        user = null;
      }

      return { req, user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  app.get("/", (req, res) => {
    res.send("Backend is running");
  });

  isInitialized = true;
  return app;
}

module.exports = { app, initApp };