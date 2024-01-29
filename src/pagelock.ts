let locks: Array<number> = [];
let sequence: number = 0;

let width: string;

let props: {
    overflow: string,
    paddingRight: string
} | null | undefined;

/**
 * Locks the page scroll. Subsequent calls to the function add to the queue of lock holders.
 * Page scroll remains locked until the queue is empty. To forcibly release the page scroll,
 * bypassing the queue, call the {@link pageunlock} function with `force = true`.
 *
 * @returns {() => void} - A function to unlock the page scroll.
 * Subsequent calls to the release function are safe and only release its own captured lock,
 * without affecting the other locks in the queue.
 */
export function pagelock(): () => void {
    if (!props) {
        const {
            offsetHeight,
            clientHeight
        } = document.documentElement;

        const style = document.body.style;
        props = {
            overflow: style.overflow,
            paddingRight: style.paddingRight
        };

        if (offsetHeight > clientHeight) {
            style.paddingRight = scrollbarWidth();
        }

        style.overflow = "hidden";
    }

    const seq = ++sequence;
    locks.push(seq);

    return () => {
        locks = locks.filter(v => v !== seq);
        restore();
    };
}

/**
 * Unlocks the page scroll. In contrast to the release function returned by {@link pagelock},
 * the {@link pageunlock} function sequentially clears the queue of lock holders.
 *
 * @param {boolean} [force] - If `true`, forcibly unlocks the page scroll, bypassing the queue;
 * otherwise, only the last lock in the queue will be released. The default is `false`.
 */
export function pageunlock(force?: boolean): void {
    force ? locks = [] : locks.pop();
    restore();
}

function restore(): void {
    if (props && !locks.length) {
        Object.assign(document.body.style, props);
        props = null;
    }
}

function scrollbarWidth(): string {
    if (!width) {
        const outer = document.createElement("div");
        outer.innerHTML = "<div style='width:80px;height:80px;position:absolute;left:-90px;top:-90px;overflow:auto'><div style='height:99px'></div></div>";
        const inner = outer.firstChild as HTMLDivElement;
        document.body.appendChild(outer);
        width = (inner.offsetWidth - inner.clientWidth) + "px";
        document.body.removeChild(outer);
    }

    return width;
}
