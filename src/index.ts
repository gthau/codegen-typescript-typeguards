import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { convertFactory } from '@graphql-codegen/visitor-plugin-common';
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
  const { typesPrefix = '', typesSuffix = '', namingConvention } = config;
  const typeNameConverter = convertFactory({ namingConvention });

  // keep types in a map, because of namingConvention, there might be duplicated typescript types
  const types = new Map<string, string>();
  for (const [typeName, namedType] of Object.entries(schema.getTypeMap())) {
    if (isObjectType(namedType) && !typesToIgnore.includes(typeName)) {
      const nameAccordingToConvention = typeNameConverter(typeName);
      const tsTypeName = addPrefixSuffix(nameAccordingToConvention, { typesPrefix, typesSuffix });
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

function addPrefixSuffix(val: string, { typesPrefix, typesSuffix }: Config): string {
  return `${typesPrefix}${val}${typesSuffix}`;
}
