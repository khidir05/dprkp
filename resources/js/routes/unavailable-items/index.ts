import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/unavailable-items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UnavailableItemController::index
 * @see app/Http/Controllers/UnavailableItemController.php:19
 * @route '/unavailable-items'
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
* @see \App\Http\Controllers\UnavailableItemController::store
 * @see app/Http/Controllers/UnavailableItemController.php:53
 * @route '/unavailable-items'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/unavailable-items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UnavailableItemController::store
 * @see app/Http/Controllers/UnavailableItemController.php:53
 * @route '/unavailable-items'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnavailableItemController::store
 * @see app/Http/Controllers/UnavailableItemController.php:53
 * @route '/unavailable-items'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UnavailableItemController::store
 * @see app/Http/Controllers/UnavailableItemController.php:53
 * @route '/unavailable-items'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UnavailableItemController::store
 * @see app/Http/Controllers/UnavailableItemController.php:53
 * @route '/unavailable-items'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\UnavailableItemController::destroy
 * @see app/Http/Controllers/UnavailableItemController.php:147
 * @route '/unavailable-items/{unavailable_item}'
 */
export const destroy = (args: { unavailable_item: string | number } | [unavailable_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/unavailable-items/{unavailable_item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UnavailableItemController::destroy
 * @see app/Http/Controllers/UnavailableItemController.php:147
 * @route '/unavailable-items/{unavailable_item}'
 */
destroy.url = (args: { unavailable_item: string | number } | [unavailable_item: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unavailable_item: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    unavailable_item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unavailable_item: args.unavailable_item,
                }

    return destroy.definition.url
            .replace('{unavailable_item}', parsedArgs.unavailable_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnavailableItemController::destroy
 * @see app/Http/Controllers/UnavailableItemController.php:147
 * @route '/unavailable-items/{unavailable_item}'
 */
destroy.delete = (args: { unavailable_item: string | number } | [unavailable_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\UnavailableItemController::destroy
 * @see app/Http/Controllers/UnavailableItemController.php:147
 * @route '/unavailable-items/{unavailable_item}'
 */
    const destroyForm = (args: { unavailable_item: string | number } | [unavailable_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UnavailableItemController::destroy
 * @see app/Http/Controllers/UnavailableItemController.php:147
 * @route '/unavailable-items/{unavailable_item}'
 */
        destroyForm.delete = (args: { unavailable_item: string | number } | [unavailable_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\UnavailableItemController::process
 * @see app/Http/Controllers/UnavailableItemController.php:82
 * @route '/unavailable-items/{item}/process'
 */
export const process = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/unavailable-items/{item}/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UnavailableItemController::process
 * @see app/Http/Controllers/UnavailableItemController.php:82
 * @route '/unavailable-items/{item}/process'
 */
process.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        item: typeof args.item === 'object'
                ? args.item.id
                : args.item,
                }

    return process.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnavailableItemController::process
 * @see app/Http/Controllers/UnavailableItemController.php:82
 * @route '/unavailable-items/{item}/process'
 */
process.post = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UnavailableItemController::process
 * @see app/Http/Controllers/UnavailableItemController.php:82
 * @route '/unavailable-items/{item}/process'
 */
    const processForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: process.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UnavailableItemController::process
 * @see app/Http/Controllers/UnavailableItemController.php:82
 * @route '/unavailable-items/{item}/process'
 */
        processForm.post = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: process.url(args, options),
            method: 'post',
        })
    
    process.form = processForm
/**
* @see \App\Http\Controllers\UnavailableItemController::close
 * @see app/Http/Controllers/UnavailableItemController.php:119
 * @route '/unavailable-items/{item}/close'
 */
export const close = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/unavailable-items/{item}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UnavailableItemController::close
 * @see app/Http/Controllers/UnavailableItemController.php:119
 * @route '/unavailable-items/{item}/close'
 */
close.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        item: typeof args.item === 'object'
                ? args.item.id
                : args.item,
                }

    return close.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnavailableItemController::close
 * @see app/Http/Controllers/UnavailableItemController.php:119
 * @route '/unavailable-items/{item}/close'
 */
close.post = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UnavailableItemController::close
 * @see app/Http/Controllers/UnavailableItemController.php:119
 * @route '/unavailable-items/{item}/close'
 */
    const closeForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UnavailableItemController::close
 * @see app/Http/Controllers/UnavailableItemController.php:119
 * @route '/unavailable-items/{item}/close'
 */
        closeForm.post = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const unavailableItems = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
process: Object.assign(process, process),
close: Object.assign(close, close),
}

export default unavailableItems