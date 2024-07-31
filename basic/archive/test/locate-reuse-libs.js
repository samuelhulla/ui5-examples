(function (sap) {
  var e = function (e) {
    var n = e;
    var t = "";
    var i = [
      "sap.apf",
      "sap.base",
      "sap.chart",
      "sap.collaboration",
      "sap.f",
      "sap.fe",
      "sap.fileviewer",
      "sap.gantt",
      "sap.landvisz",
      "sap.m",
      "sap.ndc",
      "sap.ovp",
      "sap.rules",
      "sap.suite",
      "sap.tnt",
      "sap.ui",
      "sap.uiext",
      "sap.ushell",
      "sap.uxap",
      "sap.viz",
      "sap.webanalytics",
      "sap.zen",
    ];
    function r(e, n) {
      var t = n;
      Object.keys(e).forEach(function (e) {
        if (
          !i.some(function (n) {
            return e === n || e.startsWith(n + ".");
          })
        ) {
          if (t.length > 0) {
            t = t + "," + e;
          } else {
            t = e;
          }
        }
      });
      return t;
    }
    return new Promise(function (i, a) {
      $.ajax(n)
        .done(function (e) {
          if (e) {
            if (e["sap.ui5"] && e["sap.ui5"].dependencies) {
              if (e["sap.ui5"].dependencies.libs) {
                t = r(e["sap.ui5"].dependencies.libs, t);
              }
              if (e["sap.ui5"].dependencies.components) {
                t = r(e["sap.ui5"].dependencies.components, t);
              }
            }
            if (e["sap.ui5"] && e["sap.ui5"].componentUsages) {
              t = r(e["sap.ui5"].componentUsages, t);
            }
          }
          i(t);
        })
        .fail(function () {
          a(new Error("Could not fetch manifest at '" + e));
        });
    });
  };
  function n(e) {
    Object.keys(e).forEach(function (n) {
      var t = e[n];
      if (t && t.dependencies) {
        t.dependencies.forEach(function (e) {
          if (e.url && e.url.length > 0 && e.type === "UI5LIB") {
            sap.ui.require(["sap/base/Log"], function (n) {
              n.info("Registering Library " + e.componentId + " from server " + e.url);
            });
            var n = e.componentId.replace(/\./g, "/");
            var t = { paths: {} };
            t.paths[n] = e.url;
            sap.ui.loader.config(t);
          }
        });
      }
    });
  }
  sap.registerComponentDependencyPaths = function (t) {
    return e(t).then(function (e) {
      if (e && e.length > 0) {
        var t = "/sap/bc/ui2/app_index/ui5_app_info?id=" + e;
        var i = "";
        return new Promise(function (e) {
          sap.ui.require(["sap/base/util/UriParameters"], function (n) {
            i = n.fromQuery(window.location.search).get("sap-client");
            if (i && i.length === 3) {
              t = t + "&sap-client=" + i;
            }
            e(t);
          });
        }).then(function (e) {
          return $.ajax(e).done(function (e) {
            if (e) {
              n(e);
            }
          });
        });
      } else {
        return undefined;
      }
    });
  };
})(sap);
function registerSAPFonts() {
  sap.ui.require(["sap/ui/core/IconPool"], function (e) {
    var n = {
      fontFamily: "SAP-icons-TNT",
      fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/"),
    };
    e.registerFont(n);
    var t = {
      fontFamily: "BusinessSuiteInAppSymbols",
      fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/"),
    };
    e.registerFont(t);
  });
}
var currentScript = document.getElementById("locate-reuse-libs");
if (!currentScript) {
  currentScript = document.currentScript;
}
var manifestUri = currentScript.getAttribute("data-sap-ui-manifest-uri");
var componentName = currentScript.getAttribute("data-sap-ui-componentName");
var useMockserver = currentScript.getAttribute("data-sap-ui-use-mockserver");
sap
  .registerComponentDependencyPaths(manifestUri)
  .catch(function (e) {
    sap.ui.require(["sap/base/Log"], function (n) {
      n.error(e);
    });
  })
  .finally(function () {
    sap.ui.getCore().attachInit(function () {
      var e = sap.ui.getCore().getConfiguration().getLanguage();
      sap.ui.require(["sap/base/i18n/ResourceBundle"], function (n) {
        var t = n.create({ url: "i18n/i18n.properties", locale: e });
        document.title = t.getText("appTitle");
      });
    });
    if (componentName && componentName.length > 0) {
      if (useMockserver && useMockserver === "true") {
        sap.ui.getCore().attachInit(function () {
          registerSAPFonts();
          sap.ui.require(
            [componentName.replace(/\./g, "/") + "/localService/mockserver"],
            function (e) {
              e.init();
              sap.ushell.Container.createRenderer().placeAt("content");
            }
          );
        });
      } else {
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
        sap.ui.getCore().attachInit(function () {
          registerSAPFonts();
          var e = sap.ui.getCore().getConfiguration().getLanguage();
          sap.ui.require(["sap/base/i18n/ResourceBundle"], function (n) {
            var t = n.create({ url: "i18n/i18n.properties", locale: e });
            document.title = t.getText("appTitle");
          });
        });
      }
    } else {
      sap.ui.getCore().attachInit(function () {
        registerSAPFonts();
        sap.ushell.Container.createRenderer().placeAt("content");
      });
    }
  });
//# sourceMappingURL=locate-reuse-libs.js.map
