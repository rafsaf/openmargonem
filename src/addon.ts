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
// export const addonModalButton = () => {
//   return document.querySelector(
//     `[widget-pos="top-right"], [index="0"], [class="widget-in-interface-bar"]`
//   );
// };

var autohealData = {
  pl: {
    name: "Autoheal",
    description: "Autoheal <b>test</b>.",
  },
  en: {
    name: "Autoheal",
    description: "Autoheal <b>test</b>.",
  },
  image: "/img/gui/addons-icons.png|-376 -34",
  options: 1,
  id: "200000",
};

export const addonIconListSelector = () => {
  const panel = document.getElementsByClassName("addons-panel")[0];
  return panel.getElementsByClassName("addon-list")[0];
};
export const addonDescriptionListSelector = () => {
  const panel = document.getElementsByClassName("addons-panel")[0];
  const rightPanel = panel.getElementsByClassName(
    "right-scroll scroll-wrapper classic-bar"
  )[0];
  return rightPanel.getElementsByClassName("scroll-pane")[0];
};

export const AddonOnList = (
  id: number,
  name: string,
  activated: boolean
): HTMLDivElement => {
  const addon = document.createElement("div");

  addon.append(
    AddonOnListIcon((activated = activated)),
    AddonOnListTitle((name = name))
  );

  addon.classList.add("one-addon-on-list", `addon-on-list-${id}`);

  return addon;
};

const AddonOnListTitle = (name: string): HTMLDivElement => {
  const titleWrapper = document.createElement("div");
  const title = document.createElement("div");
  const titleText = document.createTextNode(name);

  title.appendChild(titleText);
  title.classList.add("addon-title");
  titleWrapper.classList.add("title-wrapper");
  titleWrapper.appendChild(title);

  return titleWrapper;
};

const AddonOnListIcon = (activated: boolean): HTMLDivElement => {
  const imgWrapper = document.createElement("div");
  const imgWrapperInner = document.createElement("div");
  const icon = document.createElement("div");

  imgWrapperInner.appendChild(icon);
  imgWrapper.appendChild(imgWrapperInner);

  icon.classList.add("addon-img", "icon");
  icon.setAttribute(
    "style",
    `background: url("/img/gui/addons-icons.png?v=1715672874201") -376px -34px;`
  );
  imgWrapperInner.classList.add("widget-button", "no-hover");
  if (activated) {
    imgWrapperInner.classList.add("green");
  } else {
    imgWrapperInner.classList.add("red");
  }
  imgWrapperInner.setAttribute("style", "width: 44px; height: 44px;");

  imgWrapper.classList.add("img-wrapper");

  return imgWrapper;
};

export const AddonDescription = (
  id: number,
  description: string
): HTMLDivElement => {
  const desc = document.createElement("div");

  const descLabel = document.createElement("div");
  const descText = document.createElement("div");

  descLabel.classList.add("description-label");
  descLabel.setAttribute("data-trans", "#description#extManager");
  descLabel.appendChild(document.createTextNode("Opis: "));

  descText.classList.add("description-text");
  descText.appendChild(document.createTextNode(description));

  desc.classList.add("one-addon-description", `desc-${id}`);
  desc.setAttribute("style", "display: none;");

  desc.append(AddonDescriptionButton(), descLabel, descText);

  return desc;
};

const AddonDescriptionButton = () => {
  const wrapper = document.createElement("div");
  const innerWrapper = document.createElement("div");
  const btnBackground = document.createElement("div");
  const btnLabel = document.createElement("div");
  const label = document.createTextNode("Włącz");

  btnLabel.appendChild(label);
  innerWrapper.append(btnBackground, btnLabel);
  wrapper.appendChild(innerWrapper);

  wrapper.classList.add("on-off-button");
  innerWrapper.classList.add("button", "green", "small");
  btnBackground.classList.add("background");
  btnLabel.classList.add("label");

  return wrapper;
};
