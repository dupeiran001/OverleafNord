document.addEventListener('DOMContentLoaded', function() {
  const nordDarkButton = document.getElementById('nordDarkThemeButton');
  const nordLightButton = document.getElementById('nordLightThemeButton');
  const offButton = document.getElementById('offButton');

  const buttons = [nordDarkButton, nordLightButton, offButton];

  function setActiveButton(button) {
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  }

  function normalizeTheme(theme) {
    if (theme === 'black' || theme === 'purple' || theme === 'blue') {
      return 'nord-dark';
    }

    if (theme === 'nord-dark' || theme === 'nord-light' || theme === 'off') {
      return theme;
    }

    return 'nord-dark';
  }

  function setTheme(theme, button) {
    const normalizedTheme = normalizeTheme(theme);
    chrome.storage.sync.set({ theme: normalizedTheme }, function() {
      setActiveButton(button);
    });
  }

  chrome.storage.sync.get(['theme'], function(result) {
    const theme = normalizeTheme(result.theme);

    if (result.theme !== theme) {
      chrome.storage.sync.set({ theme });
    }

    if (theme === 'nord-dark') {
      setActiveButton(nordDarkButton);
      return;
    }

    if (theme === 'nord-light') {
      setActiveButton(nordLightButton);
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

  offButton.addEventListener('click', function() {
    setTheme('off', offButton);
  });
});
