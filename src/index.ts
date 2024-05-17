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

*/ //!
import {
  AddonDescription,
  AddonOnList,
  addonIconListSelector,
  addonDescriptionListSelector,
  addonModalButton,
} from "./addon";
var OpenMargonemClientSetup = async () => {
  console.log("start OpenMargonemClientSetup");

  window.addEventListener(
    "load",
    function () {
      const addonModalBtn = addonModalButton();
      addonModalBtn.addEventListener("", () => {
        const autoHealId = 21031123123;
        console.log("event!");
        addonIconListSelector().appendChild(
          AddonOnList(autoHealId, "OM AutoHeal", false)
        );
        addonDescriptionListSelector().append(
          AddonDescription(autoHealId, "Open Margonem AutoHeal")
        );
      });
    },
    false
  );
};
OpenMargonemClientSetup();
