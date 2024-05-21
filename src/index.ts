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

import { AddonSetup } from "./addon";
import { AutoHealSetup } from "./autoheal";

const Start = () => {
  console.log("openmargonem: started");

  AddonSetup();
  AutoHealSetup();
};

const Init = setInterval(() => {
  if (typeof window.Engine == "undefined") {
    console.info("openmargonem: window.Engine is not ready, sleeping...");
    return;
  }
  if (window.Engine.addonsPanel === null) {
    console.log("openmargonem: window.Engine.addonsPanel is not ready, sleeping...");
    return;
  }
  clearInterval(Init);

  Start();
}, 100);
