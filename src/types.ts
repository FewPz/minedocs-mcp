export interface MethodSummaryEntry {
  returnType: string;
  signature: string;
  description: string;
}

export interface ClassInfo {
  signature: string;
  description: string;
  methods: MethodSummaryEntry[];
}
