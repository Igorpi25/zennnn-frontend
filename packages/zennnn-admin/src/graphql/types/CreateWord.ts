/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateWordInput, WordStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateWord
// ====================================================

export interface CreateWord_createWord_values {
  __typename: "WordTranslation";
  k: string;
  v: string | null;
  tr: string | null;
}

export interface CreateWord_createWord {
  __typename: "Word";
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
