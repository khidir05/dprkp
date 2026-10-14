import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inbound',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InboundController::index
 * @see app/Http/Controllers/InboundController.php:25
 * @route '/inbound'
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
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/inbound/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InboundController::create
 * @see app/Http/Controllers/InboundController.php:81
 * @route '/inbound/create'
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
* @see \App\Http\Controllers\InboundController::store
 * @see app/Http/Controllers/InboundController.php:114
 * @route '/inbound'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inbound',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InboundController::store
 * @see app/Http/Controllers/InboundController.php:114
 * @route '/inbound'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboundController::store
 * @see app/Http/Controllers/InboundController.php:114
 * @route '/inbound'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InboundController::store
 * @see app/Http/Controllers/InboundController.php:114
 * @route '/inbound'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InboundController::store
 * @see app/Http/Controllers/InboundController.php:114
 * @route '/inbound'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
export const show = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inbound/{inbound}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
show.url = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inbound: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inbound: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inbound: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inbound: typeof args.inbound === 'object'
                ? args.inbound.id
                : args.inbound,
                }

    return show.definition.url
            .replace('{inbound}', parsedArgs.inbound.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
show.get = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
show.head = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
    const showForm = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
        showForm.get = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InboundController::show
 * @see app/Http/Controllers/InboundController.php:229
 * @route '/inbound/{inbound}'
 */
        showForm.head = (args: { inbound: number | { id: number } } | [inbound: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const InboundController = { index, create, store, show }

export default InboundController