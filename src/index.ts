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

Source code: https://github.com/rafsaf/openmargonem
*/

interface MargonemEngine {
  addonsPanel: AddonsPanel;
}

interface AddonsPanel {
  createOneAddonOnList: (data: object, addonId: string) => void;
  createOneAddonDescription: (data: object, addonId: string) => void;
  setButtonState: (id: string, active: boolean) => void;
  setWindgetColor: (id: string, active: boolean) => void;
  getStorageStateOfAddon: (id: string) => boolean;
  getAddonIdKey: (id: string) => string;
  setStateAddon: (
    data: object,
    active: boolean,
    id: string,
    p1: any,
    p2: any
  ) => void;
}

var Engine: MargonemEngine;
var getEngine: () => MargonemEngine;

const OpenMargonemRun = () => {
  console.log(`start ${OpenMargonemRun}`);

  const autohealData = {
    pl: {
      name: "Autoheal",
      description:
        'Autoheal <b>test</b> <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"><label for="vehicle1"> I have a bike</label><br>',
    },
    en: {
      name: "Autoheal",
      description:
        'Autoheal <b>test</b> <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"><label for="vehicle1"> I have a bike</label><br>',
    },
    image: "/img/gui/addons-icons.png|-376 -34",
    options: 0,
    id: "openmargonem-1",
  };
  window.Engine.addonsPanel.createOneAddonOnList(
    autohealData,
    autohealData["id"]
  );
  window.Engine.addonsPanel.createOneAddonDescription(
    autohealData,
    autohealData["id"]
  );
  window.Engine.addonsPanel.setButtonState(autohealData["id"], true);
  window.Engine.addonsPanel.setWindgetColor(autohealData["id"], true);
  const originalGetStorageStateOfAddon =
    window.Engine.addonsPanel.getStorageStateOfAddon;
  window.Engine.addonsPanel.getStorageStateOfAddon = (id: string) => {
    if (id.startsWith("openmargonem")) {
      let active = localStorage.getItem(
        `${OpenMargonemRun}-${"openmargonem"}-${id}-active`
      );
      if (active !== null) {
        return true;
      }
      return false;
    }

    return originalGetStorageStateOfAddon(id);
  };
  const originalSetStateAddon = window.Engine.addonsPanel.setStateAddon;
  window.Engine.addonsPanel.setStateAddon = (
    data: object,
    active: boolean,
    id: string,
    p1: any,
    p2: any
  ) => {
    if (id.startsWith("openmargonem")) {
      if (active) {
        localStorage.setItem(
          `${OpenMargonemRun}-${"openmargonem"}-${id}-active`,
          "1"
        );
      } else {
        localStorage.removeItem(
          `${OpenMargonemRun}-${"openmargonem"}-${id}-active`
        );
      }
      window.Engine.addonsPanel.setButtonState(autohealData["id"], active);
      window.Engine.addonsPanel.setWindgetColor(autohealData["id"], active);
    }

    return originalSetStateAddon(data, active, id, p1, p2);
  };
};

const OpenMargonemSetup = setInterval(() => {
  if (typeof window.Engine == "undefined") {
    console.debug("window.Engine is not ready, sleeping...");
    return;
  }
  if (!("addonsPanel" in window.Engine)) {
    console.debug("window.Engine.addonsPanel is not ready, sleeping...");
    return;
  }
  clearInterval(OpenMargonemSetup);

  OpenMargonemRun();
}, 100);
