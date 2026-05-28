variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "client_name" {
  description = "Short client identifier — lowercase, no spaces (e.g. vigotskyreynosa)"
  type        = string
}

variable "environment" {
  description = "Deployment environment: staging or production"
  type        = string
  default     = "staging"

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be 'staging' or 'production'."
  }
}

variable "region" {
  description = "DigitalOcean region slug"
  type        = string
  default     = "nyc1"
}

variable "droplet_size" {
  description = "Droplet size — s-1vcpu-2gb ($12/mo) minimum for Strapi v5"
  type        = string
  default     = "s-1vcpu-2gb"
}

variable "ssh_key_fingerprint" {
  description = "SSH key fingerprint from DigitalOcean account (Settings → Security → SSH Keys)"
  type        = string
}
