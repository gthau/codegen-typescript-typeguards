# codegen-typescript-typeguards

This is a plugin for [GraphQL Code Generator](https://www.graphql-code-generator.com/).
It generates Typescript [typeguards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) for all GraphQL types in the schema to simplify type-checking client-side.

It respects the `typesPrefix`, `typesSuffix` and `namingConvention` configuration options of the [Typescript plugin](https://www.graphql-code-generator.com/plugins/typescript).

## Usage example

Add this plugin to your config:

```yml
schema: ./src/schema/*.graphql
generates:
  generated.ts:
    plugins:
      - typescript
      - codegen-typescript-typeguards
```