<script setup>
import { ref, onMounted } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import List from "~/components/List.vue";

const pageParam = ref(1)
const prevParam = ref(false)

const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam = 1 }) => {
    const prev = prevParam.value ? '&prev=true' : ''
    return fetch(`http://localhost:3001/api/items?page=${pageParam}${prev}`).then(res => res.json())
  },
  getNextPageParam: (lastPage) => lastPage.hasMore ? pageParam.value : undefined,
})

const loadMore = () => {
  if (hasNextPage.value) {
    pageParam.value += 1
    fetchNextPage({ pageParam: pageParam.value })
  }
}

onMounted(() => {
  fetchNextPage({ pageParam: pageParam.value })
})

const scrollCheck = () => {
  if (localStorage.getItem('scrollPosition')) {
    const savedPosition = parseInt(localStorage.getItem('scrollPosition'))

    const savedPositionPage = Math.ceil(savedPosition / 3000)
    if (pageParam.value !== savedPositionPage && savedPositionPage !== 0) {
      pageParam.value = savedPositionPage
      prevParam.value = true
      loadMore(savedPositionPage)

    } else {
      document.querySelector('.scroller').scrollTop = savedPosition
    }
  }
}

const scrolling = (event) => {
  localStorage.setItem('scrollPosition', event.target.scrollTop)
  if (hasNextPage.value && !isFetchingNextPage.value && (event.target.scrollHeight - event.target.scrollTop) < 1000) {
    loadMore()
  }
}

const isFirstRun = ref(true)
watch(data, (value) => {
  if (isFirstRun.value) {
    nextTick(() => {
      document.querySelector('.vue-recycle-scroller').addEventListener('scroll', scrolling)

      scrollCheck()
    })

    isFirstRun.value = false
  }
  if (prevParam.value) {
    prevParam.value = false
    nextTick(() => {
      document.querySelector('.scroller').scrollTop = parseInt(localStorage.getItem('scrollPosition'))
    })
  }
})
</script>

<template>

  <header>
    Infinite scroll
  </header>
  <main>
    <section class="info">
      Info
      <div>
        NuxtJs, Typescript, Vue-query, Faker-js, Express, vue-recycle-scroller, SCSS
      </div>
    </section>
    <section class="list">
      <List :list="data ? data.pages.flatMap(page => page.items) : []" />
    </section>
  </main>
</template>

<style lang="scss">
header {
  display: flex;
  max-width: 1200px;
  margin: auto;
  font-size: 32px;
}
main {
  display: flex;
  gap: 16px;
  max-width: 1200px;
  margin: auto;
  margin-top: 32px;

  section.info {
    width: 200px;
  }

  section.list {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 16px;
  }
}
</style>