"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("graphql");
const typesToIgnore = [
    '__Directive',
    '__EnumValue',
    '__Field',
    '__InputValue',
    '__Schema',
    '__Type',
];
const plugin = (schema, rawDocuments, config) => {
    const { typesPrefix = '', typesSuffix = '', namingConvention } = config;
    const typeNameConverter = (0, visitor_plugin_common_1.convertFactory)({ namingConvention });
    // keep types in a map, because of namingConvention, there might be duplicated typescript types
    const types = new Map();
    for (const [typeName, namedType] of Object.entries(schema.getTypeMap())) {
        if ((0, graphql_1.isObjectType)(namedType) && !typesToIgnore.includes(typeName)) {
            const nameAccordingToConvention = typeNameConverter(typeName);
            const tsTypeName = addPrefixSuffix(nameAccordingToConvention, { typesPrefix, typesSuffix });
            types.set(tsTypeName, makeTypeguard(typeName, tsTypeName));
        }
    }
    return [...types.values()].join('\n\n');
};
exports.plugin = plugin;
function makeTypeguard(gqlTypeName, tsTypeName) {
    return `export function is${tsTypeName}(v: any): v is ${tsTypeName} {
  return v?.__typename === '${gqlTypeName}';
}`;
}
function addPrefixSuffix(val, { typesPrefix, typesSuffix }) {
    return `${typesPrefix}${val}${typesSuffix}`;
}
//# sourceMappingURL=index.js.map