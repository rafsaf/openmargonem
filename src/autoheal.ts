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

import {
  AddonType,
  Addon,
  AddonOption,
  OpenMargonemAddonCreate,
} from "./addon";

export const OpenMargonemAddonAutoHealOptFull: AddonOption = {
  optionKey: "OpenMargonemAddonAutoHealOptFull",
  type: AddonType.boolean,
  default: true,
  max: null,
  min: null,
};

const OpenMargonemAddonAutoHealInstall = () => {
  console.log("hello from OpenMargonemAddonAutoHealInstall");
};
const OpenMargonemAddonAutoHealUninstall = () => {
  console.log("hello from OpenMargonemAddonAutoHealUninstall");
};

export const OpenMargonemAddonAutoHealSetup = () => {
  const autoHeal: Addon = {
    pl: {
      name: "OM AutoHeal",
      description: "OpenMargonem AutoHeal<br/>",
      optionTranslations: {
        OpenMargonemAddonAutoHealOptFull: "Uleczenie do pełnego życia",
      },
    },
    en: {
      name: "OM AutoHeal",
      description: "OpenMargonem AutoHeal<br/>",
      optionTranslations: {
        OpenMargonemAddonAutoHealOptFull: "Full hp healing",
      },
    },
    image: "/img/gui/addons-icons.png|-376 -34",
    options: false,
    addonOptions: [OpenMargonemAddonAutoHealOptFull],
    id: "openmargonem-1",
    install: OpenMargonemAddonAutoHealInstall,
    uninstall: OpenMargonemAddonAutoHealUninstall,
  };

  OpenMargonemAddonCreate(autoHeal);
};
