function info(...args: any) {
    console.log(...args)
}

function error(...args: any) {
    console.error(...args)
}

export default {
    info,
    error
}