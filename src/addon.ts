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

export enum AddonType {
  range = "range",
  checkbox = "checkbox",
}
export interface AddonOptionsTranslations {
  [optionKey: string]: string;
}

export interface AddonOption {
  optionKey: string;
  default: number;
  type: AddonType;
  max: number | null;
  min: number | null;
}
export interface AddonLanguage {
  name: string;
  description: string;
  optionTranslations: AddonOptionsTranslations;
}
export interface Addon {
  pl: AddonLanguage;
  en: AddonLanguage;
  image: string;
  options: boolean;
  addonOptions: AddonOption[];
  id: string;
  install: () => void;
  uninstall: () => void;
}

export const GetOptionValue = (addonId: string, option: AddonOption): number => {
  const uniqueId = `openmargonem-addons-${addonId}-${option.optionKey}`;

  const val = localStorage.getItem(uniqueId);
  if (val === null) {
    return option.default;
  }
  return parseInt(val);
};

const AddonInput = (addon: Addon, option: AddonOption): string => {
  const addonLang: AddonLanguage = addon[window._l()];
  const uniqueId = `openmargonem-addons-${addon.id}-${option.optionKey}`;
  const value = GetOptionValue(addon.id, option);

  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("label");
  const br = document.createElement("br");
  let rangeSpan: HTMLSpanElement | null = null;

  input.setAttribute("id", uniqueId);
  input.setAttribute("name", option.optionKey);
  input.setAttribute("type", option.type);
  label.setAttribute("for", uniqueId);
  if (option.type === AddonType.range) {
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

export const AddonCreate = (addon: Addon) => {
  if (!addon.id.startsWith("openmargonem")) {
    console.error(`name of addon: '${addon.id}' does not contain required 'openamrgonem' prefix`);
    return;
  }
  const addonLang: AddonLanguage = addon[window._l()];
  for (const option of addon.addonOptions) {
    addonLang.description += AddonInput(addon, option);
  }

  window.Engine.addonsPanel.createOneAddonOnList(addon, addon.id);
  window.Engine.addonsPanel.createOneAddonDescription(addon, addon.id);
  const active = window.Engine.addonsPanel.getStorageStateOfAddon(addon.id);
  window.Engine.addonsPanel.setStateAddon(addon, active, addon.id, undefined, undefined);
};

export const AddonSetup = () => {
  const originalGetStorageStateOfAddon = window.Engine.addonsPanel.getStorageStateOfAddon;
  window.Engine.addonsPanel.getStorageStateOfAddon = (id: string) => {
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
  window.Engine.addonsPanel.setStateAddon = (addon: Addon, active: boolean, id: string, p1: any, p2: any) => {
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
  window.Engine.addonsPanel.startAddonScript = (addon: Addon, id: string, active: boolean, p1: any) => {
    if (id.startsWith("openmargonem")) {
      return;
    }

    return originalStartAddonScript(addon, id, active, p1);
  };
};
