import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import size from "rollup-plugin-bundle-size";
import stripComments from "strip-comments";
import terser from "@rollup/plugin-terser";
import typescript from '@rollup/plugin-typescript';

const production = process.env.NODE_ENV === "production";

const terserOptions = {
    output: {
        comments: false
    },
    compress: {
        passes: 5,
        ecma: 2020,
        drop_console: false,
        drop_debugger: true,
        pure_getters: true,
        arguments: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true
    }
};

const plugins = [
    resolve(),
    typescript(),
    size(),
    strip(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "__DEV": !production,
        preventAssignment: true
    })
];

export default [{
    input: "src/pagelock.ts",
    output: [{
        file: "dist/pagelock.esm.js",
        format: "esm"
    },{
        file: "dist/pagelock.esm.min.js",
        format: "esm",
        plugins: [terser(terserOptions)]
    }, {
        name: "window",
        file: "dist/pagelock.js",
        format: "iife",
        extend: true
    }, {
        name: "window",
        file: "dist/pagelock.min.js",
        format: "iife",
        extend: true,
        plugins: [terser(terserOptions)]
    }],
    plugins
}]

function strip() {
    return {
        name: "strip",
        transform(source) {
            return {
                code: stripComments(source)
            };
        }
    };
}
