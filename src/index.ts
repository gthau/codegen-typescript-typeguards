import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLObjectType, GraphQLSchema, isObjectType } from 'graphql';

export const plugin: PluginFunction = (
  schema: GraphQLSchema,
  rawDocuments: Types.DocumentFile[],
  config,
) => {
  const types = [];
  for (const [typeName, namedType] of Object.entries(schema.getTypeMap())) {
    if (isObjectType(namedType)) {
      types.push(makeTypeguard(typeName));
    }
  }
  return types.join('\n\n');
};

function makeTypeguard(typeName: string) {
  const name = capitalize(typeName);
  return `export function is${name}(v: any): v is ${name} {
  return v?.__typename === '${name}';
}`;
}

function capitalize(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1);
}