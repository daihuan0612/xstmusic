const dom = {
    container: document.getElementById("mainContainer"),
    backgroundStage: document.getElementById("backgroundStage"),
    backgroundBaseLayer: document.getElementById("backgroundBaseLayer"),
    backgroundTransitionLayer: document.getElementById("backgroundTransitionLayer"),
    playlist: document.getElementById("playlist"),
    playlistItems: document.getElementById("playlistItems"),
    favorites: document.getElementById("favorites"),
    favoriteItems: document.getElementById("favoriteItems"),
    lyrics: document.getElementById("lyrics"),
    lyricsScroll: document.getElementById("lyricsScroll"),
    lyricsContent: document.getElementById("lyricsContent"),
    mobileInlineLyrics: document.getElementById("mobileInlineLyrics"),
    mobileInlineLyricsScroll: document.getElementById("mobileInlineLyricsScroll"),
    mobileInlineLyricsContent: document.getElementById("mobileInlineLyricsContent"),
    audioPlayer: document.getElementById("audioPlayer"),
    themeToggleButton: document.getElementById("themeToggleButton"),
    loadOnlineBtn: document.getElementById("loadOnlineBtn"),
    showPlaylistBtn: document.getElementById("showPlaylistBtn"),
    showLyricsBtn: document.getElementById("showLyricsBtn"),
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    sourceSelectButton: document.getElementById("sourceSelectButton"),
    sourceSelectLabel: document.getElementById("sourceSelectLabel"),
    sourceMenu: document.getElementById("sourceMenu"),
    searchResults: document.getElementById("searchResults"),
    searchResultsList: document.getElementById("searchResultsList"),
    notification: document.getElementById("notification"),
    albumCover: document.getElementById("albumCover"),
    currentSongTitle: document.getElementById("currentSongTitle"),
    currentSongArtist: document.getElementById("currentSongArtist"),
    debugInfo: document.getElementById("debugInfo"),
    importSelectedBtn: document.getElementById("importSelectedBtn"),
    importSelectedCount: document.getElementById("importSelectedCount"),
    importSelectedMenu: document.getElementById("importSelectedMenu"),
    importToPlaylist: document.getElementById("importToPlaylist"),
    importToFavorites: document.getElementById("importToFavorites"),
    importPlaylistBtn: document.getElementById("importPlaylistBtn"),
    exportPlaylistBtn: document.getElementById("exportPlaylistBtn"),
    importPlaylistInput: document.getElementById("importPlaylistInput"),
    clearPlaylistBtn: document.getElementById("clearPlaylistBtn"),
    mobileImportPlaylistBtn: document.getElementById("mobileImportPlaylistBtn"),
    mobileExportPlaylistBtn: document.getElementById("mobileExportPlaylistBtn"),
    playModeBtn: document.getElementById("playModeBtn"),
    playPauseBtn: document.getElementById("playPauseBtn"),
    progressBar: document.getElementById("progressBar"),
    currentTimeDisplay: document.getElementById("currentTimeDisplay"),
    durationDisplay: document.getElementById("durationDisplay"),
    volumeSlider: document.getElementById("volumeSlider"),
    volumeIcon: document.getElementById("volumeIcon"),
    qualityToggle: document.getElementById("qualityToggle"),
    playerQualityMenu: document.getElementById("playerQualityMenu"),
    qualityLabel: document.getElementById("qualityLabel"),
    mobileToolbarTitle: document.getElementById("mobileToolbarTitle"),
    mobileSearchToggle: document.getElementById("mobileSearchToggle"),
    mobileSearchClose: document.getElementById("mobileSearchClose"),
    mobilePanelClose: document.getElementById("mobilePanelClose"),
    mobileClearPlaylistBtn: document.getElementById("mobileClearPlaylistBtn"),
    mobilePlaylistActions: document.getElementById("mobilePlaylistActions"),
    mobileFavoritesActions: document.getElementById("mobileFavoritesActions"),
    mobileAddAllFavoritesBtn: document.getElementById("mobileAddAllFavoritesBtn"),
    mobileImportFavoritesBtn: document.getElementById("mobileImportFavoritesBtn"),
    mobileExportFavoritesBtn: document.getElementById("mobileExportFavoritesBtn"),
    mobileClearFavoritesBtn: document.getElementById("mobileClearFavoritesBtn"),
    mobileOverlayScrim: document.getElementById("mobileOverlayScrim"),
    mobileExploreButton: document.getElementById("mobileExploreButton"),
    mobileQualityToggle: document.getElementById("mobileQualityToggle"),
    mobileQualityLabel: document.getElementById("mobileQualityLabel"),
    mobilePanel: document.getElementById("mobilePanel"),
    mobileQueueToggle: document.getElementById("mobileQueueToggle"),
    shuffleToggleBtn: document.getElementById("shuffleToggleBtn"),
    searchArea: document.getElementById("searchArea"),
    libraryTabs: Array.from(document.querySelectorAll(".playlist-tab[data-target]")),
    addAllFavoritesBtn: document.getElementById("addAllFavoritesBtn"),
    importFavoritesBtn: document.getElementById("importFavoritesBtn"),
    exportFavoritesBtn: document.getElementById("exportFavoritesBtn"),
    importFavoritesInput: document.getElementById("importFavoritesInput"),
    clearFavoritesBtn: document.getElementById("clearFavoritesBtn"),
    currentFavoriteToggle: document.getElementById("currentFavoriteToggle"),
};

window.SolaraDom = dom;

const isMobileView = Boolean(window.__SOLARA_IS_MOBILE);

const mobileBridge = window.SolaraMobileBridge || {};
mobileBridge.handlers = mobileBridge.handlers || {};
mobileBridge.queue = Array.isArray(mobileBridge.queue) ? mobileBridge.queue : [];
window.SolaraMobileBridge = mobileBridge;

function invokeMobileHook(name, ...args) {
    if (!isMobileView) {
        return undefined;
    }
    const handler = mobileBridge.handlers[name];
    if (typeof handler === "function") {
        return handler(...args);
    }
    mobileBridge.queue.push({ name, args });
    return undefined;
}

function initializeMobileUI() {
    return invokeMobileHook("initialize");
}

function updateMobileToolbarTitle() {
    return invokeMobileHook("updateToolbarTitle");
}

function runAfterOverlayFrame(callback) {
    if (typeof callback !== "function" || !isMobileView) {
        return;
    }
    const runner = () => {
        if (!document.body) {
            return;
        }
        callback();
    };
    if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(runner);
    } else {
        window.setTimeout(runner, 0);
    }
}

function syncMobileOverlayVisibility() {
    if (!isMobileView || !document.body) {
        return;
    }
    const searchOpen = document.body.classList.contains("mobile-search-open");
    const panelOpen = document.body.classList.contains("mobile-panel-open");
    if (dom.searchArea) {
        dom.searchArea.setAttribute("aria-hidden", searchOpen ? "false" : "true");
    }
    if (dom.mobileOverlayScrim) {
        dom.mobileOverlayScrim.setAttribute("aria-hidden", (searchOpen || panelOpen) ? "false" : "true");
    }
}

function updateMobileClearPlaylistVisibility() {
    if (!isMobileView) {
        return;
    }
    const button = dom.mobileClearPlaylistBtn;
    if (!button) {
        return;
    }
    const playlistElement = dom.playlist;
    const body = document.body;
    const currentView = body ? body.getAttribute("data-mobile-panel-view") : null;
    const isPlaylistView = !body || !currentView || currentView === "playlist";
    const playlistSongs = (typeof state !== "undefined" && Array.isArray(state.playlistSongs)) ? state.playlistSongs : [];
    const isEmpty = playlistSongs.length === 0 || !playlistElement || playlistElement.classList.contains("empty");
    const isPlaylistVisible = Boolean(playlistElement && !playlistElement.hasAttribute("hidden"));
    const shouldShow = isPlaylistView && isPlaylistVisible && !isEmpty;
    button.hidden = !shouldShow;
    button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
}

function updateMobileLibraryActionVisibility(showFavorites) {
    if (!isMobileView) {
        return;
    }
    const playlistGroup = dom.mobilePlaylistActions;
    const favoritesGroup = dom.mobileFavoritesActions;
    const showFavoritesGroup = Boolean(showFavorites);

    if (playlistGroup) {
        if (showFavoritesGroup) {
            playlistGroup.setAttribute("hidden", "");
            playlistGroup.setAttribute("aria-hidden", "true");
        } else {
            playlistGroup.removeAttribute("hidden");
            playlistGroup.setAttribute("aria-hidden", "false");
        }
    }

    if (favoritesGroup) {
        if (showFavoritesGroup) {
            favoritesGroup.removeAttribute("hidden");
            favoritesGroup.setAttribute("aria-hidden", "false");
        } else {
            favoritesGroup.setAttribute("hidden", "");
            favoritesGroup.setAttribute("aria-hidden", "true");
        }
    }
}

function forceCloseMobileSearchOverlay() {
    if (!isMobileView || !document.body) {
        return;
    }
    document.body.classList.remove("mobile-search-open");
    if (dom.searchInput) {
        dom.searchInput.blur();
    }
    syncMobileOverlayVisibility();
}

function forceCloseMobilePanelOverlay() {
    if (!isMobileView || !document.body) {
        return;
    }
    document.body.classList.remove("mobile-panel-open");
    syncMobileOverlayVisibility();
}

function openMobileSearch() {
    return invokeMobileHook("openSearch");
}

function closeMobileSearch() {
    const result = invokeMobileHook("closeSearch");
    runAfterOverlayFrame(forceCloseMobileSearchOverlay);
    return result;
}

function toggleMobileSearch() {
    return invokeMobileHook("toggleSearch");
}

function openMobilePanel(view = "playlist") {
    return invokeMobileHook("openPanel", view);
}

function closeMobilePanel() {
    const result = invokeMobileHook("closePanel");
    runAfterOverlayFrame(forceCloseMobilePanelOverlay);
    return result;
}

function toggleMobilePanel(view = "playlist") {
    return invokeMobileHook("togglePanel", view);
}

function closeAllMobileOverlays() {
    const result = invokeMobileHook("closeAllOverlays");
    runAfterOverlayFrame(() => {
        forceCloseMobileSearchOverlay();
        forceCloseMobilePanelOverlay();
    });
    return result;
}

function updateMobileInlineLyricsAria(isOpen) {
    if (!dom.mobileInlineLyrics) {
        return;
    }
    dom.mobileInlineLyrics.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

function setMobileInlineLyricsOpen(isOpen) {
    if (!isMobileView || !document.body || !dom.mobileInlineLyrics) {
        return;
    }
    state.isMobileInlineLyricsOpen = Boolean(isOpen);
    document.body.classList.toggle("mobile-inline-lyrics-open", Boolean(isOpen));
    updateMobileInlineLyricsAria(Boolean(isOpen));
}

function hasInlineLyricsContent() {
    const content = dom.mobileInlineLyricsContent;
    if (!content) {
        return false;
    }
    return content.textContent.trim().length > 0;
}

function canOpenMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return false;
    }
    const hasSong = Boolean(state.currentSong);
    return hasSong && hasInlineLyricsContent();
}

function closeMobileInlineLyrics(options = {}) {
    if (!isMobileView || !document.body) {
        return false;
    }
    if (!document.body.classList.contains("mobile-inline-lyrics-open")) {
        updateMobileInlineLyricsAria(false);
        state.isMobileInlineLyricsOpen = false;
        return false;
    }
    setMobileInlineLyricsOpen(false);
    if (options.force) {
        state.userScrolledLyrics = false;
    }
    return true;
}

function openMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return false;
    }
    if (!canOpenMobileInlineLyrics()) {
        return false;
    }
    setMobileInlineLyricsOpen(true);
    state.userScrolledLyrics = false;
    window.requestAnimationFrame(() => {
        const container = dom.mobileInlineLyricsScroll || dom.mobileInlineLyrics;
        const activeLyric = dom.mobileInlineLyricsContent?.querySelector(".current") ||
            dom.mobileInlineLyricsContent?.querySelector("div[data-index]");
        if (container && activeLyric) {
            scrollToCurrentLyric(activeLyric, container);
        }
    });
    syncLyrics();
    return true;
}

function toggleMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return;
    }
    if (document.body.classList.contains("mobile-inline-lyrics-open")) {
        closeMobileInlineLyrics();
    } else {
        openMobileInlineLyrics();
    }
}

const PLACEHOLDER_HTML = `<div class="placeholder"><i class="fas fa-music"></i></div>`;
const paletteCache = new Map();
const PALETTE_STORAGE_KEY = "paletteCache.v1";
let paletteAbortController = null;
const BACKGROUND_TRANSITION_DURATION = 850;
let backgroundTransitionTimer = null;
const PALETTE_APPLY_DELAY = 140;
let pendingPaletteTimer = null;
let deferredPaletteHandle = null;
let deferredPaletteType = "";
let deferredPaletteUrl = null;
const themeDefaults = {
    light: {
        gradient: "",
        primaryColor: "",
        primaryColorDark: "",
    },
    dark: {
        gradient: "",
        primaryColor: "",
        primaryColorDark: "",
    }
};
let paletteRequestId = 0;

const REMOTE_STORAGE_ENDPOINT = "/api/storage";
let remoteSyncEnabled = false;
const STORAGE_KEYS_TO_SYNC = new Set([
    "playlistSongs",
    "currentTrackIndex",
    "playMode",
    "playbackQuality",
    "playerVolume",
    "currentPlaylist",
    "currentList",
    "currentSong",
    "currentPlaybackTime",
    "favoriteSongs",
    "currentFavoriteIndex",
    "favoritePlayMode",
    "favoritePlaybackTime",
    "searchSource",
    "lastSearchState.v1",
]);

function createPersistentStorageClient() {
    let availabilityPromise = null;
    let remoteAvailable = false;

    const checkAvailability = async () => {
        if (availabilityPromise) {
            return availabilityPromise;
        }
        availabilityPromise = (async () => {
            try {
                const url = new URL(REMOTE_STORAGE_ENDPOINT, window.location.origin);
                url.searchParams.set("status", "1");
                const response = await fetch(url.toString(), { method: "GET" });
                if (!response.ok) {
                    return false;
                }
                const result = await response.json().catch(() => ({}));
                remoteAvailable = Boolean(result && result.d1Available);
                return remoteAvailable;
            } catch (error) {
                console.warn("妫€鏌ヨ繙绋嬪瓨鍌ㄥ彲鐢ㄦ€уけ璐?, error);
                return false;
            }
        })();
        return availabilityPromise;
    };

    const getItems = async (keys = []) => {
        const available = await checkAvailability();
        if (!available || !Array.isArray(keys) || keys.length === 0) {
            return null;
        }
        try {
            const url = new URL(REMOTE_STORAGE_ENDPOINT, window.location.origin);
            url.searchParams.set("keys", keys.join(","));
            const response = await fetch(url.toString(), { method: "GET" });
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.warn("鑾峰彇杩滅▼瀛樺偍鏁版嵁澶辫触", error);
            return null;
        }
    };

    const setItems = async (items) => {
        const available = await checkAvailability();
        if (!available || !items || typeof items !== "object") {
            return false;
        }
        try {
            await fetch(REMOTE_STORAGE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: items }),
            });
            return true;
        } catch (error) {
            console.warn("鍐欏叆杩滅▼瀛樺偍澶辫触", error);
            return false;
        }
    };

    const removeItems = async (keys = []) => {
        const available = await checkAvailability();
        if (!available || !Array.isArray(keys) || keys.length === 0) {
            return false;
        }
        try {
            await fetch(REMOTE_STORAGE_ENDPOINT, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keys }),
            });
            return true;
        } catch (error) {
            console.warn("鍒犻櫎杩滅▼瀛樺偍鏁版嵁澶辫触", error);
            return false;
        }
    };

    return {
        checkAvailability,
        getItems,
        setItems,
        removeItems,
    };
}

const persistentStorage = createPersistentStorageClient();

function shouldSyncStorageKey(key) {
    return STORAGE_KEYS_TO_SYNC.has(key);
}

function persistStorageItems(items) {
    if (!items || typeof items !== "object") {
        return;
    }
    persistentStorage.setItems(items).catch((error) => {
        console.warn("鍚屾杩滅▼瀛樺偍澶辫触", error);
    });
}

function removePersistentItems(keys = []) {
    if (!Array.isArray(keys) || keys.length === 0) {
        return;
    }
    persistentStorage.removeItems(keys).catch((error) => {
        console.warn("绉婚櫎杩滅▼瀛樺偍鏁版嵁澶辫触", error);
    });
}

function safeGetLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`璇诲彇鏈湴瀛樺偍澶辫触: ${key}`, error);
        return null;
    }
}

function safeSetLocalStorage(key, value, options = {}) {
    const { skipRemote = false } = options;
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn(`鍐欏叆鏈湴瀛樺偍澶辫触: ${key}`, error);
    }
    if (!skipRemote && remoteSyncEnabled && shouldSyncStorageKey(key)) {
        persistStorageItems({ [key]: value });
    }
}

function safeRemoveLocalStorage(key, options = {}) {
    const { skipRemote = false } = options;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`绉婚櫎鏈湴瀛樺偍澶辫触: ${key}`, error);
    }
    if (!skipRemote && remoteSyncEnabled && shouldSyncStorageKey(key)) {
        removePersistentItems([key]);
    }
}

function parseJSON(value, fallback) {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch (error) {
        console.warn("瑙ｆ瀽鏈湴瀛樺偍 JSON 澶辫触", error);
        return fallback;
    }
}

function cloneSearchResults(results) {
    if (!Array.isArray(results)) {
        return [];
    }
    try {
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.warn("澶嶅埗鎼滅储缁撴灉澶辫触锛屽洖閫€鍒版祬鎷疯礉", error);
        return results.map((item) => {
            if (item && typeof item === "object") {
                return { ...item };
            }
            return item;
        });
    }
}

function sanitizeStoredSearchState(data, defaultSource = SOURCE_OPTIONS[0].value) {
    if (!data || typeof data !== "object") {
        return null;
    }

    const keyword = typeof data.keyword === "string" ? data.keyword : "";
    const sourceValue = typeof data.source === "string" ? data.source : defaultSource;
    const source = normalizeSource(sourceValue);
    const page = Number.isInteger(data.page) && data.page > 0 ? data.page : 1;
    const hasMore = typeof data.hasMore === "boolean" ? data.hasMore : true;
    const results = cloneSearchResults(data.results);

    return { keyword, source, page, hasMore, results };
}

function loadStoredPalettes() {
    const stored = safeGetLocalStorage(PALETTE_STORAGE_KEY);
    if (!stored) {
        return;
    }

    try {
        const entries = JSON.parse(stored);
        if (Array.isArray(entries)) {
            for (const entry of entries) {
                if (Array.isArray(entry) && typeof entry[0] === "string" && entry[1] && typeof entry[1] === "object") {
                    paletteCache.set(entry[0], entry[1]);
                }
            }
        }
    } catch (error) {
        console.warn("瑙ｆ瀽璋冭壊鏉跨紦瀛樺け璐?, error);
    }
}

function persistPaletteCache() {
    const maxEntries = 20;
    const entries = Array.from(paletteCache.entries()).slice(-maxEntries);
    try {
        safeSetLocalStorage(PALETTE_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.warn("淇濆瓨璋冭壊鏉跨紦瀛樺け璐?, error);
    }
}

function preferHttpsUrl(url) {
    if (!url || typeof url !== "string") return url;

    try {
        const parsedUrl = new URL(url, window.location.href);
        if (parsedUrl.protocol === "http:" && window.location.protocol === "https:") {
            parsedUrl.protocol = "https:";
            return parsedUrl.toString();
        }
        return parsedUrl.toString();
    } catch (error) {
        if (window.location.protocol === "https:" && url.startsWith("http://")) {
            return "https://" + url.substring("http://".length);
        }
        return url;
    }
}

function toAbsoluteUrl(url) {
    if (!url) {
        return "";
    }

    try {
        const absolute = new URL(url, window.location.href);
        return absolute.href;
    } catch (_) {
        return url;
    }
}

function buildAudioProxyUrl(url) {
    if (!url || typeof url !== "string") return url;

    try {
        const parsedUrl = new URL(url, window.location.href);
        // 鏂癆PI杩斿洖鐨刄RL宸茬粡鏄畬鏁寸殑浠ｇ悊URL锛屼笉闇€瑕侀澶栧鐞?        return parsedUrl.toString();
    } catch (error) {
        console.warn("鏃犳硶瑙ｆ瀽闊抽鍦板潃锛岃烦杩囦唬鐞?, error);
        return url;
    }
}

// 涓篞Q闊充箰绛夌壒娈婃簮鏋勫缓鍥剧墖浠ｇ悊URL
function buildImageProxyUrl(url) {
    if (!url || typeof url !== "string") return url;
    
    // 濡傛灉URL宸茬粡鏄綋鍓嶅煙鍚嶄笅鐨勶紝涓嶉渶瑕佷唬鐞?    try {
        const parsedUrl = new URL(url, window.location.href);
        if (parsedUrl.origin === window.location.origin) {
            return url;
        }
        
        // 瀵逛簬澶栭儴鍥剧墖锛屽皾璇曢€氳繃API浠ｇ悊
        const proxyUrl = new URL('/api/proxy', window.location.origin);
        proxyUrl.searchParams.set('url', encodeURIComponent(url));
        return proxyUrl.toString();
    } catch (error) {
        console.warn("鏃犳硶鏋勫缓鍥剧墖浠ｇ悊URL锛岃繑鍥炲師URL", error);
        return url;
    }
}

const SOURCE_OPTIONS = [
    { value: "netease", label: "缃戞槗浜戦煶涔? },
    // { value: "kuwo", label: "閰锋垜闊充箰" }, // 閰锋垜闊充箰鍔熻兘鏆傛湭淇锛屽凡绂佺敤
    { value: "qq", label: "QQ闊充箰" }
];

function normalizeSource(value) {
    const allowed = SOURCE_OPTIONS.map(option => option.value);
    return allowed.includes(value) ? value : SOURCE_OPTIONS[0].value;
}

const QUALITY_OPTIONS = [
    { value: "mp3", label: "MP3闊宠川", description: "鑷姩閫夋嫨" },
    { value: "999", label: "鏃犳崯闊宠川", description: "FLAC" },
    { value: "flac", label: "鏃犳崯闊宠川", description: "FLAC" },
    { value: "flac24bit", label: "Hi-Res闊宠川", description: "FLAC24bit" }
];

function normalizeQuality(value) {
    // 澶勭悊MP3閫夐」锛岃繑鍥為粯璁ょ殑MP3璐ㄩ噺
    if (value === "mp3") {
        return "mp3";
    }
    
    const match = QUALITY_OPTIONS.find(option => option.value === value);
    return match ? match.value : "mp3";
}

const savedPlaylistSongs = (() => {
    const stored = safeGetLocalStorage("playlistSongs");
    const playlist = parseJSON(stored, []);
    return Array.isArray(playlist) ? playlist : [];
})();

const PLAYLIST_EXPORT_VERSION = 1;

const savedFavoriteSongs = (() => {
    const stored = safeGetLocalStorage("favoriteSongs");
    const favorites = parseJSON(stored, []);
    return Array.isArray(favorites) ? favorites : [];
})();

const FAVORITE_EXPORT_VERSION = 1;

const savedCurrentFavoriteIndex = (() => {
    const stored = safeGetLocalStorage("currentFavoriteIndex");
    const index = Number.parseInt(stored, 10);
    return Number.isInteger(index) && index >= 0 ? index : 0;
})();

const savedFavoritePlayMode = (() => {
    const stored = safeGetLocalStorage("favoritePlayMode");
    const normalized = stored === "order" ? "list" : stored;
    const modes = ["list", "single", "random"];
    return modes.includes(normalized) ? normalized : "list";
})();

const savedFavoritePlaybackTime = (() => {
    const stored = safeGetLocalStorage("favoritePlaybackTime");
    const time = Number.parseFloat(stored);
    return Number.isFinite(time) && time >= 0 ? time : 0;
})();

const savedCurrentList = (() => {
    const stored = safeGetLocalStorage("currentList");
    return stored === "favorite" ? "favorite" : "playlist";
})();

const savedCurrentTrackIndex = (() => {
    const stored = safeGetLocalStorage("currentTrackIndex");
    const index = Number.parseInt(stored, 10);
    return Number.isInteger(index) ? index : -1;
})();

const savedPlayMode = (() => {
    const stored = safeGetLocalStorage("playMode");
    const modes = ["list", "single", "random"];
    return modes.includes(stored) ? stored : "list";
})();

const savedPlaybackQuality = normalizeQuality(safeGetLocalStorage("playbackQuality"));

const savedVolume = (() => {
    const stored = safeGetLocalStorage("playerVolume");
    const volume = Number.parseFloat(stored);
    if (Number.isFinite(volume)) {
        return Math.min(Math.max(volume, 0), 1);
    }
    return 0.8;
})();

const savedSearchSource = (() => {
    const stored = safeGetLocalStorage("searchSource");
    return normalizeSource(stored);
})();

const LAST_SEARCH_STATE_STORAGE_KEY = "lastSearchState.v1";

const savedLastSearchState = (() => {
    const stored = safeGetLocalStorage(LAST_SEARCH_STATE_STORAGE_KEY);
    const parsed = parseJSON(stored, null);
    return sanitizeStoredSearchState(parsed, savedSearchSource || SOURCE_OPTIONS[0].value);
})();

let lastSearchStateCache = savedLastSearchState
    ? { ...savedLastSearchState, results: cloneSearchResults(savedLastSearchState.results) }
    : null;

const savedPlaybackTime = (() => {
    const stored = safeGetLocalStorage("currentPlaybackTime");
    const time = Number.parseFloat(stored);
    return Number.isFinite(time) && time >= 0 ? time : 0;
})();

const savedCurrentSong = (() => {
    const stored = safeGetLocalStorage("currentSong");
    return parseJSON(stored, null);
})();

const savedCurrentPlaylist = (() => {
    const stored = safeGetLocalStorage("currentPlaylist");
    const playlists = ["playlist", "online", "search", "favorites"];
    return playlists.includes(stored) ? stored : "playlist";
})();

// API閰嶇疆 - 绗﹀悎TuneHub API瑙勮寖
const API = {
    baseUrl: "https://music-dl.sayqz.com",

    fetchJson: async (url, options = {}) => {
        const maxRetries = options.maxRetries || 3;
        const retryDelay = options.retryDelay || 1000;
        const timeout = options.timeout || 30000;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                debugLog(`API璇锋眰 (灏濊瘯 ${attempt}/${maxRetries}): ${url}`);
                
                // 娣诲姞 timeout 鏀寔
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeout);
                
                const response = await fetch(url, {
                    headers: {
                        "Accept": "application/json",
                        ...options.headers,
                    },
                    mode: 'cors', // 娣诲姞 cors 妯″紡鏀寔
                    signal: controller.signal,
                    ...options,
                });
                
                clearTimeout(id); // 娓呴櫎 timeout

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const text = await response.text();
                try {
                    // 妫€鏌ュ搷搴斿唴瀹规槸鍚︿负绌烘垨鏃犳晥
                    if (!text || text.trim().length === 0) {
                        console.warn("鍝嶅簲鍐呭涓虹┖锛岃繑鍥瀗ull");
                        return null;
                    }
                    return JSON.parse(text);
                } catch (parseError) {
                    console.warn("JSON parse failed, returning raw text", parseError);
                    // 瀵逛簬闈濲SON鍝嶅簲锛堝闊抽鏂囦欢锛夛紝鐩存帴杩斿洖鍘熷鏂囨湰
                    return text;
                }
            } catch (error) {
                debugLog(`API璇锋眰澶辫触 (灏濊瘯 ${attempt}/${maxRetries}): ${error.message}`);
                if (attempt < maxRetries) {
                    debugLog(`绛夊緟 ${retryDelay}ms 鍚庨噸璇?..`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                } else {
                    console.error("API璇锋眰鏈€缁堝け璐?", error);
                    throw error;
                }
            }
        }
    },

    search: async (keyword, source = "netease", count = 20, page = 1) => {
        const url = `${API.baseUrl}/api/?source=${source}&type=search&keyword=${encodeURIComponent(keyword)}&limit=${count}`;

        try {
            debugLog(`API璇锋眰: ${url}`);
            const data = await API.fetchJson(url);
            debugLog(`API鍝嶅簲: ${JSON.stringify(data).substring(0, 200)}...`);

            if (!data || data.code !== 200 || !Array.isArray(data.data.results)) {
                throw new Error("鎼滅储缁撴灉鏍煎紡閿欒");
            }

            return data.data.results.map(song => ({
                id: song.id,
                name: song.name,
                artist: song.artist,
                album: song.album,
                source: song.platform || source,
                // 鏂癆PI杩斿洖鐨刄RL宸茬粡鏄畬鏁寸殑API閾炬帴锛屾垜浠渶瑕佹彁鍙杋d鐢ㄤ簬鍚庣画璇锋眰
                pic_id: song.id,
                url_id: song.id,
                lyric_id: song.id,
            }));
        } catch (error) {
            debugLog(`API閿欒: ${error.message}`);
            throw error;
        }
    },

    getRadarPlaylist: async (playlistId = "3778678", options = {}) => {
        const url = `${API.baseUrl}/api/?source=netease&id=${playlistId}&type=playlist`;

        try {
            const data = await API.fetchJson(url);
            const tracks = data && data.code === 200 && data.data && Array.isArray(data.data.list)
                ? data.data.list
                : [];

            if (tracks.length === 0) throw new Error("No tracks found");

            return tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artist || "",
                album: track.album || "",
                source: "netease",
                lyric_id: track.id,
                pic_id: track.id,
            }));
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    },

    getSongUrl: (song, quality = "320") => {
        console.log('馃幍 getSongUrl璋冪敤:', song, '璐ㄩ噺:', quality);
        
        // 鏍规嵁API鏂囨。锛宷uality鍙傛暟闇€瑕佹槧灏勪负128k, 192k, 320k, flac, flac24bit
        const qualityMap = {
            "128": "128k",
            "192": "192k",
            "320": "320k",
            "999": "flac",
            "flac": "flac", // 娣诲姞flac鍒皅ualityMap锛岀‘淇漟lac璐ㄩ噺鍙傛暟鑳芥纭槧灏?            "flac24bit": "flac24bit" // 娣诲姞flac24bit鏀寔
        };
        
        // 澶勭悊MP3閫夐」锛岃繑鍥為粯璁ょ殑MP3璐ㄩ噺
        if (quality === "mp3") {
            quality = "320";
        }
        
        // 纭繚浣跨敤鏈夋晥鐨勯煶璐ㄦ槧灏勶紝鏀寔192k鍜宖lac
        console.log('馃搳 qualityMap:', qualityMap, 'quality:', quality, 'quality in qualityMap:', quality in qualityMap);
        const validQuality = quality in qualityMap ? quality : "320";
        const br = qualityMap[validQuality];
        
        console.log('馃攧 璐ㄩ噺鏄犲皠:', quality, '->', validQuality, '->', br);
        
        // 鏋勫缓API URL锛屾敮鎸佷笉鍚岀被鍨嬬殑璇锋眰
        const url = `${API.baseUrl}/api/?source=${song.source || "netease"}&id=${song.id}&type=url&br=${br}`;
        console.log('馃寪 鐢熸垚鐨刄RL:', url);
        return url;
    },

    getLyric: (song) => {
        return `${API.baseUrl}/api/?source=${song.source || "netease"}&id=${song.id}&type=lrc`;
    },

    getPicUrl: (song) => {
        return `${API.baseUrl}/api/?source=${song.source || "netease"}&id=${song.id}&type=pic`;
    },

    getSongInfo: async (songId, source = "netease") => {
        const url = `${API.baseUrl}/api/?source=${source}&id=${songId}&type=info`;
        try {
            const data = await API.fetchJson(url);
            if (data && data.code === 200) {
                return data.data;
            }
            throw new Error("鑾峰彇姝屾洸淇℃伅澶辫触");
        } catch (error) {
            console.error("鑾峰彇姝屾洸淇℃伅閿欒:", error);
            throw error;
        }
    }
};

Object.freeze(API);

// ================================================
// 杈呭姪妫€娴嬪嚱鏁?// ================================================

// 妫€娴嬫槸鍚︿负 iOS PWA 鐙珛杩愯妯″紡
const isIOSPWA = () => {
    // 鏂规硶1锛歩OS Safari 鐨?navigator.standalone
    if (window.navigator.standalone === true) {
        return true;
    }
    
    // 鏂规硶2锛氭爣鍑嗙殑 display-mode: standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    
    // 鏂规硶3锛氭鏌ョ敤鎴蜂唬鐞?+ 鍏ㄥ睆妯″紡
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && (
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches
    )) {
        return true;
    }
    
    return false;
};

// 妫€娴嬫槸鍚﹂攣灞?鍚庡彴
const isLockScreen = () => document.visibilityState === 'hidden';

// 鍒ゆ柇鏄惁搴旇浣跨敤闅愯韩妯″紡
const shouldUseStealthMode = () => isIOSPWA() && isLockScreen();

// 鑾峰彇灏侀潰鍥剧墖鍒楄〃锛堢敤浜庨攣灞忔帶鍒跺彴锛?function getArtworkListForLockScreen(song) {
    // 纭繚浣跨敤鏈夋晥鐨勫皝闈RL锛屼紭鍏堥『搴忥細
    // 1. 褰撳墠宸插姞杞界殑灏侀潰
    // 2. 浠庢瓕鏇蹭俊鎭幏鍙栫殑灏侀潰
    // 3. 搴旂敤鍥炬爣锛堢‘淇濅娇鐢ㄧ粷瀵硅矾寰勶紝閬垮厤404锛?    let artworkUrl = state.currentArtworkUrl;
    if (!artworkUrl && song.pic_id) {
        artworkUrl = API.getPicUrl(song);
    }
    // 浣跨敤涓€涓彲闈犵殑榛樿鍥炬爣锛岀‘淇濆畠瀛樺湪
    if (!artworkUrl) {
        // 灏濊瘯浣跨敤favicon锛岀‘淇濅娇鐢ㄧ粷瀵硅矾寰?        artworkUrl = window.location.origin + '/favicon.png';
    }
    
    return [
        { src: artworkUrl, sizes: '512x512', type: 'image/png' },
        { src: artworkUrl, sizes: '384x384', type: 'image/png' },
        { src: artworkUrl, sizes: '256x256', type: 'image/png' },
        { src: artworkUrl, sizes: '192x192', type: 'image/png' }
    ];
}

