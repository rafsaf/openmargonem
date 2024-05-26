// ==UserScript==
// @name         OpenMargonem
// @version      v2
// @description  Free and open source margonem scripts
// @author       Rafał Safin <rafal.safin@rafsaf.pl>
// @copyright    GNU AGPLv3
// @source       https://github.com/rafsaf/openmargonem
// @match        https://*.margonem.pl/*
// @match        https://*.margonem.com/*
// @exclude      https://commons.margonem.pl/*
// @exclude      https://forum.margonem.pl/*
// @exclude      https://margonem.pl/*
// @exclude      https://www.margonem.pl/*
// @exclude      https://commons.margonem.com/*
// @exclude      https://forum.margonem.com/*
// @exclude      https://margonem.com/*
// @exclude      https://www.margonem.com/*
// @grant        none
// @noframes
// ==/UserScript==

/*!
openmargonem
Copyright (C) 2024  Rafał Safin <rafal.safin@rafsaf.pl>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
// compiled at 
(() => {
  // src/addon.ts
  var GetOptionValue = (addonId, option) => {
    const uniqueId = `openmargonem-addons-${addonId}-${option.optionKey}`;
    const val = localStorage.getItem(uniqueId);
    if (val === null) {
      return option.default;
    }
    return parseInt(val);
  };
  var AddonInput = (addon, option) => {
    const addonLang = addon[window._l()];
    const uniqueId = `openmargonem-addons-${addon.id}-${option.optionKey}`;
    const value = GetOptionValue(addon.id, option);
    const wrapper = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const br = document.createElement("br");
    let rangeSpan = null;
    input.setAttribute("id", uniqueId);
    input.setAttribute("name", option.optionKey);
    input.setAttribute("type", option.type);
    label.setAttribute("for", uniqueId);
    if (option.type === "range" /* range */) {
      input.setAttribute("min", String(option.min));
      input.setAttribute("max", String(option.max));
      input.setAttribute("value", String(value));
      rangeSpan = document.createElement("span");
      rangeSpan.setAttribute("id", `${uniqueId}-range`);
      rangeSpan.textContent = String(value);
      label.append(rangeSpan);
      input.setAttribute(
        "oninput",
        `localStorage.setItem('${uniqueId}', this.value);const label = document.getElementById('${uniqueId}-range');if (label !== null) {label.textContent = this.value;}`
      );
    } else {
      input.setAttribute(
        "oninput",
        `if (this.checked) {localStorage.setItem('${uniqueId}', '1')} else{localStorage.setItem('${uniqueId}', '0')};`
      );
      if (value === 1) {
        input.setAttribute("checked", "checked");
      }
    }
    label.innerHTML += addonLang.optionTranslations[option.optionKey];
    wrapper.append(br, input, label);
    return wrapper.innerHTML;
  };
  var AddonCreate = (addon) => {
    if (!addon.id.startsWith("openmargonem")) {
      console.error(`name of addon: '${addon.id}' does not contain required 'openmargonem' prefix`);
      return;
    }
    const addonLang = addon[window._l()];
    for (const option of addon.addonOptions) {
      addonLang.description += AddonInput(addon, option);
    }
    window.Engine.addonsPanel.createOneAddonOnList(addon, addon.id);
    window.Engine.addonsPanel.createOneAddonDescription(addon, addon.id);
    const active = window.Engine.addonsPanel.getStorageStateOfAddon(addon.id);
    window.Engine.addonsPanel.setStateAddon(addon, active, addon.id, void 0, void 0);
  };
  var AddonSetup = () => {
    const originalGetStorageStateOfAddon = window.Engine.addonsPanel.getStorageStateOfAddon;
    window.Engine.addonsPanel.getStorageStateOfAddon = (id) => {
      if (id.startsWith("openmargonem")) {
        const active = localStorage.getItem(`openmargonem-addons-${id}-active`);
        if (active !== null) {
          return true;
        }
        return false;
      }
      return originalGetStorageStateOfAddon(id);
    };
    const originalSetStateAddon = window.Engine.addonsPanel.setStateAddon;
    window.Engine.addonsPanel.setStateAddon = (addon, active, id, p1, p2) => {
      if (id.startsWith("openmargonem")) {
        if (active) {
          localStorage.setItem(`openmargonem-addons-${id}-active`, "1");
          addon.install();
        } else {
          localStorage.removeItem(`openmargonem-addons-${id}-active`);
          addon.uninstall();
        }
        window.Engine.addonsPanel.setButtonState(addon.id, active);
        window.Engine.addonsPanel.setWindgetColor(addon.id, active);
        return;
      }
      return originalSetStateAddon(addon, active, id, p1, p2);
    };
    const originalStartAddonScript = window.Engine.addonsPanel.startAddonScript;
    window.Engine.addonsPanel.startAddonScript = (addon, id, active, p1) => {
      if (id.startsWith("openmargonem")) {
        return;
      }
      return originalStartAddonScript(addon, id, active, p1);
    };
  };

  // src/sleep.ts
  var Sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  var sleep_default = Sleep;

  // src/autoheal.ts
  var AutoHealOptMinHealth = {
    optionKey: "AutoHealOptMinHealth",
    type: "range" /* range */,
    default: 90,
    max: 100,
    min: 1
  };
  var AutoHealOptUseFull = {
    optionKey: "AutoHealOptUseFull",
    type: "checkbox" /* checkbox */,
    default: 0,
    max: null,
    min: null
  };
  var AutoHealOptUseNormal = {
    optionKey: "AutoHealOptUseNormal",
    type: "checkbox" /* checkbox */,
    default: 1,
    max: null,
    min: null
  };
  var AutoHealOptUsePercentage = {
    optionKey: "AutoHealOptUsePercentage",
    type: "checkbox" /* checkbox */,
    default: 1,
    max: null,
    min: null
  };
  var getToFullHp = () => {
    const maxHp = window.Engine.hero.d.warrior_stats.maxhp;
    return Math.max(maxHp - window.Engine.hero.d.warrior_stats.hp, 0);
  };
  var getToMinHp = (minHealth) => {
    const maxHp = window.Engine.hero.d.warrior_stats.maxhp;
    return Math.max(minHealth / 100 * maxHp - window.Engine.hero.d.warrior_stats.hp, 0);
  };
  var WarriorAutoHeal = async () => {
    const maxHp = window.Engine.hero.d.warrior_stats.maxhp;
    const minHealth = GetOptionValue("openmargonem-1", AutoHealOptMinHealth);
    const toMinHp = getToMinHp(minHealth);
    if (toMinHp === 0 || window.Engine.dead) {
      return;
    }
    const toFullHp = getToFullHp();
    const useNormal = GetOptionValue("openmargonem-1", AutoHealOptUseNormal) === 1;
    const usePerc = GetOptionValue("openmargonem-1", AutoHealOptUsePercentage) === 1;
    const useFull = GetOptionValue("openmargonem-1", AutoHealOptUseFull) === 1;
    return AutoHealPlease({
      maxHp,
      toFullHp,
      toMinHp,
      useNormal,
      usePerc,
      useFull
    });
  };
  var AutoHealPlease = async (data) => {
    if (data.useNormal || data.usePerc) {
      const itemGetHeal = (item) => {
        if (item._cachedStats.leczy !== void 0) {
          return parseInt(item._cachedStats.leczy);
        } else {
          const percent = parseInt(item._cachedStats.perheal);
          return Math.round(percent / 100 * data.maxHp);
        }
      };
      while (data.toMinHp > 0) {
        let items;
        items = window.Engine.items.fetchLocationItems("g").filter((item) => {
          if (data.useNormal && data.usePerc) {
            return item._cachedStats.leczy !== void 0 || item._cachedStats.perheal !== void 0;
          } else if (data.useNormal) {
            return item._cachedStats.leczy !== void 0;
          } else if (data.usePerc) {
            return item._cachedStats.perheal !== void 0;
          }
        });
        items.sort((item1, item2) => {
          const heal1 = itemGetHeal(item1);
          const heal2 = itemGetHeal(item2);
          if (heal1 > data.toFullHp && heal2 > data.toFullHp) {
            const diff = heal1 - heal2;
            if (diff == 0) {
              return parseInt(item1._cachedStats.amount) - parseInt(item2._cachedStats.amount);
            }
            return diff;
          } else if (heal1 > data.toFullHp && heal2 <= data.toFullHp) {
            return 1;
          } else if (heal1 <= data.toFullHp && heal2 > data.toFullHp) {
            return -1;
          } else if (heal1 <= data.toFullHp && heal2 <= data.toFullHp) {
            const diff = heal2 - heal1;
            if (diff == 0) {
              return parseInt(item1._cachedStats.amount) - parseInt(item2._cachedStats.amount);
            }
            return diff;
          }
          return 0;
        });
        if (items.length === 0) {
          break;
        }
        window._g(`moveitem&st=1&id=${items[0].id}`);
        console.log(`openmargonem: ah: using ${items[0].name}`);
        await sleep_default(300);
        data.toMinHp = Math.max(data.toMinHp - itemGetHeal(items[0]), 0);
        data.toFullHp = Math.max(data.toFullHp - itemGetHeal(items[0]), 0);
      }
    }
    if (data.toMinHp === 0) {
      return [data.toMinHp, data.toFullHp];
    }
    if (data.useFull) {
      let items;
      items = window.Engine.items.fetchLocationItems("g").filter((item) => {
        return item._cachedStats.fullheal !== void 0;
      });
      items.sort((item1, item2) => {
        const fullHeal1 = parseInt(item1._cachedStats.fullheal);
        const fullHeal2 = parseInt(item2._cachedStats.fullheal);
        return fullHeal1 - fullHeal2;
      });
      for (const item of items) {
        window._g(`moveitem&st=1&id=${item.id}`);
        console.log(`openmargonem: ah: using ${item.name}`);
        await sleep_default(300);
        data.toMinHp = Math.max(data.toMinHp - parseInt(item._cachedStats.fullheal), 0);
        data.toFullHp = Math.max(data.toFullHp - parseInt(item._cachedStats.fullheal), 0);
      }
    }
    return [data.toMinHp, data.toFullHp];
  };
  var AutoHealInstall = () => {
    window.API.addCallbackToEvent("close_battle", WarriorAutoHeal);
    WarriorAutoHeal();
  };
  var AutoHealUninstall = () => {
    try {
      window.API.removeCallbackFromEvent("close_battle", WarriorAutoHeal);
    } catch {
    }
  };
  var AutoHealSetup = () => {
    const autoHeal = {
      pl: {
        name: "OM AutoHeal",
        description: "OpenMargonem AutoHeal<br/>",
        optionTranslations: {
          AutoHealOptMinHealth: "<br/>Minimalna procentowa ilo\u015B\u0107 zdrowia<br/>",
          AutoHealOptUseFull: "U\u017Cywaj mikstur pe\u0142nego leczenia",
          AutoHealOptUseNormal: "U\u017Cywaj normalnych mikstur",
          AutoHealOptUsePercentage: "U\u017Cywaj procentowych mikstur"
        }
      },
      en: {
        name: "OM AutoHeal",
        description: "OpenMargonem AutoHeal<br/>",
        optionTranslations: {
          AutoHealOptMinHealth: "<br/>Minimum health percentage allowed<br/>",
          AutoHealOptUseFull: "Use full hp potions",
          AutoHealOptUseNormal: "Use normal potions",
          AutoHealOptUsePercentage: "Use percentage potions"
        }
      },
      image: "/img/gui/addons-icons.png|-376 -34",
      options: false,
      addonOptions: [AutoHealOptMinHealth, AutoHealOptUseNormal, AutoHealOptUsePercentage, AutoHealOptUseFull],
      id: "openmargonem-1",
      install: AutoHealInstall,
      uninstall: AutoHealUninstall
    };
    AddonCreate(autoHeal);
  };

  // src/index.ts
  var Init = setInterval(() => {
    if (typeof window.Engine == "undefined") {
      console.info("openmargonem: window.Engine is not ready, sleeping...");
      return;
    }
    if (window.Engine.addonsPanel === null) {
      console.log("openmargonem: window.Engine.addonsPanel is not ready, sleeping...");
      return;
    }
    clearInterval(Init);
    console.log("openmargonem: started");
    AddonSetup();
    AutoHealSetup();
  }, 100);
})();
