/*
 * Generated by orval v5.5.9 🍺
 * Do not edit manually.
 * Swagger Petstore
 * OpenAPI spec version: 1.0.0
 */
import {
  rest
} from 'msw'
import type {
  Pets,
  Pet
} from '../model'

export const getSwaggerPetstoreMSW = () => [
rest.get('*/v:version/pets', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.post('*/v:version/pets', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.get('*/v:version/pets/:petId', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),]
