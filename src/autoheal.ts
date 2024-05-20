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

const AutoHealOptUseConsumable: AddonOption = {
  optionKey: "AutoHealOptUseConsumable",
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
        AutoHealOptUseConsumable: "Używaj przemiotów konsumpcyjnych",
      },
    },
    en: {
      name: "OM AutoHeal",
      description: "OpenMargonem AutoHeal<br/>",
      optionTranslations: {
        AutoHealOptMinHealth: "<br/>Minimum health percentage allowed<br/>",
        AutoHealOptUseConsumable: "Use consumable items",
      },
    },
    image: "/img/gui/addons-icons.png|-376 -34",
    options: false,
    addonOptions: [AutoHealOptMinHealth, AutoHealOptUseConsumable],
    id: "openmargonem-1",
    install: AutoHealInstall,
    uninstall: AutoHealUninstall,
  };

  AddonCreate(autoHeal);
};
