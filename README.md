# @ramstack/pagelock
[![NPM](https://img.shields.io/npm/v/@ramstack/pagelock)](https://www.npmjs.com/package/@ramstack/pagelock)
[![MIT](https://img.shields.io/github/license/rameel/pagelock)](https://github.com/rameel/pagelock/blob/main/LICENSE)

`@ramstack/pagelock` is a simple utility for managing page scroll locking.
The library is around 750 bytes in size and has no external dependencies.

## Installation

### Using NPM
```sh
npm install --save @ramstack/pagelock
```

### Using CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@ramstack/pagelock@1/dist/pagelock.min.js"></script>
```

## Usage examples

#### Vanilla JS

```vue
<button onclick="show()">Show Modal</button>

<script>
    let release;

    async function show() {
        // Lock the page scroll before showing the modal dialog
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
 * The page scroll remains locked until the queue is empty. To forcibly release the page scroll,
 * bypassing the queue, call the {@link pageunlock} function with `force = true`.
 *
 * @returns {() => void} - A function to unlock the page scroll.
 * Subsequent calls to this release function are safe: it only releases its own lock
 * without affecting the others in the queue.
 */
function pagelock(): () => void;
```

```js
/**
 * Unlocks the page scroll. Unlike the release function returned by {@link pagelock},
 * this function removes locks from the end of the queue (one by one).
 *
 * @param {boolean} [force] - If `true`, forcibly unlocks the page scroll, clearing the entire queue.
 * Otherwise, only the most recent lock is released. Defaults to `false`.
 */
function pageunlock(force?: boolean): void;
```

## License
This package is released under the **MIT License**.
