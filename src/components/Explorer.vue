<template>
  <div class="vuefinder__explorer__container">
    <div
      v-if="app.view === 'list' || searchQuery.length"
      class="vuefinder__explorer__header"
    >
      <div
        @click="sortBy('basename')"
        class="vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
      >
        {{ t("Name") }}
        <SortIcon
          :direction="sort.order"
          v-show="sort.active && sort.column === 'basename'"
        />
      </div>
      <div
        v-if="!searchQuery.length"
        @click="sortBy('file_size')"
        class="vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
      >
        {{ t("Size") }}
        <SortIcon
          :direction="sort.order"
          v-show="sort.active && sort.column === 'file_size'"
        />
      </div>
      <div
        v-if="!searchQuery.length"
        @click="sortBy('last_modified')"
        class="vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
      >
        {{ t("Date") }}
        <SortIcon
          :direction="sort.order"
          v-show="sort.active && sort.column === 'last_modified'"
        />
      </div>
      <div
        v-if="searchQuery.length"
        @click="sortBy('path')"
        class="vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
      >
        {{ t("Filepath") }}
        <SortIcon
          :direction="sort.order"
          v-show="sort.active && sort.column === 'path'"
        />
      </div>
    </div>

    <div class="vuefinder__explorer__drag-item">
      <DragItem ref="dragImage" :count="ds.getCount()" />
    </div>

    <div
      :ref="ds.scrollBarContainer"
      class="vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container"
      :class="[
        { 'grid-view': app.view === 'grid' },
        { 'search-active': searchQuery.length }
      ]"
    >
      <div :ref="ds.scrollBar" class="vuefinder__explorer__scrollbar"></div>
    </div>

    <div
      :ref="ds.area"
      class="vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area"
      @contextmenu.self.prevent="
        app.emitter.emit('vf-contextmenu-show', {
          event: $event,
          items: ds.getSelected()
        })
      "
    >
      <!-- Search View -->
      <Item
        v-if="searchQuery.length"
        v-for="(item, index) in getItems()"
        :item="item"
        :index="index"
        :dragImage="dragImage"
        class="vf-item vf-item-list"
        @update:item="handleItemUpdate(item, $event)"
      >
        <div class="vuefinder__explorer__item-list-content">
          <div class="vuefinder__explorer__item-list-name">
            <ItemIcon :type="item.type" :small="app.compactListView" />
            <span class="vuefinder__explorer__item-name">{{
              item.basename
            }}</span>
          </div>
          <div class="vuefinder__explorer__item-path">{{ item.path }}</div>
        </div>
      </Item>
      <!-- List View -->
      <Item
        v-if="app.view === 'list' && !searchQuery.length"
        v-for="(item, index) in getItems()"
        :item="item"
        :index="index"
        :dragImage="dragImage"
        class="vf-item vf-item-list"
        draggable="true"
        :key="item.path"
        @update:item="handleItemUpdate(item, $event)"
      >
        <div class="vuefinder__explorer__item-list-content">
          <div class="vuefinder__explorer__item-list-name">
            <ItemIcon :type="item.type" :small="app.compactListView" />
            <span
              class="vuefinder__explorer__item-name"
              :title="itemTitle(item)"
            >
              {{ item.basename }}
              <span
                v-if="
                  ((item.mime_type || item.mimeType) ?? '').startsWith(
                    'audio'
                  ) && item.artist
                "
              >
                ({{ item.artist }}
                <span v-if="item.title"> - {{ item.title }}</span
                >)
              </span>
            </span>
          </div>
          <div class="vuefinder__explorer__item-size">
            {{ item.file_size ? app.filesize(item.file_size) : "" }}
            <span
              v-if="
                ((item.mime_type || item.mimeType) ?? '').startsWith('audio')
              "
            >
              ({{ secondsToTime(item.duration * 1000) }})
            </span>
          </div>
          <div class="vuefinder__explorer__item-date">
            {{ datetimestring(item.last_modified) }}
          </div>
        </div>
      </Item>
      <!-- Grid View -->
      <Item
        v-if="app.view === 'grid' && !searchQuery.length"
        v-for="(item, index) in getItems(false)"
        :item="item"
        :index="index"
        :dragImage="dragImage"
        class="vf-item vf-item-grid"
        draggable="true"
        @update:item="handleItemUpdate(item, $event)"
      >
        <div>
          <div class="vuefinder__explorer__item-grid-content">
            <img
              src="data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
              class="vuefinder__explorer__item-thumbnail lazy"
              v-if="
                ((item.mime_type || item.mimeType) ?? '').startsWith('image') &&
                app.showThumbnails
              "
              :data-src="app.requester.getPreviewUrl(app.fs.adapter, item)"
              :alt="item.basename"
              :key="item.path"
            />
            <ItemIcon :type="item.type" v-else />
            <div
              class="vuefinder__explorer__item-extension"
              v-if="
                !(
                  ((item.mime_type || item.mimeType) ?? '').startsWith(
                    'image'
                  ) && app.showThumbnails
                ) && item.type !== 'dir'
              "
            >
              {{ ext(item.extension) }}
            </div>
          </div>

          <span class="vuefinder__explorer__item-title break-all">
            {{ title_shorten(item.basename) }}
          </span>
        </div>
      </Item>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref
} from "vue";
import { useDebounceFn } from "@vueuse/core";
import secondsToTime from "format-duration";
import datetimestring from "../utils/datetimestring.js";
import title_shorten from "../utils/title_shorten.js";
import Toast from "./Toast.vue";
import LazyLoad from "vanilla-lazyload";
import SortIcon from "./SortIcon.vue";
import ItemIcon from "./ItemIcon.vue";
import DragItem from "./DragItem.vue";
import Item from "./Item.vue";

