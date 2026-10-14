import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
export const guestCreate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guestCreate.url(options),
    method: 'get',
})

guestCreate.definition = {
    methods: ["get","head"],
    url: '/pengajuan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
guestCreate.url = (options?: RouteQueryOptions) => {
    return guestCreate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
guestCreate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guestCreate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
guestCreate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guestCreate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
    const guestCreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: guestCreate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
        guestCreateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guestCreate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ItemRequestController::guestCreate
 * @see app/Http/Controllers/ItemRequestController.php:275
 * @route '/pengajuan'
 */
        guestCreateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guestCreate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    guestCreate.form = guestCreateForm
/**
* @see \App\Http\Controllers\ItemRequestController::guestStore
 * @see app/Http/Controllers/ItemRequestController.php:535
 * @route '/pengajuan'
 */
export const guestStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: guestStore.url(options),
    method: 'post',
})

guestStore.definition = {
    methods: ["post"],
    url: '/pengajuan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ItemRequestController::guestStore
 * @see app/Http/Controllers/ItemRequestController.php:535
 * @route '/pengajuan'
 */
guestStore.url = (options?: RouteQueryOptions) => {
    return guestStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::guestStore
 * @see app/Http/Controllers/ItemRequestController.php:535
 * @route '/pengajuan'
 */
guestStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: guestStore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::guestStore
 * @see app/Http/Controllers/ItemRequestController.php:535
 * @route '/pengajuan'
 */
    const guestStoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: guestStore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::guestStore
 * @see app/Http/Controllers/ItemRequestController.php:535
 * @route '/pengajuan'
 */
        guestStoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: guestStore.url(options),
            method: 'post',
        })
    
    guestStore.form = guestStoreForm
/**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
export const guestPrint = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guestPrint.url(args, options),
    method: 'get',
})

guestPrint.definition = {
    methods: ["get","head"],
    url: '/pengajuan/{request_number}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
guestPrint.url = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request_number: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    request_number: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        request_number: args.request_number,
                }

    return guestPrint.definition.url
            .replace('{request_number}', parsedArgs.request_number.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
guestPrint.get = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guestPrint.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
guestPrint.head = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guestPrint.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
    const guestPrintForm = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: guestPrint.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
        guestPrintForm.get = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guestPrint.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ItemRequestController::guestPrint
 * @see app/Http/Controllers/ItemRequestController.php:290
 * @route '/pengajuan/{request_number}/print'
 */
        guestPrintForm.head = (args: { request_number: string | number } | [request_number: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guestPrint.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    guestPrint.form = guestPrintForm
/**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ItemRequestController::index
 * @see app/Http/Controllers/ItemRequestController.php:20
 * @route '/requests'
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
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/requests/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ItemRequestController::create
 * @see app/Http/Controllers/ItemRequestController.php:70
 * @route '/requests/create'
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
* @see \App\Http\Controllers\ItemRequestController::store
 * @see app/Http/Controllers/ItemRequestController.php:93
 * @route '/requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ItemRequestController::store
 * @see app/Http/Controllers/ItemRequestController.php:93
 * @route '/requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::store
 * @see app/Http/Controllers/ItemRequestController.php:93
 * @route '/requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::store
 * @see app/Http/Controllers/ItemRequestController.php:93
 * @route '/requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::store
 * @see app/Http/Controllers/ItemRequestController.php:93
 * @route '/requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
export const show = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/requests/{itemRequest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
show.url = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { itemRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { itemRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    itemRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        itemRequest: typeof args.itemRequest === 'object'
                ? args.itemRequest.id
                : args.itemRequest,
                }

    return show.definition.url
            .replace('{itemRequest}', parsedArgs.itemRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
show.get = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
show.head = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
    const showForm = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
        showForm.get = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ItemRequestController::show
 * @see app/Http/Controllers/ItemRequestController.php:149
 * @route '/requests/{itemRequest}'
 */
        showForm.head = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ItemRequestController::approve
 * @see app/Http/Controllers/ItemRequestController.php:185
 * @route '/requests/{itemRequest}/approve'
 */
export const approve = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/requests/{itemRequest}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ItemRequestController::approve
 * @see app/Http/Controllers/ItemRequestController.php:185
 * @route '/requests/{itemRequest}/approve'
 */
approve.url = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { itemRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { itemRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    itemRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        itemRequest: typeof args.itemRequest === 'object'
                ? args.itemRequest.id
                : args.itemRequest,
                }

    return approve.definition.url
            .replace('{itemRequest}', parsedArgs.itemRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::approve
 * @see app/Http/Controllers/ItemRequestController.php:185
 * @route '/requests/{itemRequest}/approve'
 */
approve.patch = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::approve
 * @see app/Http/Controllers/ItemRequestController.php:185
 * @route '/requests/{itemRequest}/approve'
 */
    const approveForm = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::approve
 * @see app/Http/Controllers/ItemRequestController.php:185
 * @route '/requests/{itemRequest}/approve'
 */
        approveForm.patch = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ItemRequestController::reject
 * @see app/Http/Controllers/ItemRequestController.php:224
 * @route '/requests/{itemRequest}/reject'
 */
export const reject = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

reject.definition = {
    methods: ["patch"],
    url: '/requests/{itemRequest}/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ItemRequestController::reject
 * @see app/Http/Controllers/ItemRequestController.php:224
 * @route '/requests/{itemRequest}/reject'
 */
reject.url = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { itemRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { itemRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    itemRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        itemRequest: typeof args.itemRequest === 'object'
                ? args.itemRequest.id
                : args.itemRequest,
                }

    return reject.definition.url
            .replace('{itemRequest}', parsedArgs.itemRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::reject
 * @see app/Http/Controllers/ItemRequestController.php:224
 * @route '/requests/{itemRequest}/reject'
 */
reject.patch = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::reject
 * @see app/Http/Controllers/ItemRequestController.php:224
 * @route '/requests/{itemRequest}/reject'
 */
    const rejectForm = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::reject
 * @see app/Http/Controllers/ItemRequestController.php:224
 * @route '/requests/{itemRequest}/reject'
 */
        rejectForm.patch = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\ItemRequestController::cancel
 * @see app/Http/Controllers/ItemRequestController.php:255
 * @route '/requests/{itemRequest}/cancel'
 */
export const cancel = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancel.url(args, options),
    method: 'delete',
})

cancel.definition = {
    methods: ["delete"],
    url: '/requests/{itemRequest}/cancel',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ItemRequestController::cancel
 * @see app/Http/Controllers/ItemRequestController.php:255
 * @route '/requests/{itemRequest}/cancel'
 */
cancel.url = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { itemRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { itemRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    itemRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        itemRequest: typeof args.itemRequest === 'object'
                ? args.itemRequest.id
                : args.itemRequest,
                }

    return cancel.definition.url
            .replace('{itemRequest}', parsedArgs.itemRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemRequestController::cancel
 * @see app/Http/Controllers/ItemRequestController.php:255
 * @route '/requests/{itemRequest}/cancel'
 */
cancel.delete = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancel.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ItemRequestController::cancel
 * @see app/Http/Controllers/ItemRequestController.php:255
 * @route '/requests/{itemRequest}/cancel'
 */
    const cancelForm = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ItemRequestController::cancel
 * @see app/Http/Controllers/ItemRequestController.php:255
 * @route '/requests/{itemRequest}/cancel'
 */
        cancelForm.delete = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
const ItemRequestController = { guestCreate, guestStore, guestPrint, index, create, store, show, approve, reject, cancel }

export default ItemRequestController