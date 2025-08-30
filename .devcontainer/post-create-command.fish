#!/usr/bin/fish
cd /workspaces/rom_archiver

# Install pnpm and global modules
sudo apk add bat git jq nodejs npm ripgrep starship
sudo npm install --global pnpm

# Setup Starship Prompt
mkdir -p $HOME/.config
echo "
[container]
disabled = true

[nodejs]
disabled = true
" > $HOME/.config/starship.toml

# Setup Git config
git config --global core.editor "code --wait"
git config --global diff.tool "code --wait"
git config --global init.defaultBranch "main"
git config --global merge.tool "code --wait"
git config --global user.email "me@sqlazer.com"
git config --global user.name "Sarah Dellysse"

# Setup Fish shell
mkdir -p $HOME/.config/fish
set --universal fish_greeting
echo 'starship init fish | source' >> $HOME/.config/fish/config.fish
alias --save cat="bat"
