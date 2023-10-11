<template>
    <div>
        <div class="grid grid-cols-2 lg:flex overflow-hidden divide-x divide-main-2 rounded-lg flex-row-revers bg-black bg-opacity-50">
            <button @click="video_editing_action('extract-audio')"
                :class="{'bg-main-2': edit_selected == 'extract-audio'}"
                class="px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2">
                Extract Audio
            </button>

            <button @click="video_editing_action('water-mark')"
                :class="{'bg-main-2': edit_selected == 'water-mark'}"
                class="px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2">
                Water Mark
            </button>

            <button @click="video_editing_action('filter')"
                :class="{'bg-main-2': edit_selected == 'filter'}"
                class="px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2">
                Filter
            </button>

            <button @click="video_editing_action('compress')"
                :class="{'bg-main-2': edit_selected == 'compress'}"
                class="px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2">
                Compress
            </button>

        </div>


    </div>
</template>
<script lang=ts>
import { Component, toNative, Vue, Emit, Prop } from 'vue-facing-decorator';
@Component({})
class ToolBarVideoEdit extends Vue {
    @Prop
    edit_selected: string = 'extract-audio'

    @Emit
    video_editing_action(action: string) {
        return action
    }
}
export default toNative(ToolBarVideoEdit)
</script>