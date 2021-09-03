// src/global.d.ts
declare module "*.gql" {
  import { DocumentNode } from "graphql";

  const value: DocumentNode;
  export = value;
}
