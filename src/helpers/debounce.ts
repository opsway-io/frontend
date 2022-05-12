export function debounce(fn: () => void, ms: number) {
    let timer: number | undefined;
    return () => {
        clearTimeout(timer);
        timer = setTimeout((_) => {
            timer = undefined;
            fn();
            console.log("yeah");
        }, ms);
    };
}
