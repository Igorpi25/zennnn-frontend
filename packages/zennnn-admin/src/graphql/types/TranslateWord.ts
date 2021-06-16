/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TranslateWord
// ====================================================

export interface TranslateWord_translateWord {
  __typename: "WordTranslation";
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
