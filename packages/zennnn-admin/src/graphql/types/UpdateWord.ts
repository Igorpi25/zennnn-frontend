/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateWordInput, WordStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateWord
// ====================================================

export interface UpdateWord_updateWord_values {
  __typename: "WordTranslation";
  k: string;
  v: string | null;
  tr: string | null;
}

export interface UpdateWord_updateWord {
  __typename: "Word";
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
