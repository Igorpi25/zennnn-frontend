/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WordStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchWords
// ====================================================

export interface SearchWords_searchWords_items_values {
  __typename: "WordTranslation";
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SearchWords_searchWords_items {
  __typename: "WordSearchItem";
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: SearchWords_searchWords_items_values[] | null;
  isHidden: boolean | null;
}

export interface SearchWords_searchWords {
  __typename: "WordSearchItems";
  items: (SearchWords_searchWords_items | null)[] | null;
}

export interface SearchWords {
  searchWords: SearchWords_searchWords | null;
}

export interface SearchWordsVariables {
  search: string;
}