const app = inject("ServiceContainer");
const { t } = app.i18n;

const ext = item => item?.substring(0, 3);
const dragImage = ref(null);

const searchQuery = ref("");
const ds = app.dragSelect;

/** @type {import('vanilla-lazyload').ILazyLoadInstance} */
let vfLazyLoad;

app.emitter.on("vf-fullscreen-toggle", () => {
  ds.area.value.style.height = null;
});

app.emitter.on("vf-search-query", ({ newQuery }) => {
  searchQuery.value = newQuery;

  if (newQuery) {
    app.emitter.emit("vf-fetch", {
      params: {
        q: "search",
        adapter: app.fs.adapter,
        path: app.fs.data.dirname,
        filter: newQuery
      },
      onSuccess: data => {
        if (!data.files.length) {
          app.emitter.emit("vf-toast-push", {
            label: t("No search result found.")
          });
        }
      }
    });
  } else {
    app.emitter.emit("vf-fetch", {
      params: { q: "index", adapter: app.fs.adapter, path: app.fs.data.dirname }
    });
  }
});

const sort = computed(() => ({
  active: app.sortActive,
  column: app.sortColumn,
  order: app.sortOrder
}));

const getItems = (sorted = true) => {
  let directories = [...app.fs.data.files.filter(f => !f.isFile)],
    files = [...app.fs.data.files.filter(f => f.isFile)],
    column = sort.value.column,
    order = sort.value.order === "asc" ? 1 : -1;

  if (!sorted) {
    return [...directories, ...files];
  }

  const compare = (a, b) => {
    if (typeof a === "string" && typeof b === "string") {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  if (sort.value.active) {
    directories = directories
      .slice()
      .sort((a, b) => compare(a[column], b[column]) * order);
    files = files.slice().sort((a, b) => compare(a[column], b[column]) * order);
  }

  return [...directories, ...files];
};

const sortBy = column => {
  if (app.sortActive && sort.value.column === column) {
    app.sortActive = sort.value.order === "asc";
    app.sortColumn = column;
    app.sortOrder = "desc";
  } else {
    app.sortActive = true;
    app.sortColumn = column;
    app.sortOrder = "asc";
  }
};

const itemTitle = item => {
  let title = item.basename;
  if (item.artist) {
    title += ` (${item.artist}`;
    if (item.title) {
      title += ` - ${item.title}`;
    }
    title += ")";
  }
  return title;
};

const handleItemUpdate = useDebounceFn((item, newItem) => {
  const itemInCache = app.fs.data.cache[item.path];
  Object.assign(item, newItem);
  if (typeof itemInCache === "undefined") {
    app.fs.data.cache[item.path] = item;
  }
}, 1000);

onMounted(() => {
  vfLazyLoad = new LazyLoad(ds.area.value);
});

onUpdated(() => {
  vfLazyLoad.update();
});

onBeforeUnmount(() => {
  vfLazyLoad.destroy();
});
</script>
