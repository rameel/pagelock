# Pagelock

The `@ramstack/pagelock` represents a simple utility for managing page scroll locking.
The library weighs around 750 bytes, and has no external dependencies.

## Installation

### Via NPM
```sh
npm install --save @ramstack/pagelock
```

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@ramstack/pagelock@1.0.0/dist/pagelock.min.js"></script>
```

## Usage examples

#### Vanilla JS

```html
<button onclick="show()">Show Modal</button>

<script>
    let release;

    async function show() {
        // Lock the page scroll before show modal dialog
        release = pagelock();

        await showModal();

        // Unlock the page scroll
        release();
    }
</script>
```

#### Vue

```vue
<script setup>

import { ref, watch } from "vue";
import { pagelock } from "@ramstack/pagelock";

let show = ref(false);
let release;

watch(show, value => {
  if (value) {
    // Lock page scroll
    release = pagelock();
  }
  else {
    // Unlock page scroll
    release?.();
  }
});

</script>

<template>
  <label>
    <input v-model="show" type="checkbox" />
    Lock page
  </label>
  <div style="height: 1000px; width: 100%">
  </div>
</template>
```

## Functions

```js
/**
 * Locks the page scroll. Subsequent calls to the function add to the queue of lock holders.
 * Page scroll remains locked until the queue is empty. To forcibly release the page scroll,
 * bypassing the queue, call the {@link pageunlock} function with `force = true`.
 *
 * @returns {() => void} - A function to unlock the page scroll.
 * Subsequent calls to the release function are safe and only release its own captured lock,
 * without affecting the other locks in the queue.
 */
function pagelock(): () => void;
```

```js
/**
 * Unlocks the page scroll. In contrast to the release function returned by {@link pagelock},
 * the {@link pageunlock} function sequentially clears the queue of lock holders.
 *
 * @param {boolean} [force] - If `true`, forcibly unlocks the page scroll, bypassing the queue;
 * otherwise, only the last lock in the queue will be released. The default is `false`.
 */
export declare function pageunlock(force?: boolean): void;
```

## License
This package is released under the **MIT License**.
