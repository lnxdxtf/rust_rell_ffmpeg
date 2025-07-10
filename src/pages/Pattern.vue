<template>
    <div>
        <div class="p-4 rounded-md w-full h-full">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';
@Component({})
class Pattern extends Vue { }
export default toNative(Pattern);
</script>
