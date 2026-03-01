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

document.addEventListener('DOMContentLoaded', function() {
  const nordDarkButton = document.getElementById('nordDarkThemeButton');
  const nordLightButton = document.getElementById('nordLightThemeButton');
  const gruvboxDarkButton = document.getElementById('gruvboxDarkThemeButton');
  const gruvboxLightButton = document.getElementById('gruvboxLightThemeButton');
  const offButton = document.getElementById('offButton');

  const buttons = [nordDarkButton, nordLightButton, gruvboxDarkButton, gruvboxLightButton, offButton];

  function setActiveButton(button) {
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  }

  function normalizeTheme(theme) {
    if (theme === 'black' || theme === 'purple' || theme === 'blue') {
      return 'nord-dark';
    }

    if (
      theme === 'nord-dark' ||
      theme === 'nord-light' ||
      theme === 'gruvbox-dark' ||
      theme === 'gruvbox-light' ||
      theme === 'off'
    ) {
      return theme;
    }

    return 'nord-dark';
  }

  function setTheme(theme, button) {
    const normalizedTheme = normalizeTheme(theme);
    setThemeInStorage(normalizedTheme, function() {
      setActiveButton(button);
    });
  }

  getThemeFromStorage(function(result) {
    const theme = normalizeTheme(result.theme);

    if (result.theme !== theme) {
      setThemeInStorage(theme);
    }

    if (theme === 'nord-dark') {
      setActiveButton(nordDarkButton);
      return;
    }

    if (theme === 'nord-light') {
      setActiveButton(nordLightButton);
      return;
    }

    if (theme === 'gruvbox-dark') {
      setActiveButton(gruvboxDarkButton);
      return;
    }

    if (theme === 'gruvbox-light') {
      setActiveButton(gruvboxLightButton);
      return;
    }

    setActiveButton(offButton);
  });

  nordDarkButton.addEventListener('click', function() {
    setTheme('nord-dark', nordDarkButton);
  });

  nordLightButton.addEventListener('click', function() {
    setTheme('nord-light', nordLightButton);
  });

  gruvboxDarkButton.addEventListener('click', function() {
    setTheme('gruvbox-dark', gruvboxDarkButton);
  });

  gruvboxLightButton.addEventListener('click', function() {
    setTheme('gruvbox-light', gruvboxLightButton);
  });

  offButton.addEventListener('click', function() {
    setTheme('off', offButton);
  });
});
