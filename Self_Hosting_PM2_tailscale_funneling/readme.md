# 🖥️ From Localhost to the Internet: The Complete Self-Hosting Journey

## How I Turned My Laptop Into a Real Server (Without Cloud, Router Access, or Public IP)

> **A student's honest journey through Proxmox, CGNAT, PM2, and Tailscale Funnel**
>
> This is not a tutorial where everything magically works.  
> This is the real story of mistakes, learning, and finally understanding how the internet actually reaches your code.

[![Made with ❤️ for students](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)]()
[![Perfect for beginners](https://img.shields.io/badge/Perfect%20for-Beginners-green)]()
[![No cloud required](https://img.shields.io/badge/No%20cloud-Required-blue)]()

![Photo 1](./assets/terminal_UI.jpeg)

![Photo 2](./assets/UI_music.jpeg)

---

## 📚 Table of Contents

1. [Why This Guide Exists](#-why-this-guide-exists)
2. [The Proxmox Exploration (What I Tried First)](#-the-proxmox-exploration-what-i-tried-first)
3. [Network Fundamentals You Must Understand](#-network-fundamentals-you-must-understand)
4. [The Real Solution: Tailscale Funnel](#-the-real-solution-tailscale-funnel)
5. [Complete Setup Guide](#-complete-setup-guide)
6. [What Happens After Shutdown](#-what-happens-after-shutdown-critical)
7. [The One-Command Recovery](#-the-one-command-recovery)
8. [Troubleshooting Guide](#-troubleshooting-guide)
9. [What I Actually Learned](#-what-i-actually-learned)
10. [When to Graduate](#-when-to-graduate-to-real-infrastructure)

---

## 🎯 Why This Guide Exists

### The Real Frustration

Every computer science student knows this pain:

You build a project for weeks.  
It works perfectly on your machine.  
You show friends — "Nice!"

Then you try to share with a recruiter.

All you have is:
```
http://localhost:3000
```

Which basically means: *"Trust me, it works on my laptop."*

### What Most Tutorials Say

- *"Just deploy to Vercel"*
- *"Use Render free tier"*
- *"Spin up a cloud VM"*

### But What If...

- ❌ You're on college Wi-Fi
- ❌ You're behind CGNAT (mobile hotspot)
- ❌ You have no public IP
- ❌ You want to **learn** infrastructure, not hide from it
- ❌ You want a **real URL**, not screenshots

This guide documents my **real journey**:

```
From localhost     →  To public HTTPS
From crashes       →  To auto-recovery
From mystery       →  To understanding
```

---

## 🔬 The Proxmox Exploration (What I Tried First)

### Why I Initially Wanted Proxmox

I thought: *"If I turn my laptop into a real server OS, I can host anything!"*

Proxmox is a powerful virtualization platform that:
- Runs VMs and containers
- Has a web-based UI
- Is used in data centers

Sounds perfect, right? **Wrong.**

### The Proxmox Installation Journey

#### Step 1: Downloaded Proxmox VE
```bash
# Downloaded: proxmox-ve-8.x-installer.iso
# Created bootable USB with Rufus
# Booted from USB
```

#### Step 2: Installation Challenges

The network configuration screen was the first puzzle:

```
Hostname:     pve.local
IP Address:   192.168.100.2/24
Gateway:      192.168.100.1
DNS Server:   127.0.0.1  ❌ (This was wrong!)
```

**First lesson learned:** DNS matters!

Changed to:
```
DNS Server:   8.8.8.8  ✅
```

#### Step 3: The Wi-Fi Reality Check

After installation, Proxmox console showed:
```
Welcome to Proxmox Virtual Environment
Connect to: https://192.168.100.2:8006/
```

But trying to access it failed: **ERR_CONNECTION_REFUSED**

**Why?**

```
My MacBook:           10.7.11.30    (college Wi-Fi)
Proxmox laptop:       192.168.100.2 (different network!)
```

### The Hard Truth About Proxmox on Laptops

1. **Wi-Fi Doesn't Work Well**
   - Proxmox uses network bridges (vmbr0)
   - Wi-Fi cards cannot be bridged properly
   - College Wi-Fi has client isolation

2. **USB Tethering Issues**
   ```bash
   # Phone USB tethering created: enx6ca5b5753cc
   # But it kept changing names after reboot
   # Configuration was fragile
   ```

3. **No GUI for Wi-Fi**
   - Proxmox has NO Wi-Fi GUI
   - Everything must be done via terminal
   - `wpa_supplicant` configuration required

### What I Learned from Proxmox

Even though Proxmox didn't become my final solution, I learned:

✅ **How server operating systems work**  
✅ **Why servers need Ethernet, not Wi-Fi**  
✅ **What network bridges actually do**  
✅ **How DHCP and DNS configuration works**  
✅ **The difference between localhost and network access**

**Key realization:** 
> Proxmox is designed for data centers with Ethernet cables, not college dorms with Wi-Fi.

---

## 🌐 Network Fundamentals You Must Understand

### The Ideal World (How We Wish It Worked)

```
User's Browser → Your Public IP → Your Router → Your Server ✅
```

**This requires:**
- ✅ A public IP address
- ✅ Port forwarding configured
- ✅ Firewall rules set
- ✅ Full network control

### The Real World (Your Actual Situation)

```
User's Browser → ??? → CGNAT → ISP → Your Private Network → Device ❌
                  ↑
              BLOCKED
```

**What's happening:**
- 🔒 You're behind **CGNAT** (Carrier-Grade NAT)
- 🏠 Your device has a **private IP** (192.168.x.x or 10.x.x.x)
- 🚫 Incoming connections are **blocked**
- ⛔ You **cannot** configure port forwarding

### Understanding CGNAT (The Real Enemy)

```
┌─────────────────────────────────────────┐
│      Multiple Users (100-1000)          │
├─────────────────────────────────────────┤
│  Student 1:  192.168.1.5                │
│  Student 2:  192.168.1.8                │
│  YOU:        192.168.1.12  ◄──          │
│  Student 4:  192.168.1.19               │
├─────────────────────────────────────────┤
│      ISP's CGNAT Gateway                │
│      (ONE Shared Public IP)             │
│      203.0.113.42                       │
└─────────────────────────────────────────┘
              ▼
        The Internet 🌍
```

**The problem:**
- All users share **ONE public IP**
- ISP controls routing
- Traditional hosting is **impossible**

### The Solution: Reverse Tunneling

Since the internet can't reach you, **you reach the internet first**:

```
Your Laptop ──[Outgoing]──> Public Relay ◄── User connects
     ▲                            │
     └────[Data flows back]───────┘
```

**How it works:**
1. 📤 Your laptop creates **outgoing connection** (always works)
2. 🔗 Connection stays **permanently open**
3. 🏢 Public server acts as **relay**
4. 👤 Users connect to relay
5. ➡️ Relay forwards to you through tunnel
6. ⬅️ You respond back through tunnel

**Why this works:**
```
✅ Outgoing connections work everywhere
✅ Tunnel stays open
✅ Relay has public IP
✅ No port forwarding needed
✅ Works on ANY network
```

---

## 🚀 The Real Solution: Tailscale Funnel

### Why Tailscale Funnel?

After abandoning Proxmox, I needed something that:
- Works behind CGNAT
- Doesn't need router access
- Provides HTTPS automatically
- Is free for personal use

**Comparison:**

| Feature | Tailscale Funnel | ngrok | Cloudflare Tunnel |
|---------|-----------------|-------|-------------------|
| Free tier | ✅ Generous | ⚠️ Limited | ✅ Good |
| HTTPS | ✅ Auto | ✅ Auto | ✅ Auto |
| Stability | ✅ Excellent | ✅ Good | ✅ Excellent |
| Setup | ✅ Simple | ✅ Simple | ⚠️ Moderate |
| URL persistence | ✅ Permanent | ⚠️ Changes | ✅ Permanent |

### What Tailscale Funnel Actually Does

```
Internet (anyone)
    ↓
Tailscale Cloud (relay)
    ↓
Secure Tunnel (WireGuard)
    ↓
Your Laptop (behind CGNAT)
    ↓
Your Application
```

**Magic features:**
- 🔐 Automatic HTTPS
- 🌍 Works from anywhere
- 🔒 Secure by default
- 📱 No app needed for visitors

---

## 🛠️ Complete Setup Guide

### Prerequisites

```
OS:       Linux (Arch/Ubuntu/WSL)
RAM:      4GB minimum
Network:  Any (Wi-Fi, hotspot, college network)
Access:   Terminal only
```

**You DO NOT need:**
- ❌ Public IP
- ❌ Router access
- ❌ Port forwarding
- ❌ Ethernet cable

### Tech Stack

```
Frontend:  React + Vite
Backend:   Node.js + Express
Process:   PM2
Tunnel:    Tailscale Funnel
```

---

### Part 1: Install Tailscale

#### On Arch Linux
```bash
sudo pacman -S tailscale
sudo systemctl start tailscaled
```

#### On Ubuntu/Debian
```bash
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.noarmor.gpg | \
  sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null

curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.tailscale-keyring.list | \
  sudo tee /etc/apt/sources.list.d/tailscale.list

sudo apt update
sudo apt install tailscale
sudo systemctl enable --now tailscaled
```

#### Authenticate
```bash
sudo tailscale up
```

This opens a browser. Login with Google/GitHub.

**Verify:**
```bash
tailscale status
```

You should see your device listed.

---

### Part 2: Install PM2 (Process Manager)

#### Why PM2?

Running apps like this is **WRONG**:
```bash
node server.js    # ❌ Dies when terminal closes
npm run dev       # ❌ Breaks after reboot
```

**PM2 solves:**
```
✅ Runs as daemon
✅ Auto-restarts on crash
✅ Survives terminal close
✅ Automatic logging
✅ Survives reboot (with setup)
```

#### Install
```bash
npm install -g pm2
```

**Verify:**
```bash
pm2 --version
```

---

### Part 3: Setup Your Project

#### Clone Repository
```bash
git clone <your-repo-url>
cd tty.fm
```

#### Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Part 4: Configure Frontend (CRITICAL)

Edit `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    
    // CRITICAL: Allow Tailscale hostname
    allowedHosts: [
      'your-device-name.ts.net'  // Replace with YOUR hostname
    ],
    
    // Proxy API to backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

**What this does:**

| Setting | Purpose |
|---------|---------|
| `host: true` | Listen on all interfaces |
| `allowedHosts` | Prevents "Invalid Host" errors |
| `proxy` | Forwards `/api/*` to backend |

**Architecture (Very Important):**
```
Internet → Funnel → Frontend (3000) → Vite Proxy → Backend (3001)
                                                         ↑
                                                    NOT PUBLIC
```

---

### Part 5: Start Backend with PM2

```bash
cd backend
pm2 start server.js --name backend
pm2 save
```

**Check:**
```bash
pm2 status
```

Expected output:
```
┌────┬──────────┬─────────┬──────┬─────────┬──────────┬──────────┐
│ id │ name     │ mode    │ ↺    │ status  │ cpu      │ memory   │
├────┼──────────┼─────────┼──────┼─────────┼──────────┼──────────┤
│ 0  │ backend  │ fork    │ 0    │ online  │ 0%       │ 45.2mb   │
└────┴──────────┴─────────┴──────┴─────────┴──────────┴──────────┘
```

---

### Part 6: Start Frontend with PM2

```bash
cd frontend
pm2 start npm --name frontend -- run dev
pm2 save
```

**Check again:**
```bash
pm2 status
```

Expected:
```
┌────┬──────────┬─────────┬──────┬─────────┬──────────┬──────────┐
│ id │ name     │ mode    │ ↺    │ status  │ cpu      │ memory   │
├────┼──────────┼─────────┼──────┼─────────┼──────────┼──────────┤
│ 0  │ backend  │ fork    │ 0    │ online  │ 0%       │ 78.3mb   │
│ 1  │ frontend │ fork    │ 0    │ online  │ 0%       │ 86.1mb   │
└────┴──────────┴─────────┴──────┴─────────┴──────────┴──────────┘
```

---

### Part 7: Enable Funnel (Make It Public)

```bash
sudo tailscale funnel --bg 3000
```

**Output:**
```
Available on the internet:

https://your-device-name.ts.net/
|-- proxy http://127.0.0.1:3000

Funnel started and running in the background.
To disable the proxy, run: tailscale funnel --https=443 off
```

---

### Part 8: Verify Everything Works

#### Check PM2
```bash
pm2 status
```

#### Check Tailscale
```bash
tailscale funnel status
```

#### Test Backend API
```bash
curl https://your-device-name.ts.net/api/health
```

#### Test in Browser

Open: `https://your-device-name.ts.net`

**Test from:**
- ✅ Your phone (mobile data)
- ✅ Friend's device
- ✅ Incognito window

---

## 🔄 What Happens After Shutdown (CRITICAL)

### The Problem

After laptop shutdown or reboot:

```
❌ Tailscale daemon stops
❌ PM2 processes stop
❌ Funnel stops
❌ Your URL returns: Connection Refused
```

### What DOESN'T Get Deleted

```
✅ Your code
✅ PM2 configuration (if you ran pm2 save)
✅ Tailscale login
✅ Node modules
```

### Manual Recovery (The Old Way)

```bash
# Step 1: Start Tailscale
sudo systemctl start tailscaled
sleep 2

# Step 2: Restore PM2
pm2 resurrect
sleep 2

# Step 3: Re-enable Funnel
sudo tailscale funnel reset
sudo tailscale funnel --bg 3000
```

---

## 🚀 The One-Command Recovery

### Create the Script

```bash
nano ~/start-server.sh
```

### Paste This Content

```bash
#!/bin/bash

echo "🔹 Starting Tailscale daemon..."
sudo systemctl start tailscaled

echo "⏳ Waiting for Tailscale to initialize..."
sleep 2

echo "🔹 Restoring PM2 processes..."
pm2 resurrect

echo "⏳ Waiting for services to bind ports..."
sleep 2

echo "🔹 Resetting any old Funnel config..."
sudo tailscale funnel reset

echo "🔹 Exposing frontend (port 3000) to the internet..."
sudo tailscale funnel --bg 3000

echo ""
echo "✅ SERVER IS LIVE"
echo "🌍 Public URL: https://$(tailscale status --json | jq -r '.Self.DNSName' | sed 's/\.$//')"
echo ""

pm2 status
```

### Make It Executable

```bash
chmod +x ~/start-server.sh
```

### Usage

**After ANY shutdown:**
```bash
./start-server.sh
```

That's it. One command. Everything works.

---

## 🔧 Troubleshooting Guide

### Issue 1: "Invalid Host header"

**Error:** `Invalid Host header`

**Cause:** Vite blocking unknown hostname

**Fix:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    allowedHosts: ['.ts.net']  // ← Add this
  }
})
```

Then:
```bash
pm2 restart frontend
```

---

### Issue 2: API requests failing

**Error:** `CONNECTION_REFUSED_TO_MAINFRAME` or `CORS error`

**Cause:** Backend not running or proxy misconfigured

**Fix:**
```bash
# Check if backend is running
pm2 status

# If backend is missing or errored
cd ~/tty.fm/backend
pm2 restart backend

# Or start fresh
pm2 delete backend
pm2 start server.js --name backend
pm2 save
```

---

### Issue 3: Worked yesterday, broken today

**Symptoms:**
- PM2 status shows high restart count (↺ 441)
- UI loads but API fails

**Cause:** Dev server + PM2 instability after reboot

**Fix:**
```bash
# Clean reset
pm2 stop all
pm2 delete all

# Start backend first
cd ~/tty.fm/backend
pm2 start server.js --name backend

# Then frontend
cd ~/tty.fm/frontend
pm2 start npm --name frontend -- run dev

# Save and expose
pm2 save
sudo tailscale funnel --bg 3000
```

---

### Issue 4: Port already in use

**Error:** `EADDRINUSE`

**Find what's using the port:**
```bash
ss -tulnp | grep 3000
ss -tulnp | grep 3001
```

**Kill it:**
```bash
# Kill specific process
kill -9 <PID>

# Or kill all node processes
pkill -f server.js
pkill -f node

# Then restart with PM2
pm2 restart all
```

---

### Issue 5: PM2 processes missing after reboot

**Symptoms:**
```bash
pm2 status
# Shows empty list
```

**Cause:** Forgot to run `pm2 save`

**Fix:**
```bash
# Manually start everything
cd ~/tty.fm/backend
pm2 start server.js --name backend

cd ~/tty.fm/frontend
pm2 start npm --name frontend -- run dev

# IMPORTANT: Save this time
pm2 save
```

---

### Issue 6: Funnel not working

**Symptoms:**
- URL loads but shows nothing
- Connection refused

**Check Funnel status:**
```bash
tailscale funnel status
```

**Fix:**
```bash
sudo tailscale funnel reset
sudo tailscale funnel --bg 3000
```

---

## 🧠 What I Actually Learned

### Real Networking Concepts

Before this project, networking was theoretical. Now I understand:

- **NAT and CGNAT** - Why most home/mobile networks can't accept incoming connections
- **Port forwarding** - Why it's needed and why it doesn't work in CGNAT
- **Reverse tunneling** - How to make servers accessible when traditional methods fail
- **Proxy servers** - How requests can be forwarded internally without exposing services
- **Localhost vs public IPs** - The fundamental difference between local and network access

### Process Management in Production

Running `node server.js` is fine for development. But I learned why real servers use process managers:

- **Persistence** - Services keep running even when you log out
- **Automatic restart** - If a process crashes, it restarts automatically
- **Logging** - You can see what happened when things go wrong
- **Resource monitoring** - Knowing CPU and memory usage helps prevent problems
- **State management** - The ability to save and restore process configurations

### The Development-Production Gap

The biggest lesson was understanding the gap between development and production environments.

**In development:**
- Everything runs on localhost
- You manually start and stop services
- Hot reload catches your changes instantly
- Error messages appear in your terminal
- Security is relaxed

**In production:**
- Services must be accessible from the internet
- Processes must survive reboots and crashes
- Changes require deliberate deployment
- Debugging requires checking logs
- Security configurations matter (CORS, allowed hosts, HTTPS)

### Why Proxmox Didn't Work (But Taught Me)

Proxmox taught me:
- **Server OSes are different** - No GUI, terminal-only management
- **Wi-Fi ≠ Ethernet for servers** - Network bridges require Ethernet
- **DNS configuration matters** - Wrong DNS breaks everything
- **Client isolation is real** - College/public Wi-Fi blocks device-to-device

### Real-World Infrastructure Failures

Every error I encountered taught me something valuable:

- **EADDRINUSE** - Port conflicts and process management
- **Vite blocked host error** - Security features in development tools
- **Connection timeout** - Why CGNAT blocks incoming connections
- **PM2 restart storms** - Why dev servers + PM2 is fragile

These weren't frustrations. They were lessons.

---

## 🎓 When to Graduate to Real Infrastructure

### Signs You've Outgrown Laptop Hosting

Move to real hosting when:

- 🚦 >100 concurrent users
- 📈 >10,000 requests/day
- ⏱️ Response times >1 second
- 💼 Paying customers
- 🌍 Need 99%+ uptime
- 💾 Need persistent data storage
- 🔒 Need serious security

### Migration Path

```
Level 1: Self-hosted (You are here ✅)
├─ Laptop + PM2 + Tailscale Funnel
├─ Cost: $0/month
└─ Learn: Process management, networking, reverse tunnels

Level 2: VPS (Virtual Private Server)
├─ DigitalOcean / Hetzner / Linode
├─ Cost: $5-20/month
├─ Learn: Server management, DNS, SSL, Nginx
└─ When: You need 24/7 uptime

Level 3: Platform as a Service
├─ Vercel / Render / Railway / Fly.io
├─ Cost: $0-50/month
├─ Learn: CI/CD, serverless, auto-scaling
└─ When: You want zero infrastructure management

Level 4: Full Cloud
├─ AWS / GCP / Azure
├─ Cost: $100+/month
├─ Learn: Cloud architecture, DevOps, Kubernetes
└─ When: You're building serious products
```

### Recommended VPS Providers

| Provider | Price/month | Best For | Pros |
|----------|-------------|----------|------|
| **Hetzner** | €4 | Best value | Powerful, cheap |
| **DigitalOcean** | $6 | Beginners | Great docs, simple |
| **Linode** | $5 | Reliable | Stable, good support |
| **Vultr** | $6 | Many locations | Global presence |

---

## 📋 Quick Reference

### Essential Commands

```bash
# Start everything (one command)
./start-server.sh

# Manual start (if needed)
sudo systemctl start tailscaled
pm2 resurrect
sudo tailscale funnel --bg 3000

# Check status
pm2 status
tailscale status
tailscale funnel status

# View logs
pm2 logs
pm2 logs backend --lines 100
pm2 logs frontend --lines 100

# Restart services
pm2 restart backend
pm2 restart frontend
pm2 restart all

# Stop everything
sudo tailscale funnel reset
pm2 stop all

# Delete PM2 processes
pm2 delete backend
pm2 delete frontend
pm2 delete all

# Get public URL
tailscale status --json | jq -r '.Self.DNSName'
```

### Troubleshooting Checklist

```
□ Is Tailscale running? → tailscale status
□ Are PM2 apps running? → pm2 status
□ Is Funnel enabled? → tailscale funnel status
□ Can access locally? → curl localhost:3000
□ Are ports free? → ss -tulnp | grep 3000
□ Check backend logs → pm2 logs backend
□ Check frontend logs → pm2 logs frontend
□ Saved PM2 config? → pm2 save
□ Backend on 3001? → ss -tulnp | grep 3001
□ Frontend on 3000? → ss -tulnp | grep 3000
```

### Common Error → Solution

| Error | Quick Fix |
|-------|-----------|
| Invalid Host header | Add hostname to `allowedHosts` in vite.config.ts |
| EADDRINUSE | `pkill -f server.js` then `pm2 restart all` |
| Connection refused | `pm2 restart backend` |
| Empty PM2 list | Manually start + `pm2 save` |
| Funnel not working | `sudo tailscale funnel reset` then re-enable |
| High restart count | `pm2 stop all; pm2 delete all` then fresh start |

---

## 🏁 Final Thoughts

### What You've Accomplished

If you followed this guide, you've built something most developers never do:

✅ **Understood networking** from first principles  
✅ **Bypassed CGNAT** using reverse tunnels  
✅ **Managed processes** like production systems  
✅ **Survived failures** and learned recovery  
✅ **Hosted publicly** without cloud platforms

### The Real Value

This guide isn't about laptop hosting forever.

It's about **understanding** how things work so deeply that cloud platforms become intuitive rather than magical.

When you eventually use:
- **Vercel** → You'll know it's handling proxy/CDN/SSL
- **Docker** → You'll know it's process isolation
- **Kubernetes** → You'll know it's automated PM2 at scale
- **AWS** → You'll know what each service actually does

**The magical becomes obvious.**

### What This Means for Your Career

You now have:
- Real infrastructure debugging experience
- Production-failure recovery skills
- Understanding of networking fundamentals
- Stories for technical interviews

Most bootcamp graduates click "Deploy" on Vercel.

You understand what happens when they click that button.

That's the difference.

### Share Your Knowledge

If this helped you:

1. ⭐ Save this guide
2. 📢 Share with fellow students
3. 🎓 Teach someone else
4. 🛠️ Build something cool
5. 📝 Write your own version

**The best way to learn is teaching.**

---

## 📊 Quick Decision Matrix

**"Should I use this method?"**

| Your Situation | Use This? | Why |
|----------------|-----------|-----|
| Student learning infrastructure | ✅ YES | Perfect learning tool |
| Portfolio project | ✅ YES | Real URL > screenshots |
| Hackathon demo | ✅ YES | Quick public access |
| Behind college Wi-Fi | ✅ YES | CGNAT workaround |
| Want to learn how internet works | ✅ YES | Hands-on experience |
| Production SaaS | ❌ NO | Use VPS/cloud |
| High traffic app | ❌ NO | Laptop can't scale |
| 24/7 uptime needed | ❌ NO | Laptop will sleep |
| Sensitive user data | ❌ NO | Use professional hosting |

---

## 🚀 Next Steps (Choose Your Path)

### Path 1: Production-Ready (Recommended)
```bash
# Build frontend for production
cd frontend
npm run build

# Serve static files (faster, more stable)
npm install -g serve
serve -s dist -l 3000

# Update PM2
pm2 delete frontend
pm2 start "serve -s dist -l 3000" --name frontend
pm2 save
```

### Path 2: Docker Everything
```dockerfile
# Learn containerization
# Package entire stack
# Deploy anywhere
```

### Path 3: Move to VPS
```bash
# Rent a $5 DigitalOcean droplet
# Same setup, but 24/7
# Add Nginx reverse proxy
# Get custom domain
```

### Path 4: Proxmox VM (Advanced)
```bash
# Install Proxmox on old hardware
# Create Ubuntu VM
# Same Tailscale + PM2 setup
# But on dedicated machine
```

---

## 📝 Acknowledgments

This guide exists because:

- College Wi-Fi forced me to learn networking
- CGNAT taught me about reverse tunnels
- Proxmox showed me what servers actually are
- PM2 crashes taught me process management
- Every error was a lesson in disguise

Thank you to:
- Tailscale for making Funnel free
- PM2 for making Node.js manageable
- The open-source community
- Every Stack Overflow answer that helped
- Students who will use this to learn

---

## 📮 Contribute

Found an error? Have improvements?

This is a living document based on real experience.

---

## 🎉 You Did It!

You now know more about infrastructure than most developers.

Not because you memorized commands.

Because you **understand** what happens between:

```
Your code → The internet
```

Now go build something amazing. 🚀

---

**Written by a student who was tired of localhost.**

*Last updated: February 2026*

---

## Appendix: Full File Structure

```
tty.fm/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   ├── vite.config.ts
│   ├── package.json
│   └── node_modules/
└── start-server.sh
```

## Appendix: Complete vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: true,
    port: 3000,
    
    allowedHosts: [
      'localhost',
      '.ts.net'  // All Tailscale domains
    ],
    
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

## Appendix: Complete start-server.sh

```bash
#!/bin/bash

echo "🔹 Starting Tailscale daemon..."
sudo systemctl start tailscaled

echo "⏳ Waiting for Tailscale to initialize..."
sleep 2

echo "🔹 Restoring PM2 processes..."
pm2 resurrect

echo "⏳ Waiting for services to bind ports..."
sleep 2

echo "🔹 Resetting any old Funnel config..."
sudo tailscale funnel reset

echo "🔹 Exposing frontend (port 3000) to the internet..."
sudo tailscale funnel --bg 3000

echo ""
echo "✅ SERVER IS LIVE"
echo "🌍 Public URL: https://$(tailscale status --json | jq -r '.Self.DNSName' | sed 's/\.$//')"
echo ""

pm2 status
```
