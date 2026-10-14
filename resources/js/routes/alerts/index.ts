import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/alerts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockAlertController::index
 * @see app/Http/Controllers/StockAlertController.php:21
 * @route '/alerts'
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
* @see \App\Http\Controllers\StockAlertController::hold
 * @see app/Http/Controllers/StockAlertController.php:76
 * @route '/alerts/{alert}/hold'
 */
export const hold = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(args, options),
    method: 'post',
})

hold.definition = {
    methods: ["post"],
    url: '/alerts/{alert}/hold',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockAlertController::hold
 * @see app/Http/Controllers/StockAlertController.php:76
 * @route '/alerts/{alert}/hold'
 */
hold.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { alert: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    alert: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alert: typeof args.alert === 'object'
                ? args.alert.id
                : args.alert,
                }

    return hold.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockAlertController::hold
 * @see app/Http/Controllers/StockAlertController.php:76
 * @route '/alerts/{alert}/hold'
 */
hold.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StockAlertController::hold
 * @see app/Http/Controllers/StockAlertController.php:76
 * @route '/alerts/{alert}/hold'
 */
    const holdForm = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: hold.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockAlertController::hold
 * @see app/Http/Controllers/StockAlertController.php:76
 * @route '/alerts/{alert}/hold'
 */
        holdForm.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: hold.url(args, options),
            method: 'post',
        })
    
    hold.form = holdForm
/**
* @see \App\Http\Controllers\StockAlertController::release
 * @see app/Http/Controllers/StockAlertController.php:104
 * @route '/alerts/{alert}/release'
 */
export const release = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: release.url(args, options),
    method: 'post',
})

release.definition = {
    methods: ["post"],
    url: '/alerts/{alert}/release',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockAlertController::release
 * @see app/Http/Controllers/StockAlertController.php:104
 * @route '/alerts/{alert}/release'
 */
release.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { alert: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    alert: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alert: typeof args.alert === 'object'
                ? args.alert.id
                : args.alert,
                }

    return release.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockAlertController::release
 * @see app/Http/Controllers/StockAlertController.php:104
 * @route '/alerts/{alert}/release'
 */
release.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: release.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StockAlertController::release
 * @see app/Http/Controllers/StockAlertController.php:104
 * @route '/alerts/{alert}/release'
 */
    const releaseForm = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: release.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockAlertController::release
 * @see app/Http/Controllers/StockAlertController.php:104
 * @route '/alerts/{alert}/release'
 */
        releaseForm.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: release.url(args, options),
            method: 'post',
        })
    
    release.form = releaseForm
/**
* @see \App\Http\Controllers\StockAlertController::restock
 * @see app/Http/Controllers/StockAlertController.php:132
 * @route '/alerts/{alert}/restock'
 */
export const restock = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restock.url(args, options),
    method: 'post',
})

restock.definition = {
    methods: ["post"],
    url: '/alerts/{alert}/restock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockAlertController::restock
 * @see app/Http/Controllers/StockAlertController.php:132
 * @route '/alerts/{alert}/restock'
 */
restock.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { alert: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    alert: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alert: typeof args.alert === 'object'
                ? args.alert.id
                : args.alert,
                }

    return restock.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockAlertController::restock
 * @see app/Http/Controllers/StockAlertController.php:132
 * @route '/alerts/{alert}/restock'
 */
restock.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StockAlertController::restock
 * @see app/Http/Controllers/StockAlertController.php:132
 * @route '/alerts/{alert}/restock'
 */
    const restockForm = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockAlertController::restock
 * @see app/Http/Controllers/StockAlertController.php:132
 * @route '/alerts/{alert}/restock'
 */
        restockForm.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restock.url(args, options),
            method: 'post',
        })
    
    restock.form = restockForm
/**
* @see \App\Http\Controllers\StockAlertController::close
 * @see app/Http/Controllers/StockAlertController.php:173
 * @route '/alerts/{alert}/close'
 */
export const close = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/alerts/{alert}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockAlertController::close
 * @see app/Http/Controllers/StockAlertController.php:173
 * @route '/alerts/{alert}/close'
 */
close.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { alert: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    alert: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alert: typeof args.alert === 'object'
                ? args.alert.id
                : args.alert,
                }

    return close.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockAlertController::close
 * @see app/Http/Controllers/StockAlertController.php:173
 * @route '/alerts/{alert}/close'
 */
close.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StockAlertController::close
 * @see app/Http/Controllers/StockAlertController.php:173
 * @route '/alerts/{alert}/close'
 */
    const closeForm = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockAlertController::close
 * @see app/Http/Controllers/StockAlertController.php:173
 * @route '/alerts/{alert}/close'
 */
        closeForm.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const alerts = {
    index: Object.assign(index, index),
hold: Object.assign(hold, hold),
release: Object.assign(release, release),
restock: Object.assign(restock, restock),
close: Object.assign(close, close),
}

export default alerts