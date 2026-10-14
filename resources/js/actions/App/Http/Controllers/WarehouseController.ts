import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/warehouses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:17
 * @route '/warehouses'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:50
 * @route '/warehouses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/warehouses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:50
 * @route '/warehouses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:50
 * @route '/warehouses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:50
 * @route '/warehouses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:50
 * @route '/warehouses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
export const update = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/warehouses/{warehouse}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
update.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return update.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
update.put = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
update.patch = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
    const updateForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
        updateForm.put = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:75
 * @route '/warehouses/{warehouse}'
 */
        updateForm.patch = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\WarehouseController::toggleActive
 * @see app/Http/Controllers/WarehouseController.php:98
 * @route '/warehouses/{warehouse}/toggle-active'
 */
export const toggleActive = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

toggleActive.definition = {
    methods: ["patch"],
    url: '/warehouses/{warehouse}/toggle-active',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\WarehouseController::toggleActive
 * @see app/Http/Controllers/WarehouseController.php:98
 * @route '/warehouses/{warehouse}/toggle-active'
 */
toggleActive.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return toggleActive.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::toggleActive
 * @see app/Http/Controllers/WarehouseController.php:98
 * @route '/warehouses/{warehouse}/toggle-active'
 */
toggleActive.patch = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WarehouseController::toggleActive
 * @see app/Http/Controllers/WarehouseController.php:98
 * @route '/warehouses/{warehouse}/toggle-active'
 */
    const toggleActiveForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActive.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::toggleActive
 * @see app/Http/Controllers/WarehouseController.php:98
 * @route '/warehouses/{warehouse}/toggle-active'
 */
        toggleActiveForm.patch = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActive.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActive.form = toggleActiveForm
/**
* @see \App\Http\Controllers\WarehouseController::assignUsers
 * @see app/Http/Controllers/WarehouseController.php:115
 * @route '/warehouses/{warehouse}/assign-users'
 */
export const assignUsers = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignUsers.url(args, options),
    method: 'post',
})

assignUsers.definition = {
    methods: ["post"],
    url: '/warehouses/{warehouse}/assign-users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WarehouseController::assignUsers
 * @see app/Http/Controllers/WarehouseController.php:115
 * @route '/warehouses/{warehouse}/assign-users'
 */
assignUsers.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return assignUsers.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::assignUsers
 * @see app/Http/Controllers/WarehouseController.php:115
 * @route '/warehouses/{warehouse}/assign-users'
 */
assignUsers.post = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignUsers.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WarehouseController::assignUsers
 * @see app/Http/Controllers/WarehouseController.php:115
 * @route '/warehouses/{warehouse}/assign-users'
 */
    const assignUsersForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignUsers.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::assignUsers
 * @see app/Http/Controllers/WarehouseController.php:115
 * @route '/warehouses/{warehouse}/assign-users'
 */
        assignUsersForm.post = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignUsers.url(args, options),
            method: 'post',
        })
    
    assignUsers.form = assignUsersForm
const WarehouseController = { index, store, update, toggleActive, assignUsers }

export default WarehouseController