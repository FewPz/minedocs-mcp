export interface MethodSummaryEntry {
  returnType: string;
  signature: string;
  description: string;
}

export type FieldSummaryEntry = MethodSummaryEntry;

export interface ClassInfo {
  signature: string;
  description: string;
  methods: MethodSummaryEntry[];
}

export interface MethodDetail {
  name: string;
  anchorId: string;
  signature: string;
  description: string;
  notes: Record<string, string[]>;
}

export interface PackageClassEntry {
  fullClassName: string;
  simpleName: string;
  kind: string;
  description: string;
}

export interface DeprecatedEntry {
  category: string;
  name: string;
  reason: string;
}
