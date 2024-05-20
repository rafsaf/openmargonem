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

import { AddonType, Addon, AddonOption, AddonCreate } from "./addon";

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

const AutoHealInstall = () => {
  console.log("hello from AutoHealInstall");
};
const AutoHealUninstall = () => {
  console.log("hello from AutoHealUninstall");
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
    addonOptions: [
      AutoHealOptMinHealth,
      AutoHealOptUseFull,
      AutoHealOptUseNormal,
      AutoHealOptUsePercentage,
    ],
    id: "openmargonem-1",
    install: AutoHealInstall,
    uninstall: AutoHealUninstall,
  };

  AddonCreate(autoHeal);
};
