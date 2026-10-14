import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:21
 * @route '/users'
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
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:59
 * @route '/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:59
 * @route '/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:59
 * @route '/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:59
 * @route '/users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:59
 * @route '/users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:112
 * @route '/users/{user}'
 */
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/users/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:112
 * @route '/users/{user}'
 */
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:112
 * @route '/users/{user}'
 */
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:112
 * @route '/users/{user}'
 */
    const updateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:112
 * @route '/users/{user}'
 */
        updateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\UserManagementController::toggleActive
 * @see app/Http/Controllers/UserManagementController.php:175
 * @route '/users/{user}/toggle-active'
 */
export const toggleActive = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

toggleActive.definition = {
    methods: ["patch"],
    url: '/users/{user}/toggle-active',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\UserManagementController::toggleActive
 * @see app/Http/Controllers/UserManagementController.php:175
 * @route '/users/{user}/toggle-active'
 */
toggleActive.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return toggleActive.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::toggleActive
 * @see app/Http/Controllers/UserManagementController.php:175
 * @route '/users/{user}/toggle-active'
 */
toggleActive.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\UserManagementController::toggleActive
 * @see app/Http/Controllers/UserManagementController.php:175
 * @route '/users/{user}/toggle-active'
 */
    const toggleActiveForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActive.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::toggleActive
 * @see app/Http/Controllers/UserManagementController.php:175
 * @route '/users/{user}/toggle-active'
 */
        toggleActiveForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
export const links = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: links.url(options),
    method: 'get',
})

links.definition = {
    methods: ["get","head"],
    url: '/users/registration-links',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
links.url = (options?: RouteQueryOptions) => {
    return links.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
links.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: links.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
links.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: links.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
    const linksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: links.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
        linksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: links.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserManagementController::links
 * @see app/Http/Controllers/UserManagementController.php:197
 * @route '/users/registration-links'
 */
        linksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: links.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    links.form = linksForm
/**
* @see \App\Http\Controllers\UserManagementController::storeLink
 * @see app/Http/Controllers/UserManagementController.php:217
 * @route '/users/registration-links'
 */
export const storeLink = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLink.url(options),
    method: 'post',
})

storeLink.definition = {
    methods: ["post"],
    url: '/users/registration-links',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserManagementController::storeLink
 * @see app/Http/Controllers/UserManagementController.php:217
 * @route '/users/registration-links'
 */
storeLink.url = (options?: RouteQueryOptions) => {
    return storeLink.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::storeLink
 * @see app/Http/Controllers/UserManagementController.php:217
 * @route '/users/registration-links'
 */
storeLink.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLink.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserManagementController::storeLink
 * @see app/Http/Controllers/UserManagementController.php:217
 * @route '/users/registration-links'
 */
    const storeLinkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeLink.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::storeLink
 * @see app/Http/Controllers/UserManagementController.php:217
 * @route '/users/registration-links'
 */
        storeLinkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeLink.url(options),
            method: 'post',
        })
    
    storeLink.form = storeLinkForm
/**
* @see \App\Http\Controllers\UserManagementController::deleteLink
 * @see app/Http/Controllers/UserManagementController.php:240
 * @route '/users/registration-links/{link}'
 */
export const deleteLink = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteLink.url(args, options),
    method: 'delete',
})

deleteLink.definition = {
    methods: ["delete"],
    url: '/users/registration-links/{link}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserManagementController::deleteLink
 * @see app/Http/Controllers/UserManagementController.php:240
 * @route '/users/registration-links/{link}'
 */
deleteLink.url = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { link: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { link: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    link: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        link: typeof args.link === 'object'
                ? args.link.id
                : args.link,
                }

    return deleteLink.definition.url
            .replace('{link}', parsedArgs.link.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::deleteLink
 * @see app/Http/Controllers/UserManagementController.php:240
 * @route '/users/registration-links/{link}'
 */
deleteLink.delete = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteLink.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\UserManagementController::deleteLink
 * @see app/Http/Controllers/UserManagementController.php:240
 * @route '/users/registration-links/{link}'
 */
    const deleteLinkForm = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteLink.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::deleteLink
 * @see app/Http/Controllers/UserManagementController.php:240
 * @route '/users/registration-links/{link}'
 */
        deleteLinkForm.delete = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteLink.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteLink.form = deleteLinkForm
const users = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
toggleActive: Object.assign(toggleActive, toggleActive),
links: Object.assign(links, links),
storeLink: Object.assign(storeLink, storeLink),
deleteLink: Object.assign(deleteLink, deleteLink),
}

export default users