import { gql } from "@apollo/client";

export const SEARCH_REPOSITORIES = gql`
  query SearchRepositories($query: String!, $first: Int = 30, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ... on Repository {
          id
          name
          owner {
            login
            avatarUrl
          }
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          url
        }
      }
    }
  }
`;

export const GET_REPOSITORY = gql`
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      owner {
        login
        avatarUrl
      }
      description
      url
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
      watchers {
        totalCount
      }
      issues(states: OPEN) {
        totalCount
      }
      createdAt
      updatedAt
    }
  }
`;
