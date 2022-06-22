import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema, isObjectType } from 'graphql';

const typesToIgnore = [
  '__Directive',
  '__EnumValue',
  '__Field',
  '__InputValue',
  '__Schema',
  '__Type',
];

export const plugin: PluginFunction = (
  schema: GraphQLSchema,
  rawDocuments: Types.DocumentFile[],
  config,
) => {
  // keep types in a map, first letter of the typename is always uppercased by the "typescript" plugin
  const types = new Map<string, string>();
  for (const [typeName, namedType] of Object.entries(schema.getTypeMap())) {
    if (isObjectType(namedType) && !typesToIgnore.includes(typeName)) {
      const name = capitalize(typeName);
      types.set(name, makeTypeguard(name));
    }
  }
  return [...types.values()].join('\n\n');
};

function makeTypeguard(typeName: string) {
  return `export function is${typeName}(v: any): v is ${typeName} {
  return v?.__typename === '${typeName}';
}`;
}

function capitalize(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1);
}