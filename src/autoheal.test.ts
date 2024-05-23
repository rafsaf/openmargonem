import { describe, expect, test, beforeEach } from "@jest/globals";
import { AutoHealPlease } from "./autoheal";

// mock sleep module
jest.mock("./sleep", () => (ms: number) => new Promise((r) => setTimeout(r, 0)));

// this generator func for passed array object return func that mimics margonem _g() behaviour on items
const CreateGMock = (items: Item[]) => (cmd: string) => {
  const itemID = cmd.split("id=")[1];
  let itemToChange: Item | undefined;
  for (const item of items) {
    if (item.id === itemID) {
      itemToChange = item;
      break;
    }
  }
  if (itemToChange === undefined) {
    throw "no item with such id";
  }
  const itemToChangeAmount = parseInt(itemToChange._cachedStats.amount);
  if (itemToChangeAmount === 1) {
    const i = items.indexOf(itemToChange);
    items.splice(i, 1);
  } else {
    itemToChange._cachedStats.amount = `${itemToChangeAmount - 1}`;
  }
};

beforeEach(() => {
  // @ts-expect-error dummy init engine
  window.Engine = {};
  // @ts-expect-error dummy init engine
  window.Engine.items = {};
});

describe("No potions", () => {
  test("Should not use any item and change hp - empty bag", async () => {
    const gMock = jest.fn();
    window._g = gMock;

    const items: Item[] = [];
    const itemsMock = jest.fn();
    itemsMock.mockReturnValue(items);
    window.Engine.items.fetchLocationItems = itemsMock;

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(100);
    expect(toFullHp).toBe(200);
    expect(gMock.mock.calls).toHaveLength(0);
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 2);
  });
  test("Should not use any item and change hp - only normal items", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "2",
        name: "2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn();
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(100);
    expect(toFullHp).toBe(200);
    expect(gMock.mock.calls).toHaveLength(0);
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 2);
  });
});

describe("Normal potions", () => {
  test("Should heal for single potion and use it", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "1", leczy: "5", perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL",
        name: "NORMAL",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL2",
        name: "NORMAL2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn(CreateGMock(items));
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(95);
    expect(toFullHp).toBe(195);
    expect(gMock.mock.calls).toHaveLength(1);
    expect(gMock.mock.calls[0][0]).toBe("moveitem&st=1&id=1");
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 2);
  });
  test("Should heal for 5 small potions and use all", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "2", leczy: "5", perheal: undefined, fullheal: undefined },
      },
      {
        id: "2",
        name: "2",
        _cachedStats: { amount: "1", leczy: "15", perheal: undefined, fullheal: undefined },
      },
      {
        id: "3",
        name: "3",
        _cachedStats: { amount: "2", leczy: "10", perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL",
        name: "NORMAL",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL2",
        name: "NORMAL2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn(CreateGMock(items));
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(55);
    expect(toFullHp).toBe(155);
    expect(gMock.mock.calls).toHaveLength(5);
    expect(gMock.mock.calls[0][0]).toBe("moveitem&st=1&id=2");
    expect(gMock.mock.calls[1][0]).toBe("moveitem&st=1&id=3");
    expect(gMock.mock.calls[2][0]).toBe("moveitem&st=1&id=3");
    expect(gMock.mock.calls[3][0]).toBe("moveitem&st=1&id=1");
    expect(gMock.mock.calls[4][0]).toBe("moveitem&st=1&id=1");
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 2);
  });
  test("Should prefer 160hp potion over 60hp for 200hp to full and 100hp to min and use one", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "100", leczy: "60", perheal: undefined, fullheal: undefined },
      },
      {
        id: "2",
        name: "2",
        _cachedStats: { amount: "100", leczy: "160", perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL",
        name: "NORMAL",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL2",
        name: "NORMAL2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn(CreateGMock(items));
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(0);
    expect(toFullHp).toBe(40);
    expect(gMock.mock.calls).toHaveLength(1);
    expect(gMock.mock.calls[0][0]).toBe("moveitem&st=1&id=2");
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 1);
  });
  test("Should prefer 5hp potion over 250hp for 200hp to full and 100hp to min but use both", async () => {
    // this is slightly not optimal but current algorithm is greedy
    // (see https://en.wikipedia.org/wiki/Greedy_algorithm) so this is expected
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "1", leczy: "5", perheal: undefined, fullheal: undefined },
      },
      {
        id: "2",
        name: "2",
        _cachedStats: { amount: "1", leczy: "250", perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL",
        name: "NORMAL",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL2",
        name: "NORMAL2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn(CreateGMock(items));
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(0);
    expect(toFullHp).toBe(0);
    expect(gMock.mock.calls).toHaveLength(2);
    expect(gMock.mock.calls[0][0]).toBe("moveitem&st=1&id=1");
    expect(gMock.mock.calls[1][0]).toBe("moveitem&st=1&id=2");
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 1);
  });
  test("Should prefer 250hp potion over 300hp for 200hp to full and 100hp to min and use one", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "1", leczy: "300", perheal: undefined, fullheal: undefined },
      },
      {
        id: "2",
        name: "2",
        _cachedStats: { amount: "1", leczy: "250", perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL",
        name: "NORMAL",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL2",
        name: "NORMAL2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn(CreateGMock(items));
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(0);
    expect(toFullHp).toBe(0);
    expect(gMock.mock.calls).toHaveLength(1);
    expect(gMock.mock.calls[0][0]).toBe("moveitem&st=1&id=2");
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 1);
  });
  test("Should prefer less amount 100hp potion over more amount 100hp potions or 99hp", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "1",
        _cachedStats: { amount: "14", leczy: "100", perheal: undefined, fullheal: undefined },
      },
      {
        id: "2",
        name: "2",
        _cachedStats: { amount: "5", leczy: "100", perheal: undefined, fullheal: undefined },
      },
      {
        id: "3",
        name: "3",
        _cachedStats: { amount: "2", leczy: "100", perheal: undefined, fullheal: undefined },
      },
      {
        id: "4",
        name: "4",
        _cachedStats: { amount: "10", leczy: "100", perheal: undefined, fullheal: undefined },
      },
      {
        id: "5",
        name: "5",
        _cachedStats: { amount: "1", leczy: "99", perheal: undefined, fullheal: undefined },
      },
      {
        id: "6",
        name: "6",
        _cachedStats: { amount: "1", leczy: "5", perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL",
        name: "NORMAL",
        _cachedStats: { amount: "1", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
      {
        id: "NORMAL2",
        name: "NORMAL2",
        _cachedStats: { amount: "6", leczy: undefined, perheal: undefined, fullheal: undefined },
      },
    ];

    const gMock = jest.fn(CreateGMock(items));
    window._g = gMock;

    const itemsMock = jest.fn();
    window.Engine.items.fetchLocationItems = itemsMock;
    itemsMock.mockReturnValue(items);

    const [toMinHp, toFullHp] = await AutoHealPlease(100, 200, true, false, false);

    expect(toMinHp).toBe(0);
    expect(toFullHp).toBe(100);
    expect(gMock.mock.calls).toHaveLength(1);
    expect(gMock.mock.calls[0][0]).toBe("moveitem&st=1&id=3");
    expect(itemsMock.mock.calls).toHaveLength(gMock.mock.calls.length + 1);
  });
});
