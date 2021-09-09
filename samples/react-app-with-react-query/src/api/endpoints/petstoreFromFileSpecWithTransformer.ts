/*
 * Generated by orval v5.5.9 🍺
 * Do not edit manually.
 * Swagger Petstore
 * OpenAPI spec version: 1.0.0
 */
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions
} from 'react-query'
import type {
  Pets,
  Error,
  ListPetsParams,
  Pet,
  CreatePetsBody
} from '../model'
import { customInstance } from '../mutator/custom-instance'

type AsyncReturnType<
T extends (...args: any) => Promise<any>
> = T extends (...args: any) => Promise<infer R> ? R : any;


export const listPets = (
    params?: ListPetsParams,
    version= 1,
 ) => {
      return customInstance<Pets>(
      {url: `/v${version}/pets`, method: 'get',
        params,
    },
      );
    }
  

export const getListPetsQueryKey = (params?: ListPetsParams,
    version= 1,) => [`/v${version}/pets`, ...(params ? [params]: [])];

    
export const useListPets = <TData = AsyncReturnType<typeof listPets>, TError = Error>(
 params?: ListPetsParams,
    version= 1, options?: { query?:UseQueryOptions<AsyncReturnType<typeof listPets>, TError, TData>, }

  ) => {

  const {query: queryOptions} = options || {}

  const queryKey = queryOptions?.queryKey ?? getListPetsQueryKey(params,version);
  const queryFn = () => listPets(params,version, );

  const query = useQuery<AsyncReturnType<typeof queryFn>, TError, TData>(queryKey, queryFn, {enabled: !!(version), ...queryOptions})

  return {
    queryKey,
    ...query
  }
}

export const createPets = (
    createPetsBody: CreatePetsBody,
    version= 1,
 ) => {
      return customInstance<Pet>(
      {url: `/v${version}/pets`, method: 'post',
      data: createPetsBody
    },
      );
    }
  


    export const useCreatePets = <TError = Error,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<AsyncReturnType<typeof createPets>, TError,{data: CreatePetsBody;version?: number}, TContext>, }
) => {
      const {mutation: mutationOptions} = options || {}

      return useMutation<AsyncReturnType<typeof createPets>, TError, {data: CreatePetsBody;version?: number}, TContext>((props) => {
        const {data,version} = props || {};

        return  createPets(data,version,)
      }, mutationOptions)
    }
    export const showPetById = (
    petId: string,
    version= 1,
 ) => {
      return customInstance<Pet>(
      {url: `/v${version}/pets/${petId}`, method: 'get'
    },
      );
    }
  

export const getShowPetByIdQueryKey = (petId: string,
    version= 1,) => [`/v${version}/pets/${petId}`];

    
export const useShowPetById = <TData = AsyncReturnType<typeof showPetById>, TError = Error>(
 petId: string,
    version= 1, options?: { query?:UseQueryOptions<AsyncReturnType<typeof showPetById>, TError, TData>, }

  ) => {

  const {query: queryOptions} = options || {}

  const queryKey = queryOptions?.queryKey ?? getShowPetByIdQueryKey(petId,version);
  const queryFn = () => showPetById(petId,version, );

  const query = useQuery<AsyncReturnType<typeof queryFn>, TError, TData>(queryKey, queryFn, {enabled: !!(version && petId), ...queryOptions})

  return {
    queryKey,
    ...query
  }
}

