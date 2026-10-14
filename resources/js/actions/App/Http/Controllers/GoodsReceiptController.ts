import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GoodsReceiptController::store
 * @see app/Http/Controllers/GoodsReceiptController.php:15
 * @route '/requests/{itemRequest}/receive'
 */
export const store = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/requests/{itemRequest}/receive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GoodsReceiptController::store
 * @see app/Http/Controllers/GoodsReceiptController.php:15
 * @route '/requests/{itemRequest}/receive'
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
* @see \App\Http\Controllers\GoodsReceiptController::store
 * @see app/Http/Controllers/GoodsReceiptController.php:15
 * @route '/requests/{itemRequest}/receive'
 */
store.post = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GoodsReceiptController::store
 * @see app/Http/Controllers/GoodsReceiptController.php:15
 * @route '/requests/{itemRequest}/receive'
 */
    const storeForm = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GoodsReceiptController::store
 * @see app/Http/Controllers/GoodsReceiptController.php:15
 * @route '/requests/{itemRequest}/receive'
 */
        storeForm.post = (args: { itemRequest: number | { id: number } } | [itemRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const GoodsReceiptController = { store }

export default GoodsReceiptController