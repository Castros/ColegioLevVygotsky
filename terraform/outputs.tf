output "droplet_ip" {
  description = "Public IP — add this as an A record in Route 53 or Cloudflare"
  value       = digitalocean_droplet.strapi.ipv4_address
}

output "ssh_command" {
  description = "SSH into the droplet"
  value       = "ssh root@${digitalocean_droplet.strapi.ipv4_address}"
}

output "next_step" {
  description = "What to do after apply"
  value       = "Add an A record in Route 53 or Cloudflare pointing your subdomain to ${digitalocean_droplet.strapi.ipv4_address}"
}