const state = {
    onlineSongs: [],
    searchResults: cloneSearchResults(savedLastSearchState?.results) || [],
    renderedSearchCount: 0,
    currentTrackIndex: savedCurrentTrackIndex,
    currentAudioUrl: null,
    lyricsData: [],
    currentLyricLine: -1,
    currentPlaylist: savedCurrentPlaylist, // 'online', 'search', or 'playlist'
    searchPage: savedLastSearchState?.page || 1,
    searchKeyword: savedLastSearchState?.keyword || "", // 纭繚杩欓噷鏈夊垵濮嬪€?    searchSource: savedLastSearchState ? savedLastSearchState.source : savedSearchSource,
    hasMoreResults: typeof savedLastSearchState?.hasMore === "boolean" ? savedLastSearchState.hasMore : true,
    currentSong: savedCurrentSong,
    currentArtworkUrl: null,
    debugMode: false,
    isSearchMode: false, // 鏂板锛氭悳绱㈡ā寮忕姸鎬?    playlistSongs: savedPlaylistSongs, // 鏂板锛氱粺涓€鎾斁鍒楄〃
    playMode: savedPlayMode, // 鏂板锛氭挱鏀炬ā寮?'list', 'single', 'random'
    playlistLastNonRandomMode: savedPlayMode === "random" ? "list" : savedPlayMode,
    favoriteSongs: savedFavoriteSongs,
    isPlaying: false, // 鏂板锛氭挱鏀剧姸鎬佹爣蹇?    currentFavoriteIndex: savedCurrentFavoriteIndex,
    currentList: savedCurrentList,
    favoritePlayMode: savedFavoritePlayMode,
    favoriteLastNonRandomMode: savedFavoritePlayMode === "random" ? "list" : savedFavoritePlayMode,
    favoritePlaybackTime: savedFavoritePlaybackTime,
    playbackQuality: savedPlaybackQuality,
    volume: savedVolume,
    currentPlaybackTime: savedPlaybackTime,
    lastSavedPlaybackTime: savedPlaybackTime,
    favoriteLastSavedPlaybackTime: savedFavoritePlaybackTime,
    pendingSeekTime: null,
    isSeeking: false,
    qualityMenuOpen: false,
    sourceMenuOpen: false,
    userScrolledLyrics: false, // 鏂板锛氱敤鎴锋槸鍚︽墜鍔ㄦ粴鍔ㄦ瓕璇?    lyricsScrollTimeout: null, // 鏂板锛氭瓕璇嶆粴鍔ㄨ秴鏃?    themeDefaultsCaptured: false,
    dynamicPalette: null,
    currentPaletteImage: null,
    pendingPaletteData: null,
    pendingPaletteImage: null,
    pendingPaletteImmediate: false,
    pendingPaletteReady: false,
    audioReadyForPalette: true,
    currentGradient: '',
    isMobileInlineLyricsOpen: false,
    selectedSearchResults: new Set(),
    needUpdateOnUnlock: false, // 鏂板锛歩OS PWA 瑙ｉ攣鍚庢槸鍚﹂渶瑕佹洿鏂癠I
    pendingStealthUpdate: null, // 鏂板锛氶殣韬ā寮忎笅寰呮洿鏂扮殑淇℃伅
    forceUIUpdate: false, // 鏂板锛氬己鍒禪I鏇存柊鏍囧織
};

let importSelectedMenuOutsideHandler = null;

if (state.currentList === "favorite" && (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0)) {
    state.currentList = "playlist";
}
if (state.currentList === "favorite") {
    state.currentPlaylist = "favorites";
}
state.favoriteSongs = ensureFavoriteSongsArray()
    .map((song) => sanitizeImportedSong(song) || song)
    .filter((song) => song && typeof song === "object");
if (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0) {
    state.currentFavoriteIndex = 0;
} else if (state.currentFavoriteIndex >= state.favoriteSongs.length) {
    state.currentFavoriteIndex = state.favoriteSongs.length - 1;
}
saveFavoriteState();

async function bootstrapPersistentStorage() {
    // 绂佺敤杩滅▼瀛樺偍鍚屾锛岀‘淇濇瘡涓澶囩殑鎾斁鍒楄〃鐙珛
    // 娉ㄩ噴鎺夎繙绋嬪瓨鍌ㄥ姞杞藉拰鍚屾鍚敤浠ｇ爜
    /*
    try {
        const remoteKeys = Array.from(STORAGE_KEYS_TO_SYNC);
        const snapshot = await persistentStorage.getItems(remoteKeys);
        if (!snapshot || !snapshot.d1Available || !snapshot.data) {
            return;
        }
        applyPersistentSnapshotFromRemote(snapshot.data);
    } catch (error) {
        console.warn("鍔犺浇杩滅▼瀛樺偍澶辫触", error);
    } finally {
        remoteSyncEnabled = true;
    }
    */
    remoteSyncEnabled = false;
}

function applyPersistentSnapshotFromRemote(data) {
    if (!data || typeof data !== "object") {
        return;
    }

    let playlistUpdated = false;

    if (typeof data.playlistSongs === "string") {
        const playlist = parseJSON(data.playlistSongs, []);
        if (Array.isArray(playlist)) {
            state.playlistSongs = playlist;
            safeSetLocalStorage("playlistSongs", data.playlistSongs, { skipRemote: true });
            playlistUpdated = true;
        }
    }

    if (typeof data.currentTrackIndex === "string") {
        const index = Number.parseInt(data.currentTrackIndex, 10);
        if (Number.isInteger(index)) {
            state.currentTrackIndex = index;
            safeSetLocalStorage("currentTrackIndex", data.currentTrackIndex, { skipRemote: true });
        }
    }

    if (typeof data.playMode === "string") {
        state.playMode = ["list", "single", "random"].includes(data.playMode) ? data.playMode : state.playMode;
        safeSetLocalStorage("playMode", state.playMode, { skipRemote: true });
    }

    if (typeof data.playbackQuality === "string") {
        state.playbackQuality = normalizeQuality(data.playbackQuality);
        safeSetLocalStorage("playbackQuality", state.playbackQuality, { skipRemote: true });
    }

    if (typeof data.playerVolume === "string") {
        const volume = Number.parseFloat(data.playerVolume);
        if (Number.isFinite(volume)) {
            const clamped = Math.min(Math.max(volume, 0), 1);
            state.volume = clamped;
            safeSetLocalStorage("playerVolume", String(clamped), { skipRemote: true });
        }
    }

    if (typeof data.currentPlaylist === "string") {
        state.currentPlaylist = data.currentPlaylist;
        safeSetLocalStorage("currentPlaylist", data.currentPlaylist, { skipRemote: true });
    }

    if (typeof data.currentList === "string") {
        state.currentList = data.currentList === "favorite" ? "favorite" : "playlist";
        safeSetLocalStorage("currentList", state.currentList, { skipRemote: true });
    }

    if (typeof data.currentSong === "string" && data.currentSong) {
        const currentSong = parseJSON(data.currentSong, null);
        if (currentSong) {
            state.currentSong = currentSong;
            safeSetLocalStorage("currentSong", data.currentSong, { skipRemote: true });
        }
    }

    if (typeof data.currentPlaybackTime === "string") {
        const playbackTime = Number.parseFloat(data.currentPlaybackTime);
        if (Number.isFinite(playbackTime) && playbackTime >= 0) {
            state.currentPlaybackTime = playbackTime;
            safeSetLocalStorage("currentPlaybackTime", data.currentPlaybackTime, { skipRemote: true });
        }
    }

    if (typeof data.favoriteSongs === "string") {
        const favorites = parseJSON(data.favoriteSongs, []);
        if (Array.isArray(favorites)) {
            state.favoriteSongs = favorites;
            safeSetLocalStorage("favoriteSongs", data.favoriteSongs, { skipRemote: true });
        }
    }

    if (typeof data.currentFavoriteIndex === "string") {
        const favoriteIndex = Number.parseInt(data.currentFavoriteIndex, 10);
        if (Number.isInteger(favoriteIndex)) {
            state.currentFavoriteIndex = favoriteIndex;
            safeSetLocalStorage("currentFavoriteIndex", data.currentFavoriteIndex, { skipRemote: true });
        }
    }

    if (state.currentList === "favorite" && (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0)) {
        state.currentList = "playlist";
    }

    if (typeof data.favoritePlayMode === "string") {
        state.favoritePlayMode = ["list", "single", "random"].includes(data.favoritePlayMode)
            ? data.favoritePlayMode
            : state.favoritePlayMode;
        safeSetLocalStorage("favoritePlayMode", state.favoritePlayMode, { skipRemote: true });
    }

    if (typeof data.favoritePlaybackTime === "string") {
        const favoritePlaybackTime = Number.parseFloat(data.favoritePlaybackTime);
        if (Number.isFinite(favoritePlaybackTime) && favoritePlaybackTime >= 0) {
            state.favoritePlaybackTime = favoritePlaybackTime;
            safeSetLocalStorage("favoritePlaybackTime", data.favoritePlaybackTime, { skipRemote: true });
        }
    }

    if (typeof data.searchSource === "string") {
        state.searchSource = normalizeSource(data.searchSource);
        safeSetLocalStorage("searchSource", state.searchSource, { skipRemote: true });
        updateSourceLabel();
        buildSourceMenu();
    }

    if (typeof data[LAST_SEARCH_STATE_STORAGE_KEY] === "string") {
        const restoredSearch = parseJSON(data[LAST_SEARCH_STATE_STORAGE_KEY], null);
        const restored = restoreStateFromSnapshot(restoredSearch);
        if (restored) {
            safeSetLocalStorage(LAST_SEARCH_STATE_STORAGE_KEY, data[LAST_SEARCH_STATE_STORAGE_KEY], { skipRemote: true });
            restoreSearchResultsList();
        }
    }

    dom.audioPlayer.volume = state.volume;
    dom.volumeSlider.value = state.volume;
    updateVolumeSliderBackground(state.volume);
    updateVolumeIcon(state.volume);

    renderFavorites();
    switchLibraryTab(state.currentList === "favorite" ? "favorites" : "playlist");
    updatePlayModeUI();
    updateQualityLabel();
    updatePlayPauseButton();

    if (state.favoriteSongs.length === 0) {
        state.currentFavoriteIndex = 0;
    } else if (state.currentFavoriteIndex >= state.favoriteSongs.length) {
        state.currentFavoriteIndex = state.favoriteSongs.length - 1;
    }

    if (playlistUpdated) {
        let restoredIndex = state.currentTrackIndex;
        if (!Number.isInteger(restoredIndex) || restoredIndex < 0 || restoredIndex >= state.playlistSongs.length) {
            restoredIndex = 0;
            state.currentTrackIndex = restoredIndex;
        }
        state.currentPlaylist = "playlist";
        renderPlaylist();

        const restoredSong = state.playlistSongs[restoredIndex];
        if (restoredSong) {
            state.currentSong = restoredSong;
            updatePlaylistHighlight();
            updateCurrentSongInfo(restoredSong, { updateBackground: true }).catch((error) => {
                console.error("鎭㈠杩滅▼姝屾洸淇℃伅澶辫触:", error);
            });
        }
    } else if (dom.playlist) {
        dom.playlist.classList.add("empty");
        if (dom.playlistItems) {
            dom.playlistItems.innerHTML = "";
        }
    }

    savePlayerState({ skipRemote: true });
    saveFavoriteState({ skipRemote: true });
    updatePlaylistActionStates();
    updateMobileClearPlaylistVisibility();
}

bootstrapPersistentStorage();

// ==== Media Session integration (Safari/iOS Lock Screen) ====
(() => {
    const audio = dom.audioPlayer;
    if (!('mediaSession' in navigator) || !audio) return;

    let handlersBound = false;
    let lastPositionUpdateTime = 0;
    const MEDIA_SESSION_ENDED_FLAG = '__solaraMediaSessionHandledEnded';

    const preferLockScreenTrackControls = (() => {
        if (typeof navigator === 'undefined') {
            return false;
        }
        const ua = navigator.userAgent || '';
        const platform = navigator.platform || '';
        const isIOS = /iP(ad|hone|od)/.test(ua);
        const isTouchMac = !isIOS && platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
        return isIOS || isTouchMac;
    })();
    const allowLockScreenScrubbing = typeof navigator.mediaSession.setPositionState === 'function' && !preferLockScreenTrackControls;

    function triggerMediaSessionMetadataRefresh() {
        let refreshed = false;
        if (typeof window.__SOLARA_UPDATE_MEDIA_METADATA === 'function') {
            try {
                window.__SOLARA_UPDATE_MEDIA_METADATA();
                refreshed = true;
            } catch (error) {
                console.warn('鍒锋柊濯掍綋淇℃伅澶辫触:', error);
            }
        }
        if (!refreshed) {
            updateMediaMetadata();
        }
    }

    function getArtworkMime(url) {
        if (!url) {
            return 'image/png';
        }

        const normalized = url.split('?')[0].toLowerCase();
        if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) {
            return 'image/jpeg';
        }
        if (normalized.endsWith('.webp')) {
            return 'image/webp';
        }
        if (normalized.endsWith('.gif')) {
            return 'image/gif';
        }
        if (normalized.endsWith('.bmp')) {
            return 'image/bmp';
        }
        if (normalized.endsWith('.svg')) {
            return 'image/svg+xml';
        }
        return 'image/png';
    }

    function getArtworkList(url) {
        // iOS/Safari 寤鸿澶氬昂瀵稿皝闈紱浣犵殑 API 宸叉湁 pic_id -> pic url锛?00锛夛紝杩欓噷鍋氬厹搴曞灏哄
        // 娉ㄦ剰锛氬敖閲忔彁渚?https 閾炬帴锛涗綘鐨勯」鐩噷宸叉湁 preferHttpsUrl/buildAudioProxyUrl 宸ュ叿鍑芥暟
        const src = (typeof preferHttpsUrl === 'function') ? preferHttpsUrl(url) : (url || '');
        // 濡傛灉娌℃湁灏侀潰锛岀敤榛樿灏侀潰鍏滃簳
        const fallback = '/favicon.png';
        const baseSrc = src || fallback;
        const base = toAbsoluteUrl(baseSrc);
        const type = getArtworkMime(base);
        return [
            { src: base, sizes: '1024x1024', type },
            { src: base, sizes: '640x640', type },
            { src: base, sizes: '512x512', type },
            { src: base, sizes: '384x384', type },
            { src: base, sizes: '256x256', type },
            { src: base, sizes: '192x192', type },
            { src: base, sizes: '128x128', type },
            { src: base, sizes: '96x96',  type }
        ];
    }

    function updateMediaMetadata() {
        // 渚濊禆鐜版湁鍏ㄥ眬 state.currentSong锛涘凡鍦ㄩ」鐩腑浣跨敤 localStorage 淇濆瓨/鎭㈠銆?contentReference[oaicite:7]{index=7}
        const song = state.currentSong || {};
        const title = song.name || dom.currentSongTitle?.textContent || 'Solara';
        const artist = song.artist || dom.currentSongArtist?.textContent || '';
        const artworkUrl = state.currentArtworkUrl || '';

        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist,
                album: song.album || '',
                artwork: getArtworkList(artworkUrl)
            });
        } catch (e) {
            // 鏌愪簺鏃?iOS 鍙兘瀵?artwork 灏哄鎸戝墧锛屽け璐ユ椂鐢ㄦ渶灏忛厤缃噸璇?            try {
                navigator.mediaSession.metadata = new MediaMetadata({ title, artist });
            } catch (_) {}
        }
    }

    function updatePositionState() {
        // iOS 15+ 鏀寔 setPositionState锛涚敤浜庤閿佸睆杩涘害鏉″彲鎷栧姩涓庢樉绀?        if (!allowLockScreenScrubbing) return;
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const position = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
        const playbackRate = Number.isFinite(audio.playbackRate) ? audio.playbackRate : 1;
        navigator.mediaSession.setPositionState({ duration, position, playbackRate });
    }

    ['currentSong', 'currentArtworkUrl'].forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(state, key)) {
            return;
        }
        let internalValue = state[key];
        Object.defineProperty(state, key, {
            configurable: true,
            enumerable: true,
            get() {
                return internalValue;
            },
            set(nextValue) {
                internalValue = nextValue;
                triggerMediaSessionMetadataRefresh();
            }
        });
    });

    function bindActionHandlersOnce() {
        if (handlersBound) return;
        handlersBound = true;

        // 鎾斁/鏆傚仠浜ょ粰 <audio> 榛樿琛屼负鍗冲彲
        try {
            navigator.mediaSession.setActionHandler('previoustrack', async () => {
                // 鐩存帴澶嶇敤浣犲凡鏈夌殑鍏ㄥ眬鍑芥暟锛圚TML 閲屼篃鍦ㄧ敤锛?contentReference[oaicite:9]{index=9}
                if (typeof window.playPrevious === 'function') {
                    try {
                        // 璋冪敤playPrevious骞剁瓑寰呭彲鑳界殑寮傛鎿嶄綔瀹屾垚
                        const result = window.playPrevious();
                        if (result && typeof result.then === 'function') {
                            await result;
                        }
                        triggerMediaSessionMetadataRefresh();
                    } catch (error) {
                        console.error('涓婁竴鏇叉挱鏀惧け璐?', error);
                    }
                }
            });
            navigator.mediaSession.setActionHandler('nexttrack', async () => {
                if (typeof window.playNext === 'function') {
                    try {
                        // 璋冪敤playNext骞剁瓑寰呭彲鑳界殑寮傛鎿嶄綔瀹屾垚
                        const result = window.playNext();
                        if (result && typeof result.then === 'function') {
                            await result;
                        }
                        triggerMediaSessionMetadataRefresh();
                    } catch (error) {
                        console.error('涓嬩竴鏇叉挱鏀惧け璐?', error);
                    }
                }
            });

            navigator.mediaSession.setActionHandler('seekbackward', null);
            navigator.mediaSession.setActionHandler('seekforward', null);

            if (allowLockScreenScrubbing) {
                // 鍏抽敭锛氳閿佸睆鏀寔鎷栧姩杩涘害鍒颁换鎰忎綅缃?                navigator.mediaSession.setActionHandler('seekto', (e) => {
                    if (!e || typeof e.seekTime !== 'number') return;
                    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, e.seekTime));
                    if (e.fastSeek && typeof audio.fastSeek === 'function') {
                        audio.fastSeek(audio.currentTime);
                    }
                    updatePositionState();
                });
            } else {
                try {
                    navigator.mediaSession.setActionHandler('seekto', null);
                } catch (_) {}
            }

            // 鍙€夛細鍒囨崲鎾斁鐘舵€侊紙澶ч儴鍒嗙郴缁熻嚜宸变細澶勭悊锛?            navigator.mediaSession.setActionHandler('play', async () => {
                try { await audio.play(); } catch(_) {}
            });
            navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        } catch (_) {
            // 鏌愪簺骞冲彴涓嶆敮鎸佸叏閮ㄥ姩浣?        }
    }

    // 鐩戝惉 audio 浜嬩欢锛屽悓姝ラ攣灞忎俊鎭笌杩涘害
    audio.addEventListener('loadedmetadata', () => {
        triggerMediaSessionMetadataRefresh();
        updatePositionState();
        lastPositionUpdateTime = Date.now();
        bindActionHandlersOnce();
    });

    audio.addEventListener('play', () => {
        navigator.mediaSession.playbackState = 'playing';
        updatePositionState();
        lastPositionUpdateTime = Date.now();
    });

    audio.addEventListener('pause', () => {
        navigator.mediaSession.playbackState = 'paused';
        updatePositionState();
        lastPositionUpdateTime = Date.now();
    });

    audio.addEventListener('timeupdate', () => {
        const now = Date.now();
        if (now - lastPositionUpdateTime >= 1000) {
            lastPositionUpdateTime = now;
            updatePositionState();
        }
    });

    audio.addEventListener('durationchange', updatePositionState);
    audio.addEventListener('ratechange', updatePositionState);
    audio.addEventListener('seeking', updatePositionState);
    audio.addEventListener('seeked', updatePositionState);

    audio.addEventListener('ended', () => {
        // 涓嶈绔嬪嵆璁剧疆涓簆aused锛屽厛灏濊瘯鑷姩鎾斁涓嬩竴棣?        updatePositionState();
        const refresh = () => {
            triggerMediaSessionMetadataRefresh();
            audio[MEDIA_SESSION_ENDED_FLAG] = false;
        };
        if (typeof autoPlayNext === 'function') {
            try {
                audio[MEDIA_SESSION_ENDED_FLAG] = 'handling';
                // 浣跨敤寮傛鏂瑰紡澶勭悊锛岀‘淇濆獟浣撲細璇濅繚鎸佹椿璺?                (async () => {
                    await autoPlayNext();
                    // 鎾斁鎴愬姛鍚庢洿鏂板獟浣撲細璇濈姸鎬?                    if (navigator.mediaSession && !audio.paused) {
                        navigator.mediaSession.playbackState = 'playing';
                    }
                    audio[MEDIA_SESSION_ENDED_FLAG] = 'skip';
                    refresh();
                })();
                return;
            } catch (error) {
                console.warn('鑷姩鎾斁涓嬩竴棣栧け璐?', error);
                // 鍙湁鍦ㄥけ璐ユ椂鎵嶈缃负paused
                if (navigator.mediaSession) {
                    navigator.mediaSession.playbackState = 'paused';
                }
            }
        }
        audio[MEDIA_SESSION_ENDED_FLAG] = 'skip';
        if (typeof window.playNext === 'function') {
            try {
                // 浣跨敤寮傛鏂瑰紡澶勭悊
                (async () => {
                    const result = window.playNext();
                    if (typeof updatePlayPauseButton === 'function') {
                        updatePlayPauseButton();
                    }
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                    // 鎾斁鎴愬姛鍚庢洿鏂板獟浣撲細璇濈姸鎬?                    if (navigator.mediaSession && !audio.paused) {
                        navigator.mediaSession.playbackState = 'playing';
                    }
                    refresh();
                })();
                return;
            } catch (error) {
                console.warn('鑷姩鎾斁涓嬩竴棣栧け璐?', error);
                // 鍙湁鍦ㄥけ璐ユ椂鎵嶈缃负paused
                if (navigator.mediaSession) {
                    navigator.mediaSession.playbackState = 'paused';
                }
            }
        }
        // 鍙湁鍦ㄦ病鏈変笅涓€棣栧彲鎾斁鏃舵墠璁剧疆涓簆aused
        if (navigator.mediaSession) {
            navigator.mediaSession.playbackState = 'paused';
        }
        refresh();
    });

    // 褰撲綘鍦ㄥ簲鐢ㄥ唴鍒囨瓕锛堟洿鏂?state.currentSong / 灏侀潰 / 鏍囬锛夋椂锛屼篃璋冪敤涓€娆★細
    // window.__SOLARA_UPDATE_MEDIA_METADATA = updateMediaMetadata;
    // 杩欐牱鍦ㄤ綘鐜版湁鐨勫垏姝岄€昏緫閲岋紝璁剧疆瀹屾柊鐨?audio.src 鍚庢墜鍔ㄨ皟鐢ㄥ畠鍙珛鍗虫洿鏂伴攣灞忓皝闈?鏂囨銆?    if (typeof window.__SOLARA_UPDATE_MEDIA_METADATA !== 'function') {
        window.__SOLARA_UPDATE_MEDIA_METADATA = updateMediaMetadata;
    }

    triggerMediaSessionMetadataRefresh();
})();

let sourceMenuPositionFrame = null;
let qualityMenuPositionFrame = null;
let floatingMenuListenersAttached = false;
let qualityMenuAnchor = null;

function runWithoutTransition(element, callback) {
    if (!element || typeof callback !== "function") return;
    const previousTransition = element.style.transition;
    element.style.transition = "none";
    callback();
    void element.offsetHeight;
    if (previousTransition) {
        element.style.transition = previousTransition;
    } else {
        element.style.removeProperty("transition");
    }
}

function cancelSourceMenuPositionUpdate() {
    if (sourceMenuPositionFrame !== null) {
        window.cancelAnimationFrame(sourceMenuPositionFrame);
        sourceMenuPositionFrame = null;
    }
}

function scheduleSourceMenuPositionUpdate() {
    if (!state.sourceMenuOpen) {
        cancelSourceMenuPositionUpdate();
        return;
    }
    if (sourceMenuPositionFrame !== null) {
        return;
    }
    sourceMenuPositionFrame = window.requestAnimationFrame(() => {
        sourceMenuPositionFrame = null;
        updateSourceMenuPosition();
    });
}

function cancelPlayerQualityMenuPositionUpdate() {
    if (qualityMenuPositionFrame !== null) {
        window.cancelAnimationFrame(qualityMenuPositionFrame);
        qualityMenuPositionFrame = null;
    }
}

function schedulePlayerQualityMenuPositionUpdate() {
    if (!state.qualityMenuOpen) {
        cancelPlayerQualityMenuPositionUpdate();
        return;
    }
    if (qualityMenuPositionFrame !== null) {
        return;
    }
    qualityMenuPositionFrame = window.requestAnimationFrame(() => {
        qualityMenuPositionFrame = null;
        updatePlayerQualityMenuPosition();
    });
}

function handleFloatingMenuResize() {
    if (state.sourceMenuOpen) {
        scheduleSourceMenuPositionUpdate();
    }
    if (state.qualityMenuOpen) {
        schedulePlayerQualityMenuPositionUpdate();
    }
}

function handleFloatingMenuScroll() {
    if (state.sourceMenuOpen) {
        scheduleSourceMenuPositionUpdate();
    }
    if (state.qualityMenuOpen) {
        schedulePlayerQualityMenuPositionUpdate();
    }
}

function ensureFloatingMenuListeners() {
    if (floatingMenuListenersAttached) {
        return;
    }
    window.addEventListener("resize", handleFloatingMenuResize);
    window.addEventListener("scroll", handleFloatingMenuScroll, { passive: true, capture: true });
    floatingMenuListenersAttached = true;
}

function releaseFloatingMenuListenersIfIdle() {
    if (state.sourceMenuOpen || state.qualityMenuOpen) {
        return;
    }
    if (!floatingMenuListenersAttached) {
        return;
    }
    window.removeEventListener("resize", handleFloatingMenuResize);
    window.removeEventListener("scroll", handleFloatingMenuScroll, true);
    floatingMenuListenersAttached = false;
}

state.currentGradient = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-gradient")
    .trim();

function setGlobalThemeProperty(name, value) {
    if (typeof name !== "string") {
        return;
    }
    document.documentElement.style.setProperty(name, value);
    if (document.body) {
        document.body.style.setProperty(name, value);
    }
}

function removeGlobalThemeProperty(name) {
    if (typeof name !== "string") {
        return;
    }
    document.documentElement.style.removeProperty(name);
    if (document.body) {
        document.body.style.removeProperty(name);
    }
}

if (state.currentGradient) {
    setGlobalThemeProperty("--bg-gradient-next", state.currentGradient);
}

function captureThemeDefaults() {
    // 鎬绘槸鏇存柊涓婚榛樿鍊硷紝纭繚CSS淇敼鍚庤兘鍙婃椂鍙嶆槧
    const initialIsDark = document.body.classList.contains("dark-mode");
    document.body.classList.remove("dark-mode");
    const lightStyles = getComputedStyle(document.body);
    themeDefaults.light.gradient = lightStyles.getPropertyValue("--bg-gradient").trim();
    themeDefaults.light.primaryColor = lightStyles.getPropertyValue("--primary-color").trim();
    themeDefaults.light.primaryColorDark = lightStyles.getPropertyValue("--primary-color-dark").trim();

    document.body.classList.add("dark-mode");
    const darkStyles = getComputedStyle(document.body);
    themeDefaults.dark.gradient = darkStyles.getPropertyValue("--bg-gradient").trim();
    themeDefaults.dark.primaryColor = darkStyles.getPropertyValue("--primary-color").trim();
    themeDefaults.dark.primaryColorDark = darkStyles.getPropertyValue("--primary-color-dark").trim();

    if (!initialIsDark) {
        document.body.classList.remove("dark-mode");
    }

    state.themeDefaultsCaptured = true;
}

function applyThemeTokens(tokens) {
    if (!tokens) return;
    if (tokens.primaryColor) {
        setGlobalThemeProperty("--primary-color", tokens.primaryColor);
    }
    if (tokens.primaryColorDark) {
        setGlobalThemeProperty("--primary-color-dark", tokens.primaryColorDark);
    }
}

function setDocumentGradient(gradient, { immediate = false } = {}) {
    const normalized = (gradient || "").trim();
    const current = (state.currentGradient || "").trim();
    const shouldSkipTransition = immediate || normalized === current;
    
    // 鑾峰彇榛樿娓愬彉鍊硷紝纭繚涓嶄細绉婚櫎蹇呰鐨勮儗鏅笎鍙?    const isDark = document.body.classList.contains("dark-mode");
    const defaults = themeDefaults[isDark ? "dark" : "light"];
    const fallbackGradient = defaults.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    const finalGradient = normalized || fallbackGradient;

    if (!dom.backgroundTransitionLayer || !dom.backgroundBaseLayer) {
        setGlobalThemeProperty("--bg-gradient", finalGradient);
        setGlobalThemeProperty("--bg-gradient-next", finalGradient);
        state.currentGradient = finalGradient;
        return;
    }

    window.clearTimeout(backgroundTransitionTimer);

    if (shouldSkipTransition) {
        setGlobalThemeProperty("--bg-gradient", finalGradient);
        setGlobalThemeProperty("--bg-gradient-next", finalGradient);
        document.body.classList.remove("background-transitioning");
        state.currentGradient = finalGradient;
        return;
    }

    setGlobalThemeProperty("--bg-gradient-next", finalGradient);

    requestAnimationFrame(() => {
        document.body.classList.add("background-transitioning");
        backgroundTransitionTimer = window.setTimeout(() => {
            setGlobalThemeProperty("--bg-gradient", finalGradient);
            setGlobalThemeProperty("--bg-gradient-next", finalGradient);
            document.body.classList.remove("background-transitioning");
            state.currentGradient = finalGradient;
        }, BACKGROUND_TRANSITION_DURATION);
    });
}

function applyDynamicGradient(options = {}) {
    // 姣忔璋冪敤閮芥洿鏂颁富棰橀粯璁ゅ€硷紝纭繚CSS淇敼鍚庤兘鍙婃椂鍙嶆槧
    captureThemeDefaults();
    const isDark = document.body.classList.contains("dark-mode");
    const mode = isDark ? "dark" : "light";
    const defaults = themeDefaults[mode];

    let targetGradient = defaults.gradient || "";
    applyThemeTokens(defaults);

    const palette = state.dynamicPalette;
    if (palette && palette.gradients) {
        const gradients = palette.gradients;
        let gradientMode = mode;
        let gradientInfo = gradients[gradientMode] || null;

        if (!gradientInfo) {
            const fallbackModes = gradientMode === "dark" ? ["light"] : ["dark"];
            for (const candidate of fallbackModes) {
                if (gradients[candidate]) {
                    gradientMode = candidate;
                    gradientInfo = gradients[candidate];
                    break;
                }
            }
            if (!gradientInfo) {
                const availableModes = Object.keys(gradients);
                if (availableModes.length) {
                    const candidate = availableModes[0];
                    gradientMode = candidate;
                    gradientInfo = gradients[candidate];
                }
            }
        }

        if (gradientInfo && gradientInfo.gradient) {
            targetGradient = gradientInfo.gradient;
        }

        if (palette.tokens) {
            const tokens = palette.tokens[gradientMode] || palette.tokens[mode];
            if (tokens) {
                applyThemeTokens(tokens);
            }
        }
    }

    setDocumentGradient(targetGradient, options);
}

function queueDefaultPalette(options = {}) {
    window.clearTimeout(pendingPaletteTimer);
    pendingPaletteTimer = null;
    cancelDeferredPaletteUpdate();
    state.pendingPaletteData = null;
    state.pendingPaletteImage = null;
    state.pendingPaletteImmediate = Boolean(options.immediate);
    state.pendingPaletteReady = true;
    attemptPaletteApplication();
}

function resetDynamicBackground(options = {}) {
    paletteRequestId += 1;
    cancelDeferredPaletteUpdate();
    if (paletteAbortController) {
        paletteAbortController.abort();
        paletteAbortController = null;
    }
    state.dynamicPalette = null;
    state.currentPaletteImage = null;
    queueDefaultPalette(options);
}

function queuePaletteApplication(palette, imageUrl, options = {}) {
    window.clearTimeout(pendingPaletteTimer);
    pendingPaletteTimer = null;
    state.pendingPaletteData = palette || null;
    state.pendingPaletteImage = imageUrl || null;
    state.pendingPaletteImmediate = Boolean(options.immediate);
    state.pendingPaletteReady = true;
    attemptPaletteApplication();
}

function cancelDeferredPaletteUpdate() {
    if (deferredPaletteHandle === null) {
        return;
    }
    if (deferredPaletteType === "idle" && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(deferredPaletteHandle);
    } else {
        window.clearTimeout(deferredPaletteHandle);
    }
    deferredPaletteHandle = null;
    deferredPaletteType = "";
    deferredPaletteUrl = null;
}

function scheduleDeferredPaletteUpdate(imageUrl, options = {}) {
    const immediate = Boolean(options.immediate);
    if (!imageUrl) {
        cancelDeferredPaletteUpdate();
        if (immediate) {
            resetDynamicBackground();
        }
        return;
    }

    if (immediate) {
        cancelDeferredPaletteUpdate();
        updateDynamicBackground(imageUrl);
        return;
    }

    if (deferredPaletteHandle !== null) {
        if (deferredPaletteType === "idle" && typeof window.cancelIdleCallback === "function") {
            window.cancelIdleCallback(deferredPaletteHandle);
        } else {
            window.clearTimeout(deferredPaletteHandle);
        }
    }

    deferredPaletteUrl = imageUrl;
    const runner = () => {
        deferredPaletteHandle = null;
        deferredPaletteType = "";
        const targetUrl = deferredPaletteUrl;
        deferredPaletteUrl = null;
        if (targetUrl) {
            updateDynamicBackground(targetUrl);
        }
    };

    if (typeof window.requestIdleCallback === "function") {
        deferredPaletteType = "idle";
        deferredPaletteHandle = window.requestIdleCallback(runner, { timeout: 800 });
    } else {
        deferredPaletteType = "timeout";
        deferredPaletteHandle = window.setTimeout(runner, 120);
    }
}

function attemptPaletteApplication() {
    if (!state.pendingPaletteReady) {
        return;
    }

    const palette = state.pendingPaletteData || null;
    const imageUrl = state.pendingPaletteImage || null;
    const immediate = state.pendingPaletteImmediate;

    state.pendingPaletteData = null;
    state.pendingPaletteImage = null;
    state.pendingPaletteImmediate = false;
    state.pendingPaletteReady = false;

    const apply = () => {
        pendingPaletteTimer = null;
        state.dynamicPalette = palette;
        state.currentPaletteImage = imageUrl;
        applyDynamicGradient({ immediate: false });
    };

    if (immediate) {
        pendingPaletteTimer = null;
        state.dynamicPalette = palette;
        state.currentPaletteImage = imageUrl;
        applyDynamicGradient({ immediate: true });
        return;
    }

    pendingPaletteTimer = window.setTimeout(apply, PALETTE_APPLY_DELAY);
}

