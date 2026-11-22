#!/usr/bin/env python3
"""Install and run a pinned codebase-memory-mcp on macOS and Linux (Python 3.9+)."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import tarfile
import tempfile


ROOT = Path(__file__).resolve().parent.parent
VERSION = "0.12.1"
RELEASE = f"https://github.com/DeusData/codebase-memory-mcp/releases/download/v{VERSION}"
DEST = ROOT / ".tools" / "codebase-memory-mcp"
BINARY = DEST / "codebase-memory-mcp"
# Published checksums.txt for v0.12.1. Linux uses the static portable builds.
CHECKSUMS = {
    "darwin-amd64": "ca6e64397a8ae80cec898a8205a6aa16750ac798acc05a0c3ed983837944a581",
    "darwin-arm64": "9bfcbe38414b47969a3e1d1c1999f5357409387c86fa3d24221b5458267660d2",
    "linux-amd64-portable": "8c3d0341064301e78ecc84cf7348d4e2c6562a0f57448243ea560aaa34de36c1",
    "linux-arm64-portable": "ed0f1f548cd79b121c401c2e9f7841c189a001af26d3768368088c24f6a53533",
}


def platform_key():
    system = platform.system().lower()
    machine = platform.machine().lower()
    arch = {"x86_64": "amd64", "amd64": "amd64", "arm64": "arm64", "aarch64": "arm64"}.get(machine)
    key = f"{system}-{arch}" + ("-portable" if system == "linux" else "")
    if key not in CHECKSUMS:
        raise RuntimeError(f"Unsupported platform: {system}/{machine}; use macOS or Linux, x86_64 or ARM64")
    return key


def run(*args, **kwargs):
    return subprocess.run([str(arg) for arg in args], check=True, cwd=ROOT, **kwargs)


def check_version(binary):
    actual = run(binary, "--version", capture_output=True, text=True).stdout.strip()
    if actual != f"codebase-memory-mcp {VERSION}":
        raise RuntimeError(f"Expected codebase-memory-mcp {VERSION}, got {actual!r}")


def install():
    key = platform_key()
    if BINARY.is_file():
        check_version(BINARY)
        print(f"Already installed: {BINARY}", flush=True)
        return
    if not shutil.which("curl"):
        raise RuntimeError("curl is required to download the release")
    DEST.parent.mkdir(parents=True, exist_ok=True)
    # Stage on the same filesystem; publish only a verified, working release.
    with tempfile.TemporaryDirectory(prefix="cbm-", dir=DEST.parent) as temp:
        stage = Path(temp)
        archive = stage / "release.tar.gz"
        name = f"codebase-memory-mcp-{key}.tar.gz"
        print(f"Downloading {name} (v{VERSION})", flush=True)
        run("curl", "--fail", "--location", "--silent", "--show-error",
            "--proto", "=https", "--proto-redir", "=https", "--retry", "3",
            "--connect-timeout", "20", "--max-time", "600",
            "--output", archive, f"{RELEASE}/{name}")
        with archive.open("rb") as stream:
            digest = hashlib.sha256()
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(chunk)
        if digest.hexdigest() != CHECKSUMS[key]:
            raise RuntimeError("Release SHA-256 mismatch; installation cancelled")
        payload = stage / "payload"
        payload.mkdir()
        with tarfile.open(archive, "r:gz") as source:
            for member_name in ("codebase-memory-mcp", "LICENSE", "THIRD_PARTY_NOTICES.md"):
                member = source.getmember(member_name)
                if not member.isfile():
                    raise RuntimeError(f"Not a regular release file: {member_name}")
                with source.extractfile(member) as stream:
                    (payload / member_name).write_bytes(stream.read())
        candidate = payload / BINARY.name
        candidate.chmod(0o755)
        check_version(candidate)
        if DEST.exists():
            raise RuntimeError(f"Incomplete installation at {DEST}; remove it and retry")
        payload.rename(DEST)
    print(f"Installed: {BINARY}", flush=True)


def register():
    if not shutil.which("codex"):
        raise RuntimeError("codex is not on PATH; install Codex CLI or register the binary in your MCP client manually")
    current = subprocess.run(["codex", "mcp", "get", "codebase-memory", "--json"],
                             capture_output=True, text=True, cwd=ROOT)
    if current.returncode == 0:
        transport = json.loads(current.stdout).get("transport", {})
        if transport.get("command") != str(BINARY) or transport.get("args"):
            raise RuntimeError("A different codebase-memory MCP entry exists; keep it or remove it with codex mcp remove codebase-memory before setup")
        print("Codex MCP entry already registered", flush=True)
        return
    run("codex", "mcp", "add", "codebase-memory", "--", BINARY)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("setup", "install", "index", "serve", "cli"),
                        help="setup: install, register in Codex, index; install: download only")
    parser.add_argument("arguments", nargs=argparse.REMAINDER, help="arguments passed to index_repository or cli")
    args = parser.parse_args()
    if args.arguments and args.action not in ("index", "cli"):
        parser.error("extra arguments are supported only for index and cli")
    if args.action in ("setup", "install"):
        install()
    elif not BINARY.is_file():
        raise RuntimeError("Indexer is not installed; run python3 scripts/code_index.py setup")
    if args.action == "setup":
        register()
    if args.action in ("setup", "index"):
        run(BINARY, "cli", "--progress", "index_repository", "--repo-path", ROOT,
            "--name", "ufalit", *args.arguments)
    elif args.action == "serve":
        os.chdir(ROOT)
        os.execv(str(BINARY), [str(BINARY)])
    elif args.action == "cli":
        run(BINARY, "cli", *args.arguments)


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError, ValueError, KeyError, tarfile.TarError, subprocess.CalledProcessError) as error:
        print(f"code-index: {error}", file=sys.stderr)
        sys.exit(1)
