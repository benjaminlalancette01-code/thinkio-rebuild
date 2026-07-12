# TASK-108: Add Automated Isolated VSIX Install Validation

Automate the real VS Code CLI install/uninstall/reinstall stress check that found the missing `engines.vscode` package blocker.

## Required Work

- Add a script that installs the generated VSIX into an isolated temporary extensions directory.
- Confirm `thinkio.thinkio-rebuild` appears in `code --list-extensions`.
- Uninstall and reinstall the extension.
- Wire the script into package validation without touching the user's normal VS Code extension directory.
- Update the plugin runbook with the automated validation path.

