export type StringValue =
  | `${number}`
  | `${number}${"d" | "m" | "h"}`
  | `${number} ${"d" | "m" | "h"}`;
