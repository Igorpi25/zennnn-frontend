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
