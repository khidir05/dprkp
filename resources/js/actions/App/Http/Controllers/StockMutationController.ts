import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mutations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockMutationController::index
 * @see app/Http/Controllers/StockMutationController.php:20
 * @route '/mutations'
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
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/mutations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockMutationController::create
 * @see app/Http/Controllers/StockMutationController.php:74
 * @route '/mutations/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\StockMutationController::store
 * @see app/Http/Controllers/StockMutationController.php:101
 * @route '/mutations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mutations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockMutationController::store
 * @see app/Http/Controllers/StockMutationController.php:101
 * @route '/mutations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockMutationController::store
 * @see app/Http/Controllers/StockMutationController.php:101
 * @route '/mutations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StockMutationController::store
 * @see app/Http/Controllers/StockMutationController.php:101
 * @route '/mutations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockMutationController::store
 * @see app/Http/Controllers/StockMutationController.php:101
 * @route '/mutations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
export const show = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mutations/{mutation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
show.url = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mutation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mutation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mutation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mutation: typeof args.mutation === 'object'
                ? args.mutation.id
                : args.mutation,
                }

    return show.definition.url
            .replace('{mutation}', parsedArgs.mutation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
show.get = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
show.head = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
    const showForm = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
        showForm.get = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockMutationController::show
 * @see app/Http/Controllers/StockMutationController.php:189
 * @route '/mutations/{mutation}'
 */
        showForm.head = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\StockMutationController::approve
 * @see app/Http/Controllers/StockMutationController.php:216
 * @route '/mutations/{mutation}/approve'
 */
export const approve = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/mutations/{mutation}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\StockMutationController::approve
 * @see app/Http/Controllers/StockMutationController.php:216
 * @route '/mutations/{mutation}/approve'
 */
approve.url = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mutation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mutation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mutation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mutation: typeof args.mutation === 'object'
                ? args.mutation.id
                : args.mutation,
                }

    return approve.definition.url
            .replace('{mutation}', parsedArgs.mutation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockMutationController::approve
 * @see app/Http/Controllers/StockMutationController.php:216
 * @route '/mutations/{mutation}/approve'
 */
approve.patch = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\StockMutationController::approve
 * @see app/Http/Controllers/StockMutationController.php:216
 * @route '/mutations/{mutation}/approve'
 */
    const approveForm = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockMutationController::approve
 * @see app/Http/Controllers/StockMutationController.php:216
 * @route '/mutations/{mutation}/approve'
 */
        approveForm.patch = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\StockMutationController::reject
 * @see app/Http/Controllers/StockMutationController.php:240
 * @route '/mutations/{mutation}/reject'
 */
export const reject = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

reject.definition = {
    methods: ["patch"],
    url: '/mutations/{mutation}/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\StockMutationController::reject
 * @see app/Http/Controllers/StockMutationController.php:240
 * @route '/mutations/{mutation}/reject'
 */
reject.url = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mutation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mutation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mutation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mutation: typeof args.mutation === 'object'
                ? args.mutation.id
                : args.mutation,
                }

    return reject.definition.url
            .replace('{mutation}', parsedArgs.mutation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockMutationController::reject
 * @see app/Http/Controllers/StockMutationController.php:240
 * @route '/mutations/{mutation}/reject'
 */
reject.patch = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\StockMutationController::reject
 * @see app/Http/Controllers/StockMutationController.php:240
 * @route '/mutations/{mutation}/reject'
 */
    const rejectForm = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockMutationController::reject
 * @see app/Http/Controllers/StockMutationController.php:240
 * @route '/mutations/{mutation}/reject'
 */
        rejectForm.patch = (args: { mutation: number | { id: number } } | [mutation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reject.form = rejectForm
const StockMutationController = { index, create, store, show, approve, reject }

export default StockMutationController