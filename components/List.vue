<script setup lang="ts">
import { ref } from 'vue'

const sortDirection = ref('none')

const props = defineProps({
  list: {
    required: true,
    type: Array
  }
})

const sortedList = computed(() => {
  if (sortDirection.value === 'none') {
    return props.list
  } else {
    return props.list.slice().sort((a, b) => {
      if (sortDirection.value === 'asc') {
        return a.views - b.views
      } else {
        return b.views - a.views
      }
    })
  }
})

const changeSort = (value: string) => {
  sortDirection.value = value
}

</script>

<template>
  <div class="buttons">
    <button @click="changeSort('none')">Default sort</button>
    <button @click="changeSort('asc')">Sort by views (asc)</button>
    <button @click="changeSort('desc')">Sort by views (desc)</button>

  </div>
  <RecycleScroller
      class="scroller"
      :items="sortedList"
      :item-size="60"
      key-field="id"
      v-slot="{ item }"
  >
    <img
        :src="item.avatar"
        class="avatar"
        alt="avatar"
    />
    <div class="user">
      {{ item.name }}
    </div>
    <div class="website">
      {{ item.website }}
    </div>
    <div class="views">
      {{ item.views }}
    </div>
  </RecycleScroller>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  gap: 16px;
}
.scroller {
  height: 500px; /* Пример высоты */
  overflow-y: auto;
  width: 100%;

  :deep( .vue-recycle-scroller__item-view) {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  img {
    height: 48px;
    width: 48px;
    object-fit: cover;
    border-radius: 50%;
  }

  .user {
    width: 200px;
  }

  .website {
    flex-grow: 1;
    flex-basis: 200px;
  }

  .views {
    width: 60px;
    padding-right: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>