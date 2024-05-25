/*
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

Source code: https://github.com/rafsaf/openmargonem
*/

import { AddonType, Addon, AddonOption, AddonCreate, GetOptionValue } from "./addon";
import Sleep from "./sleep";

const AutoHealOptMinHealth: AddonOption = {
  optionKey: "AutoHealOptMinHealth",
  type: AddonType.range,
  default: 90,
  max: 100,
  min: 1,
};
const AutoHealOptUseFull: AddonOption = {
  optionKey: "AutoHealOptUseFull",
  type: AddonType.checkbox,
  default: 0,
  max: null,
  min: null,
};
const AutoHealOptUseNormal: AddonOption = {
  optionKey: "AutoHealOptUseNormal",
  type: AddonType.checkbox,
  default: 1,
  max: null,
  min: null,
};
const AutoHealOptUsePercentage: AddonOption = {
  optionKey: "AutoHealOptUsePercentage",
  type: AddonType.checkbox,
  default: 1,
  max: null,
  min: null,
};

const getToFullHp = () => {
  const maxHp = window.Engine.hero.d.warrior_stats.maxhp;
  return Math.max(maxHp - window.Engine.hero.d.warrior_stats.hp, 0);
};
const getToMinHp = (minHealth: number) => {
  const maxHp = window.Engine.hero.d.warrior_stats.maxhp;
  return Math.max((minHealth / 100) * maxHp - window.Engine.hero.d.warrior_stats.hp, 0);
};

const WarriorAutoHeal = async () => {
  const maxHp = window.Engine.hero.d.warrior_stats.maxhp;
  const minHealth = GetOptionValue("openmargonem-1", AutoHealOptMinHealth);
  const toMinHp = getToMinHp(minHealth);
  if (toMinHp === 0 || window.Engine.dead) {
    // return early, nothing to do
    return;
  }
  const toFullHp = getToFullHp();
  const useNormal = GetOptionValue("openmargonem-1", AutoHealOptUseNormal) === 1;
  const usePerc = GetOptionValue("openmargonem-1", AutoHealOptUsePercentage) === 1;
  const useFull = GetOptionValue("openmargonem-1", AutoHealOptUseFull) === 1;
  return AutoHealPlease(maxHp, toMinHp, toFullHp, useNormal, usePerc, useFull);
};

export const AutoHealPlease = async (
  maxHp: number,
  toMinHp: number,
  toFullHp: number,
  useNormal: boolean,
  usePerc: boolean,
  useFull: boolean
) => {
  if (useNormal || usePerc) {
    const itemGetHeal = (item: Item) => {
      if (item._cachedStats.leczy !== undefined) {
        return parseInt(item._cachedStats.leczy!);
      } else {
        const percent = parseInt(item._cachedStats.perheal!);
        return Math.round((percent / 100) * maxHp);
      }
    };

    while (toMinHp > 0) {
      let items: Item[];
      items = window.Engine.items.fetchLocationItems("g").filter((item: Item) => {
        if (useNormal && usePerc) {
          return item._cachedStats.leczy !== undefined || item._cachedStats.perheal !== undefined;
        } else if (useNormal) {
          return item._cachedStats.leczy !== undefined;
        } else if (usePerc) {
          return item._cachedStats.perheal !== undefined;
        }
      });
      items.sort((item1: Item, item2: Item) => {
        const heal1 = itemGetHeal(item1);
        const heal2 = itemGetHeal(item2);

        if (heal1 > toFullHp && heal2 > toFullHp) {
          // case1 both potions are more to than full hp
          // less hp potion is better
          // if same hp, use one with less amount
          const diff = heal1 - heal2;
          if (diff == 0) {
            return parseInt(item1._cachedStats.amount!) - parseInt(item2._cachedStats.amount!);
          }
          return diff;
        } else if (heal1 > toFullHp && heal2 <= toFullHp) {
          // case2 first potion more than to full hp
          // second potion always better
          return 1;
        } else if (heal1 <= toFullHp && heal2 > toFullHp) {
          // case3 second potion more than to full hp
          // first potion always better
          return -1;
        } else if (heal1 <= toFullHp && heal2 <= toFullHp) {
          // case4 both less than to full hp
          // more hp potion is better
          // if same hp, use one with less amount
          const diff = heal2 - heal1;
          if (diff == 0) {
            return parseInt(item1._cachedStats.amount!) - parseInt(item2._cachedStats.amount!);
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

      await Sleep(300);

      toMinHp = Math.max(toMinHp - itemGetHeal(items[0]), 0);
      toFullHp = Math.max(toFullHp - itemGetHeal(items[0]), 0);
    }
  }
  if (toMinHp === 0) {
    return [toMinHp, toFullHp];
  }
  if (useFull) {
    let items: Item[];
    items = window.Engine.items.fetchLocationItems("g").filter((item: Item) => {
      return item._cachedStats.fullheal !== undefined;
    });
    items.sort((item1: Item, item2: Item) => {
      const fullHeal1 = parseInt(item1._cachedStats.fullheal!);
      const fullHeal2 = parseInt(item2._cachedStats.fullheal!);
      // always smallest full heal potion is better
      return fullHeal1 - fullHeal2;
    });
    for (const item of items) {
      if (toMinHp === 0) {
        break;
      }
      window._g(`moveitem&st=1&id=${item.id}`);
      console.log(`openmargonem: ah: using ${item.name}`);

      await Sleep(300);

      toMinHp = Math.max(toMinHp - parseInt(item._cachedStats.fullheal!), 0);
      toFullHp = Math.max(toFullHp - parseInt(item._cachedStats.fullheal!), 0);
    }
  }
  return [toMinHp, toFullHp];
};

const AutoHealInstall = () => {
  window.API.addCallbackToEvent("close_battle", WarriorAutoHeal);
  WarriorAutoHeal();
};
const AutoHealUninstall = () => {
  try {
    window.API.removeCallbackFromEvent("close_battle", WarriorAutoHeal);
  } catch {}
};

export const AutoHealSetup = () => {
  const autoHeal: Addon = {
    pl: {
      name: "OM AutoHeal",
      description: "OpenMargonem AutoHeal<br/>",
      optionTranslations: {
        AutoHealOptMinHealth: "<br/>Minimalna procentowa ilość zdrowia<br/>",
        AutoHealOptUseFull: "Używaj mikstur pełnego leczenia",
        AutoHealOptUseNormal: "Używaj normalnych mikstur",
        AutoHealOptUsePercentage: "Używaj procentowych mikstur",
      },
    },
    en: {
      name: "OM AutoHeal",
      description: "OpenMargonem AutoHeal<br/>",
      optionTranslations: {
        AutoHealOptMinHealth: "<br/>Minimum health percentage allowed<br/>",
        AutoHealOptUseFull: "Use full hp potions",
        AutoHealOptUseNormal: "Use normal potions",
        AutoHealOptUsePercentage: "Use percentage potions",
      },
    },
    image: "/img/gui/addons-icons.png|-376 -34",
    options: false,
    addonOptions: [AutoHealOptMinHealth, AutoHealOptUseNormal, AutoHealOptUsePercentage, AutoHealOptUseFull],
    id: "openmargonem-1",
    install: AutoHealInstall,
    uninstall: AutoHealUninstall,
  };

  AddonCreate(autoHeal);
};