function showAlbumCoverPlaceholder() {
    dom.albumCover.innerHTML = PLACEHOLDER_HTML;
    dom.albumCover.classList.remove("loading");
    state.currentArtworkUrl = toAbsoluteUrl('/favicon.png');
    queueDefaultPalette();
    if (typeof window.__SOLARA_UPDATE_MEDIA_METADATA === 'function') {
        window.__SOLARA_UPDATE_MEDIA_METADATA();
    }
}

function setAlbumCoverImage(url) {
    const safeUrl = toAbsoluteUrl(preferHttpsUrl(url));
    state.currentArtworkUrl = safeUrl;
    // 绉婚櫎crossorigin灞炴€э紝鍥犱负鏈変簺鏈嶅姟鍣ㄥ彲鑳戒笉鏀寔CORS
    // 淇濈暀referrerpolicy="no-referrer"浠ヤ繚鎶ら殣绉佸苟瑙ｅ喅鏌愪簺璺ㄥ煙闂
    dom.albumCover.innerHTML = `<img src="${safeUrl}" alt="涓撹緫灏侀潰" referrerpolicy="no-referrer">`;
    dom.albumCover.classList.remove("loading");
    if (typeof window.__SOLARA_UPDATE_MEDIA_METADATA === 'function') {
        window.__SOLARA_UPDATE_MEDIA_METADATA();
    }
}

loadStoredPalettes();

// 鏈湴鍙栬壊閫昏緫锛氫娇鐢?Canvas API 浠庡浘鐗囦腑鎻愬彇棰滆壊
function getLocalPalette(imageUrl) {
    return new Promise(async (resolve, reject) => {
        // 纭繚鍗充娇鍑虹幇鏈崟鑾风殑寮傚父涔熻繑鍥為粯璁よ皟鑹叉澘
        try {
        console.log('馃帹 寮€濮嬫湰鍦板彇鑹诧紝鍥剧墖URL:', imageUrl);
        
        // 閽堝QQ闊充箰銆佺綉鏄撲簯闊充箰绛夌壒娈婂煙鍚嶏紝灏濊瘯閫氳繃浠ｇ悊鑾峰彇鍥剧墖
        const isQQMusic = imageUrl.includes('qq.com') || imageUrl.includes('y.qq.com');
        const isNeteaseMusic = imageUrl.includes('music.163.com') || imageUrl.includes('126.net') || imageUrl.includes('netease.com');
        
        let processedImageUrl = imageUrl;
        
        // 濡傛灉鏄疩Q闊充箰鎴栫綉鏄撲簯闊充箰鐨勫浘鐗囷紝灏濊瘯閫氳繃鍥剧墖浠ｇ悊鑾峰彇
        if (isQQMusic || isNeteaseMusic) {
            console.log(isQQMusic ? '馃幍 妫€娴嬪埌QQ闊充箰鍥剧墖锛屽皾璇曢€氳繃鍥剧墖浠ｇ悊鑾峰彇' : '馃幍 妫€娴嬪埌缃戞槗浜戦煶涔愬浘鐗囷紝灏濊瘯閫氳繃鍥剧墖浠ｇ悊鑾峰彇');
            try {
                // 灏濊瘯浣跨敤鍥剧墖浠ｇ悊鍑芥暟
                processedImageUrl = buildImageProxyUrl(imageUrl);
                console.log('馃敆 浣跨敤浠ｇ悊URL:', processedImageUrl);
            } catch (proxyError) {
                console.warn('鈿狅笍 鍥剧墖浠ｇ悊鑾峰彇澶辫触锛屽洖閫€鍒板師URL:', proxyError.message);
                processedImageUrl = imageUrl;
            }
        }
        
        // 灏濊瘯浣跨敤fetch鏂瑰紡鑾峰彇鍥剧墖锛屼互缁曡繃璺ㄥ煙闄愬埗
        try {
            const response = await fetch(processedImageUrl);
            if (!response.ok) {
                throw new Error(`鍥剧墖鑾峰彇澶辫触: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            
            // 鍒涘缓涓€涓璞RL鏉ヤ粠blob鍔犺浇鍥剧墖
            const objectUrl = URL.createObjectURL(blob);
            
            const img = new Image();
            
            img.onload = () => {
                console.log('鉁?鍥剧墖鍔犺浇鎴愬姛锛屽昂瀵?', img.width, 'x', img.height);
                try {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    
                    // 璋冩暣鐢诲竷澶у皬锛岀缉灏忓浘鐗囦互鎻愰珮鎬ц兘
                    const maxSize = 200;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height && width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 缁樺埗鍥剧墖鍒扮敾甯?                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 鑾峰彇鍍忕礌鏁版嵁
                    const imageData = ctx.getImageData(0, 0, width, height);
                    console.log('馃搳 鎴愬姛鑾峰彇鍍忕礌鏁版嵁锛屽儚绱犳暟:', imageData.data.length / 4);
                    
                    const data = imageData.data;
                    
                    // 鏀硅繘鐨勯鑹叉彁鍙栵細璁＄畻骞冲潎棰滆壊
                    let r = 0, g = 0, b = 0, count = 0;
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const alpha = data[i + 3];
                        if (alpha > 128) { // 鍙€冭檻涓嶉€忔槑鐨勫儚绱?                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                    }
                    
                    if (count === 0) {
                        console.warn('鈿狅笍 娌℃湁鎵惧埌涓嶉€忔槑鍍忕礌锛屼娇鐢ㄩ粯璁よ皟鑹叉澘');
                        // 杩斿洖榛樿璋冭壊鏉?                        const defaultPalette = {
                            gradients: {
                                light: {
                                    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                },
                                dark: {
                                    gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                                }
                            },
                            tokens: {
                                light: {
                                    primaryColor: "#667eea",
                                    primaryColorDark: "#764ba2"
                                },
                                dark: {
                                    primaryColor: "#3498db",
                                    primaryColorDark: "#2980b9"
                                }
                            }
                        };
                        resolve(defaultPalette);
                        return;
                    }
                    
                    // 璁＄畻骞冲潎棰滆壊
                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);
                    
                    // 鍒涘缓涓婚鑹?                    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                    console.log('馃帹 鎻愬彇鍒颁富棰樿壊:', hex);
                    
                    // 鍒涘缓鏄庢樉鐨勬笎鍙樻晥鏋?                    const palette = {
                        gradients: {
                            light: {
                                gradient: `linear-gradient(135deg, ${hex} 0%, ${hex}cc 50%, ${hex}99 100%)`
                            },
                            dark: {
                                gradient: `linear-gradient(135deg, ${hex}55 0%, ${hex}66 50%, ${hex}77 100%)`
                            }
                        },
                        tokens: {
                            light: {
                                primaryColor: hex,
                                primaryColorDark: hex
                            },
                            dark: {
                                primaryColor: hex,
                                primaryColorDark: hex
                            }
                        }
                    };
                    
                    console.log('鉁?鐢熸垚璋冭壊鏉挎垚鍔?);
                    resolve(palette);
                } catch (error) {
                    console.error('鉂?鍙栬壊澶勭悊澶辫触:', error);
                    
                    // 杩斿洖澶囩敤璋冭壊鏉?                    const fallbackPalette = {
                        gradients: {
                            light: {
                                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            },
                            dark: {
                                gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                            }
                        },
                        tokens: {
                            light: {
                                primaryColor: "#667eea",
                                primaryColorDark: "#764ba2"
                            },
                            dark: {
                                primaryColor: "#3498db",
                                primaryColorDark: "#2980b9"
                            }
                        }
                    };
                    resolve(fallbackPalette);
                } finally {
                    // 娓呯悊瀵硅薄URL浠ラ噴鏀惧唴瀛?                    URL.revokeObjectURL(objectUrl);
                }
            }
                        
            img.onerror = () => {
                console.error('鉂?鍥剧墖鍔犺浇澶辫触锛屼娇鐢ㄩ粯璁よ皟鑹叉澘');
                
                // 杩斿洖澶囩敤璋冭壊鏉?                const fallbackPalette = {
                    gradients: {
                        light: {
                            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        },
                        dark: {
                            gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                        }
                    },
                    tokens: {
                        light: {
                            primaryColor: "#667eea",
                            primaryColorDark: "#764ba2"
                        },
                        dark: {
                            primaryColor: "#3498db",
                            primaryColorDark: "#2980b9"
                        }
                    }
                };
                resolve(fallbackPalette);
                
                // 娓呯悊瀵硅薄URL浠ラ噴鏀惧唴瀛?                URL.revokeObjectURL(objectUrl);
            };
            
            img.src = objectUrl;
            console.log('馃摗 寮€濮嬪姞杞藉浘鐗?..');
            
        } catch (fetchError) {
            console.warn('鈿狅笍 Fetch鏂瑰紡鑾峰彇鍥剧墖澶辫触:', fetchError.message, '灏濊瘯浼犵粺鏂瑰紡');
            
            // 濡傛灉fetch鏂瑰紡澶辫触锛屽洖閫€鍒颁紶缁熺殑鍥剧墖鍔犺浇鏂瑰紡
            const img = new Image();
            // 绉婚櫎crossOrigin灞炴€т互閬垮厤QQ闊充箰绛夎法鍩熷浘鐗囩殑CORS闂
            // img.crossOrigin = "anonymous";
            
            img.onload = () => {
                console.log('鉁?鍥剧墖鍔犺浇鎴愬姛锛屽昂瀵?', img.width, 'x', img.height);
                try {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    
                    // 璋冩暣鐢诲竷澶у皬锛岀缉灏忓浘鐗囦互鎻愰珮鎬ц兘
                    const maxSize = 200;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height && width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 缁樺埗鍥剧墖鍒扮敾甯?                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 鑾峰彇鍍忕礌鏁版嵁
                    let imageData;
                    try {
                        imageData = ctx.getImageData(0, 0, width, height);
                        console.log('馃搳 鎴愬姛鑾峰彇鍍忕礌鏁版嵁锛屽儚绱犳暟:', imageData.data.length / 4);
                    } catch (crossOriginError) {
                        console.warn('鉂?璺ㄥ煙鍥剧墖鏃犳硶鎻愬彇棰滆壊锛屼娇鐢ㄥ熀浜嶶RL鐨勯鑹茬敓鎴愭柟妗?', crossOriginError.message);
                        
                        // 鍩轰簬URL鍝堝笇鐢熸垚涓婚鑹诧紝纭繚鍚屼竴鍥剧墖濮嬬粓鐢熸垚鐩稿悓棰滆壊
                        const hash = Array.from(imageUrl).reduce((acc, char) => {
                            acc = ((acc << 5) - acc) + char.charCodeAt(0);
                            return acc & acc;
                        }, 0);
                        
                        // 浣跨敤鍝堝笇鐢熸垚涓€涓竴鑷寸殑涓婚鑹?                        const hue = Math.abs(hash % 360);
                        const saturation = 60 + Math.abs(hash % 20);
                        const lightness = 65 + Math.abs(hash % 10);

                        // 鍒涘缓鍩轰簬URL鐨勮皟鑹叉澘
                        const hex = `#${((1 << 24) + ((hue * 0.7) << 16) + ((saturation * 2.55) << 8) + (lightness * 2.55)).toString(16).slice(1)}`;
                        
                        const palette = {
                            gradients: {
                                light: {
                                    gradient: `linear-gradient(135deg, ${hex} 0%, ${hex}bb 50%, ${hex}99 100%)`
                                },
                                dark: {
                                    gradient: `linear-gradient(135deg, ${hex}66 0%, ${hex}55 50%, ${hex}44 100%)`
                                }
                            },
                            tokens: {
                                light: {
                                    primaryColor: hex,
                                    primaryColorDark: hex
                                },
                                dark: {
                                    primaryColor: hex,
                                    primaryColorDark: hex
                                }
                            }
                        };
                        
                        console.log('馃帹 浣跨敤URL鍝堝笇鐢熸垚璋冭壊鏉?', hex);
                        resolve(palette);
                        return;
                    }
                    
                    const data = imageData.data;
                    
                    // 鏀硅繘鐨勯鑹叉彁鍙栵細璁＄畻骞冲潎棰滆壊
                    let r = 0, g = 0, b = 0, count = 0;
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const alpha = data[i + 3];
                        if (alpha > 128) { // 鍙€冭檻涓嶉€忔槑鐨勫儚绱?                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                    }
                    
                    if (count === 0) {
                        console.warn('鈿狅笍 娌℃湁鎵惧埌涓嶉€忔槑鍍忕礌锛屼娇鐢ㄩ粯璁よ皟鑹叉澘');
                        // 杩斿洖榛樿璋冭壊鏉?                        const defaultPalette = {
                            gradients: {
                                light: {
                                    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                },
                                dark: {
                                    gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                                }
                            },
                            tokens: {
                                light: {
                                    primaryColor: "#667eea",
                                    primaryColorDark: "#764ba2"
                                },
                                dark: {
                                    primaryColor: "#3498db",
                                    primaryColorDark: "#2980b9"
                                }
                            }
                        };
                        resolve(defaultPalette);
                        return;
                    }
                    
                    // 璁＄畻骞冲潎棰滆壊
                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);
                    
                    // 鍒涘缓涓婚鑹?                    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                    console.log('馃帹 鎻愬彇鍒颁富棰樿壊:', hex);
                    
                    // 鍒涘缓鏄庢樉鐨勬笎鍙樻晥鏋?                    const palette = {
                        gradients: {
                            light: {
                                gradient: `linear-gradient(135deg, ${hex} 0%, ${hex}cc 50%, ${hex}99 100%)`
                            },
                            dark: {
                                gradient: `linear-gradient(135deg, ${hex}55 0%, ${hex}66 50%, ${hex}77 100%)`
                            }
                        },
                        tokens: {
                            light: {
                                primaryColor: hex,
                                primaryColorDark: hex
                            },
                            dark: {
                                primaryColor: hex,
                                primaryColorDark: hex
                            }
                        }
                    };
                    
                    console.log('鉁?鐢熸垚璋冭壊鏉挎垚鍔?);
                    resolve(palette);
                } catch (error) {
                    console.error('鉂?鍙栬壊澶勭悊澶辫触:', error);
                    
                    // 杩斿洖澶囩敤璋冭壊鏉?                    const fallbackPalette = {
                        gradients: {
                            light: {
                                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            },
                            dark: {
                                gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                            }
                        },
                        tokens: {
                            light: {
                                primaryColor: "#667eea",
                                primaryColorDark: "#764ba2"
                            },
                            dark: {
                                primaryColor: "#3498db",
                                primaryColorDark: "#2980b9"
                            }
                        }
                    };
                    resolve(fallbackPalette);
                }
            }
            
            img.onerror = () => {
                console.error('鉂?鍥剧墖鍔犺浇澶辫触锛屼娇鐢ㄩ粯璁よ皟鑹叉澘');
                
                // 杩斿洖澶囩敤璋冭壊鏉?                const fallbackPalette = {
                    gradients: {
                        light: {
                            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        },
                        dark: {
                            gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                        }
                    },
                    tokens: {
                        light: {
                            primaryColor: "#667eea",
                            primaryColorDark: "#764ba2"
                        },
                        dark: {
                            primaryColor: "#3498db",
                            primaryColorDark: "#2980b9"
                        }
                    }
                };
                resolve(fallbackPalette);
            };
            
            img.src = processedImageUrl;
            console.log('馃摗 寮€濮嬪姞杞藉浘鐗?..');
        }
    });
    
    // 纭繚Promise鎬绘槸琚玶esolve锛屽嵆浣垮嚭鐜版湭鎹曡幏鐨勫紓甯?    } catch (unexpectedError) {
        console.error('鉂?鏈湴鍙栬壊鍑虹幇鏈鏈熷紓甯?', unexpectedError);
        
        // 杩斿洖澶囩敤璋冭壊鏉?        const fallbackPalette = {
            gradients: {
                light: {
                    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                },
                dark: {
                    gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                }
            },
            tokens: {
                light: {
                    primaryColor: "#667eea",
                    primaryColorDark: "#764ba2"
                },
                dark: {
                    primaryColor: "#3498db",
                    primaryColorDark: "#2980b9"
                }
            }
        };
        resolve(fallbackPalette);
    }
}

async function fetchPaletteData(imageUrl) {
    console.log('馃帹 寮€濮嬭幏鍙栬皟鑹叉澘锛屽浘鐗嘦RL:', imageUrl);
    
    if (paletteCache.has(imageUrl)) {
        const cached = paletteCache.get(imageUrl);
        console.log('馃摝 浣跨敤缂撳瓨鐨勮皟鑹叉澘');
        // 鏇存柊缂撳瓨椤哄簭锛屽皢鏈€杩戜娇鐢ㄧ殑鏀惧湪鏈€鍚?        paletteCache.delete(imageUrl);
        paletteCache.set(imageUrl, cached);
        return cached;
    }

    // 瀵逛簬閰锋垜闊充箰鐨勫浘鐗囷紝鐩存帴杩斿洖榛樿璋冭壊鏉匡紙閰锋垜闊充箰鍔熻兘鏆傛湭淇锛?    if (imageUrl.includes('kuwo')) {
        console.log('馃幍 閰锋垜闊充箰鍥剧墖锛屼娇鐢ㄩ粯璁よ皟鑹叉澘');
        const defaultPalette = {
            gradients: {
                light: {
                    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                },
                dark: {
                    gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                }
            },
            tokens: {
                light: {
                    primaryColor: "#667eea",
                    primaryColorDark: "#764ba2"
                },
                dark: {
                    primaryColor: "#3498db",
                    primaryColorDark: "#2980b9"
                }
            }
        };
        paletteCache.set(imageUrl, defaultPalette);
        persistPaletteCache();
        return defaultPalette;
    }

    try {
        console.log('馃攳 灏濊瘯鏈湴鍙栬壊');
        // 浼樺厛灏濊瘯鏈湴鍙栬壊锛屾湰鍦板彇鑹叉洿鍙潬
        const localPalette = await getLocalPalette(imageUrl);
        if (localPalette) {
            console.log('鉁?鏈湴鍙栬壊鎴愬姛锛岀紦瀛樿皟鑹叉澘');
            paletteCache.set(imageUrl, localPalette);
            persistPaletteCache();
            return localPalette;
        }
        console.warn('鈿狅笍 鏈湴鍙栬壊杩斿洖绌猴紝浣跨敤榛樿璋冭壊鏉?);
    } catch (localError) {
        console.error('鉂?鏈湴鍙栬壊寮傚父:', localError);
    }

    // 濡傛灉鏈湴鍙栬壊澶辫触锛岃繑鍥為粯璁よ皟鑹叉澘
    console.log('馃搵 浣跨敤榛樿璋冭壊鏉?);
    const defaultPalette = {
        gradients: {
            light: {
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            },
            dark: {
                gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
            }
        },
        tokens: {
            light: {
                primaryColor: "#667eea",
                primaryColorDark: "#764ba2"
            },
            dark: {
                primaryColor: "#3498db",
                primaryColorDark: "#2980b9"
            }
        }
    };
    
    paletteCache.set(imageUrl, defaultPalette);
    persistPaletteCache();
    return defaultPalette;
}

async function updateDynamicBackground(imageUrl) {
    paletteRequestId += 1;
    const requestId = paletteRequestId;

    console.log('馃幁 鏇存柊鍔ㄦ€佽儗鏅紝鍥剧墖URL:', imageUrl);
    debugLog(`鍔ㄦ€佽儗鏅? 鏇存柊鑷虫柊鐨勫浘鐗?${imageUrl}`);

    if (!imageUrl) {
        console.warn('鉂?鍥剧墖URL涓虹┖锛岄噸缃姩鎬佽儗鏅?);
        resetDynamicBackground();
        return;
    }

    // 濡傛灉鍥剧墖URL涓庡綋鍓嶇浉鍚屼笖宸叉湁璋冭壊鏉匡紝鐩存帴浣跨敤
    if (state.currentPaletteImage === imageUrl && state.dynamicPalette) {
        console.log('馃攧 鍥剧墖URL鐩稿悓涓斿凡鏈夎皟鑹叉澘锛岀洿鎺ュ簲鐢?);
        queuePaletteApplication(state.dynamicPalette, imageUrl);
        return;
    }

    try {
        // 鑾峰彇鎴栫敓鎴愯皟鑹叉澘
        const palette = await fetchPaletteData(imageUrl);
        
        // 妫€鏌ヨ姹傛槸鍚﹀凡琚彇娑?        if (requestId !== paletteRequestId) {
            console.log('鈴笍 璇锋眰宸茶鍙栨秷锛岃烦杩囧簲鐢ㄨ皟鑹叉澘');
            return;
        }
        
        console.log('馃帹 搴旂敤璋冭壊鏉垮埌鑳屾櫙');
        queuePaletteApplication(palette, imageUrl);
    } catch (error) {
        console.error("鉂?鑾峰彇鍔ㄦ€佽儗鏅け璐?", error);
        debugLog(`鍔ㄦ€佽儗鏅姞杞藉け璐? ${error}`);
        if (requestId === paletteRequestId) {
            console.log('馃攧 閲嶇疆鍔ㄦ€佽儗鏅?);
            resetDynamicBackground();
        }
    }
}

function savePlayerState(options = {}) {
    const { skipRemote = false } = options;
    safeSetLocalStorage("playlistSongs", JSON.stringify(state.playlistSongs), { skipRemote });
    safeSetLocalStorage("currentTrackIndex", String(state.currentTrackIndex), { skipRemote });
    safeSetLocalStorage("playMode", state.playMode, { skipRemote });
    safeSetLocalStorage("playbackQuality", state.playbackQuality, { skipRemote });
    safeSetLocalStorage("playerVolume", String(state.volume), { skipRemote });
    safeSetLocalStorage("currentPlaylist", state.currentPlaylist, { skipRemote });
    safeSetLocalStorage("currentList", state.currentList, { skipRemote });
    if (state.currentSong) {
        safeSetLocalStorage("currentSong", JSON.stringify(state.currentSong), { skipRemote });
    } else {
        safeSetLocalStorage("currentSong", "", { skipRemote });
    }
    safeSetLocalStorage("currentPlaybackTime", String(state.currentPlaybackTime || 0), { skipRemote });
}

function saveFavoriteState(options = {}) {
    const { skipRemote = false } = options;
    safeSetLocalStorage("favoriteSongs", JSON.stringify(state.favoriteSongs), { skipRemote });
    safeSetLocalStorage("currentFavoriteIndex", String(state.currentFavoriteIndex), { skipRemote });
    safeSetLocalStorage("favoritePlayMode", state.favoritePlayMode, { skipRemote });
    safeSetLocalStorage("favoritePlaybackTime", String(state.favoritePlaybackTime || 0), { skipRemote });
}

// 璋冭瘯鏃ュ織鍑芥暟
function debugLog(message) {
    console.log(`[DEBUG] ${message}`);
    if (state.debugMode) {
        const debugInfo = dom.debugInfo;
        const entry = document.createElement("div");
        entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        debugInfo.appendChild(entry);

        while (debugInfo.childNodes.length > 50) {
            debugInfo.removeChild(debugInfo.firstChild);
        }

        debugInfo.classList.add("show");
        debugInfo.scrollTop = debugInfo.scrollHeight;
    }
}

// 鍚敤璋冭瘯妯″紡锛堟寜Ctrl+D锛?document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        state.debugMode = !state.debugMode;
        if (state.debugMode) {
            dom.debugInfo.classList.add("show");
            debugLog("璋冭瘯妯″紡宸插惎鐢?);
        } else {
            dom.debugInfo.classList.remove("show");
        }
    }
});

// 鏂板锛氬垏鎹㈡悳绱㈡ā寮?function toggleSearchMode(enable) {
    state.isSearchMode = enable;
    if (enable) {
        dom.container.classList.add("search-mode");
        debugLog("杩涘叆鎼滅储妯″紡");
    } else {
        dom.container.classList.remove("search-mode");
        debugLog("閫€鍑烘悳绱㈡ā寮?);
    }
}

// 鏂板锛氭樉绀烘悳绱㈢粨鏋?function showSearchResults(options = {}) {
    const { restore = false } = options;
    toggleSearchMode(true);
    if (state.sourceMenuOpen) {
        scheduleSourceMenuPositionUpdate();
    }
    if (state.qualityMenuOpen) {
        schedulePlayerQualityMenuPositionUpdate();
    }
    if (restore) {
        restoreSearchResultsList();
    }
}

// 鏂板锛氶殣钘忔悳绱㈢粨鏋?- 浼樺寲绔嬪嵆鏀惰捣
function hideSearchResults() {
    toggleSearchMode(false);
    if (state.sourceMenuOpen) {
        scheduleSourceMenuPositionUpdate();
    }
    if (state.qualityMenuOpen) {
        schedulePlayerQualityMenuPositionUpdate();
    }
    // 绔嬪嵆娓呯┖鎼滅储缁撴灉鍐呭
    const container = dom.searchResultsList || dom.searchResults;
    if (container) {
        container.innerHTML = "";
    }
    state.renderedSearchCount = 0;
    resetSelectedSearchResults();
    closeImportSelectedMenu();
}

function createSearchStateSnapshot() {
    return {
        keyword: typeof state.searchKeyword === "string" ? state.searchKeyword : "",
        source: normalizeSource(state.searchSource),
        page: Number.isInteger(state.searchPage) && state.searchPage > 0 ? state.searchPage : 1,
        hasMore: Boolean(state.hasMoreResults),
        results: cloneSearchResults(state.searchResults),
    };
}

function persistLastSearchState() {
    const snapshot = createSearchStateSnapshot();
    if (!snapshot.keyword) {
        lastSearchStateCache = null;
        safeRemoveLocalStorage(LAST_SEARCH_STATE_STORAGE_KEY);
        return;
    }
    lastSearchStateCache = { ...snapshot, results: cloneSearchResults(snapshot.results) };
    safeSetLocalStorage(LAST_SEARCH_STATE_STORAGE_KEY, JSON.stringify(snapshot));
}

function restoreStateFromSnapshot(snapshot) {
    const sanitized = sanitizeStoredSearchState(snapshot, state.searchSource || SOURCE_OPTIONS[0].value);
    if (!sanitized || !sanitized.keyword) {
        return false;
    }
    state.searchKeyword = sanitized.keyword;
    state.searchSource = sanitized.source;
    state.searchPage = sanitized.page;
    state.hasMoreResults = sanitized.hasMore;
    state.searchResults = cloneSearchResults(sanitized.results);
    lastSearchStateCache = { ...sanitized, results: cloneSearchResults(sanitized.results) };
    safeSetLocalStorage("searchSource", state.searchSource);
    updateSourceLabel();
    buildSourceMenu();
    return true;
}

function restoreSearchResultsList() {
    const container = dom.searchResultsList || dom.searchResults;
    if (!container) {
        return;
    }
    if (container.childElementCount > 0) {
        return;
    }
    const results = Array.isArray(state.searchResults) ? state.searchResults : [];
    state.renderedSearchCount = 0;
    displaySearchResults(results, {
        reset: true,
        totalCount: results.length,
    });
}

function handleSearchInputFocus() {
    if (!dom.searchInput) {
        return;
    }

    const currentValue = dom.searchInput.value.trim();
    if (currentValue && state.searchKeyword && currentValue !== state.searchKeyword) {
        return;
    }

    const hasKeyword = typeof state.searchKeyword === "string" && state.searchKeyword.length > 0;
    const hasResults = Array.isArray(state.searchResults) && state.searchResults.length > 0;

    if (!hasKeyword || !hasResults) {
        const restored = restoreStateFromSnapshot(lastSearchStateCache);
        if (!restored) {
            return;
        }
    }

    if (!dom.searchInput.value.trim()) {
        dom.searchInput.value = state.searchKeyword;
        window.requestAnimationFrame(() => {
            try {
                dom.searchInput.select();
            } catch (error) {
                console.warn("閫夋嫨鎼滅储鏂囨湰澶辫触", error);
            }
        });
    }

    showSearchResults({ restore: true });
}

const playModeTexts = {
    "list": "鍒楄〃寰幆",
    "single": "鍗曟洸寰幆",
    "random": "闅忔満鎾斁"
};

const playModeIcons = {
    "list": "fa-repeat",
    "single": "fa-redo",
    "random": "fa-shuffle"
};

function getActivePlayMode() {
    return state.currentList === "favorite" ? state.favoritePlayMode : state.playMode;
}

function getLastNonRandomMode() {
    if (state.currentList === "favorite") {
        return state.favoriteLastNonRandomMode || "list";
    }
    return state.playlistLastNonRandomMode || "list";
}

function rememberLastNonRandomMode() {
    const currentMode = getActivePlayMode();
    if (currentMode === "random") {
        return;
    }
    const mode = currentMode || "list";
    if (state.currentList === "favorite") {
        state.favoriteLastNonRandomMode = mode;
    } else {
        state.playlistLastNonRandomMode = mode;
    }
}

function updateShuffleButtonUI() {
    const button = dom.shuffleToggleBtn;
    if (!button) {
        return;
    }
    const mode = getActivePlayMode();
    const isRandom = mode === "random";
    button.setAttribute("aria-pressed", isRandom ? "true" : "false");
    const iconClass = isRandom ? "shuffle-icon shuffle-icon--on" : "shuffle-icon shuffle-icon--off";
    button.innerHTML = `<i class="fas fa-shuffle ${iconClass}"></i>`;
    const label = isRandom ? "鍏抽棴闅忔満鎾斁" : "寮€鍚殢鏈烘挱鏀?;
    button.title = label;
    button.setAttribute("aria-label", label);
}

function updatePlayModeUI() {
    const mode = getActivePlayMode();
    if (dom.playModeBtn) {
        dom.playModeBtn.innerHTML = `<i class="fas ${playModeIcons[mode] || playModeIcons.list}"></i>`;
        dom.playModeBtn.title = `鎾斁妯″紡: ${playModeTexts[mode] || playModeTexts.list}`;
    }
    updateShuffleButtonUI();
}

function setPlayMode(mode, { announce = true } = {}) {
    const validModes = ["list", "single", "random"];
    if (!validModes.includes(mode)) {
        return getActivePlayMode();
    }
    const isFavoriteList = state.currentList === "favorite";
    const key = isFavoriteList ? "favoritePlayMode" : "playMode";
    const previousMode = state[key];
    if (previousMode === mode) {
        updatePlayModeUI();
        return mode;
    }

    state[key] = mode;
    if (mode !== "random") {
        if (isFavoriteList) {
            state.favoriteLastNonRandomMode = mode;
        } else {
            state.playlistLastNonRandomMode = mode;
        }
    }

    if (isFavoriteList) {
        saveFavoriteState();
    } else {
        savePlayerState();
    }

    updatePlayModeUI();

    if (announce) {
        const modeText = playModeTexts[mode] || playModeTexts.list;
        showNotification(`鎾斁妯″紡: ${modeText}`);
        debugLog(`鎾斁妯″紡鍒囨崲涓? ${mode} (鍒楄〃: ${state.currentList})`);
    }

    return mode;
}

// 鏂板锛氭挱鏀炬ā寮忓垏鎹?function togglePlayMode() {
    const modes = isMobileView ? ["list", "single", "random"] : ["list", "single"];
    const currentMode = getActivePlayMode();
    let currentIndex = modes.indexOf(currentMode);
    if (currentIndex === -1) {
        currentIndex = 0;
    }
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    if (nextMode === "random") {
        rememberLastNonRandomMode();
    }
    setPlayMode(nextMode);
}

function toggleShuffleMode() {
    const currentMode = getActivePlayMode();
    if (currentMode === "random") {
        const fallback = getLastNonRandomMode();
        setPlayMode(fallback);
        return;
    }
    rememberLastNonRandomMode();
    setPlayMode("random");
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "00:00";
    }
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updatePlayPauseButton() {
    if (!dom.playPauseBtn) return;
    const isPlaying = !dom.audioPlayer.paused && !dom.audioPlayer.ended;
    dom.playPauseBtn.innerHTML = `<i class="fas ${isPlaying ? "fa-pause" : "fa-play"}"></i>`;
    dom.playPauseBtn.title = isPlaying ? "鏆傚仠" : "鎾斁";
    if (document.body) {
        document.body.classList.toggle("is-playing", isPlaying);
    }
}

function updateProgressBarBackground(value = Number(dom.progressBar.value), max = Number(dom.progressBar.max)) {
    const duration = Number.isFinite(max) && max > 0 ? max : 0;
    const progressValue = Number.isFinite(value) ? Math.max(value, 0) : 0;
    const percent = duration > 0 ? Math.min(progressValue / duration, 1) * 100 : 0;
    dom.progressBar.style.setProperty("--progress", `${percent}%`);
}

function updateVolumeSliderBackground(volume = dom.audioPlayer.volume) {
    const clamped = Math.min(Math.max(Number.isFinite(volume) ? volume : 0, 0), 1);
    dom.volumeSlider.style.setProperty("--volume-progress", `${clamped * 100}%`);
}

function updateVolumeIcon(volume) {
    if (!dom.volumeIcon) return;
    const clamped = Math.min(Math.max(Number.isFinite(volume) ? volume : 0, 0), 1);
    let icon = "fa-volume-high";
    if (clamped === 0) {
        icon = "fa-volume-xmark";
    } else if (clamped < 0.4) {
        icon = "fa-volume-low";
    }
    dom.volumeIcon.className = `fas ${icon}`;
}

function onAudioVolumeChange() {
    const volume = dom.audioPlayer.volume;
    state.volume = volume;
    dom.volumeSlider.value = volume;
    updateVolumeSliderBackground(volume);
    updateVolumeIcon(volume);
    savePlayerState();
}

function handleVolumeChange(event) {
    const volume = Number.parseFloat(event.target.value);
    const clamped = Number.isFinite(volume) ? Math.min(Math.max(volume, 0), 1) : dom.audioPlayer.volume;
    dom.audioPlayer.volume = clamped;
    state.volume = clamped;
    updateVolumeSliderBackground(clamped);
    updateVolumeIcon(clamped);
    safeSetLocalStorage("playerVolume", String(clamped));
}

