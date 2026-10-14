import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/restock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RestockListController::index
 * @see app/Http/Controllers/RestockListController.php:19
 * @route '/restock'
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
* @see \App\Http\Controllers\RestockListController::updateStatus
 * @see app/Http/Controllers/RestockListController.php:58
 * @route '/restock/{restock}/status'
 */
export const updateStatus = (args: { restock: number | { id: number } } | [restock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/restock/{restock}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RestockListController::updateStatus
 * @see app/Http/Controllers/RestockListController.php:58
 * @route '/restock/{restock}/status'
 */
updateStatus.url = (args: { restock: number | { id: number } } | [restock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { restock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { restock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    restock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        restock: typeof args.restock === 'object'
                ? args.restock.id
                : args.restock,
                }

    return updateStatus.definition.url
            .replace('{restock}', parsedArgs.restock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RestockListController::updateStatus
 * @see app/Http/Controllers/RestockListController.php:58
 * @route '/restock/{restock}/status'
 */
updateStatus.patch = (args: { restock: number | { id: number } } | [restock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\RestockListController::updateStatus
 * @see app/Http/Controllers/RestockListController.php:58
 * @route '/restock/{restock}/status'
 */
    const updateStatusForm = (args: { restock: number | { id: number } } | [restock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RestockListController::updateStatus
 * @see app/Http/Controllers/RestockListController.php:58
 * @route '/restock/{restock}/status'
 */
        updateStatusForm.patch = (args: { restock: number | { id: number } } | [restock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
const RestockListController = { index, updateStatus }

export default RestockListController