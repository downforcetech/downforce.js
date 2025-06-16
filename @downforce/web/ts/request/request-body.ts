import {whenSome} from '@downforce/std/optional'

export function createFormData(data: Record<string, string | Blob | File>): FormData {
    const formData = new FormData()

    for (const key in data) {
        const value = data[key]
        whenSome(value, value => formData.append(key, value))
    }

    return formData
}
