import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/stock-opnames',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockOpnameController::index
 * @see app/Http/Controllers/StockOpnameController.php:21
 * @route '/stock-opnames'
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
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/stock-opnames/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockOpnameController::create
 * @see app/Http/Controllers/StockOpnameController.php:72
 * @route '/stock-opnames/create'
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
* @see \App\Http\Controllers\StockOpnameController::store
 * @see app/Http/Controllers/StockOpnameController.php:126
 * @route '/stock-opnames'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/stock-opnames',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StockOpnameController::store
 * @see app/Http/Controllers/StockOpnameController.php:126
 * @route '/stock-opnames'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::store
 * @see app/Http/Controllers/StockOpnameController.php:126
 * @route '/stock-opnames'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::store
 * @see app/Http/Controllers/StockOpnameController.php:126
 * @route '/stock-opnames'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::store
 * @see app/Http/Controllers/StockOpnameController.php:126
 * @route '/stock-opnames'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
export const show = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/stock-opnames/{stockOpname}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
show.url = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockOpname: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stockOpname: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stockOpname: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stockOpname: typeof args.stockOpname === 'object'
                ? args.stockOpname.id
                : args.stockOpname,
                }

    return show.definition.url
            .replace('{stockOpname}', parsedArgs.stockOpname.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
show.get = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
show.head = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
    const showForm = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
        showForm.get = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockOpnameController::show
 * @see app/Http/Controllers/StockOpnameController.php:198
 * @route '/stock-opnames/{stockOpname}'
 */
        showForm.head = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
export const edit = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/stock-opnames/{stockOpname}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
edit.url = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockOpname: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stockOpname: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stockOpname: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stockOpname: typeof args.stockOpname === 'object'
                ? args.stockOpname.id
                : args.stockOpname,
                }

    return edit.definition.url
            .replace('{stockOpname}', parsedArgs.stockOpname.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
edit.get = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
edit.head = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
    const editForm = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
        editForm.get = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StockOpnameController::edit
 * @see app/Http/Controllers/StockOpnameController.php:224
 * @route '/stock-opnames/{stockOpname}/edit'
 */
        editForm.head = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
export const update = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/stock-opnames/{stockOpname}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
update.url = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockOpname: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stockOpname: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stockOpname: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stockOpname: typeof args.stockOpname === 'object'
                ? args.stockOpname.id
                : args.stockOpname,
                }

    return update.definition.url
            .replace('{stockOpname}', parsedArgs.stockOpname.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
update.put = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
update.patch = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
    const updateForm = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
        updateForm.put = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\StockOpnameController::update
 * @see app/Http/Controllers/StockOpnameController.php:270
 * @route '/stock-opnames/{stockOpname}'
 */
        updateForm.patch = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\StockOpnameController::approve
 * @see app/Http/Controllers/StockOpnameController.php:343
 * @route '/stock-opnames/{stockOpname}/approve'
 */
export const approve = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/stock-opnames/{stockOpname}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\StockOpnameController::approve
 * @see app/Http/Controllers/StockOpnameController.php:343
 * @route '/stock-opnames/{stockOpname}/approve'
 */
approve.url = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockOpname: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stockOpname: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stockOpname: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stockOpname: typeof args.stockOpname === 'object'
                ? args.stockOpname.id
                : args.stockOpname,
                }

    return approve.definition.url
            .replace('{stockOpname}', parsedArgs.stockOpname.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::approve
 * @see app/Http/Controllers/StockOpnameController.php:343
 * @route '/stock-opnames/{stockOpname}/approve'
 */
approve.patch = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::approve
 * @see app/Http/Controllers/StockOpnameController.php:343
 * @route '/stock-opnames/{stockOpname}/approve'
 */
    const approveForm = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::approve
 * @see app/Http/Controllers/StockOpnameController.php:343
 * @route '/stock-opnames/{stockOpname}/approve'
 */
        approveForm.patch = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\StockOpnameController::cancel
 * @see app/Http/Controllers/StockOpnameController.php:385
 * @route '/stock-opnames/{stockOpname}/cancel'
 */
export const cancel = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/stock-opnames/{stockOpname}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\StockOpnameController::cancel
 * @see app/Http/Controllers/StockOpnameController.php:385
 * @route '/stock-opnames/{stockOpname}/cancel'
 */
cancel.url = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stockOpname: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stockOpname: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stockOpname: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stockOpname: typeof args.stockOpname === 'object'
                ? args.stockOpname.id
                : args.stockOpname,
                }

    return cancel.definition.url
            .replace('{stockOpname}', parsedArgs.stockOpname.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StockOpnameController::cancel
 * @see app/Http/Controllers/StockOpnameController.php:385
 * @route '/stock-opnames/{stockOpname}/cancel'
 */
cancel.patch = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\StockOpnameController::cancel
 * @see app/Http/Controllers/StockOpnameController.php:385
 * @route '/stock-opnames/{stockOpname}/cancel'
 */
    const cancelForm = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StockOpnameController::cancel
 * @see app/Http/Controllers/StockOpnameController.php:385
 * @route '/stock-opnames/{stockOpname}/cancel'
 */
        cancelForm.patch = (args: { stockOpname: number | { id: number } } | [stockOpname: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
const stockOpnames = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
approve: Object.assign(approve, approve),
cancel: Object.assign(cancel, cancel),
}

export default stockOpnames