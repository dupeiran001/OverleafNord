const extensionApi = globalThis.browser || globalThis.chrome;
const storageSync = extensionApi && extensionApi.storage ? extensionApi.storage.sync : null;
const browserStorageSync = globalThis.browser?.storage?.sync || null;
const usesPromiseStorage = !!browserStorageSync && storageSync === browserStorageSync;

function getThemeFromStorage(callback) {
  if (!storageSync) {
    callback({});
    return;
  }

  if (usesPromiseStorage) {
    storageSync.get(['theme']).then(callback).catch(() => callback({}));
    return;
  }

  storageSync.get(['theme'], callback);
}

function setThemeInStorage(theme, callback) {
  const done = typeof callback === 'function' ? callback : function() {};

  if (!storageSync) {
    done();
    return;
  }

  if (usesPromiseStorage) {
    storageSync.set({ theme }).then(done).catch(done);
    return;
  }

  storageSync.set({ theme }, done);
}

const styleNordDark = document.createElement('style');
const styleNordLight = document.createElement('style');

styleNordDark.innerText = `
/* Nord Dark: apply to PDF pane only (no global editor inversion) */
.pdf,
.pdf-viewer,
.pdfjs,
.pdfjs-viewer,
.pdfjs .viewer,
.pdf-viewer .viewer,
.synctex-controls {
  background-color: #242933 !important;
  color: #eceff4 !important;
  color-scheme: dark !important;
  scrollbar-color: #4c566a #242933 !important;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, filter 0.25s ease;
}

.pdf-viewer .page,
.pdfjs .page,
.pdfViewer .page {
  background-color: #2e3440 !important;
  background-image: none !important;
  border: 1px solid #1c2330 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  filter: none !important;
  outline: none !important;
  overflow: hidden !important;
}

.pdf-viewer .page::before,
.pdf-viewer .page::after,
.pdfjs .page::before,
.pdfjs .page::after,
.pdfViewer .page::before,
.pdfViewer .page::after {
  content: none !important;
  background: none !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  filter: none !important;
}

.pdf-viewer canvas,
.pdf canvas,
.pdfjs canvas {
  /* Nord Dark: keep PDF page tone at #2E3440, fg #ECEFF4 */
  filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="zoteroNordDark" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="0.180392 0.925490"/><feFuncG type="table" tableValues="0.203922 0.937255"/><feFuncB type="table" tableValues="0.250980 0.956863"/></feComponentTransfer></filter></svg>#zoteroNordDark') !important;
  background: transparent !important;
}

.horizontal-resize-handle {
  background-color: #3b4252 !important;
}

.vertical-resize-handle,
.split-view-resizer,
[class*="resize-handle"],
[class*="splitter"] {
  background-color: #3b4252 !important;
}

.pdf-viewer::-webkit-scrollbar,
.pdfjs::-webkit-scrollbar,
.pdf-viewer .viewer::-webkit-scrollbar,
.pdfjs .viewer::-webkit-scrollbar,
.pdf-viewer #viewerContainer::-webkit-scrollbar,
.pdfjs #viewerContainer::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}

.pdf-viewer::-webkit-scrollbar-track,
.pdfjs::-webkit-scrollbar-track,
.pdf-viewer .viewer::-webkit-scrollbar-track,
.pdfjs .viewer::-webkit-scrollbar-track,
.pdf-viewer #viewerContainer::-webkit-scrollbar-track,
.pdfjs #viewerContainer::-webkit-scrollbar-track {
  background: #242933 !important;
}

.pdf-viewer::-webkit-scrollbar-thumb,
.pdfjs::-webkit-scrollbar-thumb,
.pdf-viewer .viewer::-webkit-scrollbar-thumb,
.pdfjs .viewer::-webkit-scrollbar-thumb,
.pdf-viewer #viewerContainer::-webkit-scrollbar-thumb,
.pdfjs #viewerContainer::-webkit-scrollbar-thumb {
  background: #4c566a !important;
  border-radius: 8px !important;
  border: 2px solid #242933 !important;
}

.pdf-viewer::-webkit-scrollbar-thumb:hover,
.pdfjs::-webkit-scrollbar-thumb:hover,
.pdf-viewer .viewer::-webkit-scrollbar-thumb:hover,
.pdfjs .viewer::-webkit-scrollbar-thumb:hover,
.pdf-viewer #viewerContainer::-webkit-scrollbar-thumb:hover,
.pdfjs #viewerContainer::-webkit-scrollbar-thumb:hover {
  background: #5e81ac !important;
}

.pdfViewer .canvasWrapper,
.pdf-viewer .canvasWrapper,
.pdfjs .canvasWrapper,
.pdfViewer .page > div,
.pdf-viewer .page > div,
.pdfjs .page > div {
  background: transparent !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  filter: none !important;
}

/* PDF text selection: Nord cyan instead of default bright blue */
.pdfViewer .textLayer ::selection,
.pdf-viewer .textLayer ::selection,
.pdfjs .textLayer ::selection,
.pdfViewer .textLayer span::selection,
.pdf-viewer .textLayer span::selection,
.pdfjs .textLayer span::selection {
  background: rgba(136, 192, 208, 0.50) !important;
}

.pdfViewer .textLayer ::-moz-selection,
.pdf-viewer .textLayer ::-moz-selection,
.pdfjs .textLayer ::-moz-selection,
.pdfViewer .textLayer span::-moz-selection,
.pdf-viewer .textLayer span::-moz-selection,
.pdfjs .textLayer span::-moz-selection {
  background: rgba(136, 192, 208, 0.50) !important;
}
`;

