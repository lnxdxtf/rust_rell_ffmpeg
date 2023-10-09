<template>
    <div>
        <span id="ProgressLabel" class="sr-only">Loading</span>

        <span role="progressbar" aria-labelledby="ProgressLabel" aria-valuenow="75"
            class="relative block rounded-full bg-gray-200 dark:bg-gray-700">
            <span class="absolute inset-0 flex items-center justify-center text-[10px]/4">
                <span id="progress-percent" class="font-bold text-white"></span>            </span>

            <span id="progress-width" class="block h-4 rounded-full bg-indigo-600 text-center" style="width: 75%">
            </span>
        </span>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative, } from 'vue-facing-decorator';
@Component({})
class Progress extends Vue { }
export default toNative(Progress);
</script>