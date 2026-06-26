import type { Id, TableNames } from "@FC237/backend/convex/_generated/dataModel";

type SupportedTableName = TableNames | "_storage";

export function toOptionalId<TableName extends SupportedTableName>(value: string): Id<TableName> | undefined {
  return value ? (value as Id<TableName>) : undefined;
}

export function toIdArray<TableName extends SupportedTableName>(values: string[]): Id<TableName>[] | undefined {
  return values.length ? (values as Id<TableName>[]) : undefined;
}