styleNordLight.innerText = `
/* Nord Light: snow-white PDF pane */
.pdf,
.pdf-viewer,
.pdfjs,
.pdfjs-viewer,
.pdfjs .viewer,
.pdf-viewer .viewer,
.synctex-controls {
  background-color: #d8dee9 !important;
  color: #2e3440 !important;
  color-scheme: light !important;
  scrollbar-color: #b8c3d1 #d8dee9 !important;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, filter 0.25s ease;
}

.pdf-viewer .page,
.pdfjs .page,
.pdfViewer .page {
  background-color: #d8dee9 !important;
  background-image: none !important;
  border: 1px solid #1c2330 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  filter: none !important;
  outline: none !important;
  overflow: hidden !important;
}

.pdf-viewer .page::before,
.pdf-viewer .page::after,
.pdfjs .page::before,
.pdfjs .page::after,
.pdfViewer .page::before,
.pdfViewer .page::after {
  content: none !important;
  background: none !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  filter: none !important;
}

.pdf-viewer canvas,
.pdf canvas,
.pdfjs canvas {
  /* Snow with requested swap: fg #3B4252, bg #D8DEE9 */
  filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="zoteroSnow" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0.231373 0.847059"/><feFuncG type="table" tableValues="0.258824 0.870588"/><feFuncB type="table" tableValues="0.321569 0.913725"/></feComponentTransfer></filter></svg>#zoteroSnow') !important;
  background: transparent !important;
}

.horizontal-resize-handle {
  background-color: #c5cfdb !important;
}

.vertical-resize-handle,
.split-view-resizer,
[class*="resize-handle"],
[class*="splitter"] {
  background-color: #c5cfdb !important;
}

.pdf-viewer::-webkit-scrollbar,
.pdfjs::-webkit-scrollbar,
.pdf-viewer .viewer::-webkit-scrollbar,
.pdfjs .viewer::-webkit-scrollbar,
.pdf-viewer #viewerContainer::-webkit-scrollbar,
.pdfjs #viewerContainer::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}

.pdf-viewer::-webkit-scrollbar-track,
.pdfjs::-webkit-scrollbar-track,
.pdf-viewer .viewer::-webkit-scrollbar-track,
.pdfjs .viewer::-webkit-scrollbar-track,
.pdf-viewer #viewerContainer::-webkit-scrollbar-track,
.pdfjs #viewerContainer::-webkit-scrollbar-track {
  background: #d8dee9 !important;
}

.pdf-viewer::-webkit-scrollbar-thumb,
.pdfjs::-webkit-scrollbar-thumb,
.pdf-viewer .viewer::-webkit-scrollbar-thumb,
.pdfjs .viewer::-webkit-scrollbar-thumb,
.pdf-viewer #viewerContainer::-webkit-scrollbar-thumb,
.pdfjs #viewerContainer::-webkit-scrollbar-thumb {
  background: #b8c3d1 !important;
  border-radius: 8px !important;
  border: 2px solid #d8dee9 !important;
}

.pdf-viewer::-webkit-scrollbar-thumb:hover,
.pdfjs::-webkit-scrollbar-thumb:hover,
.pdf-viewer .viewer::-webkit-scrollbar-thumb:hover,
.pdfjs .viewer::-webkit-scrollbar-thumb:hover,
.pdf-viewer #viewerContainer::-webkit-scrollbar-thumb:hover,
.pdfjs #viewerContainer::-webkit-scrollbar-thumb:hover {
  background: #9fb0c5 !important;
}

.pdfViewer .canvasWrapper,
.pdf-viewer .canvasWrapper,
.pdfjs .canvasWrapper,
.pdfViewer .page > div,
.pdf-viewer .page > div,
.pdfjs .page > div {
  background: transparent !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  filter: none !important;
}

/* PDF text selection: Nord cyan/blue tone */
.pdfViewer .textLayer ::selection,
.pdf-viewer .textLayer ::selection,
.pdfjs .textLayer ::selection,
.pdfViewer .textLayer span::selection,
.pdf-viewer .textLayer span::selection,
.pdfjs .textLayer span::selection {
  background: rgba(94, 129, 172, 0.42) !important;
}

.pdfViewer .textLayer ::-moz-selection,
.pdf-viewer .textLayer ::-moz-selection,
.pdfjs .textLayer ::-moz-selection,
.pdfViewer .textLayer span::-moz-selection,
.pdf-viewer .textLayer span::-moz-selection,
.pdfjs .textLayer span::-moz-selection {
  background: rgba(94, 129, 172, 0.42) !important;
}
`;

const allStyles = [styleNordDark, styleNordLight];

function clearStyles() {
  allStyles.forEach((styleTag) => {
    if (styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
    }
  });
}

function appendStyle(styleTag) {
  const parent = document.head || document.documentElement || document.body;
  if (parent && !styleTag.parentNode) {
    parent.appendChild(styleTag);
  }
}

function normalizeTheme(theme) {
  if (theme === 'black' || theme === 'purple' || theme === 'blue') {
    return 'nord-dark';
  }

  if (theme === 'nord-light' || theme === 'off') {
    return theme;
  }

  return 'nord-dark';
}

function applyTheme(theme) {
  const resolvedTheme = normalizeTheme(theme);
  clearStyles();

  if (resolvedTheme === 'nord-dark') {
    appendStyle(styleNordDark);
    return;
  }

  if (resolvedTheme === 'nord-light') {
    appendStyle(styleNordLight);
  }
}

getThemeFromStorage(function(result) {
  const theme = normalizeTheme(result.theme);

  if (result.theme !== theme) {
    setThemeInStorage(theme);
  }

  applyTheme(theme);
});

if (extensionApi && extensionApi.storage && extensionApi.storage.onChanged) {
  extensionApi.storage.onChanged.addListener(() => {
    getThemeFromStorage(function(result) {
      applyTheme(normalizeTheme(result.theme));
    });
  });
}
