import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string,
    initialValue: T| (() => T)) { //in use state we can pass a func or inital value

    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key)
        if (jsonValue == null) {
            if (typeof initialValue === 'function') {
                return (initialValue as () => T)()//this value will be a function that return type of T
            }
            else {
                return initialValue
            }
        }
        else {
            return JSON.parse(jsonValue)
        }

    })
    // checking if the value exist


    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))

    }, [value, key]) //everytime our value or  key changes we use the  useffect hook

    return [value, setValue] as [T, typeof setValue]

}