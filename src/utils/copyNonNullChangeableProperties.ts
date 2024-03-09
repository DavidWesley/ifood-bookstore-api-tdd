export function copyNonNullChangeableProperties<T extends object>(data: Partial<T>): Partial<Record<keyof T, Exclude<T[keyof T], undefined | null>>> {
    const partialProperties: Partial<Record<keyof T, Exclude<T[keyof T], undefined | null>>> = {}

    for (const key in data) {
        if (Reflect.has(data, key) && data[key] !== undefined) {
            partialProperties[key] = data[key] as Exclude<T[keyof T], undefined | null>
        }
    }

    return partialProperties
}
