/**
 * Shared Portable Text / object helpers for Sanity migration scripts.
 *
 * Every function returns a plain object that matches a Sanity schema type
 * (block, list, pricingTable, etc.). Keys are prefixed with _type and _key
 * so they are ready to insert into a document.
 */

let _counter = 0;

/**
 * Deterministic-ish key for Portable Text blocks and inline objects.
 * Prefix + sanitised hint + incrementing base-36 counter = unique within a
 * single script run.
 */
export function key(prefix: string, hint: string): string {
  _counter += 1;
  const sanitized = hint
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}-${sanitized.slice(0, 24)}-${_counter.toString(36)}`;
}

/* -------------------------------------------------------------------------- */
/*  Portable Text block helpers                                               */
/* -------------------------------------------------------------------------- */

export interface Block {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3";
  markDefs: [];
  children: { _type: "span"; _key: string; text: string; marks: string[] }[];
}

/**
 * A single normal-style Portable Text paragraph.
 */
export function paragraphBlock(text: string): Block {
  return {
    _type: "block",
    _key: key("p", text.slice(0, 20)),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key("s", text.slice(0, 10)),
        text,
        marks: [],
      },
    ],
  };
}

export interface ListBlock extends Block {
  listItem: "bullet";
  level: 1;
}

/**
 * A bulleted list item.
 */
function listItemBlock(text: string, idx: number): ListBlock {
  return {
    _type: "block",
    _key: key("li", `${idx}-${text.slice(0, 12)}`),
    style: "normal",
    listItem: "bullet" as const,
    level: 1 as const,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key("s", text.slice(0, 10)),
        text,
        marks: [],
      },
    ],
  };
}

/**
 * Full bulleted list from an array of strings. Returns an array of block
 * objects suitable for a Portable Text array.
 */
export function listBlock(items: string[]): ListBlock[] {
  return items.map((item, idx) => listItemBlock(item, idx));
}

/* -------------------------------------------------------------------------- */
/*  Pricing table                                                             */
/* -------------------------------------------------------------------------- */

export interface Row {
  _type: "row";
  _key: string;
  cells: string[];
}

export interface PricingTable {
  _type: "pricingTable";
  _key: string;
  headers: string[];
  rows: Row[];
}

/**
 * A pricing-table inline object matching the brand schema's `pricingTable`
 * type.
 */
export function pricingTable(
  headers: string[],
  rows: string[][],
): PricingTable {
  return {
    _type: "pricingTable",
    _key: key("tbl", headers.join("-").slice(0, 20)),
    headers,
    rows: rows.map((cells, idx) => ({
      _type: "row",
      _key: key("row", `${idx}`),
      cells,
    })),
  };
}
