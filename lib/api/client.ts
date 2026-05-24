import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.GITHUB_GRAPHQL_ENDPOINT,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      fetchOptions: {
        cache: "no-store",
      },
    }),
  });
}

let clientInstance: ApolloClient | null = null;

export function getClient() {
  if (!clientInstance) {
    clientInstance = makeClient();
  }
  return clientInstance;
}
