# Windows Subsystem for Linux (WSL) Installation Guide

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
  - [1. Verify Windows Version](#1-verify-windows-version)
  - [2. Install WSL](#2-install-wsl)
  - [3. Initial Configuration](#3-initial-configuration)
  - [4. Verification](#4-verification)
- [Advanced Configuration](#advanced-configuration)
- [Working with WSL](#working-with-wsl)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Overview

Windows Subsystem for Linux (WSL) enables developers to run a Linux environment directly on Windows without the overhead of a traditional virtual machine or dual-boot setup. This guide covers the installation and initial configuration of WSL 2 on Windows 10/11.

**What you'll achieve:**
- Full Linux command-line environment on Windows
- Access to Linux utilities and package managers
- Seamless integration between Windows and Linux filesystems
- Development environment compatible with Linux-based workflows

---

## Prerequisites

### System Requirements

Your system must meet the following requirements:

- **Windows 10:** Version 2004 or higher (Build 19041 or higher)
- **Windows 11:** Any version
- **Architecture:** x64 or ARM64

### Verify Your Windows Version

1. Press `Win + R` to open the Run dialog
2. Type `winver` and press Enter
3. Check the version number in the dialog that appears

If your version is below the required build, update Windows through Settings > Update & Security > Windows Update.

---

## Installation Steps

### 1. Verify Windows Version

Before proceeding, confirm your Windows version meets the requirements outlined in the Prerequisites section.

### 2. Install WSL

#### Standard Installation

1. **Open PowerShell as Administrator**
   - Click the Start button
   - Type `PowerShell`
   - Right-click "Windows PowerShell"
   - Select "Run as administrator"

2. **Execute the installation command**

   ```powershell
   wsl --install
   ```

   This single command will:
   - Enable the WSL feature
   - Enable the Virtual Machine Platform feature
   - Download and install the latest Linux kernel
   - Install Ubuntu as the default distribution

3. **Restart your computer**

   The installation requires a system restart to complete. Save your work and restart when prompted.

#### Expected Output

During installation, you should see output similar to:

```
Installing: Windows Subsystem for Linux
Installing: Virtual Machine Platform
Downloading: Ubuntu
Installing: Ubuntu
The requested operation is successful.
Changes will not be effective until the system is rebooted.
```

#### Alternative: Installing a Different Distribution

To install a different Linux distribution instead of Ubuntu:

1. **List available distributions**

   ```powershell
   wsl --list --online
   ```

2. **Install your chosen distribution**

   ```powershell
   wsl --install -d <DistroName>
   ```

   Replace `<DistroName>` with your selection (e.g., `Debian`, `kali-linux`, `openSUSE-42`).

### 3. Initial Configuration

#### First Launch

After restarting, Ubuntu will launch automatically and complete its installation:

1. Wait for the initial setup to complete (typically 1-2 minutes)
2. You'll see a message: `Please create a default UNIX user account.`

#### Create Your Linux User Account

1. **Enter a username**

   ```
   Enter new UNIX username: your_username
   ```

   Note: The username should be lowercase and contain no spaces.

2. **Set a password**

   ```
   Enter new UNIX password: 
   Retype new UNIX password:
   ```

   **Important:** The password will not be displayed as you type. This is normal Linux behavior for security.

3. **Successful setup confirmation**

   Upon successful creation, you'll see a command prompt:

   ```
   your_username@COMPUTERNAME:~$
   ```

### 4. Verification

#### Test Basic Linux Commands

Verify your installation by running these commands:

1. **Check current directory**

   ```bash
   pwd
   ```

   Expected output: `/home/your_username`

2. **List directory contents**

   ```bash
   ls
   ```

   Initially, this may show nothing or just a few default directories.

3. **Create a test directory**

   ```bash
   mkdir test_directory
   ls
   ```

   You should now see `test_directory` in the output.

#### Verify WSL Version

Open a new PowerShell window and run:

```powershell
wsl --list --verbose
```

Expected output:

```
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

The VERSION column should show `2` for WSL 2. If it shows `1`, upgrade using:

```powershell
wsl --set-version Ubuntu 2
```

---

## Advanced Configuration

### Update Linux Packages

After initial installation, update your Linux distribution's package manager:

```bash
sudo apt update
sudo apt upgrade -y
```

This ensures you have the latest security patches and software versions.

### Access Windows Files from Linux

Your Windows drives are automatically mounted in WSL under `/mnt/`:

```bash
cd /mnt/c
ls
```

This will show the contents of your C: drive. Other drives follow the same pattern (`/mnt/d`, `/mnt/e`, etc.).

### Set Default WSL Version

To ensure all future distributions use WSL 2:

```powershell
wsl --set-default-version 2
```

### Set Default Distribution

If you have multiple distributions installed:

```powershell
wsl --set-default <DistroName>
```

---

## Working with WSL

### Launching WSL

**Method 1: Start Menu**
- Click Start
- Type the distribution name (e.g., "Ubuntu")
- Click to launch

**Method 2: From PowerShell**

```powershell
wsl
```

This launches your default distribution.

**Method 3: Specific Distribution**

```powershell
wsl -d <DistroName>
```

### Running Linux Commands from PowerShell

Execute Linux commands without entering the WSL environment:

```powershell
wsl <command>
```

Example:

```powershell
wsl ls -la
```

### Windows Terminal Integration

For the best experience, install Windows Terminal from the Microsoft Store. It provides:
- Multiple tab support
- Better font rendering
- Customizable themes and profiles
- GPU-accelerated rendering

---

## Troubleshooting

### Installation Hangs at 0.0%

If the installation appears frozen:

```powershell
wsl --install --web-download -d <DistroName>
```

This downloads the distribution before installation, which can resolve network-related issues.

### WSL Command Not Recognized

If WSL is not installed and you see help text when running `wsl --install`:

1. List available distributions:

   ```powershell
   wsl --list --online
   ```

2. Install a specific distribution:

   ```powershell
   wsl --install -d <DistroName>
   ```

### Virtual Machine Platform Not Enabled

If you receive errors about virtualization:

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Restart your computer after running this command.

### Check WSL Status

To diagnose issues:

```powershell
wsl --status
```

This displays current WSL configuration and version information.

---

## Additional Resources

### Official Documentation
- [Microsoft WSL Documentation](https://docs.microsoft.com/windows/wsl/)
- [WSL Release Notes](https://github.com/microsoft/WSL/releases)
- [Best Practices for WSL Development](https://docs.microsoft.com/windows/wsl/setup/environment)

### Common Tasks
- **Managing Distributions:** [WSL Command Reference](https://docs.microsoft.com/windows/wsl/basic-commands)
- **WSL 1 vs WSL 2:** [Comparison Guide](https://docs.microsoft.com/windows/wsl/compare-versions)
- **VS Code Integration:** [Remote WSL Extension](https://code.visualstudio.com/docs/remote/wsl)

### Community Support
- [WSL GitHub Repository](https://github.com/microsoft/WSL)
- [WSL Issue Tracker](https://github.com/microsoft/WSL/issues)

---

## Offline Installation

For environments without internet access:

1. **Download WSL MSI package**
   
   Download the latest WSL MSI from the [GitHub releases page](https://github.com/microsoft/WSL/releases)

2. **Enable Virtual Machine Platform**

   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

3. **Install a distribution via .wsl file**

   Find download URLs at [DistributionInfo.json](https://github.com/microsoft/WSL/blob/master/distributions/DistributionInfo.json)

---

**Last Updated:** February 2026  
**WSL Version:** 2.x  
**Supported Windows Versions:** Windows 10 (2004+), Windows 11
