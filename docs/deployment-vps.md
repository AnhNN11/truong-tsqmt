# VPS deployment

- URL: https://103.72.97.24 (no domain)
- GitHub: https://github.com/AnhNN11/truong-tsqmt
- Checkout: `/var/www/tsqmt/app`, branch `main`
- Persistent SQLite/uploads: `/var/www/tsqmt/shared/data`, linked as `app/.data`
- Private environment: `/var/www/tsqmt/shared/.env.local`, linked as `app/.env.local`, mode 600
- Systemd: `tsqmt`, user/group `tsqmt`, working directory `/var/www/tsqmt/app`
- Next.js: `127.0.0.1:3100`; Nginx: `/etc/nginx/sites-available/tsqmt-ip`
- SSH: root at 103.72.97.24, port 24700; credentials are not stored in Git.

The app is cloned from GitHub, installed with `npm ci`, and built on Linux.
Updates use this fixed checkout; no new release directories are created.
Environment, database and uploads are excluded from Git and remain outside the
checkout. Never replace production data with development data during updates.

## Update

Commit and push reviewed changes first. On the VPS, record the current commit and
back up SQLite using its backup API and preserve the environment. Then:

```sh
cd /var/www/tsqmt/app
sudo -u tsqmt git pull --ff-only origin main
sudo -u tsqmt npm ci
sudo -u tsqmt env NODE_OPTIONS=--max-old-space-size=768 npm run build
sudo systemctl restart tsqmt
curl -fsS https://103.72.97.24/ >/dev/null
sudo systemctl status tsqmt --no-pager
```

If build fails, do not restart. To roll back code, check out the recorded previous
commit, install/build again and restart. Avoid editing content during deployment.
Existing backups remain under `/var/www/tsqmt/backups`.

## HTTPS

Nginx keeps the trusted Let's Encrypt IP certificate and HTTP redirects with 308.
Secure cookies remain enabled. Certificate automation stays independent of LMS:

- Certbot: `/opt/tsqmt-certbot/bin/certbot`
- Configuration: `/etc/letsencrypt-tsqmt`
- Certificate: `/etc/letsencrypt-tsqmt/live/tsqmt-ip/`
- Challenge directory: `/var/www/tsqmt-acme`
- Renewal: `tsqmt-cert-renew.timer`, twice daily plus random delay

Keep port 80 reachable for HTTP-01. Admin uses email/password without OTP.
ADMIN_EMAIL/ADMIN_PASSWORD seed the initial account only; environment changes do
not overwrite an existing account.

## Diagnostics

```sh
git -C /var/www/tsqmt/app rev-parse HEAD
systemctl status tsqmt --no-pager
journalctl -u tsqmt -n 100 --no-pager
systemctl list-timers tsqmt-cert-renew.timer
nginx -t
```
