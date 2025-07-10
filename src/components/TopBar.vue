<template>
    <div>
        <div class="w-full flex items-center border-b border-main-3 border-opacity-50 p-4">
            <div class="w-fit flex gap-4 items-center text-main-3 cursor-pointer">
                <i class="fa-brands fa-safari"></i>
                <span class="text-base flex font-bold pr-6">Browse</span>
                <i class="fa-solid fa-angle-down"></i>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';
@Component({})
class TopBar extends Vue { }
export default toNative(TopBar);
</script>
