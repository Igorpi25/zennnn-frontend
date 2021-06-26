/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateWord
// ====================================================

export interface CreateWord_createWord_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface CreateWord_createWord {
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: CreateWord_createWord_values[] | null;
}

export interface CreateWord {
  createWord: CreateWord_createWord | null;
}

export interface CreateWordVariables {
  input: CreateWordInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateWord
// ====================================================

export interface UpdateWord_updateWord_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface UpdateWord_updateWord {
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: UpdateWord_updateWord_values[] | null;
}

export interface UpdateWord {
  updateWord: UpdateWord_updateWord | null;
}

export interface UpdateWordVariables {
  input: UpdateWordInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ApproveWords
// ====================================================

export interface ApproveWords {
  approveWords: number | null;
}

export interface ApproveWordsVariables {
  ids?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MergeWords
// ====================================================

export interface MergeWords_mergeWords_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface MergeWords_mergeWords {
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

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: HideWords
// ====================================================

export interface HideWords {
  hideWords: number | null;
}

export interface HideWordsVariables {
  ids?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateWordWithProducts
// ====================================================

export interface CreateWordWithProducts {
  createWordWithProducts: number | null;
}

export interface CreateWordWithProductsVariables {
  productsIds?: string[] | null;
  input: CreateWordInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddProductsToWord
// ====================================================

export interface AddProductsToWord {
  addProductsToWord: number | null;
}

export interface AddProductsToWordVariables {
  productsIds?: string[] | null;
  wordId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListWords
// ====================================================

export interface ListWords_listWords_items_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface ListWords_listWords_items_products_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface ListWords_listWords_items_products {
  id: string;
  article: string | null;
  description: string | null;
  images: ListWords_listWords_items_products_images[] | null;
}

export interface ListWords_listWords_items {
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: ListWords_listWords_items_values[] | null;
  products: ListWords_listWords_items_products[] | null;
  isHidden: boolean | null;
}

export interface ListWords_listWords {
  items: ListWords_listWords_items[] | null;
}

export interface ListWords {
  listWords: ListWords_listWords | null;
}

export interface ListWordsVariables {
  filters?: ListWordsFilters | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TranslateWord
// ====================================================

export interface TranslateWord_translateWord {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface TranslateWord {
  translateWord: TranslateWord_translateWord[] | null;
}

export interface TranslateWordVariables {
  text: string;
  sourceLang: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchWords
// ====================================================

export interface SearchWords_searchWords_items_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SearchWords_searchWords_items {
  id: string;
  status: WordStatus | null;
  defaultLocale: string | null;
  values: SearchWords_searchWords_items_values[] | null;
  isHidden: boolean | null;
}

export interface SearchWords_searchWords {
  items: SearchWords_searchWords_items[] | null;
}

export interface SearchWords {
  searchWords: SearchWords_searchWords | null;
}

export interface SearchWordsVariables {
  search: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum WordStatus {
  APPROVED = "APPROVED",
  DRAFT = "DRAFT",
  DUPLICATE = "DUPLICATE",
}

export interface CreateWordInput {
  defaultLocale?: string | null;
  values?: WordTranslationInput[] | null;
}

export interface ListWordsFilters {
  orgId?: string | null;
  status?: WordStatus | null;
  showHiddens?: boolean | null;
  all?: boolean | null;
}

export interface MergeWordInput {
  defaultLocale?: string | null;
  values?: WordTranslationInput[] | null;
}

export interface UpdateWordInput {
  id: string;
  defaultLocale?: string | null;
  values?: WordTranslationInput[] | null;
}

export interface WordTranslationInput {
  k: string;
  v?: string | null;
  tr?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
