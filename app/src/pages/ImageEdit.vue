<template>
    <div>
        <Pattern>

        </Pattern>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Pattern from './Pattern.vue';

@Component({
    components: { Pattern }
})
class ImageEdit extends Vue { }
export default toNative(ImageEdit);
</script>
