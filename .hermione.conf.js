module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
      retry: 2,
      windowSize: {
        width: 1920,
        height: 1080,
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
