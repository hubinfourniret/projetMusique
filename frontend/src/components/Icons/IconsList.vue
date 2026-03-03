<script setup>
defineProps({
  debutList:{ type: Boolean, default: false },

})


</script>

<template>
  <span v-if="debutList" class="flex items-start gap-0.5 text-white">

                <span
                    class="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[4px] border-t-transparent border-b-transparent border-l-white"
                ></span>

                <span class="flex flex-col gap-[2px]">
                  <span class="w-3 h-[3px] bg-white rounded-full"></span>
                  <span class="w-3 h-[1px] bg-white rounded-full"></span>
                  <span class="w-3 h-[1px] bg-white rounded-full"></span>
                </span>
              </span>


  <span v-if="!debutList" class="flex items-end gap-0.5 text-white">

                <span
                    class="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[4px] border-t-transparent border-b-transparent border-l-white"
                ></span>

                <span class="flex flex-col gap-[2px]">
                  <span class="w-3 h-[1px] bg-white rounded-full"></span>
                  <span class="w-3 h-[1px] bg-white rounded-full"></span>
                  <span class="w-3 h-[3px] bg-white rounded-full"></span>
                </span>
              </span>
</template>
