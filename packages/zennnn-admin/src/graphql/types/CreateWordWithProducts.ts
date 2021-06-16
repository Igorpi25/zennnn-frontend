/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateWordInput } from "./globalTypes";

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
