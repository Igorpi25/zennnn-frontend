/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MergeWordInput, WordStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MergeWords
// ====================================================

export interface MergeWords_mergeWords_values {
  __typename: "WordTranslation";
  k: string;
  v: string | null;
  tr: string | null;
}

export interface MergeWords_mergeWords {
  __typename: "Word";
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: MergeWords_mergeWords_values[] | null;
}

export interface MergeWords {
  mergeWords: MergeWords_mergeWords | null;
}

export interface MergeWordsVariables {
  ids?: string[] | null;
  input: MergeWordInput;
}
