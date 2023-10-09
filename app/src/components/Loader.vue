<template>
    <div>
        <div class="loader">
            <svg viewBox="0 0 80 80">
                <rect x="8" y="8" width="64" height="64"></rect>
            </svg>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative, } from 'vue-facing-decorator';
@Component({})
class Loader extends Vue { }
export default toNative(Loader);
</script>

<style lang="scss">
.loader {
    --path: #ffffff;
    --dot: #ff6200;
    --duration: 3s;
    width: 44px;
    height: 44px;
    position: relative;

    &:before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
        display: block;
        background: var(--dot);
        top: 37px;
        left: 19px;
        transform: translate(-18px, -18px);
        animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
    }

    svg {
        display: block;
        width: 100%;
        height: 100%;

        rect,
        polygon,
        circle {
            fill: none;
            stroke: var(--path);
            stroke-width: 10px;
            stroke-linejoin: round;
            stroke-linecap: round;
        }

        polygon {
            stroke-dasharray: 145 (221 - 145) 145 (221 - 145);
            stroke-dashoffset: 0;
            animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
        }

        rect {
            stroke-dasharray: (256 / 4 * 3) (256 / 4) (256 / 4 * 3) (256 / 4);
            stroke-dashoffset: 0;
            animation: pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
        }

        circle {
            stroke-dasharray: (200 / 4 * 3) (200 / 4) (200 / 4 * 3) (200 / 4);
            stroke-dashoffset: 75;
            animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
        }
    }

    &.triangle {
        width: 48px;

        &:before {
            left: 21px;
            transform: translate(-10px, -18px);
            animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
        }
    }
}

@keyframes pathRect {
    25% {
        stroke-dashoffset: 64;
    }

    50% {
        stroke-dashoffset: 128;
    }

    75% {
        stroke-dashoffset: 192;
    }

    100% {
        stroke-dashoffset: 256;
    }
}

@keyframes dotRect {
    25% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(18px, -18px);
    }

    75% {
        transform: translate(0, -36px);
    }

    100% {
        transform: translate(-18px, -18px);
    }
}


.loader {
    display: inline-block;
    margin: 0 16px;
}


* {
    box-sizing: border-box;

    &:before,
    &:after {
        box-sizing: border-box;
    }
}
</style>