function handleTimeUpdate() {
    const currentTime = dom.audioPlayer.currentTime || 0;
    
    if (!state.isSeeking) {
        dom.progressBar.value = currentTime;
        dom.currentTimeDisplay.textContent = formatTime(currentTime);
        updateProgressBarBackground(currentTime, Number(dom.progressBar.max));
    }

    syncLyrics();

    if (state.currentList === "favorite") {
        state.favoritePlaybackTime = currentTime;
        if (Math.abs(currentTime - state.favoriteLastSavedPlaybackTime) >= 2) {
            state.favoriteLastSavedPlaybackTime = currentTime;
            safeSetLocalStorage("favoritePlaybackTime", currentTime.toFixed(1));
        }
    } else {
        state.currentPlaybackTime = currentTime;
        if (Math.abs(currentTime - state.lastSavedPlaybackTime) >= 2) {
            state.lastSavedPlaybackTime = currentTime;
            safeSetLocalStorage("currentPlaybackTime", currentTime.toFixed(1));
        }
    }
}

// 閽堝閰锋垜闊充箰鐨勯澶栦慨澶嶏細鐩戞帶currentTime鍙樺寲锛堝凡绂佺敤锛屽洜涓洪叿鎴戦煶涔愬姛鑳芥殏鏈慨澶嶏級
/*
let currentTimeMonitor = null;
function startCurrentTimeMonitor() {
    if (currentTimeMonitor) {
        clearInterval(currentTimeMonitor);
    }
    
    if (state.currentSong && state.currentSong.source === 'kuwo') {
        let lastCurrentTime = 0;
        let consecutiveSameTime = 0;
        
        currentTimeMonitor = setInterval(() => {
            const currentTime = dom.audioPlayer.currentTime || 0;
            
            if (Math.abs(currentTime - lastCurrentTime) < 0.1) {
                consecutiveSameTime++;
            } else {
                consecutiveSameTime = 0;
            }
            
            // 濡傛灉杩炵画5娆℃鏌urrentTime閮芥病鏈夊彉鍖栵紝灏濊瘯閲嶇疆鎾斁
            if (consecutiveSameTime >= 5 && !dom.audioPlayer.paused) {
                consecutiveSameTime = 0;
                
                // 淇濆瓨褰撳墠杩涘害
                const savedTime = currentTime;
                
                // 灏濊瘯閲嶇疆鎾斁
                dom.audioPlayer.currentTime = Math.max(0, savedTime - 0.5);
                dom.audioPlayer.play().catch(() => {
                    // 蹇界暐鎾斁閿欒
                });
            }
            
            lastCurrentTime = currentTime;
        }, 1000);
    }
}
*/

// 淇濈暀stopCurrentTimeMonitor鍑芥暟锛岄伩鍏嶈繍琛屾椂閿欒
let currentTimeMonitor = null;
function stopCurrentTimeMonitor() {
    if (currentTimeMonitor) {
        clearInterval(currentTimeMonitor);
        currentTimeMonitor = null;
    }
}

function handleLoadedMetadata() {
    const duration = dom.audioPlayer.duration || 0;
    dom.progressBar.max = duration;
    dom.durationDisplay.textContent = formatTime(duration);
    const storedTime = state.currentList === "favorite"
        ? state.favoritePlaybackTime
        : state.currentPlaybackTime;
    dom.progressBar.value = storedTime;
    dom.currentTimeDisplay.textContent = formatTime(storedTime);
    updateProgressBarBackground(storedTime, duration);

    if (state.pendingSeekTime != null) {
        setAudioCurrentTime(state.pendingSeekTime);
        state.pendingSeekTime = null;
    }
}

function setAudioCurrentTime(time) {
    if (!Number.isFinite(time)) return;
    const duration = dom.audioPlayer.duration || Number(dom.progressBar.max) || 0;
    const clamped = duration > 0 ? Math.min(Math.max(time, 0), duration) : Math.max(time, 0);
    try {
        dom.audioPlayer.currentTime = clamped;
    } catch (error) {
        console.warn("璁剧疆鎾斁杩涘害澶辫触", error);
    }
    dom.progressBar.value = clamped;
    dom.currentTimeDisplay.textContent = formatTime(clamped);
    updateProgressBarBackground(clamped, duration);
    if (state.currentList === "favorite") {
        state.favoritePlaybackTime = clamped;
    } else {
        state.currentPlaybackTime = clamped;
    }
}

function handleProgressInput() {
    state.isSeeking = true;
    const value = Number(dom.progressBar.value);
    dom.currentTimeDisplay.textContent = formatTime(value);
    updateProgressBarBackground(value, Number(dom.progressBar.max));
}

function handleProgressChange() {
    const value = Number(dom.progressBar.value);
    state.isSeeking = false;
    seekAudio(value);
}

function seekAudio(value) {
    if (!Number.isFinite(value)) return;
    setAudioCurrentTime(value);
    if (state.currentList === "favorite") {
        state.favoriteLastSavedPlaybackTime = state.favoritePlaybackTime;
        safeSetLocalStorage("favoritePlaybackTime", state.favoritePlaybackTime.toFixed(1));
    } else {
        state.lastSavedPlaybackTime = state.currentPlaybackTime;
        safeSetLocalStorage("currentPlaybackTime", state.currentPlaybackTime.toFixed(1));
    }
}

async function togglePlayPause() {
    if (!state.currentSong) {
        if (state.playlistSongs.length > 0) {
            const targetIndex = state.currentTrackIndex >= 0 && state.currentTrackIndex < state.playlistSongs.length
                ? state.currentTrackIndex
                : 0;
            await playPlaylistSong(targetIndex);
        } else {
            showNotification("鎾斁鍒楄〃涓虹┖锛岃鍏堟坊鍔犳瓕鏇?, "error");
        }
        return;
    }

    if (!dom.audioPlayer.src) {
        try {
            await playSong(state.currentSong, {
                autoplay: true,
                startTime: state.currentPlaybackTime,
                preserveProgress: true,
            });
        } catch (error) {
            console.error("鎭㈠鎾斁澶辫触:", error);
            showNotification("鎾斁澶辫触锛岃绋嶅悗閲嶈瘯", "error");
        }
        return;
    }

    if (dom.audioPlayer.paused) {
        state.isPlaying = true;
        const playPromise = dom.audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("play() Promise琚嫆缁?", error);
                
                // 鍏抽敭淇锛氭鏌ュ疄闄呮挱鏀剧姸鎬侊紝鑰屼笉浠呬粎渚濊禆Promise缁撴灉
                if (!dom.audioPlayer.paused) {
                    console.log("鉁?铏界劧play() Promise琚嫆缁濓紝浣嗛煶棰戝疄闄呮挱鏀炬垚鍔?);
                    state.isPlaying = true;
                } else {
                    console.error("鎾斁纭疄澶辫触:", error);
                    showNotification("鎾斁澶辫触锛岃妫€鏌ョ綉缁滆繛鎺?, "error");
                    state.isPlaying = false;
                }
            });
        }
    } else {
        state.isPlaying = false;
        dom.audioPlayer.pause();
    }
    updatePlayPauseButton();
}

function buildSourceMenu() {
    if (!dom.sourceMenu) return;
    const optionsHtml = SOURCE_OPTIONS.map(option => {
        const isActive = option.value === state.searchSource;
        return `
            <div class="source-option${isActive ? " active" : ""}" data-source="${option.value}" role="option" aria-selected="${isActive}">
                <span>${option.label}</span>
                ${isActive ? '<i class="fas fa-check" aria-hidden="true"></i>' : ""}
            </div>
        `;
    }).join("");
    dom.sourceMenu.innerHTML = optionsHtml;
    if (state.sourceMenuOpen) {
        scheduleSourceMenuPositionUpdate();
    }
}

