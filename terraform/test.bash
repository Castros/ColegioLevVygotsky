sudo tee /etc/apt/sources.list.d/hashicorp.list << 'EOF'
deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com jammy main
EOF