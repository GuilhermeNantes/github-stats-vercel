import type { VercelRequest } from "@vercel/node";

import type { CommandName, TerminalConfig } from "../types";

import { defaultConfig } from "./defaults";

const VALID_COMMANDS: CommandName[] = [
  "whoami",
  "manifest",
  "gitlog",
  "stats",
  "languages",
  "projects",
  "contributions",
  "contact",
];

const VALID_THEMES = ["dark", "github", "cupertino", "dracula", "white", "cappuccino"];
const VALID_SPEEDS = ["slow", "normal", "fast", "instant"] as const;

function getString(value: string | string[] | undefined, fallback: string): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function getNumber(value: string | string[] | undefined, fallback: number): number {
  const stringValue = getString(value, String(fallback));
  const number = Number(stringValue);
  if (!Number.isFinite(number)) return fallback;
  return number;
}

function getBoolean(value: string | string[] | undefined, fallback: boolean): boolean {
  const stringValue = getString(value, "");
  if (!stringValue) return fallback;
  return stringValue.toLowerCase() === "true";
}

function parseList(value: string | string[] | undefined): string[] {
  const stringValue = getString(value, "");
  if (!stringValue) return [];
  return stringValue
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export interface ParseResult {
  config: TerminalConfig;
  unknownCommands: string[];
}

export function getUsername(req: VercelRequest): string | null {
  const raw = req.query.username ?? req.query.Username;
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pickTheme(value: string | string[] | undefined): string {
  const v = getString(value, "dark").toLowerCase();
  return VALID_THEMES.includes(v) ? v : "dark";
}

function pickSpeed(value: string | string[] | undefined): "slow" | "normal" | "fast" | "instant" {
  const v = getString(value, "normal").toLowerCase();
  return (VALID_SPEEDS as readonly string[]).includes(v)
    ? (v as "slow" | "normal" | "fast" | "instant")
    : "normal";
}

export function parseRequest(req: VercelRequest): ParseResult {
  const rawCommands = parseList(req.query.cmd);
  const unknownCommands = rawCommands.filter(
    (cmd) => !VALID_COMMANDS.includes(cmd),
  );
  const validCommands = rawCommands.filter(
    (cmd): cmd is CommandName =>
      VALID_COMMANDS.includes(cmd) && !defaultConfig.hidden.includes(cmd),
  );

  const commands =
    validCommands.length > 0 ? validCommands : defaultConfig.commands;

  const noanimationRaw = getString(req.query.noanimation, "");
  const noanimation =
    noanimationRaw === "" ? false : noanimationRaw.toLowerCase() === "true";

  const speed = pickSpeed(req.query.speed);
  const effectiveNoanimation = noanimation || speed === "instant";

  const config: TerminalConfig = {
    username: getString(req.query.username, defaultConfig.username),
    name: getString(req.query.name, defaultConfig.name),
    role: getString(req.query.role, defaultConfig.role),
    commands,
    theme: pickTheme(req.query.theme),
    hidden: parseList(req.query.hide),
    width: getNumber(req.query.width, defaultConfig.width),
    height: getNumber(req.query.height, defaultConfig.height),
    noanimation: effectiveNoanimation,
    speed,
  };

  return { config, unknownCommands };
}

export function isMockMode(req: VercelRequest): boolean {
  return getString(req.query.mock, "").toLowerCase() === "1" ||
    getString(req.query.mock, "").toLowerCase() === "true";
}

export function isHelpMode(req: VercelRequest): boolean {
  const help = getString(req.query.help, "").toLowerCase();
  return help === "1" || help === "true";
}

export function listAvailableCommands(): string[] {
  return [...VALID_COMMANDS];
}
