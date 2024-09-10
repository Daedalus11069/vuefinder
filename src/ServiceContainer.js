import { computed, reactive } from "vue";
import mitt from "mitt";
import { buildRequester } from "./utils/ajax.js";
import { useStorage } from "./composables/useStorage.js";
import { useI18n } from "./composables/useI18n.js";
import { FEATURE_ALL_NAMES } from "./features.js";
import { version } from "./../package.json";
import {
  format as filesizeDefault,
  metricFormat as filesizeMetric
} from "./utils/filesize.js";
import useTheme from "./composables/useTheme.js";
import useModal from "./composables/useModal.js";
import useDragSelect from "./composables/useDragSelect.js";
import useData from "./composables/useData.js";
import { syncRef } from "@vueuse/core";

export default (props, models, options) => {
  const storage = useStorage(props.id);
  const emitter = mitt();
  const metricUnits = storage.getStore("metricUnits", false);
  const theme = useTheme(storage, props.theme);
  const supportedLocales = options.i18n;
  const initialLang = props.locale ?? options.locale;
  const adapter = storage.getStore("adapter");

  const setFeatures = features => {
    if (Array.isArray(features)) {
      return features;
    }
    return FEATURE_ALL_NAMES;
  };

  const persist = storage.getStore("persist-path", props.persist);

  const path = persist ? storage.getStore("path", props.path) : props.path;

  const returnVal = reactive({
    /**
     * Core properties
     * */

    // app version
    version: version,
    // root element
    root: null,
    // app id
    debug: props.debug,
    // Event Bus
    emitter: emitter,
    // storage
    storage: storage,
    // localization object
    i18n: useI18n(storage, initialLang, emitter, supportedLocales),
    // modal state
    modal: useModal(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: computed(() => useDragSelect()),
    // http object
    requester: buildRequester(props.request),
    // active features
    features: setFeatures(props.features),
    // view state
    view: storage.getStore("viewport", models.view.value),
    // fullscreen state
    fullScreen: storage.getStore("full-screen", props.fullScreen),
    // show tree view
    showTreeView: storage.getStore("show-tree-view", props.showTreeView),
    // pinnedFolders
    pinnedFolders: storage.getStore("pinned-folders", props.pinnedFolders),
    // treeViewData
    treeViewData: [],
    // selectButton state
    selectButton: props.selectButton,
    // max file size
    maxFileSize: props.maxFileSize,

    /**
     * Settings
     * */

    // theme state
    theme: theme,
    // unit state - for example: GB or GiB
    metricUnits: metricUnits,
    // human readable file sizes
    filesize: metricUnits ? filesizeMetric : filesizeDefault,
    // show large icons in list view
    compactListView: storage.getStore("compact-list-view", true),
    // persist state
    persist: persist,
    // show thumbnails
    showThumbnails: storage.getStore("show-thumbnails", props.showThumbnails),
    // file system
    fs: useData(adapter, path),
    // Sorting
    sortActive: false,
    sortColumn: "",
    sortOrder: "",
    // Additional select buttons
    additionalButtons: props.additionalButtons
  });

  const viewRef = computed({
    get() {
      return returnVal.view;
    },
    set(val) {
      returnVal.view = val;
    }
  });
  const sortRef = computed({
    get() {
      return {
        active: returnVal.sortActive,
        column: returnVal.sortColumn,
        order: returnVal.sortOrder
      };
    },
    set(val) {
      if (val) {
        returnVal.sortActive = val.active;
        returnVal.sortColumn = val.column;
        returnVal.sortOrder = val.order;
      }
    }
  });

  syncRef(models.view, viewRef);
  syncRef(models.sort, sortRef);

  return returnVal;
};
