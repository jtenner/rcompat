import collect from "@rcompat/fs/collect";
import webpath from "@rcompat/fs/webpath";
import override from "@rcompat/record/override";
import Node from "./Node.js";
import * as errors from "./errors.js";
import type { Route, RouteEntry, RouterConfig } from "./types.js";

const defaults = {
  directory: undefined,
  extensions: [".js"],
  specials: {},
  predicate: () => true,
  import: true,
} satisfies RouterConfig;

export default class Router {
  static Error = errors;

  #root;
  #config: RouterConfig;

  constructor(config: RouterConfig) {
    this.#config = override(defaults, config);
    Node.config = {
      specials: this.#config.specials,
      predicate: this.#config.predicate,
    };
    this.#root = new Node(null, "$");
  }

  #add(node: Node, parts: string[], file: Route) {
    const [first, ...rest] = parts;
    // anchor
    if (parts.length === 1) {
      node.filed(first, file);
    } else {
      this.#add(node.interim(first), rest, file);
    }
  }

  match(request: Request) {
    const path = new URL(request.url).pathname;
    const [_, ...parts] = path.split("/").map(p => p === "" ? "index" : p);
    const $parts = parts.filter((part, i) => i === 0 || part !== "index");
    const root = this.#root;
    return root.match(request, $parts.concat("index"), false)
      ?? root.match(request, $parts);
  }

  init(objects: RouteEntry[]) {
    for (const [path, file] of objects.sort(([a], [b]) => a > b ? 1 : -1)) {
      this.#add(this.#root, webpath(path).split("/"), file);
    }

    // check for duplicates
    this.#root.check((node: Node) => {
      if (node.doubled) {
        throw new errors.DoubleRoute(node.path);
      }
      const dynamics = node.dynamics();
      if (dynamics.length > 1) {
        throw new errors.DoubleRoute(dynamics[1].path);
      }
      if (dynamics.length === 0) {
        return;
      }
      const [dynamic] = dynamics;
      if (dynamic.optional && !dynamic.leaf) {
        throw new errors.OptionalRoute(dynamic.path);
      }
      if (dynamic.rest && !dynamic.leaf) {
        throw new errors.RestRoute(dynamic.path);
      }

      return undefined;
    });

    return this;
  }

  static init(config: RouterConfig, objects: RouteEntry[]) {
    return new Router(config).init(objects);
  }

  async load() {
    const { directory, extensions } = this.#config;
    const re = new RegExp(`^.*${extensions.join("|")}$`, "u");

    this.init(directory === undefined ? [] : await Promise.all(
      (await collect(directory, re, { recursive: true }))
        .map(async (file: any) => [
          `${file}`.replace(directory, _ => "").slice(1, -file.extension.length),
          this.#config.import && await file.import(),
        ])));

    return this;
  }

  depth(special: string) {
    return this.#root.max((node: Node) => node.specials()
      .filter(({ path }: { path: string }) => path.slice(1) === special).length > 0);
  }

  static load(config: RouterConfig) {
    return new Router(config).load();
  }
}
