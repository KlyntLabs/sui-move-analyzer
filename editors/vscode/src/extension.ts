import { exec } from "child_process";
import * as fs from "fs";
import * as https from "https";
import * as http from "http";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

const GITHUB_REPO = "KlyntLabs/sui-move-analyzer";
const BINARY_NAME = "sui-move-analyzer";

let client: LanguageClient | undefined;

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const config = vscode.workspace.getConfiguration("suiMoveAnalyzer");
  const logLevel = config.get<string>("server.logLevel") || "info";

  let serverPath = config.get<string>("server.path") || "";
  if (!serverPath || serverPath === BINARY_NAME) {
    const resolved = await resolveServerPath(context);
    if (!resolved) {
      return;
    }
    serverPath = resolved;
  }

  const serverOptions: ServerOptions = {
    command: serverPath,
    args: ["--log-level", logLevel],
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "move" }],
    outputChannel: vscode.window.createOutputChannel("Sui Move Analyzer"),
    traceOutputChannel: vscode.window.createOutputChannel(
      "Sui Move Analyzer Trace",
    ),
  };

  client = new LanguageClient(
    "suiMoveAnalyzer",
    "Sui Move Analyzer",
    serverOptions,
    clientOptions,
  );

  await client.start();
}

export async function deactivate(): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
}

/** Find the server binary, downloading it if necessary. */
async function resolveServerPath(
  context: vscode.ExtensionContext,
): Promise<string | undefined> {
  // 1. Check if it's already on PATH
  if (await findOnPath(BINARY_NAME)) {
    return BINARY_NAME;
  }

  // 2. Check if we previously downloaded it
  const installed = installedBinaryPath(context);
  if (fs.existsSync(installed)) {
    return installed;
  }

  // 3. Offer to download
  const asset = getAssetName();
  if (!asset) {
    vscode.window.showErrorMessage(
      `Sui Move Analyzer: no pre-built binary available for ${os.platform()}-${os.arch()}. ` +
        `Please install manually from https://github.com/${GITHUB_REPO}/releases`,
    );
    return undefined;
  }

  const choice = await vscode.window.showInformationMessage(
    "Sui Move Analyzer: language server binary not found. Download it now?",
    "Download",
    "Cancel",
  );

  if (choice !== "Download") {
    return undefined;
  }

  const success = await downloadBinary(context, asset);
  return success ? installed : undefined;
}

/** Return the platform-specific asset name for GitHub Releases. */
function getAssetName(): string | undefined {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === "darwin" && arch === "arm64") {
    return "sui-move-analyzer-aarch64-apple-darwin";
  }
  if (platform === "darwin" && arch === "x64") {
    return "sui-move-analyzer-x86_64-apple-darwin";
  }
  if (platform === "linux" && arch === "x64") {
    return "sui-move-analyzer-x86_64-unknown-linux-gnu";
  }
  if (platform === "linux" && arch === "arm64") {
    return "sui-move-analyzer-aarch64-unknown-linux-gnu";
  }
  if (platform === "win32" && arch === "x64") {
    return "sui-move-analyzer-x86_64-pc-windows-msvc.exe";
  }
  return undefined;
}

/** Path where we store the downloaded binary inside the extension's globalStorage. */
function installedBinaryPath(context: vscode.ExtensionContext): string {
  return path.join(context.globalStorageUri.fsPath, BINARY_NAME);
}

/** Download the binary from the latest GitHub Release. */
async function downloadBinary(
  context: vscode.ExtensionContext,
  assetName: string,
): Promise<boolean> {
  const dir = context.globalStorageUri.fsPath;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const dest = installedBinaryPath(context);
  const url = `https://github.com/${GITHUB_REPO}/releases/latest/download/${assetName}`;

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Sui Move Analyzer: downloading language server...",
      cancellable: false,
    },
    async () => {
      try {
        await downloadFile(url, dest);
        fs.chmodSync(dest, 0o755);
        vscode.window.showInformationMessage(
          "Sui Move Analyzer: language server installed successfully.",
        );
        return true;
      } catch (err) {
        // Clean up partial download
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(
          `Sui Move Analyzer: failed to download binary. ${msg}`,
        );
        return false;
      }
    },
  );
}

/** Download a file, following HTTP redirects (GitHub uses 302). */
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const get = url.startsWith("https") ? https.get : http.get;
    get(url, (res: http.IncomingMessage) => {
      if (
        (res.statusCode === 301 || res.statusCode === 302) &&
        res.headers.location
      ) {
        res.resume();
        downloadFile(res.headers.location, dest).then(resolve, reject);
        return;
      }

      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", (err) => {
        file.close();
        reject(err);
      });
    }).on("error", reject);
  });
}

/** Check if a command exists on PATH. */
function findOnPath(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    const check = os.platform() === "win32" ? `where ${cmd}` : `which ${cmd}`;
    exec(check, (err) => resolve(!err));
  });
}