function updateSourceLabel() {
    const option = SOURCE_OPTIONS.find(item => item.value === state.searchSource) || SOURCE_OPTIONS[0];
    if (!option || !dom.sourceSelectLabel || !dom.sourceSelectButton) return;
    dom.sourceSelectLabel.textContent = option.label;
    dom.sourceSelectButton.dataset.source = option.value;
    dom.sourceSelectButton.setAttribute("aria-expanded", state.sourceMenuOpen ? "true" : "false");
    dom.sourceSelectButton.setAttribute("aria-label", `褰撳墠闊虫簮锛?{option.label}锛岀偣鍑诲垏鎹㈤煶婧恅);
    dom.sourceSelectButton.setAttribute("title", `闊虫簮锛?{option.label}`);
}

function updateSourceMenuPosition() {
    if (!state.sourceMenuOpen || !dom.sourceMenu || !dom.sourceSelectButton) return;

    const menu = dom.sourceMenu;
    const button = dom.sourceSelectButton;
    const spacing = 10;
    const buttonWidth = Math.ceil(button.getBoundingClientRect().width);
    const effectiveWidth = Math.max(buttonWidth, 140);

    menu.style.left = "0px";
    menu.style.width = `${effectiveWidth}px`;
    menu.style.minWidth = `${effectiveWidth}px`;
    menu.style.maxWidth = `${effectiveWidth}px`;

    const menuHeight = Math.max(menu.scrollHeight, 0);
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
    const spaceBelow = Math.max(viewportHeight - buttonRect.bottom - spacing, 0);
    const canOpenUpwards = buttonRect.top - spacing - menuHeight >= 0;
    const shouldOpenUpwards = menuHeight > spaceBelow && canOpenUpwards;

    if (shouldOpenUpwards) {
        menu.classList.add("open-upwards");
        menu.classList.remove("open-downwards");
        menu.style.top = "";
        menu.style.bottom = `${button.offsetHeight + spacing}px`;
    } else {
        menu.classList.add("open-downwards");
        menu.classList.remove("open-upwards");
        menu.style.bottom = "";
        menu.style.top = `${button.offsetHeight + spacing}px`;
    }
}

function resetSourceMenuPosition() {
    if (!dom.sourceMenu) return;
    dom.sourceMenu.classList.remove("open-upwards", "open-downwards");
    dom.sourceMenu.style.top = "";
    dom.sourceMenu.style.left = "";
    dom.sourceMenu.style.bottom = "";
    dom.sourceMenu.style.minWidth = "";
    dom.sourceMenu.style.maxWidth = "";
    dom.sourceMenu.style.width = "";
}

function openSourceMenu() {
    if (!dom.sourceMenu || !dom.sourceSelectButton) return;
    state.sourceMenuOpen = true;
    ensureFloatingMenuListeners();
    buildSourceMenu();
    dom.sourceMenu.classList.add("show");
    dom.sourceSelectButton.classList.add("active");
    dom.sourceSelectButton.setAttribute("aria-expanded", "true");
    updateSourceMenuPosition();
    scheduleSourceMenuPositionUpdate();
}

function closeSourceMenu() {
    if (!dom.sourceMenu) return;
    dom.sourceMenu.classList.remove("show");
    dom.sourceSelectButton.classList.remove("active");
    dom.sourceSelectButton.setAttribute("aria-expanded", "false");
    state.sourceMenuOpen = false;
    cancelSourceMenuPositionUpdate();
    resetSourceMenuPosition();
    releaseFloatingMenuListenersIfIdle();
}

function toggleSourceMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    if (state.sourceMenuOpen) {
        closeSourceMenu();
    } else {
        openSourceMenu();
    }
}

function handleSourceSelection(event) {
    const option = event.target.closest(".source-option");
    if (!option) return;
    event.preventDefault();
    event.stopPropagation();
    const { source } = option.dataset;
    if (source) {
        selectSearchSource(source);
    }
}

function selectSearchSource(source) {
    const normalized = normalizeSource(source);
    if (normalized === state.searchSource) {
        closeSourceMenu();
        return;
    }
    state.searchSource = normalized;
    safeSetLocalStorage("searchSource", normalized);
    updateSourceLabel();
    buildSourceMenu();
    closeSourceMenu();
}

function buildQualityMenu() {
    if (!dom.playerQualityMenu) return;
    const optionsHtml = QUALITY_OPTIONS.map(option => {
        const isActive = option.value === state.playbackQuality;
        return `
            <div class="player-quality-option${isActive ? " active" : ""}" data-quality="${option.value}">
                <span>${option.label}</span>
                <small>${option.description}</small>
            </div>
        `;
    }).join("");
    dom.playerQualityMenu.innerHTML = optionsHtml;
    if (state.qualityMenuOpen) {
        schedulePlayerQualityMenuPositionUpdate();
    }
}

function isElementNode(value) {
    return Boolean(value) && typeof value === "object" && value.nodeType === 1;
}

function resolveQualityAnchor(anchor) {
    if (isElementNode(anchor)) {
        return anchor;
    }
    if (isElementNode(dom.qualityToggle)) {
        return dom.qualityToggle;
    }
    if (isElementNode(dom.mobileQualityToggle)) {
        return dom.mobileQualityToggle;
    }
    return null;
}

function setQualityAnchorState(anchor, expanded) {
    if (!isElementNode(anchor)) {
        return;
    }
    anchor.classList.toggle("active", Boolean(expanded));
    if (typeof anchor.setAttribute === "function") {
        anchor.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
}

function getQualityMenuAnchor() {
    if (isElementNode(qualityMenuAnchor) && (!document.body || document.body.contains(qualityMenuAnchor))) {
        return qualityMenuAnchor;
    }
    const fallback = resolveQualityAnchor();
    qualityMenuAnchor = fallback;
    return fallback;
}

function updateQualityLabel() {
    const option = QUALITY_OPTIONS.find(item => item.value === state.playbackQuality) || QUALITY_OPTIONS[0];
    if (!option) return;
    dom.qualityLabel.textContent = option.label;
    dom.qualityToggle.title = `闊宠川: ${option.label} (${option.description})`;
    if (dom.mobileQualityLabel) {
        dom.mobileQualityLabel.textContent = option.label;
    }
    if (dom.mobileQualityToggle) {
        dom.mobileQualityToggle.title = `闊宠川: ${option.label} (${option.description})`;
    }
}

function togglePlayerQualityMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const anchor = resolveQualityAnchor(event && event.currentTarget ? event.currentTarget : qualityMenuAnchor);
    if (!anchor) {
        return;
    }
    if (state.qualityMenuOpen && qualityMenuAnchor === anchor) {
        closePlayerQualityMenu();
    } else {
        openPlayerQualityMenu(anchor);
    }
}

function updatePlayerQualityMenuPosition() {
    if (!state.qualityMenuOpen || !dom.playerQualityMenu) return;

    const anchor = getQualityMenuAnchor();
    if (!isElementNode(anchor)) {
        return;
    }
    const menu = dom.playerQualityMenu;
    const toggleRect = anchor.getBoundingClientRect();
    const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
    const viewportHeight = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
    const spacing = 10;

    menu.classList.add("floating");

    const targetWidth = Math.max(Math.round(toggleRect.width), 180);
    menu.style.minWidth = `${targetWidth}px`;
    menu.style.maxWidth = `${targetWidth}px`;
    menu.style.width = `${targetWidth}px`;
    menu.style.right = "auto";

    const menuRect = menu.getBoundingClientRect();
    const menuHeight = Math.round(menuRect.height);
    const menuWidth = Math.round(menuRect.width) || targetWidth;

    let top = Math.round(toggleRect.bottom + spacing);
    let openUpwards = false;
    if (top + menuHeight > viewportHeight - spacing) {
        const upwardTop = Math.round(toggleRect.top - spacing - menuHeight);
        if (upwardTop >= spacing) {
            top = upwardTop;
            openUpwards = true;
        } else {
            top = Math.max(spacing, viewportHeight - spacing - menuHeight);
        }
    }

    const isPortraitOrientation = (() => {
        if (typeof window.matchMedia === "function") {
            const portraitQuery = window.matchMedia("(orientation: portrait)");
            if (typeof portraitQuery.matches === "boolean") {
                return portraitQuery.matches;
            }
        }
        return viewportHeight >= viewportWidth;
    })();

    let left;
    if (isMobileView && isPortraitOrientation) {
        left = Math.round(toggleRect.left + (toggleRect.width - menuWidth) / 2);
    } else {
        left = Math.round(toggleRect.right - menuWidth);
    }

    const minLeft = spacing;
    const maxLeft = Math.max(minLeft, viewportWidth - spacing - menuWidth);
    left = Math.min(Math.max(left, minLeft), maxLeft);

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.classList.toggle("open-upwards", openUpwards);
    menu.classList.toggle("open-downwards", !openUpwards);
}

function resetPlayerQualityMenuPosition() {
    if (!dom.playerQualityMenu) return;
    dom.playerQualityMenu.classList.remove("floating", "open-upwards", "open-downwards");
    dom.playerQualityMenu.style.top = "";
    dom.playerQualityMenu.style.left = "";
    dom.playerQualityMenu.style.right = "";
    dom.playerQualityMenu.style.minWidth = "";
    dom.playerQualityMenu.style.maxWidth = "";
    dom.playerQualityMenu.style.width = "";
}

function openPlayerQualityMenu(anchor) {
    if (!dom.playerQualityMenu) return;
    const targetAnchor = resolveQualityAnchor(anchor);
    if (!targetAnchor) {
        return;
    }
    if (qualityMenuAnchor && qualityMenuAnchor !== targetAnchor) {
        setQualityAnchorState(qualityMenuAnchor, false);
    }
    qualityMenuAnchor = targetAnchor;
    state.qualityMenuOpen = true;
    ensureFloatingMenuListeners();
    const menu = dom.playerQualityMenu;
    setQualityAnchorState(qualityMenuAnchor, true);
    menu.classList.add("floating");
    menu.classList.remove("show");

    runWithoutTransition(menu, () => {
        updatePlayerQualityMenuPosition();
    });

    requestAnimationFrame(() => {
        if (!state.qualityMenuOpen) return;
        menu.classList.add("show");
    });

    schedulePlayerQualityMenuPositionUpdate();
}

function closePlayerQualityMenu() {
    if (!dom.playerQualityMenu) return;
    const menu = dom.playerQualityMenu;
    const wasOpen = state.qualityMenuOpen || menu.classList.contains("show");

    if (!wasOpen) {
        resetPlayerQualityMenuPosition();
        setQualityAnchorState(qualityMenuAnchor, false);
        qualityMenuAnchor = null;
        releaseFloatingMenuListenersIfIdle();
        return;
    }

    const finalizeClose = () => {
        if (finalizeClose._timeout) {
            window.clearTimeout(finalizeClose._timeout);
            finalizeClose._timeout = null;
        }
        menu.removeEventListener("transitionend", handleTransitionEnd);
        if (state.qualityMenuOpen || menu.classList.contains("show")) {
            return;
        }
        resetPlayerQualityMenuPosition();
        releaseFloatingMenuListenersIfIdle();
    };

    const handleTransitionEnd = (event) => {
        if (event.target !== menu) {
            return;
        }
        if (event.propertyName && !["opacity", "transform"].includes(event.propertyName)) {
            return;
        }
        finalizeClose();
    };

    menu.addEventListener("transitionend", handleTransitionEnd);
    finalizeClose._timeout = window.setTimeout(finalizeClose, 250);

    menu.classList.remove("show");
    state.qualityMenuOpen = false;
    cancelPlayerQualityMenuPositionUpdate();
    setQualityAnchorState(qualityMenuAnchor, false);
    qualityMenuAnchor = null;
}

function handlePlayerQualitySelection(event) {
    const option = event.target.closest(".player-quality-option");
    if (!option) return;
    event.preventDefault();
    event.stopPropagation();
    const { quality } = option.dataset;
    if (quality) {
        selectPlaybackQuality(quality);
    }
}

async function selectPlaybackQuality(quality) {
    const normalized = normalizeQuality(quality);
    if (normalized === state.playbackQuality) {
        closePlayerQualityMenu();
        return;
    }

    state.playbackQuality = normalized;
    updateQualityLabel();
    buildQualityMenu();
    savePlayerState();
    closePlayerQualityMenu();

    const option = QUALITY_OPTIONS.find(item => item.value === normalized);
    if (option) {
        showNotification(`闊宠川宸插垏鎹负 ${option.label} (${option.description})`);
    }

    if (state.currentSong) {
        const success = await reloadCurrentSong();
        if (!success) {
            showNotification("鍒囨崲闊宠川澶辫触锛岃绋嶅悗閲嶈瘯", "error");
        }
    }
}

async function reloadCurrentSong() {
    if (!state.currentSong) return true;
    const wasPlaying = !dom.audioPlayer.paused;
    const targetTime = dom.audioPlayer.currentTime || state.currentPlaybackTime || 0;
    try {
        await playSong(state.currentSong, {
            autoplay: wasPlaying,
            startTime: targetTime,
            preserveProgress: true,
        });
        if (!wasPlaying) {
            dom.audioPlayer.pause();
            updatePlayPauseButton();
        }
        return true;
    } catch (error) {
        console.error("鍒囨崲闊宠川澶辫触:", error);
        return false;
    }
}

async function restoreCurrentSongState() {
    if (!state.currentSong) return;
    try {
        await playSong(state.currentSong, {
            autoplay: false,
            startTime: state.currentPlaybackTime,
            preserveProgress: true,
        });
        dom.audioPlayer.pause();
        updatePlayPauseButton();
    } catch (error) {
        console.warn("鎭㈠闊抽澶辫触:", error);
    }
}

// ================================================
// 閿佸睆鎿嶄綔鎷︽埅鍣?// ================================================
function setupLockScreenInterceptor() {
    // 鎷︽埅鍏ㄥ眬鎾斁鍑芥暟锛屾爣璁伴攣灞忕姸鎬?    const functionsToPatch = ['playNext', 'playPrevious', 'playPlaylistSong', 'autoPlayNext'];
    
    functionsToPatch.forEach(fnName => {
        if (typeof window[fnName] === 'function') {
            const original = window[fnName];
            window[fnName] = function(...args) {
                // 濡傛灉椤甸潰涓嶅彲瑙侊紙閿佸睆/鍚庡彴锛夛紝寮哄埗鍚敤澧炲己閲嶅悓姝?                if (document.visibilityState === 'hidden') {
                    console.log(`馃敀 閿佸睆璋冪敤: ${fnName}`);
                    // 杩欓噷鎴戜滑鍒╃敤 JS 鐨勯棴鍖呯壒鎬ф垨鑰呬慨鏀?playSong 鐨勯粯璁ゅ弬鏁?                    // 浣嗘渶绠€鍗曠殑鏄洿鎺ヨ皟鐢紝鍥犱负 playSong 鍐呴儴宸茬粡妫€娴嬩簡 visibilityState
                }
                return original.apply(this, args);
            };
        }
    });

    // 鐩戝惉 Media Session 鐨勪笅涓€鏇?涓婁竴鏇?    if ('mediaSession' in navigator) {
        const actionHandlers = [['nexttrack', 'playNext'], ['previoustrack', 'playPrevious']];
        actionHandlers.forEach(([action, globalFn]) => {
            try {
                navigator.mediaSession.setActionHandler(action, () => {
                    console.log(`馃敀 閿佸睆 MediaSession: ${action}`);
                    if (window[globalFn]) window[globalFn]();
                });
            } catch(e) {}
        });
    }
}

// 纭繚鍦ㄥ垵濮嬪寲鏃惰皟鐢ㄥ畠
// 璇峰湪 window.addEventListener("load", ...) 涔嬪墠璋冪敤
setupLockScreenInterceptor();

window.addEventListener("load", setupInteractions);
// 浠呭湪娴忚鍣ㄤ笉鏀寔 Media Session API 鏃剁洃鍚?ended 浜嬩欢锛?// 閬垮厤涓庡獟浣撲細璇濈殑缁撴潫鍥炶皟閲嶅瑙﹀彂鑷姩鎾斁銆?if (!("mediaSession" in navigator)) {
    dom.audioPlayer.addEventListener("ended", autoPlayNext);
}

function setupInteractions() {
    function ensureQualityMenuPortal() {
        if (!dom.playerQualityMenu || !document.body || !isMobileView) {
            return;
        }
        const currentParent = dom.playerQualityMenu.parentElement;
        if (!currentParent || currentParent === document.body) {
            return;
        }
        currentParent.removeChild(dom.playerQualityMenu);
        document.body.appendChild(dom.playerQualityMenu);
    }

    function initializePlaylistEventHandlers() {
        if (!dom.playlistItems) {
            return;
        }

        const activatePlaylistItem = (index) => {
            if (typeof index !== "number" || Number.isNaN(index)) {
                return;
            }
            playPlaylistSong(index);
        };

        const handlePlaylistAction = (event, actionButton) => {
            const index = Number(actionButton.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }

            const action = actionButton.dataset.playlistAction;
            if (action === "remove") {
                event.preventDefault();
                event.stopPropagation();
                removeFromPlaylist(index);
            } else if (action === "favorite") {
                event.preventDefault();
                event.stopPropagation();
                const song = state.playlistSongs[index];
                if (song) {
                    toggleFavorite(song);
                }
            } else if (action === "download") {
                event.preventDefault();
                event.stopPropagation();
                showQualityMenu(event, index, "playlist");
            }
        };

        const handleClick = (event) => {
            const actionButton = event.target.closest("[data-playlist-action]");
            if (actionButton) {
                handlePlaylistAction(event, actionButton);
                return;
            }
            const item = event.target.closest(".playlist-item");
            if (!item || !dom.playlistItems.contains(item)) {
                return;
            }

            const index = Number(item.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }

            activatePlaylistItem(index);

            if (event.detail !== 0 && typeof item.blur === "function") {
                item.blur();
            }
        };

        const handleKeydown = (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }
            if (event.target.closest("[data-playlist-action]")) {
                return;
            }
            const item = event.target.closest(".playlist-item");
            if (!item || !dom.playlistItems.contains(item)) {
                return;
            }
            const index = Number(item.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }
            event.preventDefault();
            activatePlaylistItem(index);
        };

        dom.playlistItems.addEventListener("click", handleClick);
        dom.playlistItems.addEventListener("keydown", handleKeydown);
    }

    function initializeFavoritesEventHandlers() {
        if (!dom.favoriteItems) {
            return;
        }

        const activateFavoriteItem = (index) => {
            if (typeof index !== "number" || Number.isNaN(index)) {
                return;
            }
            playFavoriteSong(index);
        };

        const handleFavoriteAction = (event, actionButton) => {
            const index = Number(actionButton.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }

            const action = actionButton.dataset.favoriteAction;
            if (action === "add") {
                event.preventDefault();
                event.stopPropagation();
                const song = state.favoriteSongs[index];
                if (!song) {
                    return;
                }
                const added = addSongToPlaylist(song);
                if (added) {
                    renderPlaylist();
                    showNotification("宸叉坊鍔犲埌鎾斁鍒楄〃", "success");
                } else {
                    showNotification("鎾斁鍒楄〃宸插寘鍚姝屾洸", "warning");
                }
            } else if (action === "download") {
                event.preventDefault();
                event.stopPropagation();
                showQualityMenu(event, index, "favorites");
            } else if (action === "remove") {
                event.preventDefault();
                event.stopPropagation();
                const removed = removeFavoriteAtIndex(index);
                if (removed) {
                    showNotification("宸蹭粠鏀惰棌鍒楄〃绉婚櫎", "success");
                }
            }
        };

        const handleClick = (event) => {
            const actionButton = event.target.closest("[data-favorite-action]");
            if (actionButton) {
                handleFavoriteAction(event, actionButton);
                return;
            }
            const item = event.target.closest(".playlist-item");
            if (!item || !dom.favoriteItems.contains(item)) {
                return;
            }

            const index = Number(item.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }

            event.preventDefault();
            activateFavoriteItem(index);
        };

        const handleKeydown = (event) => {
            const actionButton = event.target.closest("[data-favorite-action]");
            if (actionButton) {
                if (event.key === "Enter" || event.key === " ") {
                    handleFavoriteAction(event, actionButton);
                }
                return;
            }
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }
            const item = event.target.closest(".playlist-item");
            if (!item || !dom.favoriteItems.contains(item)) {
                return;
            }
            const index = Number(item.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }
            event.preventDefault();
            activateFavoriteItem(index);
        };

        dom.favoriteItems.addEventListener("click", handleClick);
        dom.favoriteItems.addEventListener("keydown", handleKeydown);
    }

    function applyTheme(isDark) {
        if (!state.themeDefaultsCaptured) {
            captureThemeDefaults();
        }
        document.body.classList.toggle("dark-mode", isDark);
        dom.themeToggleButton.classList.toggle("is-dark", isDark);
        const label = isDark ? "鍒囨崲涓烘祬鑹叉ā寮? : "鍒囨崲涓烘繁鑹叉ā寮?;
        dom.themeToggleButton.setAttribute("aria-label", label);
        dom.themeToggleButton.setAttribute("title", label);
        applyDynamicGradient();
    }

    captureThemeDefaults();
    const savedTheme = safeGetLocalStorage("theme");
    // 榛樿浣跨敤娴呰壊涓婚锛屼笉鍐嶈窡闅忕郴缁熷亸濂?    const initialIsDark = savedTheme ? savedTheme === "dark" : false;
    applyTheme(initialIsDark);

    dom.themeToggleButton.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        applyTheme(isDark);
        safeSetLocalStorage("theme", isDark ? "dark" : "light");
    });

    // 涓虹Щ鍔ㄧ鏍囬娣诲姞涓婚鍒囨崲鍔熻兘
    if (dom.mobileToolbarTitle) {
        dom.mobileToolbarTitle.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark-mode");
            applyTheme(!isDark);
            safeSetLocalStorage("theme", !isDark ? "dark" : "light");
        });
    }

    dom.audioPlayer.volume = state.volume;
    dom.volumeSlider.value = state.volume;
    updateVolumeSliderBackground(state.volume);
    updateVolumeIcon(state.volume);

    buildSourceMenu();
    updateSourceLabel();
    buildQualityMenu();
    ensureQualityMenuPortal();
    initializePlaylistEventHandlers();
    initializeFavoritesEventHandlers();
    updateQualityLabel();
    updatePlayPauseButton();
    const initialTime = state.currentList === "favorite"
        ? state.favoritePlaybackTime
        : state.currentPlaybackTime;
    dom.progressBar.value = initialTime;
    dom.currentTimeDisplay.textContent = formatTime(initialTime);
    updateProgressBarBackground(initialTime, Number(dom.progressBar.max));
    renderFavorites();
    switchLibraryTab(state.currentList === "favorite" ? "favorites" : "playlist");
    updatePlayModeUI();

    dom.playPauseBtn.addEventListener("click", togglePlayPause);
    dom.audioPlayer.addEventListener("timeupdate", handleTimeUpdate);
    dom.audioPlayer.addEventListener("loadedmetadata", handleLoadedMetadata);
    dom.audioPlayer.addEventListener("play", updatePlayPauseButton);
    dom.audioPlayer.addEventListener("pause", updatePlayPauseButton);
    dom.audioPlayer.addEventListener("volumechange", onAudioVolumeChange);
    dom.audioPlayer.addEventListener("error", handleAudioError);

    dom.progressBar.addEventListener("input", handleProgressInput);
    dom.progressBar.addEventListener("change", handleProgressChange);
    dom.progressBar.addEventListener("pointerup", handleProgressChange);

    dom.volumeSlider.addEventListener("input", handleVolumeChange);

    if (dom.sourceSelectButton && dom.sourceMenu) {
        dom.sourceSelectButton.addEventListener("click", toggleSourceMenu);
        dom.sourceMenu.addEventListener("click", handleSourceSelection);
    }
    dom.qualityToggle.addEventListener("click", togglePlayerQualityMenu);
    if (dom.mobileQualityToggle) {
        dom.mobileQualityToggle.addEventListener("click", togglePlayerQualityMenu);
    }
    setQualityAnchorState(dom.qualityToggle, false);
    if (dom.mobileQualityToggle) {
        setQualityAnchorState(dom.mobileQualityToggle, false);
    }
    dom.playerQualityMenu.addEventListener("click", handlePlayerQualitySelection);

    if (isMobileView && dom.albumCover) {
        dom.albumCover.addEventListener("click", () => {
            toggleMobileInlineLyrics();
        });
    }

    if (isMobileView && dom.mobileInlineLyrics) {
        dom.mobileInlineLyrics.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!state.isMobileInlineLyricsOpen) {
                return;
            }
            closeMobileInlineLyrics();
        });
    }

    dom.loadOnlineBtn.addEventListener("click", exploreOnlineMusic);
    if (dom.mobileExploreButton) {
        dom.mobileExploreButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeAllMobileOverlays();
            exploreOnlineMusic();
        });
    }

    if (dom.importPlaylistBtn && dom.importPlaylistInput) {
        dom.importPlaylistBtn.addEventListener("click", () => {
            dom.importPlaylistInput.value = "";
            dom.importPlaylistInput.click();
        });
        dom.importPlaylistInput.addEventListener("change", handleImportPlaylistChange);
    }

    if (dom.exportPlaylistBtn) {
        dom.exportPlaylistBtn.addEventListener("click", exportPlaylist);
    }

    if (dom.mobileImportPlaylistBtn && dom.importPlaylistInput) {
        dom.mobileImportPlaylistBtn.addEventListener("click", () => {
            dom.importPlaylistInput.value = "";
            dom.importPlaylistInput.click();
        });
    }

    if (dom.mobileExportPlaylistBtn) {
        dom.mobileExportPlaylistBtn.addEventListener("click", exportPlaylist);
    }

    if (dom.addAllFavoritesBtn) {
        dom.addAllFavoritesBtn.addEventListener("click", addAllFavoritesToPlaylist);
    }

    if (dom.importFavoritesBtn && dom.importFavoritesInput) {
        dom.importFavoritesBtn.addEventListener("click", () => {
            dom.importFavoritesInput.value = "";
            dom.importFavoritesInput.click();
        });
        dom.importFavoritesInput.addEventListener("change", handleImportFavoritesChange);
    }

    if (dom.exportFavoritesBtn) {
        dom.exportFavoritesBtn.addEventListener("click", exportFavorites);
    }

    if (dom.clearFavoritesBtn) {
        dom.clearFavoritesBtn.addEventListener("click", clearFavorites);
    }

    if (dom.mobileAddAllFavoritesBtn) {
        dom.mobileAddAllFavoritesBtn.addEventListener("click", addAllFavoritesToPlaylist);
    }

    if (dom.mobileImportFavoritesBtn && dom.importFavoritesInput) {
        dom.mobileImportFavoritesBtn.addEventListener("click", () => {
            dom.importFavoritesInput.value = "";
            dom.importFavoritesInput.click();
        });
    }

    if (dom.mobileExportFavoritesBtn) {
        dom.mobileExportFavoritesBtn.addEventListener("click", exportFavorites);
    }

    if (dom.mobileClearFavoritesBtn) {
        dom.mobileClearFavoritesBtn.addEventListener("click", clearFavorites);
    }

    if (dom.currentFavoriteToggle) {
        dom.currentFavoriteToggle.addEventListener("click", () => {
            if (!state.currentSong) {
                return;
            }
            toggleFavorite(state.currentSong);
        });
    }

    if (Array.isArray(dom.libraryTabs) && dom.libraryTabs.length > 0) {
        dom.libraryTabs.forEach((tab) => {
            if (!(tab instanceof HTMLElement)) {
                return;
            }
            tab.addEventListener("click", () => {
                const target = tab.dataset.target === "favorites" ? "favorites" : "playlist";
                switchLibraryTab(target);
            });
        });
    }

    if (dom.importSelectedBtn) {
        dom.importSelectedBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (dom.importSelectedBtn.disabled) {
                return;
            }
            const isOpen = dom.importSelectedMenu && !dom.importSelectedMenu.hasAttribute("hidden");
            if (isOpen) {
                closeImportSelectedMenu();
            } else {
                openImportSelectedMenu();
            }
        });
    }

    if (dom.importToPlaylist) {
        dom.importToPlaylist.addEventListener("click", (event) => {
            event.preventDefault();
            closeImportSelectedMenu();
            importSelectedSearchResults("playlist");
        });
    }

    if (dom.importToFavorites) {
        dom.importToFavorites.addEventListener("click", (event) => {
            event.preventDefault();
            closeImportSelectedMenu();
            importSelectedSearchResults("favorites");
        });
    }

    if (dom.showPlaylistBtn) {
        dom.showPlaylistBtn.addEventListener("click", () => {
            if (isMobileView) {
                openMobilePanel("playlist");
            } else {
                switchMobileView("playlist");
            }
        });
    }
    if (dom.showLyricsBtn) {
        dom.showLyricsBtn.addEventListener("click", () => {
            if (isMobileView) {
                openMobilePanel("lyrics");
            } else {
                switchMobileView("lyrics");
            }
        });
    }

    // 鎾斁妯″紡鎸夐挳浜嬩欢
    updatePlayModeUI();
    if (dom.playModeBtn) {
        dom.playModeBtn.addEventListener("click", togglePlayMode);
    }
    if (dom.shuffleToggleBtn) {
        dom.shuffleToggleBtn.addEventListener("click", toggleShuffleMode);
    }

    // 鎼滅储鐩稿叧浜嬩欢 - 淇鎼滅储涓嬫媺妗嗘樉绀洪棶棰?    dom.searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        debugLog("鎼滅储鎸夐挳琚偣鍑?);
        performSearch();
    });

    dom.searchInput.addEventListener("focus", () => {
        debugLog("鎼滅储杈撳叆妗嗚幏寰楃劍鐐癸紝灏濊瘯鎭㈠涓婃鎼滅储缁撴灉");
        handleSearchInputFocus();
    });

    dom.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            debugLog("鎼滅储杈撳叆妗嗗洖杞﹂敭琚寜涓?);
            performSearch();
        }
    });

    updateImportSelectedButton();

    // 淇锛氱偣鍑绘悳绱㈠尯鍩熷閮ㄦ椂闅愯棌鎼滅储缁撴灉
    document.addEventListener("click", (e) => {
        const searchArea = document.querySelector(".search-area");
        if (searchArea && !searchArea.contains(e.target) && state.isSearchMode) {
            debugLog("鐐瑰嚮鎼滅储鍖哄煙澶栭儴锛岄殣钘忔悳绱㈢粨鏋?);
            hideSearchResults();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && state.sourceMenuOpen) {
            closeSourceMenu();
        }
        if (isMobileView && e.key === "Escape") {
            closeAllMobileOverlays();
        }
    });

    // 鎼滅储缁撴灉鐩稿叧浜嬩欢澶勭悊 - 淇鍔犺浇鏇村鎸夐挳鐐瑰嚮闂
    document.addEventListener("click", (e) => {
        const qualityMenus = document.querySelectorAll(".quality-menu");
        qualityMenus.forEach(menu => {
            if (!menu.contains(e.target) &&
                !e.target.closest(".playlist-item-download")) {
                menu.classList.remove("show");
                const parentItem = menu.closest(".search-result-item");
                if (parentItem) parentItem.classList.remove("menu-active");
            }
        });

        if (state.qualityMenuOpen &&
            dom.playerQualityMenu &&
            !dom.playerQualityMenu.contains(e.target)) {
            const anchor = isElementNode(qualityMenuAnchor) ? qualityMenuAnchor : resolveQualityAnchor();
            if (anchor && anchor.contains(e.target)) {
                return;
            }
            closePlayerQualityMenu();
        }

        if (state.sourceMenuOpen &&
            dom.sourceMenu &&
            dom.sourceSelectButton &&
            !dom.sourceMenu.contains(e.target) &&
            !dom.sourceSelectButton.contains(e.target)) {
            closeSourceMenu();
        }
    });

    // 淇锛氫娇鐢ㄦ洿寮哄仴鐨勪簨浠跺鎵樺鐞嗗姞杞芥洿澶氭寜閽偣鍑?    dom.searchResults.addEventListener("click", (e) => {
        debugLog(`鐐瑰嚮浜嬩欢瑙﹀彂: ${e.target.tagName} ${e.target.className} ${e.target.id}`);

        // 妫€鏌ュ绉嶅彲鑳界殑鐩爣鍏冪礌
        const loadMoreBtn = e.target.closest(".load-more-btn") || 
                           e.target.closest("#loadMoreBtn") ||
                           (e.target.id === "loadMoreBtn" ? e.target : null) ||
                           (e.target.classList.contains("load-more-btn") ? e.target : null);

        if (loadMoreBtn) {
            debugLog("妫€娴嬪埌鍔犺浇鏇村鎸夐挳鐐瑰嚮");
            e.preventDefault();
            e.stopPropagation();
            loadMoreResults();
        }
    });

    // 棰濆鐨勭洿鎺ヤ簨浠剁洃鍚櫒浣滀负澶囩敤
    document.addEventListener("click", (e) => {
        if (e.target.id === "loadMoreBtn" || e.target.closest("#loadMoreBtn")) {
            debugLog("澶囩敤浜嬩欢鐩戝惉鍣ㄨЕ鍙?);
            e.preventDefault();
            e.stopPropagation();
            loadMoreResults();
        }
    });

    // 鏂板锛氭瓕璇嶆粴鍔ㄧ洃鍚?    const attachLyricScrollHandler = (scrollElement, getCurrentElement) => {
        if (!scrollElement) {
            return;
        }
        scrollElement.addEventListener("scroll", () => {
            state.userScrolledLyrics = true;
            clearTimeout(state.lyricsScrollTimeout);
            state.lyricsScrollTimeout = setTimeout(() => {
                state.userScrolledLyrics = false;
                const currentLyricElement = typeof getCurrentElement === "function"
                    ? getCurrentElement()
                    : dom.lyricsContent?.querySelector(".current");
                if (currentLyricElement) {
                    scrollToCurrentLyric(currentLyricElement, scrollElement);
                }
            }, 3000);
        }, { passive: true });
    };

    attachLyricScrollHandler(dom.lyricsScroll, () => dom.lyricsContent?.querySelector(".current"));
    attachLyricScrollHandler(dom.mobileInlineLyricsScroll, () => dom.mobileInlineLyricsContent?.querySelector(".current"));

    updatePlaylistActionStates();

    if (state.playlistSongs.length > 0) {
        let restoredIndex = state.currentTrackIndex;
        if (restoredIndex < 0 || restoredIndex >= state.playlistSongs.length) {
            restoredIndex = 0;
        }

        state.currentTrackIndex = restoredIndex;
        state.currentPlaylist = "playlist";
        renderPlaylist();

        const restoredSong = state.playlistSongs[restoredIndex];
        if (restoredSong) {
            state.currentSong = restoredSong;
            updatePlaylistHighlight();
            updateCurrentSongInfo(restoredSong, { updateBackground: true }).catch(error => {
                console.error("鎭㈠姝屾洸淇℃伅澶辫触:", error);
            });
        }

        savePlayerState();
    } else {
        dom.playlist.classList.add("empty");
        if (dom.playlistItems) {
            dom.playlistItems.innerHTML = "";
        }
        updateMobileClearPlaylistVisibility();
    }

    if (state.currentSong) {
        restoreCurrentSongState();
    }

    if (isMobileView) {
        initializeMobileUI();
        updateMobileClearPlaylistVisibility();
    }
    
    // ==========================================
    // 鍦ㄥ嚱鏁版湯灏炬坊鍔犱互涓嬩唬鐮侊細
    // ==========================================
    
    // 璁剧疆瑙ｉ攣鑷姩鎭㈠
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // 鍒氫粠閿佸睆瑙ｉ攣
            setTimeout(() => {
                const player = dom.audioPlayer;
                if (player && !player.paused && player.currentTime > 0) {
                    console.log('馃攧 瑙ｉ攣鍚庨煶棰戠姸鎬佹鏌?);
                    
                    // 妫€鏌ユ槸鍚︽槸 iOS PWA
                    const isIOSPWA = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                                    window.navigator.standalone === true;
                    
                    if (isIOSPWA) {
                        // 鎵ц绠€鍖栫殑纭欢閲嶅悓姝?                        const currentTime = player.currentTime;
                        player.pause();
                        
                        setTimeout(() => {
                            player.currentTime = currentTime + 0.001; // 寰皟 1 姣
                            player.play().catch(e => {
                                console.log('馃攧 瑙ｉ攣鍚庢挱鏀惧け璐?', e);
                            });
                        }, 50);
                    }
                }
            }, 500);
            
            // 闂數渚犳ā寮忥細瑙ｉ攣鍚庣灛闂村畬鎴愭墍鏈夊欢杩熺殑UI鏇存柊
            if (state.needUpdateOnUnlock && state.currentSong) {
                console.log('馃Ω 闂數渚犳ā寮忥細瑙ｉ攣鍚庣灛闂存洿鏂癠I');
                // 浣跨敤 requestAnimationFrame 纭繚娓叉煋甯у氨缁?                requestAnimationFrame(() => {
                    if (state.currentSong) {
                        // 琛ュ叏涔嬪墠璺宠繃鐨?UI 鏇存柊
                        updateCurrentSongInfo(state.currentSong, {
                            loadArtwork: true,
                            updateBackground: true
                        });
                        
                        // 琛ュ叏姝岃瘝婊氬姩浣嶇疆
                        loadLyrics(state.currentSong);
                        
                        // 閲嶇疆鏍囪
                        state.needUpdateOnUnlock = false;
                    }
                });
            }
        }
    });
    
    // 1. 璁剧疆瑙ｉ攣鎭㈠鏈哄埗
    setupUnlockRecovery();
    
    // 2. 鐜妫€娴嬫棩蹇?    console.log('馃幍 鎾斁鍣ㄧ幆澧冩娴?', {
        isIOSPWA: isIOSPWA(),
        userAgent: navigator.userAgent.substring(0, 80),
        displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
        navigatorStandalone: window.navigator.standalone
    });
    
    // 3. 璋冭瘯宸ュ叿
    window.solaraPlayer = {
        // 鐜妫€娴?        env: () => ({
            mode: isIOSPWA() ? '馃摫 PWA鐙珛妯″紡' : '馃寪 娴忚鍣ㄦā寮?,
            stealth: shouldUseStealthMode() ? '馃敀 闅愯韩妯″紡' : '馃寪 姝ｅ父妯″紡',
            visibility: document.visibilityState
        }),
        
        // 鐘舵€佹煡鐪?        status: () => ({
            currentSong: state.currentSong ? state.currentSong.name : '鏃?,
            pendingUpdate: state.pendingStealthUpdate ? '鏈? : '鏃?,
            audio: {
                src: dom.audioPlayer.src ? '宸茶缃? : '鏈缃?,
                playing: !dom.audioPlayer.paused,
                time: dom.audioPlayer.currentTime.toFixed(1),
                volume: dom.audioPlayer.volume,
                muted: dom.audioPlayer.muted
            }
        }),
        
        // 寮哄埗鎭㈠
        forceRecovery: () => performUnlockRecovery(),
        
        // 娴嬭瘯闅愯韩妯″紡
        testStealth: () => {
            if (state.currentSong) {
                console.log('娴嬭瘯闅愯韩妯″紡...');
                state.pendingStealthUpdate = {
                    song: state.currentSong,
                    timestamp: Date.now(),
                    shouldLoadArtwork: true,
                    shouldUpdateBackground: true,
                    shouldLoadLyrics: true
                };
                performUnlockRecovery();
            }
        }
    };
    
    console.log('鉁?iOS PWA 閿佸睆淇鏂规宸插姞杞?);
}

// ================================================
// 闅愯韩妯″紡涓撶敤锛氭洿鏂伴攣灞忓獟浣撲俊鎭?// ================================================
function updateMediaMetadataForStealthMode(song) {
    if (!('mediaSession' in navigator)) return;
    
    try {
        // 鐩存帴鑾峰彇灏侀潰鍒楄〃锛実etArtworkListForLockScreen浼氬鐞嗛粯璁ゅ€?        const artworkList = getArtworkListForLockScreen(song);
        
        // 鏇存柊閿佸睆濯掍綋淇℃伅
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.name || '鏈煡姝屾洸',
            artist: Array.isArray(song.artist) ?
                   song.artist.join(', ') : (song.artist || '鏈煡鑹烘湳瀹?),
            album: song.album || '',
            artwork: artworkList
        });
        
        console.log('馃摫 閿佸睆濯掍綋淇℃伅宸叉洿鏂?, { artworkUrl: artworkList[0].src });
        
    } catch (error) {
        console.warn('鏇存柊閿佸睆淇℃伅澶辫触:', error);
    }
}

// ================================================
// 瑙ｉ攣鎭㈠鏈哄埗
// ================================================
function setupUnlockRecovery() {
    console.log('馃敁 鍒濆鍖栬В閿佹仮澶嶆満鍒?);
    
    let isRecovering = false;
    let lastUnlockTime = 0;
    
    document.addEventListener('visibilitychange', () => {
        console.log('馃憖 椤甸潰鍙鎬у彉鍖?', document.visibilityState);
        
        if (document.visibilityState === 'visible') {
            // 鍒氫粠閿佸睆瑙ｉ攣
            const now = Date.now();
            
            // 闃叉姈锛氶槻姝㈢煭鏃堕棿鍐呭娆¤Е鍙?            if (now - lastUnlockTime < 1000 || isRecovering) {
                return;
            }
            
            lastUnlockTime = now;
            isRecovering = true;
            
            console.log('馃敁 妫€娴嬪埌瑙ｉ攣锛屽紑濮嬫仮澶嶆祦绋?..');
            
            // 寤惰繜鎵ц锛岀‘淇濋〉闈㈠畬鍏ㄦ仮澶?            setTimeout(() => {
                try {
                    performUnlockRecovery();
                } catch (error) {
                    console.error('馃敁 鎭㈠杩囩▼涓嚭閿?', error);
                } finally {
                    isRecovering = false;
                }
            }, 300);
        }
    });
}

// 鎵ц瑙ｉ攣鎭㈠
function performUnlockRecovery() {
    console.log('馃敁 鎵ц瑙ｉ攣鎭㈠娴佺▼');
    
    // 浣跨敤 requestAnimationFrame 纭繚娓叉煋甯у氨缁?    requestAnimationFrame(() => {
        try {
            // === 鎭㈠1锛氬欢杩熺殑UI鏇存柊 ===
            if (state.pendingStealthUpdate) {
                console.log('馃敁 鎭㈠寤惰繜鐨刄I鏇存柊');
                
                const { song, timestamp, shouldLoadArtwork, shouldUpdateBackground, shouldLoadLyrics } = 
                    state.pendingStealthUpdate;
                
                // 妫€鏌ユ槸鍚﹁繃鏈燂紙瓒呰繃60绉掔殑鏇存柊涓㈠純锛?                if (Date.now() - timestamp < 60000) {
                    // 琛ュ叏涔嬪墠璺宠繃鐨?UI 鏇存柊
                    updateCurrentSongInfo(song, {
                        loadArtwork: shouldLoadArtwork,
                        updateBackground: shouldUpdateBackground
                    });
                    
                    // 琛ュ叏姝岃瘝
                    if (shouldLoadLyrics) {
                        loadLyrics(song);
                    }
                    
                    console.log('鉁?UI鎭㈠瀹屾垚');
                } else {
                    console.log('鈴?寤惰繜鏇存柊宸茶繃鏈燂紝璺宠繃');
                }
                
                // 娓呯悊鏍囪
                state.pendingStealthUpdate = null;
                state.needUpdateOnUnlock = false;
            }
            
            // === 鎭㈠2锛氶煶棰戠姸鎬佹鏌ュ拰淇 ===
            const player = dom.audioPlayer;
            if (player && player.src) {
                console.log('馃敁 妫€鏌ラ煶棰戠姸鎬?', {
                    paused: player.paused,
                    currentTime: player.currentTime,
                    volume: player.volume,
                    muted: player.muted
                });
                
                // 濡傛灉闊抽搴旇鍦ㄦ挱鏀句絾鍙兘鏈夐棶棰?                if (!player.paused) {
                    // 妫€鏌ユ槸鍚﹂渶瑕侀煶棰戜慨澶?                    if (player.volume > 0 && !player.muted) {
                        // 闊抽鍙兘娌″０闊筹紝灏濊瘯淇
                        fixAudioOutputIfNeeded();
                    }
                    
                    // 寮哄埗鏇存柊涓€娆¤繘搴︽潯
                    const currentTime = player.currentTime || 0;
                    const duration = player.duration || Number(dom.progressBar.max) || 0;
                    
                    dom.progressBar.value = currentTime;
                    dom.currentTimeDisplay.textContent = formatTime(currentTime);
                    updateProgressBarBackground(currentTime, duration);
                }
            }
            
            // === 鎭㈠3锛歎I鍏冪礌鍒锋柊 ===
            // 鍒锋柊鎾斁鎸夐挳
            updatePlayPauseButton();
            
            // 鍒锋柊鏀惰棌鍥炬爣
            updateFavoriteIcons();
            
            // 鍒锋柊鎾斁鍒楄〃楂樹寒
            if (state.currentPlaylist === "playlist") {
                updatePlaylistHighlight();
            }
            
            // 鍒锋柊鏀惰棌鍒楄〃楂樹寒
            if (state.currentList === "favorite") {
                updateFavoriteHighlight();
            }
            
            console.log('馃敁 瑙ｉ攣鎭㈠娴佺▼瀹屾垚');
            
        } catch (error) {
            console.error('馃敁 鎭㈠杩囩▼涓嚭閿?', error);
        }
    });
}

// 淇闊抽杈撳嚭
function fixAudioOutputIfNeeded() {
    const player = dom.audioPlayer;
    if (!player || !player.src || player.paused) return;
    
    console.log('馃敁 灏濊瘯淇闊抽杈撳嚭');
    
    try {
        const currentTime = player.currentTime;
        const currentVolume = player.volume;
        
        // 鏂规硶锛氭殏鍋?-> 寰皟鏃堕棿 -> 閲嶆柊鎾斁
        player.pause();
        
        setTimeout(() => {
            // 寰皟鏃堕棿锛屽己鍒剁‖浠堕噸鍚屾
            player.currentTime = Math.max(0, currentTime + 0.001);
            player.volume = currentVolume;
            
            player.play().then(() => {
                console.log('鉁?闊抽杈撳嚭淇鎴愬姛');
            }).catch(e => {
                console.warn('闊抽杈撳嚭淇澶辫触:', e);
            });
        }, 50);
        
    } catch (error) {
        console.error('闊抽淇寮傚父:', error);
    }
}

// 淇锛氭洿鏂板綋鍓嶆瓕鏇蹭俊鎭拰灏侀潰
function updateCurrentSongInfo(song, options = {}) {
    const { loadArtwork = true, updateBackground = true } = options;
    
    // 濡傛灉鏄殣韬ā寮忥紝璺宠繃UI鏇存柊
    if (shouldUseStealthMode() && !state.forceUIUpdate) {
        console.log('馃敀 闅愯韩妯″紡锛氳烦杩嘦I鏇存柊');
        return Promise.resolve();
    }
    
    // 鍙湁鍦?updateBackground 涓?true 鏃舵墠鏇存柊褰撳墠姝屾洸鐘舵€?    if (updateBackground) {
        state.currentSong = song;
        dom.currentSongTitle.textContent = song.name;
        updateMobileToolbarTitle();
        updateFavoriteIcons();

        // 淇鑹轰汉鍚嶇О鏄剧ず闂 - 浣跨敤姝ｇ‘鐨勫瓧娈靛悕
        const artistText = Array.isArray(song.artist) ? song.artist.join(', ') : (song.artist || '鏈煡鑹烘湳瀹?);
        dom.currentSongArtist.textContent = artistText;
    }

    cancelDeferredPaletteUpdate();

    if (!loadArtwork) {
        if (updateBackground) {
            dom.albumCover.classList.add("loading");
            dom.albumCover.innerHTML = PLACEHOLDER_HTML;
            state.currentArtworkUrl = null;
        }
        return Promise.resolve();
    }

    // 鍔犺浇灏侀潰
    if (song.pic_id || song.id) {
        cancelDeferredPaletteUpdate();
        dom.albumCover.classList.add("loading");
        const picUrl = API.getPicUrl(song);
        
        // 鐩存帴浣跨敤鍥剧墖URL锛屼笉閫氳繃JSON瑙ｆ瀽
        debugLog(`鐩存帴浣跨敤灏侀潰URL: ${picUrl}`);
        
        const preferredImageUrl = preferHttpsUrl(picUrl);
        const absoluteImageUrl = toAbsoluteUrl(preferredImageUrl);
        
        if (state.currentSong === song) {
            state.currentArtworkUrl = absoluteImageUrl;
            if (typeof window.__SOLARA_UPDATE_MEDIA_METADATA === 'function') {
                window.__SOLARA_UPDATE_MEDIA_METADATA();
            }
        }
        
        // 閽堝QQ闊充箰鐨勫皝闈㈠姞杞戒紭鍖栵紙閰锋垜闊充箰宸茬鐢級
        const isSlowSource = song.source === 'qq';
        const loadTimeout = isSlowSource ? 8000 : 3000;
        
        // 浼樺寲鍥剧墖鍔犺浇锛屾坊鍔犺秴鏃跺鐞嗗拰閲嶈瘯鏈哄埗
        const loadImageWithTimeout = (url, timeout) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                let timeoutId;
                
                // 绉婚櫎crossOrigin灞炴€э紝閬垮厤璺ㄥ煙闂
                
                img.onload = () => {
                    clearTimeout(timeoutId);
                    resolve(img);
                };
                
                img.onerror = () => {
                    clearTimeout(timeoutId);
                    // 鐩存帴鎷掔粷锛屼笉灏濊瘯no-cors妯″紡锛屽洜涓烘垜浠笉闇€瑕佽闂浘鐗囨暟鎹?                    reject(new Error('Image load failed'));
                };
                
                // 璁剧疆瓒呮椂
                timeoutId = setTimeout(() => {
                    img.src = ''; // 鍙栨秷鍥剧墖鍔犺浇
                    reject(new Error(`Image load timed out after ${timeout}ms`));
                }, timeout);
                
                img.src = url;
            });
        };
        
        // 灏濊瘯鍔犺浇鍥剧墖锛屽甫閲嶈瘯鏈哄埗
        const loadImage = async () => {
            const maxRetries = isSlowSource ? 2 : 1;
            let retryCount = 0;
            
            while (retryCount < maxRetries) {
                try {
                    await loadImageWithTimeout(preferredImageUrl, loadTimeout);
                    
                    if (state.currentSong === song && updateBackground) {
                        setAlbumCoverImage(preferredImageUrl);
                        // 浼樺寲锛氭€绘槸绔嬪嵆搴旂敤璋冭壊鏉匡紝鍔犲揩瑙嗚鏁堟灉
                        scheduleDeferredPaletteUpdate(preferredImageUrl, { immediate: true });
                    }
                    return;
                } catch (error) {
                    retryCount++;
                    debugLog(`灏侀潰鍔犺浇澶辫触锛岄噸璇?${retryCount}/${maxRetries}: ${error.message}`);
                    
                    // 鏈€鍚庝竴娆″皾璇曞け璐ワ紝鏄剧ず鍗犱綅绗?                    if (retryCount >= maxRetries) {
                        if (state.currentSong === song && updateBackground) {
                            cancelDeferredPaletteUpdate();
                            showAlbumCoverPlaceholder();
                        }
                    }
                }
            }
        };
        
        loadImage();
    } else {
        cancelDeferredPaletteUpdate();
        if (updateBackground) {
            showAlbumCoverPlaceholder();
        }
    }

    return Promise.resolve();
}

// 鎼滅储鍔熻兘 - 淇鎼滅储涓嬫媺妗嗘樉绀洪棶棰?async function performSearch(isLiveSearch = false) {
    const query = dom.searchInput.value.trim();
    if (!query) {
        showNotification("璇疯緭鍏ユ悳绱㈠叧閿瘝", "error");
        return;
    }

    if (state.sourceMenuOpen) {
        closeSourceMenu();
    }

    const source = normalizeSource(state.searchSource);
    state.searchSource = source;
    safeSetLocalStorage("searchSource", source);
    updateSourceLabel();
    buildSourceMenu();

    // 閲嶇疆鎼滅储鐘舵€?    if (!isLiveSearch) {
        state.searchPage = 1;
        state.searchKeyword = query;
        state.searchSource = source;
        state.searchResults = [];
        state.hasMoreResults = true;
        state.renderedSearchCount = 0;
        resetSelectedSearchResults();
        const listContainer = dom.searchResultsList || dom.searchResults;
        if (listContainer) {
            listContainer.innerHTML = "";
        }
        debugLog(`寮€濮嬫柊鎼滅储: ${query}, 鏉ユ簮: ${source}`);
    } else {
        state.searchKeyword = query;
        state.searchSource = source;
    }

    try {
        // 绂佺敤鎼滅储鎸夐挳骞舵樉绀哄姞杞界姸鎬?        dom.searchBtn.disabled = true;
        dom.searchBtn.innerHTML = '<span class="loader"></span><span>鎼滅储涓?..</span>';

        // 绔嬪嵆鏄剧ず鎼滅储妯″紡
        showSearchResults();
        debugLog("宸插垏鎹㈠埌鎼滅储妯″紡");

        // 鎵ц鎼滅储
        const results = await API.search(query, source, 20, state.searchPage);
        debugLog(`API杩斿洖缁撴灉鏁伴噺: ${results.length}`);

        if (state.searchPage === 1) {
            state.searchResults = results;
        } else {
            state.searchResults = [...state.searchResults, ...results];
        }

        state.hasMoreResults = results.length === 20;

        // 鏄剧ず鎼滅储缁撴灉
        displaySearchResults(results, {
            reset: state.searchPage === 1,
            totalCount: state.searchResults.length,
        });
        persistLastSearchState();
        debugLog(`鎼滅储瀹屾垚: 鎬诲叡鏄剧ず ${state.searchResults.length} 涓粨鏋渀);

        // 濡傛灉娌℃湁缁撴灉锛屾樉绀烘洿鍙嬪ソ鐨勬彁绀轰俊鎭?        if (state.searchResults.length === 0) {
            const platformName = SOURCE_OPTIONS.find(option => option.value === source)?.label || source;
            showNotification(`${platformName} 鏈壘鍒扮浉鍏虫瓕鏇诧紝璇峰皾璇曞叾浠栧钩鍙版垨鍏抽敭璇峘, "info");
        }

    } catch (error) {
        console.error("鎼滅储澶辫触:", error);
        showNotification("鎼滅储澶辫触锛岃绋嶅悗閲嶈瘯", "error");
        hideSearchResults();
        debugLog(`鎼滅储澶辫触: ${error.message}`);
    } finally {
        // 鎭㈠鎼滅储鎸夐挳鐘舵€?        dom.searchBtn.disabled = false;
        dom.searchBtn.innerHTML = '<i class="fas fa-search"></i><span>鎼滅储</span>';
    }
}

// 鍔犺浇鏇村鎼滅储缁撴灉
async function loadMoreResults() {
    if (!state.hasMoreResults || !state.searchKeyword) {
        debugLog("娌℃湁鏇村缁撴灉鎴栨悳绱㈠叧閿瘝涓虹┖");
        return;
    }

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (!loadMoreBtn) {
        debugLog("鎵句笉鍒板姞杞芥洿澶氭寜閽?);
        return;
    }

    try {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<span class="loader"></span><span>鍔犺浇涓?..</span>';

        state.searchPage++;
        debugLog(`鍔犺浇绗?${state.searchPage} 椤电粨鏋渀);

        const source = normalizeSource(state.searchSource);
        state.searchSource = source;
        safeSetLocalStorage("searchSource", source);
        const results = await API.search(state.searchKeyword, source, 20, state.searchPage);

        if (results.length > 0) {
            state.searchResults = [...state.searchResults, ...results];
            state.hasMoreResults = results.length === 20;
            displaySearchResults(results, {
                totalCount: state.searchResults.length,
            });
            persistLastSearchState();
            debugLog(`鍔犺浇瀹屾垚: 鏂板 ${results.length} 涓粨鏋渀);
        } else {
            state.hasMoreResults = false;
            showNotification("娌℃湁鏇村缁撴灉浜?);
            debugLog("娌℃湁鏇村缁撴灉");
        }
    } catch (error) {
        console.error("鍔犺浇鏇村澶辫触:", error);
        showNotification("鍔犺浇澶辫触锛岃绋嶅悗閲嶈瘯", "error");
        state.searchPage--; // 鍥為€€椤电爜
    } finally {
        if (loadMoreBtn) {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = "<i class=\"fas fa-plus\"></i><span>鍔犺浇鏇村</span>";
        }
    }
}

// 鑾峰彇姝屾洸鏉ユ簮绠€绉?function getSourceShortName(source) {
    const sourceMap = {
        'netease': '缃戞槗',
        'kuwo': '閰锋垜',
        'qq': 'QQ'
    };
    return sourceMap[source] || '';
}

function createSearchResultItem(song, index) {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.dataset.index = String(index);

    const selectionToggle = document.createElement("button");
    selectionToggle.className = "search-result-select";
    selectionToggle.type = "button";
    selectionToggle.innerHTML = '<i class="fas fa-check"></i>';
    selectionToggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSearchResultSelection(index);
    });

    const info = document.createElement("div");
    info.className = "search-result-info";

    const title = document.createElement("div");
    title.className = "search-result-title";
    title.textContent = song.name || "鏈煡姝屾洸";

    const artist = document.createElement("div");
    artist.className = "search-result-artist";
    const artistName = Array.isArray(song.artist)
        ? song.artist.join(', ')
        : (song.artist || "鏈煡鑹烘湳瀹?);
    const albumText = song.album ? ` - ${song.album}` : "";
    artist.textContent = `${artistName}${albumText}`;

    info.appendChild(title);
    info.appendChild(artist);

    const actions = document.createElement("div");
    actions.className = "search-result-actions";

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "action-btn favorite favorite-toggle";
    favoriteButton.type = "button";
    favoriteButton.title = "鏀惰棌";
    favoriteButton.dataset.favoriteKey = getSongKey(song) || `search-${index}`;
    favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
    favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(song);
    });

    const playButton = document.createElement("button");
    playButton.className = "action-btn play";
    playButton.type = "button";
    playButton.title = "鎾斁";
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.addEventListener("click", (event) => {
        event.stopPropagation();
        playSearchResult(index);
    });

    const downloadButton = document.createElement("button");
    downloadButton.className = "action-btn download";
    downloadButton.type = "button";
    downloadButton.title = "涓嬭浇";
    downloadButton.innerHTML = '<i class="fas fa-download"></i>';
    downloadButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showQualityMenu(event, index, "search");
    });

    actions.appendChild(favoriteButton);
    actions.appendChild(playButton);
    actions.appendChild(downloadButton);

    item.appendChild(selectionToggle);
    item.appendChild(info);
    item.appendChild(actions);

    applySelectionStateToElement(item, state.selectedSearchResults.has(index));

    item.addEventListener("click", (event) => {
        if (event.target.closest(".search-result-actions")) {
            return;
        }
        if (event.target.closest(".search-result-select")) {
            return;
        }
        toggleSearchResultSelection(index);
    });

    return item;
}

function ensureSelectedSearchResultsSet() {
    if (!(state.selectedSearchResults instanceof Set)) {
        state.selectedSearchResults = new Set();
    }
}

function applySelectionStateToElement(item, isSelected) {
    if (!item) {
        return;
    }
    item.classList.toggle("selected", Boolean(isSelected));
    const toggle = item.querySelector(".search-result-select");
    if (toggle) {
        toggle.setAttribute("aria-pressed", isSelected ? "true" : "false");
        toggle.setAttribute("aria-label", isSelected ? "鍙栨秷閫夋嫨" : "閫夋嫨姝屾洸");
    }
}

function updateSearchResultSelectionUI(index) {
    const container = dom.searchResultsList || dom.searchResults;
    if (!container) {
        return;
    }
    const numericIndex = Number(index);
    const item = container.querySelector(`.search-result-item[data-index="${numericIndex}"]`);
    ensureSelectedSearchResultsSet();
    applySelectionStateToElement(item, state.selectedSearchResults.has(numericIndex));
}

function updateImportSelectedButton() {
    const button = dom.importSelectedBtn;
    if (!button) {
        return;
    }
    ensureSelectedSearchResultsSet();
    const count = state.selectedSearchResults.size;
    button.disabled = count === 0;
    button.setAttribute("aria-disabled", count === 0 ? "true" : "false");
    if (count === 0) {
        closeImportSelectedMenu();
    }
    const countLabel = dom.importSelectedCount;
    if (countLabel) {
        countLabel.textContent = count > 0 ? `(${count})` : "";
    }
    const label = count > 0 ? `瀵煎叆宸查€?(${count})` : "瀵煎叆宸查€?;
    button.title = label;
    button.setAttribute("aria-label", count > 0 ? `瀵煎叆宸查€?${count} 棣栨瓕鏇瞏 : "瀵煎叆宸查€?);
}

function toggleSearchResultSelection(index) {
    const numericIndex = Number(index);
    if (!Number.isInteger(numericIndex) || numericIndex < 0) {
        return;
    }
    ensureSelectedSearchResultsSet();
    if (state.selectedSearchResults.has(numericIndex)) {
        state.selectedSearchResults.delete(numericIndex);
    } else {
        state.selectedSearchResults.add(numericIndex);
    }
    updateSearchResultSelectionUI(numericIndex);
    updateImportSelectedButton();
}

function resetSelectedSearchResults() {
    ensureSelectedSearchResultsSet();
    if (state.selectedSearchResults.size === 0) {
        updateImportSelectedButton();
        return;
    }
    const indices = Array.from(state.selectedSearchResults);
    state.selectedSearchResults.clear();
    indices.forEach(updateSearchResultSelectionUI);
    updateImportSelectedButton();
}

function closeImportSelectedMenu() {
    if (!dom.importSelectedMenu || !dom.importSelectedBtn) {
        return;
    }
    if (!dom.importSelectedMenu.hasAttribute("hidden")) {
        dom.importSelectedMenu.setAttribute("hidden", "");
        dom.importSelectedBtn.setAttribute("aria-expanded", "false");
    }
    if (importSelectedMenuOutsideHandler) {
        document.removeEventListener("click", importSelectedMenuOutsideHandler);
        importSelectedMenuOutsideHandler = null;
    }
}

function openImportSelectedMenu() {
    if (!dom.importSelectedMenu || !dom.importSelectedBtn || dom.importSelectedBtn.disabled) {
        return;
    }
    dom.importSelectedMenu.removeAttribute("hidden");
    dom.importSelectedBtn.setAttribute("aria-expanded", "true");
    if (importSelectedMenuOutsideHandler) {
        document.removeEventListener("click", importSelectedMenuOutsideHandler);
    }
    importSelectedMenuOutsideHandler = (event) => {
        if (!dom.importSelectedMenu || !dom.importSelectedBtn) {
            return;
        }
        if (dom.importSelectedMenu.contains(event.target) || dom.importSelectedBtn.contains(event.target)) {
            return;
        }
        closeImportSelectedMenu();
    };
    window.requestAnimationFrame(() => {
        document.addEventListener("click", importSelectedMenuOutsideHandler);
    });
}

function importSelectedSearchResults(target = "playlist") {
    ensureSelectedSearchResultsSet();
    if (state.selectedSearchResults.size === 0) {
        return;
    }

    const indices = Array.from(state.selectedSearchResults).filter((value) => Number.isInteger(value) && value >= 0);
    if (indices.length === 0) {
        resetSelectedSearchResults();
        return;
    }

    const songsToAdd = indices
        .map((index) => state.searchResults[index])
        .filter((song) => song && typeof song === "object");

    if (songsToAdd.length === 0) {
        resetSelectedSearchResults();
        showNotification("鏈壘鍒板彲瀵煎叆鐨勬瓕鏇?, "warning");
        return;
    }

    const processedIndices = [...indices];
    state.selectedSearchResults.clear();
    processedIndices.forEach(updateSearchResultSelectionUI);
    updateImportSelectedButton();

    if (target === "favorites") {
        const favorites = ensureFavoriteSongsArray();
        const existingKeys = new Set(
            favorites
                .map(getSongKey)
                .filter((key) => typeof key === "string" && key !== "")
        );

        let added = 0;
        let duplicates = 0;

        songsToAdd.forEach((song) => {
            const normalized = sanitizeImportedSong(song) || song;
            const key = getSongKey(normalized);
            if (key && existingKeys.has(key)) {
                duplicates++;
                return;
            }
            favorites.push(normalized);
            if (key) {
                existingKeys.add(key);
            }
            added++;
        });

        if (added > 0) {
            saveFavoriteState();
            renderFavorites();
            const duplicateHint = duplicates > 0 ? `锛?{duplicates} 棣栧凡瀛樺湪` : "";
            showNotification(`鎴愬姛瀵煎叆 ${added} 棣栨敹钘忔瓕鏇?{duplicateHint}`, "success");
        } else {
            updateFavoriteActionStates();
            showNotification("閫変腑鐨勬瓕鏇插凡鍦ㄦ敹钘忓垪琛ㄤ腑", "warning");
        }
        updateFavoriteIcons();
        return;
    }

    if (!Array.isArray(state.playlistSongs)) {
        state.playlistSongs = [];
    }

    const existingKeys = new Set(
        state.playlistSongs
            .map(getSongKey)
            .filter((key) => typeof key === "string" && key !== "")
    );

    let added = 0;
    let duplicates = 0;

    songsToAdd.forEach((song) => {
        const key = getSongKey(song);
        if (key && existingKeys.has(key)) {
            duplicates++;
            return;
        }
        state.playlistSongs.push(song);
        if (key) {
            existingKeys.add(key);
        }
        added++;
    });

    if (added > 0) {
        renderPlaylist();
        const duplicateHint = duplicates > 0 ? `锛?{duplicates} 棣栧凡瀛樺湪` : "";
        showNotification(`鎴愬姛瀵煎叆 ${added} 棣栨瓕鏇?{duplicateHint}`, "success");
    } else {
        updatePlaylistActionStates();
        showNotification("閫変腑鐨勬瓕鏇插凡鍦ㄦ挱鏀惧垪琛ㄤ腑", "warning");
    }
    updateFavoriteIcons();
}

function createLoadMoreButton() {
    const button = document.createElement("button");
    button.id = "loadMoreBtn";
    button.className = "load-more-btn";
    button.type = "button";
    button.innerHTML = '<i class="fas fa-plus"></i><span>鍔犺浇鏇村</span>';
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        loadMoreResults();
    });
    return button;
}

function displaySearchResults(newItems, options = {}) {
    dom.playlist.classList.remove("empty");
    const container = dom.searchResultsList || dom.searchResults;
    if (!container) {
        return;
    }

    const { reset = false, totalCount = state.searchResults.length } = options;

    if (reset) {
        container.innerHTML = "";
        state.renderedSearchCount = 0;
        resetSelectedSearchResults();
    }

    const existingLoadMore = container.querySelector("#loadMoreBtn");
    if (existingLoadMore) {
        existingLoadMore.remove();
    }

    const itemsToAppend = Array.isArray(newItems) ? newItems : [];

    if (itemsToAppend.length === 0 && state.renderedSearchCount === 0 && totalCount === 0) {
        container.innerHTML = "<div style=\"text-align: center; color: var(--text-secondary-color); padding: 20px;\">鏈壘鍒扮浉鍏虫瓕鏇?/div>";
        state.renderedSearchCount = 0;
        debugLog("鏄剧ず鎼滅储缁撴灉: 0 涓粨鏋? 鏃犲彲鐢ㄦ暟鎹?);
        return;
    }

    if (itemsToAppend.length > 0) {
        const fragment = document.createDocumentFragment();
        const startIndex = state.renderedSearchCount;
        itemsToAppend.forEach((song, offset) => {
            fragment.appendChild(createSearchResultItem(song, startIndex + offset));
        });
        container.appendChild(fragment);
        state.renderedSearchCount += itemsToAppend.length;
    }

    if (state.hasMoreResults) {
        container.appendChild(createLoadMoreButton());
    }

    const appendedCount = itemsToAppend.length;
    const totalRendered = state.renderedSearchCount;
    debugLog(`鏄剧ず鎼滅储缁撴灉: 鏂板 ${appendedCount} 涓粨鏋? 鎬昏 ${totalRendered} 涓? 鍔犺浇鏇村鎸夐挳: ${state.hasMoreResults ? "鏄剧ず" : "闅愯棌"}`);
    updateFavoriteIcons();
}

// 鏄剧ず璐ㄩ噺閫夋嫨鑿滃崟
function showQualityMenu(event, index, type) {
    event.stopPropagation();
    console.log('馃嵔锔?showQualityMenu璋冪敤:', index, type);

    // 绉婚櫎鐜版湁鐨勮川閲忚彍鍗?    const existingMenu = document.querySelector(".dynamic-quality-menu");
    if (existingMenu) {
        existingMenu.remove();
    }

    // 鍒涘缓鏂扮殑璐ㄩ噺鑿滃崟
    const menu = document.createElement("div");
    menu.className = "dynamic-quality-menu";
    // 鏀寔澶氱闊宠川閫夐」锛屽寘鎷琭lac24bit
    menu.innerHTML = `
        <div class="quality-option" onclick="downloadWithQuality(event, ${index}, '${type}', 'mp3')">MP3闊宠川</div>
        <div class="quality-option" onclick="downloadWithQuality(event, ${index}, '${type}', 'flac')">鏃犳崯闊宠川 FLAC</div>
        <div class="quality-option" onclick="downloadWithQuality(event, ${index}, '${type}', 'flac24bit')">Hi-Res闊宠川 FLAC24bit</div>
    `;

    // 璁剧疆鑿滃崟浣嶇疆
    const button = event.target.closest("button");
    const rect = button.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.top = (rect.bottom + 5) + "px";
    menu.style.left = (rect.left - 50) + "px";
    menu.style.zIndex = "10000";

    // 娣诲姞鍒癰ody
    document.body.appendChild(menu);
    console.log('馃嵔锔?璐ㄩ噺鑿滃崟宸插垱寤猴紝HTML:', menu.innerHTML);

    // 鐐瑰嚮鍏朵粬鍦版柟鍏抽棴鑿滃崟
    setTimeout(() => {
        document.addEventListener("click", function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener("click", closeMenu);
            }
        });
    }, 0);
}

