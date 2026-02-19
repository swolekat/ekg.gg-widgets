/// <reference types="@ekg_gg/devkit" />

declare namespace EKG {
  interface WidgetAssets {
    fartImage: string
    fartSound: string
  }
  interface WidgetSettings {
    fartCommand: string
    privileges: "everybody" | "justSubs" | "subs" | "vips" | "mods" | "broadcaster"
  }
}
