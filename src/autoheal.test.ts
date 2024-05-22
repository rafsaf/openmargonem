import { describe, expect, test, beforeEach } from "@jest/globals";
import { AutoHealPlease } from "./autoheal";
import * as autoheal from "./autoheal";

beforeEach(() => {
  const sleepMock = jest.spyOn(autoheal, "sleep");
  sleepMock.mockImplementation(() => new Promise(() => {}));

  // @ts-expect-error dummy init engine
  window.Engine = {};
  // @ts-expect-error dummy init engine
  window.Engine.items = {};
});

describe("No potions in items", () => {
  test("Should not trigger any item and change hp - empty bag", async () => {
    const gMock = jest.fn();
    window._g = gMock;

    const items: Item[] = [];
    const itemsMock = jest.fn();
    itemsMock.mockReturnValueOnce(items);
    window.Engine.items.fetchLocationItems = itemsMock;

    const [toMinHp, toFullHp] = await AutoHealPlease(1000, 10000, true, false, false);

    expect(toMinHp).toBe(1000);
    expect(toFullHp).toBe(10000);
    expect(gMock.mock.calls).toHaveLength(0);
  });
  test("Should not trigger any item and change hp - only normal items", async () => {
    const gMock = jest.fn();
    window._g = gMock;

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
    const itemsMock = jest.fn();
    itemsMock.mockReturnValueOnce(items);
    window.Engine.items.fetchLocationItems = itemsMock;

    const [toMinHp, toFullHp] = await AutoHealPlease(1000, 10000, true, false, false);

    expect(toMinHp).toBe(1000);
    expect(toFullHp).toBe(10000);
    expect(gMock.mock.calls).toHaveLength(0);
  });
});