// 鏍规嵁璐ㄩ噺涓嬭浇 - 鏀寔鎾斁鍒楄〃妯″紡
async function downloadWithQuality(event, index, type, quality) {
    event.stopPropagation();
    let song;

    if (type === "search") {
        song = state.searchResults[index];
    } else if (type === "online") {
        song = state.onlineSongs[index];
    } else if (type === "playlist") {
        song = state.playlistSongs[index];
    } else if (type === "favorites") {
        song = state.favoriteSongs[index];
    }

    if (!song) return;

    // 鍏抽棴鑿滃崟骞剁Щ闄?menu-active 绫?    document.querySelectorAll(".quality-menu").forEach(menu => {
        menu.classList.remove("show");
        const parentItem = menu.closest(".search-result-item");
        if (parentItem) parentItem.classList.remove("menu-active");
    });

    // 鍏抽棴鍔ㄦ€佽川閲忚彍鍗?    const dynamicMenu = document.querySelector(".dynamic-quality-menu");
    if (dynamicMenu) {
        dynamicMenu.remove();
    }

    try {
        // 姝ｇ‘浼犻€掕川閲忓弬鏁?        await downloadSong(song, quality);
    } catch (error) {
        console.error("涓嬭浇澶辫触:", error);
        showNotification("涓嬭浇澶辫触锛岃绋嶅悗閲嶈瘯", "error");
    }
}

// 淇锛氭挱鏀炬悳绱㈢粨鏋?- 娣诲姞鍒版挱鏀惧垪琛ㄨ€屼笉鏄竻绌?async function playSearchResult(index) {
    const song = state.searchResults[index];
    if (!song) return;

    try {
        // 绔嬪嵆闅愯棌鎼滅储缁撴灉锛屾樉绀烘挱鏀剧晫闈?        hideSearchResults();
        dom.searchInput.value = "";
        if (isMobileView) {
            closeMobileSearch();
        }

        // 妫€鏌ユ瓕鏇叉槸鍚﹀凡鍦ㄦ挱鏀惧垪琛ㄤ腑
        const existingIndex = state.playlistSongs.findIndex(s => s.id === song.id && s.source === song.source);

        if (existingIndex !== -1) {
            // 濡傛灉姝屾洸宸插瓨鍦紝鐩存帴鎾斁
            state.currentTrackIndex = existingIndex;
            state.currentPlaylist = "playlist";
            state.currentList = "playlist";
        } else {
            // 濡傛灉姝屾洸涓嶅瓨鍦紝娣诲姞鍒版挱鏀惧垪琛?            state.playlistSongs.push(song);
            state.currentTrackIndex = state.playlistSongs.length - 1;
            state.currentPlaylist = "playlist";
            state.currentList = "playlist";
        }

        // 鏇存柊鎾斁鍒楄〃鏄剧ず
        renderPlaylist();

        // 鎾斁姝屾洸
        await playSong(song);
        updatePlayModeUI();

        showNotification(`姝ｅ湪鎾斁: ${song.name}`);

    } catch (error) {
        console.error("鎾斁澶辫触:", error);
        showNotification("鎾斁澶辫触锛岃绋嶅悗閲嶈瘯", "error");
    }
}

function resolveSongId(song) {
    if (!song || typeof song !== "object") {
        return null;
    }
    const candidates = [
        "id",
        "songId",
        "songid",
        "songmid",
        "mid",
        "hash",
        "sid",
        "rid",
        "trackId"
    ];
    for (const key of candidates) {
        if (Object.prototype.hasOwnProperty.call(song, key)) {
            const value = song[key];
            if (typeof value === "number" && Number.isFinite(value)) {
                return String(value);
            }
            if (typeof value === "string" && value.trim() !== "") {
                return value.trim();
            }
        }
    }
    return null;
}

function normalizeArtistValue(value) {
    if (Array.isArray(value)) {
        const names = value.map((item) => {
            if (typeof item === "string") {
                return item.trim();
            }
            if (item && typeof item === "object" && typeof item.name === "string") {
                return item.name.trim();
            }
            return "";
        }).filter(Boolean);
        if (names.length === 0) {
            return undefined;
        }
        if (names.length === 1) {
            return names[0];
        }
        return names;
    }
    if (value && typeof value === "object" && typeof value.name === "string") {
        const name = value.name.trim();
        return name || undefined;
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed || undefined;
    }
    return undefined;
}

function getSongKey(song) {
    if (!song || typeof song !== "object") {
        return null;
    }
    const source = typeof song.source === "string" && song.source.trim() !== ""
        ? song.source.trim().toLowerCase()
        : (typeof song.platform === "string" && song.platform.trim() !== ""
            ? song.platform.trim().toLowerCase()
            : "netease");
    const id = resolveSongId(song);
    if (id) {
        return `${source}:${id}`;
    }
    const name = typeof song.name === "string" ? song.name.trim().toLowerCase() : "";
    if (!name) {
        return null;
    }
    const artistValue = song.artist ?? song.artists ?? song.singers ?? song.singer;
    let artistText = "";
    if (Array.isArray(artistValue)) {
        artistText = artistValue.map((item) => {
            if (typeof item === "string") {
                return item.trim().toLowerCase();
            }
            if (item && typeof item === "object" && typeof item.name === "string") {
                return item.name.trim().toLowerCase();
            }
            return "";
        }).filter(Boolean).join(",");
    } else if (artistValue && typeof artistValue === "object" && typeof artistValue.name === "string") {
        artistText = artistValue.name.trim().toLowerCase();
    } else if (typeof artistValue === "string") {
        artistText = artistValue.trim().toLowerCase();
    }
    return `${source}:${name}::${artistText}`;
}

function sanitizeImportedSong(rawSong) {
    if (!rawSong || typeof rawSong !== "object") {
        return null;
    }
    const name = typeof rawSong.name === "string" ? rawSong.name.trim() : "";
    if (!name) {
        return null;
    }

    const normalized = { ...rawSong, name };
    const sourceCandidate = rawSong.source || rawSong.platform || rawSong.provider || rawSong.vendor;
    normalized.source = typeof sourceCandidate === "string" && sourceCandidate.trim() !== ""
        ? sourceCandidate.trim()
        : "netease";

    const resolvedId = resolveSongId(rawSong);
    if (resolvedId) {
        normalized.id = resolvedId;
    }

    const artistValue = rawSong.artist ?? rawSong.artists ?? rawSong.singers ?? rawSong.singer;
    const normalizedArtist = normalizeArtistValue(artistValue);
    if (normalizedArtist !== undefined) {
        normalized.artist = normalizedArtist;
    }

    if (normalized.album && typeof normalized.album === "object" && typeof normalized.album.name === "string") {
        normalized.album = normalized.album.name.trim();
    }

    return normalized;
}

function extractPlaylistItems(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (payload && typeof payload === "object") {
        const possibleKeys = ["items", "songs", "playlist", "tracks", "data"];
        for (const key of possibleKeys) {
            if (Array.isArray(payload[key])) {
                return payload[key];
            }
        }
    }
    return [];
}

function updatePlaylistActionStates() {
    const hasSongs = Array.isArray(state.playlistSongs) && state.playlistSongs.length > 0;
    if (dom.exportPlaylistBtn) {
        dom.exportPlaylistBtn.disabled = !hasSongs;
        dom.exportPlaylistBtn.setAttribute("aria-disabled", hasSongs ? "false" : "true");
    }
    if (dom.mobileExportPlaylistBtn) {
        dom.mobileExportPlaylistBtn.disabled = !hasSongs;
        dom.mobileExportPlaylistBtn.setAttribute("aria-disabled", hasSongs ? "false" : "true");
    }
    if (dom.clearPlaylistBtn) {
        dom.clearPlaylistBtn.disabled = !hasSongs;
        dom.clearPlaylistBtn.setAttribute("aria-disabled", hasSongs ? "false" : "true");
    }
    if (dom.mobileClearPlaylistBtn) {
        dom.mobileClearPlaylistBtn.disabled = !hasSongs;
        dom.mobileClearPlaylistBtn.setAttribute("aria-disabled", hasSongs ? "false" : "true");
    }
}

function exportPlaylist() {
    if (!Array.isArray(state.playlistSongs) || state.playlistSongs.length === 0) {
        showNotification("鎾斁鍒楄〃涓虹┖锛屾棤娉曞鍑?, "warning");
        return;
    }

    try {
        const payload = {
            meta: {
                app: "Solara",
                version: PLAYLIST_EXPORT_VERSION,
                exportedAt: new Date().toISOString(),
                itemCount: state.playlistSongs.length
            },
            items: state.playlistSongs
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `solara-playlist-${formattedTimestamp}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        showNotification(`宸插鍑?${state.playlistSongs.length} 棣栨瓕鏇瞏, "success");
    } catch (error) {
        console.error("瀵煎嚭鎾斁鍒楄〃澶辫触:", error);
        showNotification("瀵煎嚭澶辫触锛岃绋嶅悗閲嶈瘯", "error");
    }
}

function handleImportedPlaylistItems(rawItems) {
    if (!Array.isArray(state.playlistSongs)) {
        state.playlistSongs = [];
    }

    const sanitizedSongs = rawItems
        .map(sanitizeImportedSong)
        .filter((song) => song && typeof song === "object");

    if (sanitizedSongs.length === 0) {
        throw new Error("NO_VALID_SONGS");
    }

    const existingKeys = new Set(
        state.playlistSongs
            .map(getSongKey)
            .filter((key) => typeof key === "string" && key !== "")
    );

    let added = 0;
    let duplicates = 0;

    sanitizedSongs.forEach((song) => {
        const key = getSongKey(song);
        if (key && existingKeys.has(key)) {
            duplicates++;
            return;
        }
        state.playlistSongs.push(song);
        if (key) {
            existingKeys.add(key);
        }
        added++;
    });

    if (added > 0) {
        renderPlaylist();
    } else {
        updatePlaylistActionStates();
    }

    return { added, duplicates };
}

function handleImportPlaylistChange(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const text = typeof reader.result === "string" ? reader.result : "";
            if (!text) {
                throw new Error("EMPTY_FILE");
            }

            const payload = parseJSON(text, null);
            if (!payload) {
                throw new Error("INVALID_JSON");
            }

            const items = extractPlaylistItems(payload);
            if (!Array.isArray(items) || items.length === 0) {
                throw new Error("NO_SONGS");
            }

            const { added, duplicates } = handleImportedPlaylistItems(items);
            if (added > 0) {
                const duplicateHint = duplicates > 0 ? `锛?{duplicates} 棣栧凡瀛樺湪` : "";
                showNotification(`鎴愬姛瀵煎叆 ${added} 棣栨瓕鏇?{duplicateHint}`, "success");
            } else {
                showNotification("鏂囦欢涓殑姝屾洸宸插湪鎾斁鍒楄〃涓?, "warning");
            }
        } catch (error) {
            console.error("瀵煎叆鎾斁鍒楄〃澶辫触:", error);
            showNotification("瀵煎叆澶辫触锛岃纭鏂囦欢鏍煎紡", "error");
        } finally {
            if (input) {
                input.value = "";
            }
        }
    };

    reader.onerror = () => {
        console.error("璇诲彇鎾斁鍒楄〃鏂囦欢澶辫触:", reader.error);
        showNotification("鏃犳硶璇诲彇鎾斁鍒楄〃鏂囦欢", "error");
        if (input) {
            input.value = "";
        }
    };

    reader.readAsText(file, "utf-8");
}

// 鏂板锛氭覆鏌撶粺涓€鎾斁鍒楄〃
function renderPlaylist() {
    if (!dom.playlistItems) return;

    if (state.playlistSongs.length === 0) {
        dom.playlist.classList.add("empty");
        dom.playlistItems.innerHTML = "";
        savePlayerState();
        updateFavoriteIcons();
        updatePlaylistHighlight();
        updateMobileClearPlaylistVisibility();
        updatePlaylistActionStates();
        return;
    }

    dom.playlist.classList.remove("empty");
    const playlistHtml = state.playlistSongs.map((song, index) => {
        const artistValue = Array.isArray(song.artist)
            ? song.artist.join(", ")
            : (song.artist || "鏈煡鑹烘湳瀹?);
        const songKey = getSongKey(song) || `playlist-${index}`;
        const sourceShortName = getSourceShortName(song.source);
        const songNameWithSource = sourceShortName ? `[${sourceShortName}] ${song.name}` : song.name;
        return `
        <div class="playlist-item" data-index="${index}" role="button" tabindex="0" aria-label="鎾斁 ${song.name}" data-favorite-key="${songKey}">
            ${songNameWithSource} - ${artistValue}
            <button class="playlist-item-favorite action-btn favorite favorite-toggle" type="button" data-playlist-action="favorite" data-index="${index}" data-favorite-key="${songKey}" title="鏀惰棌" aria-label="鏀惰棌">
                <i class="fa-regular fa-heart"></i>
            </button>
            <button class="playlist-item-download" type="button" data-playlist-action="download" data-index="${index}" title="涓嬭浇">
                <i class="fas fa-download"></i>
            </button>
            <button class="playlist-item-remove" type="button" data-playlist-action="remove" data-index="${index}" title="浠庢挱鏀惧垪琛ㄧЩ闄?>
                <i class="fas fa-times"></i>
            </button>
        </div>`;
    }).join("");
    

    dom.playlistItems.innerHTML = playlistHtml;
    savePlayerState();
    updateFavoriteIcons();
    updatePlaylistHighlight();
    updateMobileClearPlaylistVisibility();
    updatePlaylistActionStates();
}

function ensureFavoriteSongsArray() {
    if (!Array.isArray(state.favoriteSongs)) {
        state.favoriteSongs = [];
    }
    return state.favoriteSongs;
}

function isSongFavorited(song) {
    const key = getSongKey(song);
    if (!key) {
        return false;
    }
    return ensureFavoriteSongsArray().some((item) => getSongKey(item) === key);
}

function updateFavoriteIcons() {
    const favorites = ensureFavoriteSongsArray();
    const favoriteKeys = new Set(
        favorites
            .map(getSongKey)
            .filter((key) => typeof key === "string" && key !== "")
    );

    const toggleButtons = document.querySelectorAll('.favorite-toggle[data-favorite-key]');
    toggleButtons.forEach((button) => {
        const key = button.dataset.favoriteKey;
        const isActive = key && favoriteKeys.has(key);
        button.classList.toggle('is-active', Boolean(isActive));
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('fas', Boolean(isActive));
            icon.classList.toggle('far', !isActive);
            icon.classList.toggle('fa-solid', Boolean(isActive));
            icon.classList.toggle('fa-regular', !isActive);
        }
        if (isActive) {
            button.setAttribute('title', '鍙栨秷鏀惰棌');
            button.setAttribute('aria-label', '鍙栨秷鏀惰棌');
        } else {
            button.setAttribute('title', '鏀惰棌');
            button.setAttribute('aria-label', '鏀惰棌');
        }
    });

    if (dom.currentFavoriteToggle) {
        const currentSong = state.currentSong;
        const key = currentSong ? getSongKey(currentSong) : null;
        const isActive = key && favoriteKeys.has(key);
        dom.currentFavoriteToggle.disabled = !currentSong;
        dom.currentFavoriteToggle.setAttribute('aria-disabled', currentSong ? 'false' : 'true');
        dom.currentFavoriteToggle.classList.toggle('is-active', Boolean(isActive));
        dom.currentFavoriteToggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        const label = isActive ? '鍙栨秷鏀惰棌褰撳墠姝屾洸' : '鏀惰棌褰撳墠姝屾洸';
        dom.currentFavoriteToggle.setAttribute('aria-label', label);
        dom.currentFavoriteToggle.setAttribute('title', label);
        const icon = dom.currentFavoriteToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fas', Boolean(isActive));
            icon.classList.toggle('far', !isActive);
            icon.classList.toggle('fa-solid', Boolean(isActive));
            icon.classList.toggle('fa-regular', !isActive);
        }
    }
}

