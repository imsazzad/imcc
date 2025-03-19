# Fixing GitHub SSH Permission Issues with Multiple Accounts

## **Problem**
When trying to push to a GitHub repository, you get the following error:

```
Permission to imsazzad/imcc.git denied to sazzadabdulhasib.
fatal: unable to access 'https://github.com/imsazzad/imcc.git/': The requested URL returned error: 403
```

This happens when Git is using the wrong GitHub account for authentication. To fix this, we need to properly configure SSH keys and Git for multiple accounts.

---

## **Solution: Configure Multiple GitHub Accounts with SSH**

### **1️⃣ Check Your SSH Keys**
Run the following command to list your SSH keys:
```bash
ls -l ~/.ssh/
```
If you don’t see multiple SSH keys, generate one for each GitHub account:
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```
Save each key with a unique name like:
- `~/.ssh/id_rsa_github_personal`
- `~/.ssh/id_rsa_github_work`

---

### **2️⃣ Add SSH Keys to SSH Agent**
Run:
```bash
eval "$(ssh-agent -s)"
```
Then add your keys:
```bash
ssh-add ~/.ssh/id_rsa_github_personal
ssh-add ~/.ssh/id_rsa_github_work
```

---

### **3️⃣ Configure SSH for Multiple GitHub Accounts**
Edit or create the SSH config file:
```bash
nano ~/.ssh/config
```
Add the following configuration:
```ini
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github_personal

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github_work
```
Save and exit (`Ctrl + X`, then `Y`).

---

### **4️⃣ Update Your Remote URLs in Git**
Check your current remote:
```bash
git remote -v
```
If it shows:
```
https://github.com/imsazzad/imcc.git
```
Change it to SSH using your correct identity:
```bash
git remote set-url origin git@github-personal:imsazzad/imcc.git
```
Or for the work account:
```bash
git remote set-url origin git@github-work:work-username/repository.git
```

---

### **5️⃣ Test SSH Connection**
Run:
```bash
ssh -T git@github-personal
ssh -T git@github-work
```
Each should return:
```
Hi imsazzad! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### **6️⃣ Push Again**
Now try pushing again:
```bash
git push origin main
```

This setup ensures that GitHub uses the correct SSH key for each account. 🚀

---

**Reference this file in the future if you encounter the same issue.**


## My Current ~/.ssh/config file
```bash
# Default GitHub
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa

# Personal GitHub
Host me.github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_personal
```

## My Current ~/.ssh/folder
```bash
config                  id_personal.pub         id_rsa.pub  
id_personal             id_rsa                              
```

## Test my Current SSH connections
```bash
ssh -T git@me.github.com
ssh -T git@github.com
```

Also you have to update your remote URL in your git repository
```bash
git remote -v
origin  git@me.github.com:imsazzad/imcc.git (fetch)
origin  git@me.github.com:imsazzad/imcc.git (push)

```

as you can see, I have updated my remote URL to use my personal github account rather than the default github account `git@github.com:imsazzad/imcc.git` to  `git@me.github.com:imsazzad/imcc.git`