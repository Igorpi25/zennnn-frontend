/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListWordsFilters, WordStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: ListWords
// ====================================================

export interface ListWords_listWords_items_values {
  __typename: "WordTranslation";
  k: string;
  v: string | null;
  tr: string | null;
}

export interface ListWords_listWords_items_products_images {
  __typename: "AttachFile";
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface ListWords_listWords_items_products {
  __typename: "WordProduct";
  id: string;
  article: string | null;
  description: string | null;
  images: ListWords_listWords_items_products_images[] | null;
}

export interface ListWords_listWords_items {
  __typename: "Word";
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: ListWords_listWords_items_values[] | null;
  products: ListWords_listWords_items_products[] | null;
  isHidden: boolean | null;
}

export interface ListWords_listWords {
  __typename: "WordItems";
  items: (ListWords_listWords_items | null)[] | null;
}

export interface ListWords {
  listWords: ListWords_listWords | null;
}

export interface ListWordsVariables {
  filters?: ListWordsFilters | null;
}