function switchLibraryTab(target) {
    const showFavorites = target === "favorites";

    if (Array.isArray(dom.libraryTabs) && dom.libraryTabs.length > 0) {
        dom.libraryTabs.forEach((tab) => {
            if (!(tab instanceof HTMLElement)) {
                return;
            }
            const target = tab.dataset.target === "favorites" ? "favorites" : "playlist";
            const isActive = showFavorites ? target === "favorites" : target === "playlist";
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    }

    if (dom.playlist) {
        if (showFavorites) {
            dom.playlist.classList.remove("active");
            dom.playlist.setAttribute("hidden", "");
        } else {
            dom.playlist.classList.add("active");
            dom.playlist.removeAttribute("hidden");
        }
    }

    if (dom.favorites) {
        if (showFavorites) {
            dom.favorites.classList.add("active");
            dom.favorites.removeAttribute("hidden");
        } else {
            dom.favorites.classList.remove("active");
            dom.favorites.setAttribute("hidden", "");
        }
    }

    updateMobileLibraryActionVisibility(showFavorites);
    updateMobileClearPlaylistVisibility();
    closeImportSelectedMenu();
}

// 鏂板锛氫粠鎾斁鍒楄〃绉婚櫎姝屾洸
function removeFromPlaylist(index) {
    if (index < 0 || index >= state.playlistSongs.length) return;

    const removingCurrent = state.currentPlaylist === "playlist" && state.currentTrackIndex === index;

    if (removingCurrent) {
        if (state.playlistSongs.length === 1) {
            dom.audioPlayer.pause();
            dom.audioPlayer.src = "";
            state.currentTrackIndex = -1;
            state.currentSong = null;
            state.currentAudioUrl = null;
            state.currentPlaybackTime = 0;
            state.lastSavedPlaybackTime = 0;
            dom.progressBar.value = 0;
            dom.progressBar.max = 0;
            dom.currentTimeDisplay.textContent = "00:00";
            dom.durationDisplay.textContent = "00:00";
            updateProgressBarBackground(0, 1);
            dom.currentSongTitle.textContent = "閫夋嫨涓€棣栨瓕鏇插紑濮嬫挱鏀?;
            updateMobileToolbarTitle();
            dom.currentSongArtist.textContent = "鏈煡鑹烘湳瀹?;
            showAlbumCoverPlaceholder();
            clearLyricsContent();
            if (dom.lyrics) {
                dom.lyrics.dataset.placeholder = "default";
            }
            dom.lyrics.classList.add("empty");
            updatePlayPauseButton();
        } else if (index === state.playlistSongs.length - 1) {
            state.currentTrackIndex = index - 1;
        }
    } else if (state.currentPlaylist === "playlist" && state.currentTrackIndex > index) {
        state.currentTrackIndex--;
    }

    state.playlistSongs.splice(index, 1);

    if (state.playlistSongs.length === 0) {
        dom.playlist.classList.add("empty");
        if (dom.playlistItems) {
            dom.playlistItems.innerHTML = "";
        }
        state.currentPlaylist = "playlist";
        updateMobileClearPlaylistVisibility();
    } else {
        if (state.currentPlaylist === "playlist" && state.currentTrackIndex < 0) {
            state.currentTrackIndex = 0;
        }

        renderPlaylist();

        if (removingCurrent && state.currentPlaylist === "playlist" && state.currentTrackIndex >= 0) {
            const targetIndex = Math.min(state.currentTrackIndex, state.playlistSongs.length - 1);
            state.currentTrackIndex = targetIndex;
            playPlaylistSong(targetIndex);
        } else {
            updatePlaylistHighlight();
        }
    }

    updatePlaylistActionStates();
    savePlayerState();
    showNotification("宸蹭粠鎾斁鍒楄〃绉婚櫎", "success");
    clearLyricsIfLibraryEmpty();
}

function addSongToPlaylist(song) {
    if (!song || typeof song !== "object") {
        return false;
    }
    if (!Array.isArray(state.playlistSongs)) {
        state.playlistSongs = [];
    }
    const key = getSongKey(song);
    const exists = state.playlistSongs.some((item) => getSongKey(item) === key);
    if (exists) {
        return false;
    }
    state.playlistSongs.push(song);
    return true;
}

function updateFavoriteActionStates() {
    const hasFavorites = Array.isArray(state.favoriteSongs) && state.favoriteSongs.length > 0;
    if (dom.exportFavoritesBtn) {
        dom.exportFavoritesBtn.disabled = !hasFavorites;
        dom.exportFavoritesBtn.setAttribute("aria-disabled", hasFavorites ? "false" : "true");
    }
    if (dom.mobileExportFavoritesBtn) {
        dom.mobileExportFavoritesBtn.disabled = !hasFavorites;
        dom.mobileExportFavoritesBtn.setAttribute("aria-disabled", hasFavorites ? "false" : "true");
    }
    if (dom.clearFavoritesBtn) {
        dom.clearFavoritesBtn.disabled = !hasFavorites;
        dom.clearFavoritesBtn.setAttribute("aria-disabled", hasFavorites ? "false" : "true");
    }
    if (dom.mobileClearFavoritesBtn) {
        dom.mobileClearFavoritesBtn.disabled = !hasFavorites;
        dom.mobileClearFavoritesBtn.setAttribute("aria-disabled", hasFavorites ? "false" : "true");
    }
    if (dom.addAllFavoritesBtn) {
        dom.addAllFavoritesBtn.disabled = !hasFavorites;
        dom.addAllFavoritesBtn.setAttribute("aria-disabled", hasFavorites ? "false" : "true");
    }
    if (dom.mobileAddAllFavoritesBtn) {
        dom.mobileAddAllFavoritesBtn.disabled = !hasFavorites;
        dom.mobileAddAllFavoritesBtn.setAttribute("aria-disabled", hasFavorites ? "false" : "true");
    }
}

function renderFavorites() {
    if (!dom.favoriteItems || !dom.favorites) {
        return;
    }

    const favorites = ensureFavoriteSongsArray();

    if (favorites.length === 0) {
        dom.favorites.classList.add("empty");
        dom.favoriteItems.innerHTML = "";
        updateFavoriteIcons();
        updateFavoriteActionStates();
        return;
    }

    dom.favorites.classList.remove("empty");
    const favoritesHtml = favorites.map((song, index) => {
        const artistValue = Array.isArray(song.artist)
            ? song.artist.join(", ")
            : (song.artist || "鏈煡鑹烘湳瀹?);
        const isCurrent = state.currentList === "favorite" && index === state.currentFavoriteIndex;
        const songKey = getSongKey(song) || `favorite-${index}`;
        const sourceShortName = getSourceShortName(song.source);
        const songNameWithSource = sourceShortName ? `[${sourceShortName}] ${song.name}` : song.name;
        return `
        <div class="playlist-item${isCurrent ? " current" : ""}" data-index="${index}" role="button" tabindex="0" aria-label="鎾斁 ${song.name}" data-favorite-key="${songKey}">
            ${songNameWithSource} - ${artistValue}
            <button class="favorite-item-action favorite-item-action--add" type="button" data-favorite-action="add" data-index="${index}" title="娣诲姞鍒版挱鏀惧垪琛? aria-label="娣诲姞鍒版挱鏀惧垪琛?>
                <i class="fas fa-plus"></i>
            </button>
            <button class="favorite-item-action favorite-item-action--download" type="button" data-favorite-action="download" data-index="${index}" title="涓嬭浇" aria-label="涓嬭浇">
                <i class="fas fa-download"></i>
            </button>
            <button class="favorite-item-action favorite-item-action--remove" type="button" data-favorite-action="remove" data-index="${index}" title="浠庢敹钘忓垪琛ㄧЩ闄? aria-label="浠庢敹钘忓垪琛ㄧЩ闄?>
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    }).join("");

    dom.favoriteItems.innerHTML = favoritesHtml;
    updateFavoriteHighlight();
    updateFavoriteIcons();
    updateFavoriteActionStates();
}

function updateFavoriteHighlight() {
    if (!dom.favoriteItems) {
        return;
    }
    const items = dom.favoriteItems.querySelectorAll(".playlist-item");
    items.forEach((item, index) => {
        const isCurrent = state.currentList === "favorite" && index === state.currentFavoriteIndex;
        item.classList.toggle("current", isCurrent);
        item.setAttribute("aria-current", isCurrent ? "true" : "false");
        item.setAttribute("aria-pressed", isCurrent ? "true" : "false");
    });
}

function removeFavoriteAtIndex(index) {
    const favorites = ensureFavoriteSongsArray();
    if (index < 0 || index >= favorites.length) {
        return null;
    }
    const [removed] = favorites.splice(index, 1);

    if (state.currentList === "favorite") {
        if (state.currentFavoriteIndex === index) {
            if (favorites.length === 0) {
                state.currentFavoriteIndex = 0;
                state.favoritePlaybackTime = 0;
                state.favoriteLastSavedPlaybackTime = 0;
                state.currentList = "playlist";
                state.currentPlaylist = "playlist";
                savePlayerState();
            } else if (state.currentFavoriteIndex >= favorites.length) {
                state.currentFavoriteIndex = favorites.length - 1;
            }
        } else if (state.currentFavoriteIndex > index) {
            state.currentFavoriteIndex--;
        }
    }

    saveFavoriteState();
    renderFavorites();
    updatePlayModeUI();
    clearLyricsIfLibraryEmpty();
    return removed;
}

function toggleFavorite(song) {
    if (!song || typeof song !== "object") {
        return;
    }

    const normalizedSong = sanitizeImportedSong(song) || { ...song };
    const key = getSongKey(normalizedSong);
    if (!key) {
        showNotification("鏃犳硶鏀惰棌璇ユ瓕鏇?, "error");
        return;
    }

    const favorites = ensureFavoriteSongsArray();
    const existingIndex = favorites.findIndex((item) => getSongKey(item) === key);

    if (existingIndex >= 0) {
        removeFavoriteAtIndex(existingIndex);
        showNotification("宸蹭粠鏀惰棌鍒楄〃绉婚櫎", "success");
    } else {
        favorites.push(normalizedSong);
        saveFavoriteState();
        renderFavorites();
        showNotification("宸叉坊鍔犲埌鏀惰棌鍒楄〃", "success");
    }
}

async function playFavoriteSong(index) {
    const favorites = ensureFavoriteSongsArray();
    if (index < 0 || index >= favorites.length) {
        return;
    }

    const song = favorites[index];
    state.currentFavoriteIndex = index;
    state.currentList = "favorite";
    state.currentPlaylist = "favorites";

    try {
        await playSong(song);
        updateFavoriteHighlight();
        updatePlayModeUI();
        saveFavoriteState();
        if (isMobileView) {
            closeMobilePanel();
        }
    } catch (error) {
        console.error("鎾斁鏀惰棌姝屾洸澶辫触:", error);
        showNotification("鎾斁鏀惰棌姝屾洸澶辫触", "error");
    }
}

function addAllFavoritesToPlaylist() {
    const favorites = ensureFavoriteSongsArray();
    if (favorites.length === 0) {
        showNotification("鏀惰棌鍒楄〃涓虹┖", "warning");
        return;
    }

    if (!Array.isArray(state.playlistSongs)) {
        state.playlistSongs = [];
    }

    const existingKeys = new Set(
        state.playlistSongs
            .map(getSongKey)
            .filter((key) => typeof key === "string" && key !== "")
    );

    let added = 0;
    let duplicates = 0;

    favorites.forEach((song) => {
        const key = getSongKey(song);
        if (key && existingKeys.has(key)) {
            duplicates++;
            return;
        }
        state.playlistSongs.push(song);
        if (key) {
            existingKeys.add(key);
        }
        added++;
    });

    if (added > 0) {
        renderPlaylist();
        const duplicateHint = duplicates > 0 ? `锛?{duplicates} 棣栧凡瀛樺湪` : "";
        showNotification(`宸叉坊鍔?${added} 棣栨敹钘忔瓕鏇插埌鎾斁鍒楄〃${duplicateHint}`, "success");
    } else {
        updatePlaylistActionStates();
        showNotification("鏀惰棌姝屾洸鍧囧凡鍦ㄦ挱鏀惧垪琛ㄤ腑", "warning");
    }
}

function clearFavorites() {
    const favorites = ensureFavoriteSongsArray();
    if (favorites.length === 0) {
        showNotification("鏀惰棌鍒楄〃涓虹┖", "warning");
        return;
    }

    if (!window.confirm("纭畾娓呯┖鏀惰棌鍒楄〃鍚楋紵")) {
        return;
    }

    state.favoriteSongs = [];
    state.currentFavoriteIndex = 0;
    state.favoritePlaybackTime = 0;
    state.favoriteLastSavedPlaybackTime = 0;
    if (state.currentList === "favorite") {
        state.currentList = "playlist";
        state.currentPlaylist = "playlist";
    }
    saveFavoriteState();
    savePlayerState();
    renderFavorites();
    updateFavoriteIcons();
    updatePlayModeUI();
    showNotification("鏀惰棌鍒楄〃宸叉竻绌?, "success");
    clearLyricsIfLibraryEmpty();
}

function exportFavorites() {
    const favorites = ensureFavoriteSongsArray();
    if (favorites.length === 0) {
        showNotification("鏀惰棌鍒楄〃涓虹┖锛屾棤娉曞鍑?, "warning");
        return;
    }

    try {
        const payload = {
            meta: {
                app: "Solara",
                version: FAVORITE_EXPORT_VERSION,
                exportedAt: new Date().toISOString(),
                itemCount: favorites.length,
                type: "favorites"
            },
            items: favorites
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `solara-favorites-${formattedTimestamp}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        showNotification(`宸插鍑?${favorites.length} 棣栨敹钘忔瓕鏇瞏, "success");
    } catch (error) {
        console.error("瀵煎嚭鏀惰棌鍒楄〃澶辫触:", error);
        showNotification("瀵煎嚭鏀惰棌鍒楄〃澶辫触", "error");
    }
}

function handleImportedFavoriteItems(rawItems) {
    const favorites = ensureFavoriteSongsArray();

    const sanitizedSongs = rawItems
        .map(sanitizeImportedSong)
        .filter((song) => song && typeof song === "object");

    if (sanitizedSongs.length === 0) {
        throw new Error("NO_VALID_SONGS");
    }

    const existingKeys = new Set(
        favorites
            .map(getSongKey)
            .filter((key) => typeof key === "string" && key !== "")
    );

    let added = 0;
    let duplicates = 0;

    sanitizedSongs.forEach((song) => {
        const key = getSongKey(song);
        if (key && existingKeys.has(key)) {
            duplicates++;
            return;
        }
        favorites.push(song);
        if (key) {
            existingKeys.add(key);
        }
        added++;
    });

    if (added > 0) {
        saveFavoriteState();
        renderFavorites();
    } else {
        updateFavoriteActionStates();
        updateFavoriteIcons();
    }

    return { added, duplicates };
}

function handleImportFavoritesChange(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const text = typeof reader.result === "string" ? reader.result : "";
            if (!text) {
                throw new Error("EMPTY_FILE");
            }

            const payload = parseJSON(text, null);
            if (!payload) {
                throw new Error("INVALID_JSON");
            }

            const meta = payload.meta || {};
            if (meta.version && Number(meta.version) > FAVORITE_EXPORT_VERSION) {
                console.warn("鏀惰棌鍒楄〃鏂囦欢鐗堟湰杈冩柊锛屽皾璇曞吋瀹瑰鍏?);
            }

            const items = Array.isArray(payload.items)
                ? payload.items
                : extractPlaylistItems(payload);

            if (!Array.isArray(items) || items.length === 0) {
                throw new Error("NO_SONGS");
            }

            const { added, duplicates } = handleImportedFavoriteItems(items);
            if (added > 0) {
                const duplicateHint = duplicates > 0 ? `锛?{duplicates} 棣栧凡瀛樺湪` : "";
                showNotification(`鎴愬姛瀵煎叆 ${added} 棣栨敹钘忔瓕鏇?{duplicateHint}`, "success");
            } else {
                showNotification("鏂囦欢涓殑姝屾洸宸插湪鏀惰棌鍒楄〃涓?, "warning");
            }
        } catch (error) {
            console.error("瀵煎叆鏀惰棌鍒楄〃澶辫触:", error);
            showNotification("瀵煎叆鏀惰棌鍒楄〃澶辫触锛岃纭鏂囦欢鏍煎紡", "error");
        } finally {
            if (input) {
                input.value = "";
            }
        }
    };

    reader.onerror = () => {
        console.error("璇诲彇鏀惰棌鍒楄〃鏂囦欢澶辫触:", reader.error);
        showNotification("鏃犳硶璇诲彇鏀惰棌鍒楄〃鏂囦欢", "error");
        if (input) {
            input.value = "";
        }
    };

    reader.readAsText(file, "utf-8");
}

// 鏂板锛氭竻绌烘挱鏀惧垪琛?function clearPlaylist() {
    if (state.playlistSongs.length === 0) return;

    if (state.currentPlaylist === "playlist") {
        dom.audioPlayer.pause();
        dom.audioPlayer.src = "";
        state.currentTrackIndex = -1;
        state.currentSong = null;
        state.currentAudioUrl = null;
        state.currentPlaybackTime = 0;
        state.lastSavedPlaybackTime = 0;
        dom.progressBar.value = 0;
        dom.progressBar.max = 0;
        dom.currentTimeDisplay.textContent = "00:00";
        dom.durationDisplay.textContent = "00:00";
        updateProgressBarBackground(0, 1);
        dom.currentSongTitle.textContent = "閫夋嫨涓€棣栨瓕鏇插紑濮嬫挱鏀?;
        updateMobileToolbarTitle();
        dom.currentSongArtist.textContent = "鏈煡鑹烘湳瀹?;
        showAlbumCoverPlaceholder();
        clearLyricsContent();
        if (dom.lyrics) {
            dom.lyrics.dataset.placeholder = "default";
        }
        dom.lyrics.classList.add("empty");
        updatePlayPauseButton();
    }

    state.playlistSongs = [];
    dom.playlist.classList.add("empty");
    if (dom.playlistItems) {
        dom.playlistItems.innerHTML = "";
    }
    state.currentPlaylist = "playlist";
    updateMobileClearPlaylistVisibility();
    updatePlaylistActionStates();

    savePlayerState();
    showNotification("鎾斁鍒楄〃宸叉竻绌?, "success");
    clearLyricsIfLibraryEmpty();
}

// 鏂板锛氭挱鏀炬挱鏀惧垪琛ㄤ腑鐨勬瓕鏇?async function playPlaylistSong(index) {
    if (index < 0 || index >= state.playlistSongs.length) return;

    const song = state.playlistSongs[index];
    state.currentTrackIndex = index;
    state.currentPlaylist = "playlist";
    state.currentList = "playlist";

    try {
        await playSong(song);
        updatePlaylistHighlight();
        updatePlayModeUI();
        if (isMobileView) {
            closeMobilePanel();
        }
    } catch (error) {
        console.error("鎾斁澶辫触:", error);
        showNotification("鎾斁澶辫触锛岃绋嶅悗閲嶈瘯", "error");
    }
}

// 鏂板锛氭洿鏂版挱鏀惧垪琛ㄩ珮浜?function updatePlaylistHighlight() {
    if (!dom.playlistItems) return;
    const playlistItems = dom.playlistItems.querySelectorAll(".playlist-item");
    playlistItems.forEach((item, index) => {
        const isCurrent = state.currentPlaylist === "playlist" && index === state.currentTrackIndex;
        item.classList.toggle("current", isCurrent);
        item.setAttribute("aria-current", isCurrent ? "true" : "false");
        item.setAttribute("aria-pressed", isCurrent ? "true" : "false");
    });
}

// ============================================================
// 鏈€缁堟牳寮圭骇淇锛歩OS PWA 閿佸睆鎾斁鍑芥暟 (v3.0 鎶㈠崰寮忔縺娲荤増)
// ============================================================
// ================================================
// iOS PWA 鍏煎鐗?playSong 鍑芥暟
// ================================================
// ================================================ 
// 馃幍 杈呭姪妯″潡锛氶攣灞忓厓鏁版嵁 & 闊抽瀹堟姢 
// ================================================ 

// 1. 閿佸睆鍏冩暟鎹洿鏂?
function updateMediaMetadataForLockScreen(song) { 
    if (!('mediaSession' in navigator)) return; 
    try { 
        let coverUrl = ''; 
        if (song.pic_id || song.id) { 
            coverUrl = API.getPicUrl(song); 
            if (coverUrl.startsWith('http://')) coverUrl = coverUrl.replace('http://', 'https://'); 
        } 
        if (!coverUrl) coverUrl = window.location.origin + '/favicon.png'; 
        
        navigator.mediaSession.metadata = new MediaMetadata({ 
            title: song.name || '鏈煡姝屾洸', 
            artist: Array.isArray(song.artist) ? song.artist.join(', ') : (song.artist || '鏈煡鑹烘湳瀹?), 
            album: song.album || '', 
            artwork: [{ src: coverUrl, sizes: '512x512', type: 'image/png' }] 
        }); 
    } catch (e) { console.warn('閿佸睆鏇存柊寰皬閿欒:', e); } 
} 

// 2. 闊抽瀹堟姢杩涚▼ (AudioGuard) 
(function() { 
    if (!window.solaraAudioGuard) { 
        window.solaraAudioGuard = { 
            isActive: false, 
            audioCtx: null, 
            osc: null, 
            start: function() { 
                if (this.isActive) return; 
                try { 
                    const AC = window.AudioContext || window.webkitAudioContext; 
                    if (!AC) return; 
                    this.audioCtx = new AC(); 
                    this.osc = this.audioCtx.createOscillator(); 
                    const gain = this.audioCtx.createGain(); 
                    this.osc.type = 'sine'; 
                    this.osc.frequency.value = 1; 
                    gain.gain.value = 0.001; // 鏋佷綆闊抽噺 
                    this.osc.connect(gain); 
                    gain.connect(this.audioCtx.destination); 
                    this.osc.start(); 
                    this.isActive = true; 
                    console.log('馃洝锔?瀹堟姢鍚姩 (鍗犱綅)'); 
                } catch (e) { console.error('瀹堟姢鍚姩澶辫触:', e); } 
            }, 
            stop: function() { 
                if (!this.isActive) return; 
                try { 
                    if (this.osc) { this.osc.stop(); this.osc.disconnect(); } 
                    if (this.audioCtx) { this.audioCtx.close(); } 
                    this.isActive = false; 
                    console.log('馃洝锔?瀹堟姢鍋滄 (閲婃斁閫氶亾)'); 
                } catch (e) { console.error('瀹堟姢鍋滄澶辫触:', e); } 
            } 
        }; 
    } 
})();

// ================================================
// iOS PWA 缁堟瀬鐗?playSong (v7.4 Ghost Fix)
// 淇锛氶攣灞忓垏姝屾湁杩涘害鏃犲０闊炽€佹寜閽崱姝?// ================================================
async function playSong(song, options = {}) {
    const { autoplay = true, startTime = 0, preserveProgress = false } = options;
    
    // 鐜妫€娴?    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator.standalone === true);
    const isIOSPWA = isIOS && isPWA;
    const isLockScreen = document.visibilityState === 'hidden';
    
    console.log(`馃幍 鍑嗗鎾斁: ${song.name} (閿佸睆: ${isLockScreen})`);

    try {
        // 鍋滄涔嬪墠鐨勭洃鎺?        stopCurrentTimeMonitor();
        
        if (state._isPlayingSong) return false;
        state._isPlayingSong = true;
        state.currentSong = song;
        const player = dom.audioPlayer;

        // 1. 鍚姩瀹堟姢 (鍏抽敭锛氬彧瑕佹槸 iOS PWA 灏卞惎鍔紝涓嶇鏄惁閿佸睆锛岄槻姝㈠垏姝岄棿闅欒鏉€)
        if (isIOSPWA && window.solaraAudioGuard) {
            window.solaraAudioGuard.start();
            console.log('馃洝锔?瀹堟姢鍚姩锛氫繚鎶ゅ垏姝岄棿闅?);
        }

        // 2. 鎶㈠崰閿佸睆淇℃伅 (闃叉涓婁竴棣栫粨鏉熷悗鎺т欢娓呯┖)
        updateMediaMetadataForLockScreen(song);

        // 3. 鏆傚仠鏃ч煶棰戝苟淇濆瓨闊抽噺
        let safeVolume = player.volume;
        if (!safeVolume || safeVolume < 0.1) safeVolume = 1.0;
        
        if (!player.paused) {
            player.pause();
            // 缁欎竴鐐圭紦鍐叉椂闂磋纭欢閲婃斁
            await new Promise(r => setTimeout(r, 30));
        }

        // 4. 鑾峰彇瀹為檯闊抽娴?URL
        const quality = state.playbackQuality || '320';
        let rawUrl = API.getSongUrl(song, quality);
        if (!rawUrl.startsWith('http')) rawUrl = new URL(rawUrl, window.location.origin).href;
        
        // 閽堝 QQ 闊充箰鍜岄叿鎴戦煶涔愶紝闇€瑕佸厛鑾峰彇瀹為檯鐨勯煶棰戞祦 URL
        let streamUrl = rawUrl;
        console.log('馃攳 姝ｅ湪鑾峰彇瀹為檯闊抽娴?URL:', rawUrl);
        
        try {
            // 鍙戦€?HEAD 璇锋眰妫€鏌?API 鍝嶅簲锛屼笉璺熼殢閲嶅畾鍚?            const response = await fetch(rawUrl, { method: 'HEAD', redirect: 'manual' });
            
            // 澶勭悊閲嶅畾鍚戞儏鍐碉紝鐗瑰埆鏄叿鎴戦煶涔愮殑 302 閲嶅畾鍚?            if (response.status >= 300 && response.status < 400) {
                const redirectUrl = response.headers.get('location');
                if (redirectUrl) {
                    console.log('馃攢 API 杩斿洖閲嶅畾鍚?', redirectUrl);
                    // 娣诲姞闃茬紦瀛樺弬鏁板埌閲嶅畾鍚?URL
                    const separator = redirectUrl.includes('?') ? '&' : '?';
                    streamUrl = `${redirectUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                    console.log('鉁?浣跨敤閲嶅畾鍚?URL 浣滀负闊抽婧?);
                } else {
                    // 閲嶅畾鍚戜絾娌℃湁 location 澶达紝浣跨敤鍘熷 URL
                    console.warn('鈿狅笍 閲嶅畾鍚戜絾娌℃湁 location 澶达紝浣跨敤鍘熷 URL');
                    const separator = rawUrl.includes('?') ? '&' : '?';
                    streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                }
            } else {
                // 闈為噸瀹氬悜鍝嶅簲锛屾鏌ュ唴瀹圭被鍨?                const contentType = response.headers.get('content-type');
                
                // 濡傛灉鐩存帴杩斿洖闊抽娴侊紝灏变娇鐢ㄨ URL
                if (contentType && contentType.includes('audio/')) {
                    console.log('鉁?鐩存帴浣跨敤 API URL 浣滀负闊抽婧?);
                    // 娣诲姞闃茬紦瀛樺弬鏁?                    const separator = rawUrl.includes('?') ? '&' : '?';
                    streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                } else {
                    // 鍚﹀垯锛屽彂閫?GET 璇锋眰鑾峰彇瀹屾暣鍝嶅簲
                    const getResponse = await fetch(rawUrl);
                    const getContentType = getResponse.headers.get('content-type');
                    
                    if (getContentType && getContentType.includes('application/json')) {
                        // JSON 鍝嶅簲锛屽皾璇曡В鏋愯幏鍙栧疄闄?URL
                        const data = await getResponse.json();
                        console.log('馃搵 API 杩斿洖 JSON 鍝嶅簲:', data);
                        
                        // 鏍规嵁涓嶅悓 API 杩斿洖鏍煎紡澶勭悊
                        if (data && data.url) {
                            streamUrl = data.url;
                            console.log('鉁?浠?JSON 涓彁鍙栭煶棰?URL:', streamUrl);
                        } else if (data && data.type === 'media_file') {
                            // 閰锋垜闊充箰鐨?media_file 绫诲瀷锛岀洿鎺ヤ娇鐢?API URL
                            console.log('鉁?閰锋垜闊充箰 media_file 绫诲瀷锛岀洿鎺ヤ娇鐢?API URL');
                            const separator = rawUrl.includes('?') ? '&' : '?';
                            streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                        } else {
                            console.warn('鈿狅笍 鏃犳硶浠?JSON 鍝嶅簲涓彁鍙栭煶棰?URL锛屼娇鐢ㄥ師濮?URL');
                            const separator = rawUrl.includes('?') ? '&' : '?';
                            streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                        }
                    } else if (getContentType && getContentType.includes('audio/')) {
                        // 鐩存帴杩斿洖闊抽娴侊紝浣跨敤璇?URL
                        console.log('鉁?鐩存帴杩斿洖闊抽娴侊紝浣跨敤璇?URL');
                        // 娣诲姞闃茬紦瀛樺弬鏁?                        const separator = rawUrl.includes('?') ? '&' : '?';
                        streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                    } else {
                        console.warn('鈿狅笍 鏈煡鐨勫搷搴旂被鍨?', getContentType, '浣跨敤鍘熷 URL');
                        const separator = rawUrl.includes('?') ? '&' : '?';
                        streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
                    }
                }
            }
        } catch (error) {
            console.warn('鈿狅笍 鑾峰彇闊抽 URL 澶辫触锛屼娇鐢ㄥ師濮?URL:', error);
            const separator = rawUrl.includes('?') ? '&' : '?';
            streamUrl = `${rawUrl}${separator}_t=${Date.now()}_r=${Math.random().toString(36).substr(2,5)}`;
        }
        
        console.log('馃幍 鏈€缁堜娇鐢ㄧ殑闊抽 URL:', streamUrl);
        
        // 5. 鏌旀€у垏鎹?(Soft Switch)
        player.removeAttribute('crossOrigin');
        player.setAttribute('playsinline', '');
        player.setAttribute('webkit-playsinline', '');
        
        player.src = streamUrl;
        state.currentAudioUrl = streamUrl;
        
        // 鈿★笍 棰勫鐘舵€侊細闈欓煶骞跺姞杞?        player.muted = false;
        player.volume = safeVolume;
        player.preload = 'auto';
        player.load();

        // 6. 璁剧疆闊抽鍔犺浇瓒呮椂鏃堕棿
        const loadTimeout = 3000; // 缁熶竴瓒呮椂鏃堕棿锛岄叿鎴戦煶涔愬凡绂佺敤
        console.log(`鈴?绛夊緟闊抽鍔犺浇锛岃秴鏃舵椂闂? ${loadTimeout}ms`);
        
        // 閽堝閰锋垜闊充箰鐨勯鍔犺浇浼樺寲宸茬鐢?        /*
        if (song.source === 'kuwo') {
            console.log('馃攳 閰锋垜闊充箰锛氬惎鐢ㄩ鍔犺浇浼樺寲');
            // 灏濊瘯鎻愬墠鑾峰彇闊抽澶翠俊鎭紝涓嶉樆濉炰富绾跨▼
            fetch(streamUrl, { method: 'HEAD' })
                .then(response => {
                    console.log('馃搵 閰锋垜闊充箰澶翠俊鎭?', {
                        contentType: response.headers.get('content-type'),
                        contentLength: response.headers.get('content-length')
                    });
                })
                .catch(error => {
                    console.warn('鈿狅笍 鑾峰彇閰锋垜闊充箰澶翠俊鎭け璐?', error);
                });
        }
        */
        
        await new Promise((resolve) => {
            let resolved = false;
            let loadStartTime = Date.now();
            
            // 璁剧疆涓嶅悓鐨勮秴鏃舵椂闂达紝閰锋垜闊充箰闇€瑕佹洿闀挎椂闂?            const timer = setTimeout(() => {
                if(!resolved) {
                    resolved=true;
                    const elapsed = Date.now() - loadStartTime;
                    console.warn(`鈴憋笍  闊抽鍔犺浇瓒呮椂锛屽疄闄呯瓑寰? ${elapsed}ms锛岀户缁墽琛宍);
                    resolve();
                }
            }, loadTimeout);
            
            const done = (event) => {
                if(!resolved) {
                    resolved=true;
                    clearTimeout(timer);
                    const elapsed = Date.now() - loadStartTime;
                    if (event && event.type === 'error') {
                        console.error('鉂?闊抽鍔犺浇閿欒:', {
                            eventType: event.type,
                            errorCode: player.error ? player.error.code : 'unknown',
                            errorMessage: player.error ? player.error.message : 'unknown',
                            elapsedTime: elapsed
                        });
                    } else {
                        console.log(`鉁?闊抽鍔犺浇瀹屾垚锛岃€楁椂: ${elapsed}ms锛屼簨浠剁被鍨? ${event ? event.type : 'unknown'}`);
                    }
                    resolve();
                }
            };
            
            // 娣诲姞鏇村鍔犺浇浜嬩欢鐩戝惉锛岀‘淇濅笉閿欒繃浠讳綍鐘舵€佸彉鍖?            player.addEventListener('canplaythrough', done, { once: true });
            player.addEventListener('canplay', done, { once: true });
            player.addEventListener('loadeddata', done, { once: true });
            player.addEventListener('loadedmetadata', done, { once: true });
            player.addEventListener('loadstart', () => {
                console.log('馃殌 闊抽寮€濮嬪姞杞?);
            }, { once: true });
            player.addEventListener('progress', () => {
                const buffered = player.buffered.length > 0 ? player.buffered.end(0) : 0;
                console.log(`馃搳 闊抽鍔犺浇杩涘害: ${buffered.toFixed(2)}s`);
            });
            player.addEventListener('error', done, { once: true });
        });

        // 7. 鎭㈠杩涘害
        let targetTime = startTime;
        if (preserveProgress) {
            targetTime = state.currentList === "favorite" ? state.favoritePlaybackTime : state.currentPlaybackTime;
        }
        if (targetTime > 0) player.currentTime = targetTime;

        // 8. UI 鏇存柊
        if (isIOSPWA && isLockScreen) {
            state.needUpdateOnUnlock = true;
        } else {
            if (dom.albumCover) dom.albumCover.classList.add('loading');
            setTimeout(() => {
                updateCurrentSongInfo(song, { loadArtwork: true, updateBackground: true, immediate: true });
                setTimeout(() => { if (dom.albumCover) dom.albumCover.classList.remove('loading'); }, 300);
            }, 100);
        }
        
        // 9. 鎾斁閫昏緫 (鏍稿績淇鍖?
        if (autoplay) {
            state.isPlaying = true;
            updatePlayPauseButton();
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
            


            // 缁欎竴鐐圭偣缂撳啿
            await new Promise(r => setTimeout(r, 50));

            try {
                // 灏濊瘯鎾斁
                const playResult = await player.play();
                console.log('鉁?鎾斁鎸囦护宸插彂鍑猴紝缁撴灉:', playResult);
                console.log('馃攰 闊抽鐘舵€佹鏌?', {
                    paused: player.paused,
                    ended: player.ended,
                    readyState: player.readyState,
                    currentTime: player.currentTime,
                    duration: player.duration
                });



                // 鈿★笍鈿★笍 [鏍稿績淇 1] 纭欢閫氶亾寮哄埗鎻℃墜 鈿★笍鈿★笍
                // 鍦?iOS 閿佸睆涓嬶紝鏈夋椂鍊?Audio 鍏冪礌鐘舵€佹槸 playing锛屼絾纭欢閫氶亾娌℃墦寮€銆?                // 鎴戜滑閫氳繃蹇€熷垏鎹?muted 鐘舵€佹潵鈥滄儕閱掆€濋煶棰戝畧鎶よ繘绋嬨€?                if (isIOS) {
                    setTimeout(() => {
                        player.muted = true;
                        player.volume = safeVolume;
                        setTimeout(() => {
                            player.muted = false; // 杩欎竴鍒伙紝澹伴煶搴旇鍑烘潵浜?                            console.log('馃攰 纭欢閫氶亾寮哄埗鎻℃墜瀹屾垚');
                        }, 50); // 50ms 鐨勯潤闊抽棯鐑?                    }, 100);
                }
                
                // 鈿★笍鈿★笍 [鏍稿績淇 2] 寤惰繜鍏抽棴瀹堟姢杩涚▼ 鈿★笍鈿★笍
                // 涓嶈绔嬪嵆鍏抽棴锛佽 AudioContext 鍐嶈窇 3 绉掞紝鍜屾柊姝岄噸鍙犱竴浼氬効銆?                // 杩欏氨鍍忔帴鍔涜禌锛屼袱浜哄悓璺戜竴娈佃窛绂诲啀鏉炬墜锛岄槻姝㈡帀妫掋€?                if (isIOSPWA && window.solaraAudioGuard) {
                    console.log('鈴?瀹堟姢杩涚▼灏嗗湪 3 绉掑悗閫€鍑?..');
                    setTimeout(() => {
                        if (!player.paused) { // 鍙湁杩樺湪鎾斁鎵嶅叧闂?                            window.solaraAudioGuard.stop();
                            console.log('馃洃 瀹堟姢杩涚▼瀹夊叏閫€鍑?);
                        }
                    }, 3000);
                }
                
                // 鍐嶆鍒锋柊閿佸睆淇℃伅锛岀‘淇?metadata 娌¤绯荤粺娓呯┖
                setTimeout(() => updateMediaMetadataForLockScreen(song), 500);

            } catch (error) {
                console.warn('鈿狅笍 鎾斁鍙楅樆锛屽皾璇曞己鍔涗慨澶?', error);
                // 鍏滃簳绛栫暐锛氬鏋滄挱鏀惧け璐ワ紝涓嶅叧闂畧鎶よ繘绋嬶紝鐢氳嚦灏濊瘯閲嶆柊鍔犺浇
                try {
                    player.muted = true;
                    await player.play();
                    player.muted = false;
                } catch (e) {
                    state.isPlaying = false;
                    updatePlayPauseButton();
                    // 鎾斁澶辫触涔熷欢杩熷叧闂紝鎴栬€呬笉鍏抽棴
                    if (isIOSPWA && window.solaraAudioGuard) {
                        setTimeout(() => window.solaraAudioGuard.stop(), 2000);
                    }
                }
            }
        } else {
            state.isPlaying = false;
            updatePlayPauseButton();
            if (isIOSPWA && window.solaraAudioGuard) window.solaraAudioGuard.stop();
        }

        savePlayerState();
        setTimeout(() => loadLyrics(song), 1000);
        return true;

    } catch (error) {
        console.error("鎾斁娴佺▼寮傚父:", error);
        state.isPlaying = false;
        updatePlayPauseButton();
        if (isIOSPWA && window.solaraAudioGuard) window.solaraAudioGuard.stop();
        return false;
    } finally {
        state._isPlayingSong = false;
    }
}

// 淇锛氭挱鏀炬瓕鏇插嚱鏁?- 鏀寔缁熶竴鎾斁鍒楄〃
function waitForAudioReady(player) {
    if (!player) return Promise.resolve();
    if (player.readyState >= 1) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            player.removeEventListener('loadedmetadata', onLoaded);
            player.removeEventListener('error', onError);
        };
        const onLoaded = () => {
            cleanup();
            resolve();
        };
        const onError = () => {
            cleanup();
            reject(new Error('闊抽鍔犺浇澶辫触'));
        };
        player.addEventListener('loadedmetadata', onLoaded, { once: true });
        player.addEventListener('error', onError, { once: true });
    });
}

function scheduleDeferredSongAssets(song, playPromise) {
    const run = () => {
        if (state.currentSong !== song) {
            return;
        }

        updateCurrentSongInfo(song, { loadArtwork: true, updateBackground: true });
        loadLyrics(song);
        state.audioReadyForPalette = true;
        attemptPaletteApplication();
    };

    const kickoff = () => {
        if (state.currentSong !== song) {
            return;
        }

        if (typeof window.requestAnimationFrame === "function") {
            window.requestAnimationFrame(() => {
                if (state.currentSong !== song) {
                    return;
                }

                if (typeof window.requestIdleCallback === "function") {
                    window.requestIdleCallback(() => {
                        if (state.currentSong !== song) {
                            return;
                        }
                        run();
                    }, { timeout: 600 });
                } else {
                    run();
                }
            });
        } else {
            window.setTimeout(run, 0);
        }
    };

    if (playPromise && typeof playPromise.finally === "function") {
        playPromise.finally(kickoff);
    } else {
        kickoff();
    }
}

// 淇锛氳嚜鍔ㄦ挱鏀句笅涓€棣?(甯︾姸鎬侀噸缃?
function handleAudioError(event) {
    const player = event.target;
    console.error('馃幍 闊抽鎾斁閿欒:', {
        errorCode: player.error.code,
        errorMessage: player.error.message,
        currentSong: state.currentSong,
        audioUrl: state.currentAudioUrl
    });
    
    // 閽堝閰锋垜闊充箰鐨勭壒娈婂鐞嗗凡绂佺敤
    /*
    if (state.currentSong && state.currentSong.source === 'kuwo') {
        console.error('馃攳 閰锋垜闊充箰鎾斁澶辫触锛屽皾璇曠洿鎺ヤ娇鐢?API 閾炬帴閲嶆柊鎾斁...');
        // 灏濊瘯閲嶆柊鏋勫缓闊抽 URL锛屽彲鑳介渶瑕佽皟鏁?API 鍙傛暟
        try {
            const quality = state.playbackQuality || '320';
            const audioUrl = API.getSongUrl(state.currentSong, quality);
            console.log('馃攧 閲嶆柊灏濊瘯閰锋垜闊充箰 URL:', audioUrl);
            player.src = audioUrl;
            player.load();
            player.play();
        } catch (retryError) {
            console.error('鉂?閰锋垜闊充箰閲嶆柊鎾斁涔熷け璐?', retryError);
        }
    }
    */
    
    // 閲嶇疆鎾斁鐘舵€?    state.isPlaying = false;
    updatePlayPauseButton();
    state._isPlayingSong = false;
}

function autoPlayNext() {
    console.log('馃攧 瑙﹀彂鑷姩杩炴挱...');
    
    // 寮哄埗閲嶇疆鎾斁閿侊紝闃叉鍥犱负涓婁竴棣栫粨鏉熸椂鐨勭姸鎬侀敊璇鑷存棤娉曞垏姝?    state._isPlayingSong = false;
    
    const mode = typeof getActivePlayMode === 'function' ? getActivePlayMode() : 'sequence';
    
    if (mode === "single") {
        if (dom.audioPlayer) {
            dom.audioPlayer.currentTime = 0;
            dom.audioPlayer.play().catch(console.warn);
        }
        return;
    }

    if (typeof playNext === 'function') {
        playNext();
    }
    updatePlayPauseButton();
}

// 淇锛氭挱鏀句笅涓€棣?- 鏀寔鎾斁妯″紡鍜岀粺涓€鎾斁鍒楄〃
async function playNext() {
    if (state.currentList === "favorite") {
        const favorites = ensureFavoriteSongsArray();
        if (favorites.length === 0) {
            clearLyricsIfLibraryEmpty();
            return;
        }
        const mode = state.favoritePlayMode || "list";
        let nextIndex = state.currentFavoriteIndex;
        if (mode === "random") {
            nextIndex = Math.floor(Math.random() * favorites.length);
        } else if (mode === "list") {
            nextIndex = (state.currentFavoriteIndex + 1) % favorites.length;
        }
        if (mode !== "single") {
            state.currentFavoriteIndex = nextIndex;
        }
        return playFavoriteSong(state.currentFavoriteIndex);
    }

    let nextIndex = -1;
    let playlist = [];

    if (state.currentPlaylist === "playlist") {
        playlist = state.playlistSongs;
    } else if (state.currentPlaylist === "online") {
        playlist = state.onlineSongs;
    } else if (state.currentPlaylist === "search") {
        playlist = state.searchResults;
    }

    if (playlist.length === 0) {
        clearLyricsIfLibraryEmpty();
        return;
    }

    const mode = state.playMode || "list";
    if (mode === "random") {
        // 闅忔満鎾斁
        nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (mode === "list") {
        // 鍒楄〃寰幆
        nextIndex = (state.currentTrackIndex + 1) % playlist.length;
    } else if (mode === "single") {
        nextIndex = state.currentTrackIndex >= 0 ? state.currentTrackIndex : 0;
    }

    if (mode !== "single") {
        state.currentTrackIndex = nextIndex;
    }

    const targetIndex = mode === "single" ? state.currentTrackIndex : nextIndex;

    if (state.currentPlaylist === "playlist") {
        return playPlaylistSong(targetIndex);
    } else if (state.currentPlaylist === "online") {
        return playOnlineSong(targetIndex);
    } else if (state.currentPlaylist === "search") {
        return playSearchResult(targetIndex);
    }
}

// 淇锛氭挱鏀句笂涓€棣?- 鏀寔鎾斁妯″紡鍜岀粺涓€鎾斁鍒楄〃
async function playPrevious() {
    if (state.currentList === "favorite") {
        const favorites = ensureFavoriteSongsArray();
        if (favorites.length === 0) {
            return;
        }
        const mode = state.favoritePlayMode || "list";
        let prevIndex = state.currentFavoriteIndex;
        if (mode === "random") {
            prevIndex = Math.floor(Math.random() * favorites.length);
        } else if (mode === "list") {
            prevIndex = state.currentFavoriteIndex - 1;
            if (prevIndex < 0) {
                prevIndex = favorites.length - 1;
            }
        }
        if (mode !== "single") {
            state.currentFavoriteIndex = prevIndex;
        }
        return playFavoriteSong(state.currentFavoriteIndex);
    }

    let prevIndex = -1;
    let playlist = [];

    if (state.currentPlaylist === "playlist") {
        playlist = state.playlistSongs;
    } else if (state.currentPlaylist === "online") {
        playlist = state.onlineSongs;
    } else if (state.currentPlaylist === "search") {
        playlist = state.searchResults;
    }

    if (playlist.length === 0) return;

    const mode = state.playMode || "list";
    if (mode === "random") {
        // 闅忔満鎾斁
        prevIndex = Math.floor(Math.random() * playlist.length);
    } else if (mode === "list") {
        // 鍒楄〃寰幆
        prevIndex = state.currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = playlist.length - 1;
    } else if (mode === "single") {
        prevIndex = state.currentTrackIndex >= 0 ? state.currentTrackIndex : 0;
    }

    if (mode !== "single") {
        state.currentTrackIndex = prevIndex;
    }

    const targetIndex = mode === "single" ? state.currentTrackIndex : prevIndex;

    if (state.currentPlaylist === "playlist") {
        return playPlaylistSong(targetIndex);
    } else if (state.currentPlaylist === "online") {
        return playOnlineSong(targetIndex);
    } else if (state.currentPlaylist === "search") {
        return playSearchResult(targetIndex);
    }
}

// 淇锛氬湪绾块煶涔愭挱鏀惧嚱鏁?async function playOnlineSong(index) {
    const song = state.onlineSongs[index];
    if (!song) return;

    state.currentTrackIndex = index;
    state.currentPlaylist = "online";
    state.currentList = "playlist";

    try {
        await playSong(song);
        updateOnlineHighlight();
        updatePlayModeUI();
    } catch (error) {
        console.error("鎾斁澶辫触:", error);
        showNotification("鎾斁澶辫触锛岃绋嶅悗閲嶈瘯", "error");
    }
}

// 淇锛氭洿鏂板湪绾块煶涔愰珮浜?function updateOnlineHighlight() {
    if (!dom.playlistItems) return;
    const playlistItems = dom.playlistItems.querySelectorAll(".playlist-item");
    playlistItems.forEach((item, index) => {
        if (state.currentPlaylist === "online" && index === state.currentTrackIndex) {
            item.classList.add("current");
        } else {
            item.classList.remove("current");
        }
    });
}

const EXPLORE_RADAR_GENRES = [
    "鎺掕姒?,
    "姣忔棩鎺掕姒?,
    "姣忔棩鎺掕",
    "姘戣埃",
];

function pickRandomExploreGenre() {
    if (!Array.isArray(EXPLORE_RADAR_GENRES) || EXPLORE_RADAR_GENRES.length === 0) {
        return "娴佽";
    }
    const index = Math.floor(Math.random() * EXPLORE_RADAR_GENRES.length);
    return EXPLORE_RADAR_GENRES[index];
}

const EXPLORE_RADAR_SOURCES = ["netease"];

function pickRandomExploreSource() {
    if (!Array.isArray(EXPLORE_RADAR_SOURCES) || EXPLORE_RADAR_SOURCES.length === 0) {
        return "netease";
    }
    const index = Math.floor(Math.random() * EXPLORE_RADAR_SOURCES.length);
    return EXPLORE_RADAR_SOURCES[index];
}

// 鎺㈢储闆疯揪锛氶€氳繃浠ｇ悊鍚庣闅忔満鎼滄瓕骞跺埛鏂版挱鏀惧垪琛?async function exploreOnlineMusic() {
    const desktopButton = dom.loadOnlineBtn;
    const mobileButton = dom.mobileExploreButton;
    const btnText = desktopButton ? desktopButton.querySelector(".btn-text") : null;
    const loader = desktopButton ? desktopButton.querySelector(".loader") : null;

    const setLoadingState = (isLoading) => {
        if (desktopButton) {
            desktopButton.disabled = isLoading;
            desktopButton.classList.toggle("is-loading", Boolean(isLoading));
            if (btnText) {
                btnText.style.display = isLoading ? "none" : "";
            }
            if (loader) {
                loader.style.display = isLoading ? "inline-flex" : "none";
            }
        }
        if (mobileButton) {
            mobileButton.disabled = isLoading;
            mobileButton.setAttribute("aria-disabled", isLoading ? "true" : "false");
        }
    };

    try {
        setLoadingState(true);

        const randomGenre = pickRandomExploreGenre();
        const source = pickRandomExploreSource();
        const results = await API.search(randomGenre, source, 10, 1);

        if (!Array.isArray(results) || results.length === 0) {
            showNotification("鎺㈢储闆疯揪锛氭湭鎵惧埌姝屾洸", "error");
            debugLog(`鎺㈢储闆疯揪鏈壘鍒版瓕鏇诧紝鍏抽敭璇嶏細${randomGenre}锛岄煶婧愶細${source}`);
            return;
        }

        const normalizedSongs = results.map((song) => ({
            id: song.id,
            name: song.name,
            artist: Array.isArray(song.artist) ? song.artist.join(" / ") : (song.artist || "鏈煡鑹烘湳瀹?),
            album: song.album || "",
            source: song.source || source,
            lyric_id: song.lyric_id || song.id,
            pic_id: song.pic_id || song.pic || "",
            url_id: song.url_id,
        }));

        const existingSongs = Array.isArray(state.playlistSongs) ? state.playlistSongs.slice() : [];
        const existingKeys = new Set(existingSongs
            .map((song) => getSongKey(song))
            .filter((key) => typeof key === "string" && key.length > 0));

        const appendedSongs = [];
        for (const song of normalizedSongs) {
            const key = getSongKey(song);
            if (key && existingKeys.has(key)) {
                continue;
            }
            appendedSongs.push(song);
            if (key) {
                existingKeys.add(key);
            }
        }

        if (appendedSongs.length === 0) {
            showNotification("鎺㈢储闆疯揪锛氭湰娆℃湭鎵惧埌鏂扮殑姝屾洸锛屽綋鍓嶅垪琛ㄥ凡鍖呭惈杩欎簺鏇茬洰", "info");
            debugLog(`鎺㈢储闆疯揪鏃犳柊澧炴瓕鏇诧紝鍏抽敭璇嶏細${randomGenre}`);
            return;
        }

        // 浼樺寲1锛氬垎鎵规坊鍔犳瓕鏇诧紝鍑忓皯UI闃诲
        const batchSize = 10;
        const totalAppended = appendedSongs.length;
        
        for (let i = 0; i < totalAppended; i += batchSize) {
            const batch = appendedSongs.slice(i, i + batchSize);
            state.playlistSongs = [...existingSongs, ...appendedSongs.slice(0, i + batchSize)];
            state.onlineSongs = state.playlistSongs.slice();
            state.currentPlaylist = "playlist";
            state.currentList = "playlist";
            
            // 娓叉煋褰撳墠鎵规
            renderPlaylist();
            updatePlaylistHighlight();
            
            // 绛夊緟涓€灏忔鏃堕棿锛岃UI鏈夋椂闂存洿鏂?            if (i + batchSize < totalAppended) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        showNotification(`鎺㈢储闆疯揪锛氭柊澧?{appendedSongs.length}棣?${randomGenre} 姝屾洸`);
        debugLog(`鎺㈢储闆疯揪鍔犺浇鎴愬姛锛屽叧閿瘝锛?{randomGenre}锛岄煶婧愶細${source}锛屾柊澧炴瓕鏇叉暟锛?{appendedSongs.length}`);

        const shouldAutoplay = existingSongs.length === 0 && state.playlistSongs.length > 0;
        if (shouldAutoplay) {
            // 浼樺寲2锛氶鍔犺浇绗竴棣栨瓕鐨勯煶棰戯紝鍑忓皯鎾斁寤惰繜
            const firstSong = state.playlistSongs[0];
            if (firstSong) {
                // 鐩存帴鎾斁锛屼笉鍐嶉鍔犺浇锛岄伩鍏嶅彲鑳界殑abort閿欒
                await playPlaylistSong(0);
            }
        } else {
            savePlayerState();
        }
    } catch (error) {
        console.error("鎺㈢储闆疯揪閿欒:", error);
        showNotification("鎺㈢储闆疯揪鑾峰彇澶辫触锛岃绋嶅悗閲嶈瘯", "error");
    } finally {
        setLoadingState(false);
    }
}

// 淇锛氬姞杞芥瓕璇?async function loadLyrics(song) {
    // 濡傛灉鏄殣韬ā寮忥紝璺宠繃姝岃瘝鍔犺浇
    if (shouldUseStealthMode() && !state.forceUIUpdate) {
        console.log('馃敀 闅愯韩妯″紡锛氳烦杩囨瓕璇嶅姞杞?);
        return;
    }
    
    try {
        const lyricUrl = API.getLyric(song);
        debugLog(`鑾峰彇姝岃瘝URL: ${lyricUrl}`);

        const lyricData = await API.fetchJson(lyricUrl);
        debugLog(`姝岃瘝API杩斿洖鏁版嵁: ${JSON.stringify(lyricData).substring(0, 200)}...`);

        // 澶勭悊涓嶅悓鏍煎紡鐨勬瓕璇嶆暟鎹?        let lyricText = '';
        
        if (typeof lyricData === 'string') {
            // 濡傛灉鐩存帴杩斿洖瀛楃涓诧紝鍙兘灏辨槸姝岃瘝鏂囨湰
            lyricText = lyricData;
        } else if (lyricData && lyricData.lyric) {
            // 鏍囧噯鏍煎紡锛歿 lyric: "姝岃瘝鏂囨湰" }
            lyricText = lyricData.lyric;
        } else if (lyricData && lyricData.data && lyricData.data.lyric) {
            // 鍙兘鐨勬牸寮忥細{ data: { lyric: "姝岃瘝鏂囨湰" } }
            lyricText = lyricData.data.lyric;
        } else if (lyricData && lyricData.lrc && lyricData.lrc.lyric) {
            // 缃戞槗浜戦煶涔怉PI鏍煎紡
            lyricText = lyricData.lrc.lyric;
        } else if (lyricData && lyricData.content) {
            // 鍙兘鐨勬牸寮忥細{ content: "姝岃瘝鏂囨湰" }
            lyricText = lyricData.content;
        }
        
        if (lyricText && lyricText.trim()) {
            parseLyrics(lyricText.trim());
            dom.lyrics.classList.remove("empty");
            dom.lyrics.dataset.placeholder = "default";
            debugLog(`姝岃瘝鍔犺浇鎴愬姛: ${state.lyricsData.length} 琛宍);
        } else {
            setLyricsContentHtml("<div>鏆傛棤姝岃瘝</div>");
            dom.lyrics.classList.add("empty");
            dom.lyrics.dataset.placeholder = "message";
            state.lyricsData = [];
            state.currentLyricLine = -1;
            debugLog("姝岃瘝鍔犺浇澶辫触: 鏃犳瓕璇嶆暟鎹?);
        }
    } catch (error) {
        console.error("鍔犺浇姝岃瘝澶辫触:", error);
        setLyricsContentHtml("<div>姝岃瘝鍔犺浇澶辫触</div>");
        dom.lyrics.classList.add("empty");
        dom.lyrics.dataset.placeholder = "message";
        state.lyricsData = [];
        state.currentLyricLine = -1;
        debugLog(`姝岃瘝鍔犺浇澶辫触: ${error}`);
    }
}

// 淇锛氳В鏋愭瓕璇?function parseLyrics(lyricText) {
    const lines = lyricText.split('\n');
    const lyrics = [];

    lines.forEach(line => {
        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = parseInt(match[3].padEnd(3, '0'));
            const time = minutes * 60 + seconds + milliseconds / 1000;
            const text = match[4].trim();

            if (text) {
                lyrics.push({ time, text });
            }
        }
    });

    state.lyricsData = lyrics.sort((a, b) => a.time - b.time);
    displayLyrics();
    debugLog(`瑙ｆ瀽姝岃瘝瀹屾垚: ${state.lyricsData.length} 琛宍);
}

function setLyricsContentHtml(html) {
    if (dom.lyricsContent) {
        dom.lyricsContent.innerHTML = html;
    }
    if (dom.mobileInlineLyricsContent) {
        dom.mobileInlineLyricsContent.innerHTML = html;
    }
}

function clearLyricsContent() {
    setLyricsContentHtml("");
    state.lyricsData = [];
    state.currentLyricLine = -1;
    if (isMobileView) {
        closeMobileInlineLyrics({ force: true });
    }
}

function clearLyricsIfLibraryEmpty() {
    const playlistEmpty = !Array.isArray(state.playlistSongs) || state.playlistSongs.length === 0;
    const favoritesEmpty = !Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0;
    if (!playlistEmpty || !favoritesEmpty) {
        return;
    }

    const player = dom.audioPlayer;
    const hasActiveAudio = Boolean(player && player.src && !player.ended && !player.paused);
    if (hasActiveAudio) {
        return;
    }

    clearLyricsContent();
    if (dom.lyrics) {
        dom.lyrics.classList.add("empty");
        dom.lyrics.dataset.placeholder = "default";
    }
}

// 淇锛氭樉绀烘瓕璇?function displayLyrics() {
    const lyricsHtml = state.lyricsData.map((lyric, index) =>
        `<div data-time="${lyric.time}" data-index="${index}">${lyric.text}</div>`
    ).join("");
    setLyricsContentHtml(lyricsHtml);
    if (dom.lyrics) {
        dom.lyrics.dataset.placeholder = "default";
    }
    if (state.isMobileInlineLyricsOpen) {
        syncLyrics();
    }
}

// 淇锛氬悓姝ユ瓕璇?function syncLyrics() {
    if (state.lyricsData.length === 0) return;

    const currentTime = dom.audioPlayer.currentTime;
    let currentIndex = -1;
    // 姝岃瘝鎻愬墠0.5绉掕仛鐒?    const advanceTime = 0.5;

    for (let i = 0; i < state.lyricsData.length; i++) {
        if (currentTime + advanceTime >= state.lyricsData[i].time) {
            currentIndex = i;
        } else {
            break;
        }
    }

    if (currentIndex !== state.currentLyricLine) {
        state.currentLyricLine = currentIndex;

        const lyricTargets = [];
        if (dom.lyricsContent) {
            lyricTargets.push({
                elements: dom.lyricsContent.querySelectorAll("div[data-index]"),
                container: dom.lyricsScroll || dom.lyrics,
            });
        }
        if (dom.mobileInlineLyricsContent) {
            lyricTargets.push({
                elements: dom.mobileInlineLyricsContent.querySelectorAll("div[data-index]"),
                container: dom.mobileInlineLyricsScroll || dom.mobileInlineLyrics,
                inline: true,
            });
        }

        lyricTargets.forEach(({ elements, container, inline }) => {
            elements.forEach((element, index) => {
                if (index === currentIndex) {
                    element.classList.add("current");
                    const shouldScroll = !state.userScrolledLyrics && (!inline || state.isMobileInlineLyricsOpen);
                    if (shouldScroll) {
                        scrollToCurrentLyric(element, container);
                    }
                } else {
                    element.classList.remove("current");
                }
            });
        });
    }
}

// 鏂板锛氭粴鍔ㄥ埌褰撳墠姝岃瘝 - 淇灞呬腑鏄剧ず闂
function scrollToCurrentLyric(element, containerOverride) {
    const container = containerOverride || dom.lyricsScroll || dom.lyrics;
    if (!container || !element) {
        return;
    }
    const containerHeight = container.clientHeight;
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // 璁＄畻鍏冪礌鍦ㄥ鍣ㄥ唴閮ㄧ殑鍙浣嶇疆锛岄伩鍏嶅彈鍒?offsetParent 褰卞搷
    const elementOffsetTop = elementRect.top - containerRect.top + container.scrollTop;
    const elementHeight = elementRect.height;

    // 鐩爣婊氬姩浣嶇疆锛氳褰撳墠姝岃瘝鐨勪腑蹇冧笌瀹瑰櫒涓績瀵归綈
    const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (elementHeight / 2);

    const maxScrollTop = container.scrollHeight - containerHeight;
    const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

    if (Math.abs(container.scrollTop - finalScrollTop) > 1) {
        if (typeof container.scrollTo === "function") {
            container.scrollTo({
                top: finalScrollTop,
                behavior: 'smooth'
            });
        } else {
            container.scrollTop = finalScrollTop;
        }
    }

}

// 淇锛氫笅杞芥瓕鏇?- 浣跨敤Blob URL锛岀‘淇濊Е鍙戜笅杞借€岄潪鏂扮獥鍙ｆ挱鏀?// ============================================================
// 鏈€缁堢ǔ濡ョ増涓嬭浇鍑芥暟锛氭敮鎸丣SON鍝嶅簲鍜岀洿鎺ヤ笅杞?// ============================================================
async function downloadSong(song, quality = null) {
    try {
        // 鎭㈠璐ㄩ噺閫夋嫨鍔熻兘锛屾牴鎹笉鍚岃川閲忚幏鍙栦笉鍚岄摼鎺?        const finalQuality = quality || state.playbackQuality || 'flac';
        showNotification(`姝ｅ湪鑾峰彇 ${song.name} 涓嬭浇鍦板潃...`, 'info');

        // 1. 鑾峰彇API绔偣URL
        const apiUrl = API.getSongUrl(song, finalQuality);
        if (!apiUrl) {
            throw new Error('鏃犳硶鑾峰彇API閾炬帴');
        }
        console.log('馃敆 API绔偣URL:', apiUrl);

        // 2. 鐢熸垚鏂囦欢鍚嶏紝澶勭悊artist涓烘暟缁勭殑鎯呭喌
        const artistName = Array.isArray(song.artist) ? song.artist.join(', ') : (song.artist || '鏈煡鑹烘湳瀹?);
        const songName = song.name || '鏈煡姝屾洸';
        // 鏍规嵁璐ㄩ噺纭畾鏂囦欢鎵╁睍鍚?        let fileExtension = 'mp3';
        if (finalQuality === '999' || finalQuality === 'flac' || finalQuality === 'flac24bit') {
            fileExtension = 'flac';
        }
        // 鎸夌収鐢ㄦ埛瑕佹眰鐨勬牸寮忥細姝屾洸鍚?- 鑹烘湳瀹?鎵╁睍鍚?        // 纭繚鏂囦欢鍚嶅畨鍏紝绉婚櫎鐗规畩瀛楃
        const safeSongName = songName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ');
        const safeArtistName = artistName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ');
        const fileName = `${safeSongName} - ${safeArtistName}.${fileExtension}`;
        console.log('馃搧 鏈€缁堟枃浠跺悕:', fileName);

        // 3. 閽堝涓嶅悓闊宠川鐨勪紭鍖栦笅杞界瓥鐣?        console.log('馃幍 浼樺寲鐨勪笅杞界瓥鐣ワ紝璐ㄩ噺:', finalQuality);
        
        // 缁熶竴鎵€鏈夐煶璐ㄧ殑涓嬭浇鏂瑰紡锛屽畬鍏ㄥ鐢∕P3鐨勬垚鍔熶唬鐮?        console.log('馃幍 缁熶竴涓嬭浇鏂瑰紡锛氬鐢∕P3鐨勬垚鍔熶唬鐮?);
        
        // 涓虹‘淇滻DM鍜屾祻瑙堝櫒閮借兘姝ｇ‘璇嗗埆鏂囦欢鍚嶏紝浣跨敤浠ｇ悊涓嬭浇鏂瑰紡澶勭悊璺ㄥ煙
        const link = document.createElement('a');
        link.href = apiUrl;
        link.download = fileName;
        link.style.display = 'none';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 涓虹‘淇滻DM鑳芥崟鑾蜂笅杞斤紝寤惰繜涓€灏忔鏃堕棿鍚庡皾璇曠浜屾瑙﹀彂锛堝鏋滈渶瑕侊級
        setTimeout(() => {
            // 灏濊瘯浣跨敤fetch鏂瑰紡鍒涘缓blob URL浣滀负澶囬€夋柟妗?            downloadWithBlobUrl(apiUrl, fileName);
        }, 100);
        
        // 鏍规嵁璐ㄩ噺鏄剧ず涓嶅悓鐨勯€氱煡
        const qualityText = (finalQuality === 'flac' || finalQuality === '999') ? ' (鏃犳崯闊宠川)' : '';
        showNotification(`姝ｅ湪涓嬭浇: ${song.name}${qualityText}`, 'success');
        console.log(`鉁?涓嬭浇娴佺▼瀹屾垚锛屾枃浠跺悕: ${fileName}`);

    } catch (error) {
        console.error('鉂?涓嬭浇鍑洪敊:', error);
        showNotification('鑾峰彇涓嬭浇鍦板潃澶辫触', 'error');
    }
}

// 閫氳繃Blob URL涓嬭浇锛岀敤浜庡鐞嗚法鍩熷拰IDM鍏煎鎬?async function downloadWithBlobUrl(url, filename, redirectCount = 0) {
    // 闄愬埗閲嶅畾鍚戞鏁帮紝閬垮厤鏃犻檺寰幆
    if (redirectCount > 5) {
        console.error('閲嶅畾鍚戞鏁拌繃澶氾紝鍋滄涓嬭浇');
        return;
    }
    
    try {
        // 浣跨敤fetch鑾峰彇闊抽鏁版嵁
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',  // 鏄庣‘鎸囧畾CORS妯″紡
            headers: {
                'Accept': 'audio/*,application/octet-stream,*/*',
                // 娣诲姞涓€浜涘父瑙佺殑璇锋眰澶存潵鎻愰珮鍏煎鎬?                'Accept-Language': navigator.language || 'zh-CN',
                'Referer': window.location.href,
                'Origin': window.location.origin,
                'Sec-Fetch-Dest': 'audio',
                'Sec-Fetch-Mode': 'cors',
            },
            // 绂佺敤缂撳瓨浠ラ伩鍏嶉棶棰?            cache: 'no-cache'
        });
        
        // 妫€鏌ユ槸鍚︽槸閲嶅畾鍚?        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('Location') || response.headers.get('location');
            if (redirectUrl) {
                console.log('鍙戠幇閲嶅畾鍚戯紝浣跨敤鏂扮殑URL:', redirectUrl);
                return await downloadWithBlobUrl(redirectUrl, filename, redirectCount + 1);
            }
        }
        
        if (!response.ok) {
            throw new Error(`涓嬭浇澶辫触: ${response.status} ${response.statusText}`);
        }
        
        // 妫€鏌ュ搷搴旂被鍨?        const contentType = response.headers.get('content-type');
        console.log('鍝嶅簲鍐呭绫诲瀷:', contentType);
        
        // 濡傛灉鍝嶅簲鏄疛SON锛堝彲鑳芥槸API閿欒鎴栭噸瀹氬悜淇℃伅锛夛紝闇€瑕佺壒娈婂鐞?        if (contentType && contentType.includes('application/json')) {
            let jsonData;
            try {
                jsonData = await response.json();
            } catch (jsonError) {
                console.warn('鏃犳硶瑙ｆ瀽JSON鍝嶅簲:', jsonError);
                // 濡傛灉鏄?02閲嶅畾鍚戜絾鍐呭鏄疕TML锛屽皾璇曚粠headers鑾峰彇location
                const location = response.headers.get('Location');
                if (location) {
                    console.log('浠嶭ocation header鑾峰彇閲嶅畾鍚慤RL:', location);
                    return await downloadWithBlobUrl(location, filename, redirectCount + 1);
                }
                throw new Error('鏃犳硶瑙ｆ瀽鍝嶅簲');
            }
            
            console.warn('API杩斿洖JSON鍝嶅簲鑰屼笉鏄煶棰戞枃浠?', jsonData);
            
            // 妫€鏌ユ槸鍚︽湁瀹為檯鐨勯煶棰慤RL
            if (jsonData.url) {
                console.log('浠嶫SON鍝嶅簲涓彁鍙栭煶棰慤RL:', jsonData.url);
                return await downloadWithBlobUrl(jsonData.url, filename, redirectCount + 1);
            } else {
                throw new Error('API杩斿洖閿欒淇℃伅鑰岄潪闊抽鏂囦欢');
            }
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // 鍒涘缓涓嬭浇閾炬帴
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 娓呯悊blob URL浠ラ噴鏀惧唴瀛?        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);  // 10绉掑悗娓呯悊
        
        console.log(`鉁?Blob URL涓嬭浇瀹屾垚锛屾枃浠跺悕: ${filename}`);
    } catch (error) {
        console.warn('Blob URL涓嬭浇澶辫触锛屽洖閫€鍒扮洿鎺ラ摼鎺?', error.message);
        
        // 濡傛灉Blob鏂瑰紡澶辫触锛屽皾璇曠洿鎺ラ摼鎺ユ柟寮?        try {
            // 浣跨敤iframe鏂瑰紡浣滀负澶囬€夋柟妗堬紝浠ュ鐞嗘煇浜汣ORS闄愬埗
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            // 涓€娈垫椂闂村悗绉婚櫎iframe浠ユ竻鐞咲OM
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 1000);
            
            console.log(`鉁?iframe涓嬭浇瑙﹀彂锛屾枃浠跺悕: ${filename}`);
        } catch (fallbackError) {
            console.error('iframe涓嬭浇涔熷け璐?', fallbackError);
            
            // 涓嶅啀浣跨敤璺宠浆鍒版柊绐楀彛鎾斁锛岃€屾槸鏄剧ず閿欒淇℃伅
            console.log('鎵€鏈変笅杞芥柟寮忛兘宸插皾璇曪紝濡傛灉鏈笅杞芥垚鍔燂紝璇峰鍒堕摼鎺ユ墜鍔ㄤ笅杞?);
        }
    }
}

// 淇锛氱Щ鍔ㄧ瑙嗗浘鍒囨崲
function switchMobileView(view) {
    if (view === "playlist") {
        if (dom.showPlaylistBtn) {
            dom.showPlaylistBtn.classList.add("active");
        }
        if (dom.showLyricsBtn) {
            dom.showLyricsBtn.classList.remove("active");
        }
        dom.playlist.classList.add("active");
        dom.lyrics.classList.remove("active");
    } else if (view === "lyrics") {
        if (dom.showLyricsBtn) {
            dom.showLyricsBtn.classList.add("active");
        }
        if (dom.showPlaylistBtn) {
            dom.showPlaylistBtn.classList.remove("active");
        }
        dom.lyrics.classList.add("active");
        dom.playlist.classList.remove("active");
    }
    if (isMobileView && document.body) {
        document.body.setAttribute("data-mobile-panel-view", view);
        updateMobileClearPlaylistVisibility();
    }
}

// 淇锛氭樉绀洪€氱煡
function showNotification(message, type = "success") {
    const notification = dom.notification;
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// ================================================
// iOS 闊抽淇濇椿瀹堝崼 (鏈€缁堢増)
// ================================================
(function() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // 鍙湪 iOS PWA 涓嬭繍琛?    if (!isIOS || !window.navigator.standalone) return;
    
    console.log('馃洝锔?鍚姩 iOS 闊抽淇濇椿瀹堝崼');
    
    let audioCtx = null;
    let oscillator = null;
    let guardInterval = null;
    
    // 鍒濆鍖栦竴涓瀬浣庡姛鑰楃殑闈欓煶瀹堟姢杩涚▼
    function initGuard() {
        if (audioCtx) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        try {
            audioCtx = new AudioContext();
            
            // 鍒涘缓鎸崱鍣?            oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // 璁剧疆鏋佷綆棰戠巼鍜屽鐩?(浜鸿€冲惉涓嶈锛屼絾纭欢蹇呴』淇濇寔寮€鍚?
            oscillator.type = 'sine';
            oscillator.frequency.value = 1; // 1Hz 鏋佷綆棰?            gainNode.gain.value = 0.000001; // 鏋佷綆澧炵泭
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            
            console.log('馃洝锔?闊抽淇濇椿瀹堝崼宸插惎鍔?);
            
            // 鐩戝惉鐘舵€侊紝濡傛灉琚寕璧峰垯灏濊瘯鎭㈠
            guardInterval = setInterval(() => {
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume().then(() => {
                        console.log('馃洝锔?AudioContext 宸叉仮澶?);
                    }).catch(e => {
                        console.warn('馃洝锔?鎭㈠ AudioContext 澶辫触:', e);
                    });
                }
            }, 10000); // 姣?0绉掓鏌ヤ竴娆?            
        } catch (error) {
            console.error('馃洝锔?闊抽淇濇椿瀹堝崼鍚姩澶辫触:', error);
        }
    }
    
    // 鍋滄瀹堝崼
    function stopGuard() {
        if (oscillator) {
            try {
                oscillator.stop();
                oscillator.disconnect();
                oscillator = null;
            } catch (error) {
                console.error('馃洝锔?鍋滄瀹堝崼澶辫触:', error);
            }
        }
        
        if (guardInterval) {
            clearInterval(guardInterval);
            guardInterval = null;
        }
        
        console.log('馃洝锔?闊抽淇濇椿瀹堝崼宸插仠姝?);
    }
    
    // 鏅鸿兘绠＄悊瀹堝崼鐘舵€?    function manageGuard() {
        const isLockScreen = document.visibilityState === 'hidden';
        const hasActiveAudio = dom.audioPlayer && 
                               dom.audioPlayer.src && 
                               !dom.audioPlayer.paused;
        
        if (isLockScreen && !hasActiveAudio) {
            // 閿佸睆涓旀病鏈夐煶涔愭挱鏀炬椂锛屽惎鍔ㄥ畧鍗?            if (!audioCtx) {
                console.log('馃洝锔?閿佸睆鏃犻煶涔愶紝鍚姩闊抽淇濇椿');
                initGuard();
            }
        } else {
            // 鏈夐煶涔愭挱鏀炬垨涓嶅湪閿佸睆鏃讹紝鍋滄瀹堝崼
            if (audioCtx) {
                console.log('馃洝锔?鏈夐煶涔愭挱鏀?闈為攣灞忥紝鍋滄闊抽淇濇椿');
                stopGuard();
            }
        }
    }

    // iOS 闇€瑕佺敤鎴蜂氦浜掓墠鑳藉惎鍔?AudioContext
    const activate = () => {
        initGuard();
        document.removeEventListener('click', activate);
        document.removeEventListener('touchstart', activate);
    };
    
    document.addEventListener('click', activate);
    document.addEventListener('touchstart', activate);
    
    // 寤惰繜鍒濆妫€鏌?    setTimeout(() => {
        manageGuard();
    }, 2000);
    
    // 鐩戝惉椤甸潰鍙鎬у彉鍖?    document.addEventListener('visibilitychange', manageGuard);
    
    // 鐩戝惉闊抽鐘舵€佸彉鍖?    if (dom.audioPlayer) {
        dom.audioPlayer.addEventListener('play', () => {
            setTimeout(manageGuard, 500);
        });
        
        dom.audioPlayer.addEventListener('pause', () => {
            setTimeout(manageGuard, 1000);
        });
        
        dom.audioPlayer.addEventListener('ended', () => {
            setTimeout(manageGuard, 1500);
        });
    }
    
    // 鏆撮湶缁欏叏灞€锛屾柟渚胯皟璇?    window.solaraAudioGuard = {
        start: initGuard,
        stop: stopGuard,
        status: () => ({
            isActive: !!audioCtx,
            contextState: audioCtx ? audioCtx.state : 'none',
            lockScreen: document.visibilityState === 'hidden',
            hasAudio: dom.audioPlayer ? !!dom.audioPlayer.src : false
        })
    };
})();

// ================================================
// 馃拃 鍚姩娓呯悊锛氭竻闄ゆ墍鏈夊兊灏?SW 鍜岀紦瀛?// ================================================
async function exterminateServiceWorkers() {
    if (!('serviceWorker' in navigator)) return;
    try {
        const regs = await navigator.serviceWorker.getRegistrations();
        if (regs.length > 0) {
            console.warn(`鈿狅笍 娓呴櫎 ${regs.length} 涓兊灏窼W`);
            await Promise.all(regs.map(r => r.unregister()));
        }
        if ('caches' in window) {
            const keys = await caches.keys();
            // 娓呯悊鎵€鏈夊寘鍚?sw 鎴?workbox 鐨勭紦瀛?            for (const k of keys) {
                if (k.includes('sw') || k.includes('workbox') || k.includes('precache')) await caches.delete(k);
            }
        }
    } catch (e) { console.error('娓呯悊澶辫触:', e); }
}

// ================================================
// 馃殌 UI 浼樺寲锛氱Щ闄ゅ姞杞介伄缃?(瀹炵幇绉掑紑)
// ================================================
function removeLoadingMask() {
    const mask = document.getElementById('app-loading-mask');
    if (mask) {
        mask.classList.add('loaded'); // 瑙﹀彂CSS娣″嚭
        mask.style.pointerEvents = 'none'; // 纭繚鐐瑰嚮绌块€?        setTimeout(() => {
            if (mask.parentNode) mask.parentNode.removeChild(mask);
        }, 600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. 绔嬪嵆娓呯悊鍍靛案杩涚▼
    exterminateServiceWorkers();
    
    // 2. 鍒濆鍖栨挱鏀惧櫒
    const player = dom.audioPlayer;
    if (player) {
        player.removeAttribute('crossOrigin');
        player.preload = "none";
        player.setAttribute('playsinline', '');
        player.setAttribute('webkit-playsinline', '');
        
        // 鐩戞帶鏄惁闈欓煶
        player.addEventListener('volumechange', () => {
             if(player.muted || player.volume === 0) console.warn('鈿狅笍 鎾斁鍣ㄥ彉涓洪潤闊崇姸鎬?);
        });
        
        player.addEventListener('canplaythrough', () => { player.preload = "auto"; }, { once: true });
    }
    
    // 3. 馃殌 鍏抽敭锛欽S鍔犺浇瀹屾瘯绔嬪嵆绉婚櫎閬僵
    // 绋嶅井寤惰繜涓€鐐圭偣锛岀‘淇?CSS 娓叉煋瀹屾垚锛岄伩鍏嶇晫闈㈤棯鐑?    setTimeout(removeLoadingMask, 100);
});

// 浣滀负鍏滃簳锛屽鏋?load 浜嬩欢瑙﹀彂锛堟墍鏈夎祫婧愬姞杞藉畬锛夛紝涔熷皾璇曠Щ闄?window.addEventListener('load', () => setTimeout(removeLoadingMask, 200));

