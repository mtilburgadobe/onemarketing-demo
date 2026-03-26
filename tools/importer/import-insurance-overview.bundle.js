var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-insurance-overview.js
  var import_insurance_overview_exports = {};
  __export(import_insurance_overview_exports, {
    default: () => import_insurance_overview_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    var bgImage = element.querySelector(".c-stage__image img, .c-stage img");
    var heading = element.querySelector("h1.c-heading--page, h1.c-stage__headline, h1");
    var ctaLink = element.querySelector(".c-stage__paragraph-content a.c-button, .c-stage__paragraph-content a");
    var cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    var contentCell = [];
    if (heading) {
      var h1 = document2.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.push(h1);
    }
    if (ctaLink) {
      var p = document2.createElement("p");
      var a = document2.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      contentCell.push(p);
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    var block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse2(element, { document: document2 }) {
    var grid = element.classList.contains("multi-column-grid") ? element : element.closest(".multi-column-grid") || element;
    var columns = grid.querySelectorAll('.l-grid__row > .column, .l-grid__row > [class*="l-grid__column"]');
    if (!columns || columns.length === 0) {
      var row = grid.querySelector(".l-grid__row");
      if (row) {
        columns = row.children;
      }
    }
    if (!columns || columns.length === 0) {
      var block = WebImporter.Blocks.createBlock(document2, { name: "columns-info", cells: [] });
      element.replaceWith(block);
      return;
    }
    var row = [];
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      var cellContent = [];
      var images = col.querySelectorAll(".cmp-image a, .c-image img, img");
      for (var j = 0; j < images.length; j++) {
        var imgEl = images[j];
        if (imgEl.tagName === "A" && imgEl.querySelector("img")) {
          cellContent.push(imgEl);
        } else if (imgEl.tagName === "IMG") {
          if (!imgEl.closest("a") || !imgEl.closest(".cmp-image")) {
            cellContent.push(imgEl);
          }
        }
      }
      var headings = col.querySelectorAll("h2, h3, span.c-heading, .article-sum-title");
      for (var j = 0; j < headings.length; j++) {
        var h = headings[j];
        var heading = document2.createElement("h2");
        heading.textContent = h.textContent.trim();
        if (heading.textContent) {
          cellContent.push(heading);
        }
      }
      var lists = col.querySelectorAll("ul.c-list");
      for (var j = 0; j < lists.length; j++) {
        var sourceList = lists[j];
        var ul = document2.createElement("ul");
        var items = sourceList.querySelectorAll("li");
        for (var k = 0; k < items.length; k++) {
          var li = document2.createElement("li");
          var link = items[k].querySelector("a");
          if (link) {
            var a = document2.createElement("a");
            a.href = link.href;
            a.textContent = link.textContent.trim();
            li.appendChild(a);
          } else {
            var textContent = items[k].textContent.trim();
            li.textContent = textContent;
          }
          ul.appendChild(li);
        }
        cellContent.push(ul);
      }
      var textDivs = col.querySelectorAll(".text .c-copy");
      for (var j = 0; j < textDivs.length; j++) {
        var textDiv = textDivs[j];
        var childDivs = textDiv.querySelectorAll(":scope > div");
        for (var k = 0; k < childDivs.length; k++) {
          var childDiv = childDivs[k];
          var text = childDiv.textContent.trim();
          if (!text || text === "\xA0") continue;
          var childLink = childDiv.querySelector("a.c-link");
          if (childLink) {
            var p = document2.createElement("p");
            var a = document2.createElement("a");
            a.href = childLink.href;
            a.textContent = childLink.textContent.trim();
            p.appendChild(a);
            cellContent.push(p);
          } else {
            var p = document2.createElement("p");
            var boldEl = childDiv.querySelector("b");
            if (boldEl) {
              var strong = document2.createElement("strong");
              strong.textContent = boldEl.textContent.trim();
              p.appendChild(strong);
            } else {
              p.textContent = text;
            }
            cellContent.push(p);
          }
        }
      }
      row.push(cellContent.length > 0 ? cellContent : "");
    }
    var cells = [row];
    var block = WebImporter.Blocks.createBlock(document2, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/allianz-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#overlay",
        ".c-skip-link"
      ]);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header.c-header",
        ".c-header-spacer",
        "footer.c-footer",
        ".c-breadcrumb__container",
        ".c-three-level-navigation",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/allianz-sections.js
  function fixSelector(sel) {
    var fixed = sel.replace(/#(\d[^.\s,:[]*)/g, '[id="$1"]');
    return fixed;
  }
  function findElement(root, sel) {
    var containsMatch = sel.match(/(.*):contains\(['"]([^'"]+)['"]\)/);
    if (containsMatch) {
      var baseSelector = containsMatch[1].trim();
      var textToFind = containsMatch[2];
      var candidates = root.querySelectorAll(baseSelector);
      for (var i = 0; i < candidates.length; i++) {
        if (candidates[i].textContent.indexOf(textToFind) !== -1) {
          return candidates[i];
        }
      }
      return null;
    }
    return root.querySelector(fixSelector(sel));
  }
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      var template = payload && payload.template;
      var sections = template && template.sections;
      if (!sections || sections.length < 2) return;
      var reversedSections = sections.slice().reverse();
      reversedSections.forEach(function(section, idx) {
        var originalIndex = sections.length - 1 - idx;
        if (originalIndex === 0) return;
        var selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        var sectionEl = null;
        for (var i = 0; i < selectors.length; i++) {
          try {
            sectionEl = findElement(element, selectors[i]);
          } catch (e) {
            sectionEl = null;
          }
          if (sectionEl) break;
        }
        if (sectionEl) {
          if (section.style) {
            var metaBlock = WebImporter.Blocks.createBlock(document, {
              name: "Section Metadata",
              cells: { style: section.style }
            });
            sectionEl.before(metaBlock);
          }
          var hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-insurance-overview.js
  var parsers = {
    "hero-banner": parse,
    "columns-info": parse2
  };
  var PAGE_TEMPLATE = {
    name: "insurance-overview",
    description: "Insurance overview landing page showcasing insurance products and services available in Switzerland",
    urls: [
      "https://www.allianz.ch/en/insurance-switzerland.html"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".c-stage"]
      },
      {
        name: "columns-info",
        instances: [".multi-column-grid"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero/Stage",
        selector: ".c-stage",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Topics and At a Glance",
        selector: ".parsys > .wrapper:first-child .multi-column-grid",
        style: null,
        blocks: ["columns-info"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Introduction",
        selector: ".parsys > .wrapper:first-child > .l-container .c-wrapper > .text",
        style: null,
        blocks: [],
        defaultContent: [".parsys > .wrapper:first-child > .l-container .c-wrapper > .text .c-copy"]
      },
      {
        id: "section-4",
        name: "Obligatory Insurance Policies",
        selector: "#0_summary",
        style: null,
        blocks: [],
        defaultContent: ["#0_summary", ".headline h3", ".text .c-copy"]
      },
      {
        id: "section-5",
        name: "Voluntary Insurance Policies",
        selector: "#1_summary",
        style: null,
        blocks: [],
        defaultContent: ["#1_summary", ".headline h3", ".text .c-copy"]
      },
      {
        id: "section-6",
        name: "Good to Know",
        selector: [".c-wrapper .headline span:contains('GOOD TO KNOW')", ".c-wrapper .headline span"],
        style: null,
        blocks: [],
        defaultContent: [".c-heading", ".c-copy"]
      },
      {
        id: "section-7",
        name: "Arrange a Consultation",
        selector: "#2_summary",
        style: null,
        blocks: [],
        defaultContent: ["#2_summary", ".c-copy", ".button"]
      },
      {
        id: "section-8",
        name: "Customer Reviews and Ratings",
        selector: "#3_summary",
        style: null,
        blocks: ["columns-info"],
        defaultContent: ["#3_summary", ".c-copy"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach(function(transformerFn) {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error("Transformer failed at " + hookName + ":", e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    var pageBlocks = [];
    template.blocks.forEach(function(blockDef) {
      blockDef.instances.forEach(function(selector) {
        var elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn('Block "' + blockDef.name + '" selector not found: ' + selector);
        }
        elements.forEach(function(element) {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log("Found " + pageBlocks.length + " block instances on page");
    return pageBlocks;
  }
  var import_insurance_overview_default = {
    transform: function(payload) {
      var document2 = payload.document;
      var url = payload.url;
      var html = payload.html;
      var params = payload.params;
      var main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      var pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach(function(block) {
        var parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error("Failed to parse " + block.name + " (" + block.selector + "):", e);
          }
        } else {
          console.warn("No parser found for block: " + block.name);
        }
      });
      executeTransformers("afterTransform", main, payload);
      var hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      var path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map(function(b) {
            return b.name;
          })
        }
      }];
    }
  };
  return __toCommonJS(import_insurance_overview_exports);
})();
