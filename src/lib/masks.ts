export const maskPhone = (value: string) => {
    if (!value) return ""
    value = value.replace(/\D/g, "")
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d{4,5})(\d{4}).*/, "$1-$2")
    return value.substring(0, 15)
}

export const unmaskPhone = (value: string) => {
    return value.replace(/\D/g, "")
}
