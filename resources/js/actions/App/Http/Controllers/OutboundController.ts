import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OutboundController::store
 * @see app/Http/Controllers/OutboundController.php:18
 * @route '/requests/{itemRequest}/outbound'
 */
export const store = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/requests/{itemRequest}/outbound',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OutboundController::store
 * @see app/Http/Controllers/OutboundController.php:18
 * @route '/requests/{itemRequest}/outbound'
 */
store.url = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{itemRequest}', parsedArgs.itemRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutboundController::store
 * @see app/Http/Controllers/OutboundController.php:18
 * @route '/requests/{itemRequest}/outbound'
 */
store.post = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OutboundController::store
 * @see app/Http/Controllers/OutboundController.php:18
 * @route '/requests/{itemRequest}/outbound'
 */
    const storeForm = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OutboundController::store
 * @see app/Http/Controllers/OutboundController.php:18
 * @route '/requests/{itemRequest}/outbound'
 */
        storeForm.post = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const OutboundController = { store }

export default OutboundController