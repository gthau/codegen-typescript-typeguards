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

type Config = {
  typesPrefix: string;
  typesSuffix: string;
}

export const plugin: PluginFunction = (
  schema: GraphQLSchema,
  rawDocuments: Types.DocumentFile[],
  config,
) => {
  const { typesPrefix = '', typesSuffix = '' } = config;
  // keep types in a map, first letter of the typename is always uppercased by the "typescript" plugin
  const types = new Map<string, string>();
  for (const [typeName, namedType] of Object.entries(schema.getTypeMap())) {
    if (isObjectType(namedType) && !typesToIgnore.includes(typeName)) {
      const tsTypeName = computeTypeName(typeName, { typesPrefix, typesSuffix });
      types.set(tsTypeName, makeTypeguard(typeName, tsTypeName));
    }
  }
  return [...types.values()].join('\n\n');
};

function makeTypeguard(gqlTypeName: string, tsTypeName: string) {
  return `export function is${tsTypeName}(v: any): v is ${tsTypeName} {
  return v?.__typename === '${gqlTypeName}';
}`;
}

function computeTypeName(val: string, { typesPrefix, typesSuffix }: Config): string {
  return `${typesPrefix}${val}${typesSuffix}`;
}