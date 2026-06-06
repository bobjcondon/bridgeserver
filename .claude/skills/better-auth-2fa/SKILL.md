---
name: two-factor-authentication-best-practices
description: Configure TOTP authenticator apps, send OTP codes via email/SMS, manage backup codes, handle trusted devices, and implement 2FA sign-in flows using Better Auth's twoFactor plugin. Use when users need MFA, multi-factor authentication, authenticator setup, or login security with Better Auth.
---

## Setup

1. Add `twoFactor()` plugin to server config with `issuer`
2. Add `twoFactorClient()` plugin to client config
3. Run `bun run auth:schema && bun run db:push`
4. Verify: check that `twoFactorSecret` column exists on user table

```ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "BridgeServer",
  plugins: [
    twoFactor({
      issuer: "BridgeServer",
    }),
  ],
});
```

### Client-Side Setup

```ts
import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/2fa";
      },
    }),
  ],
});
```

## Enabling 2FA for Users

Requires password verification. Returns TOTP URI (for QR code) and backup codes.

```ts
const { data, error } = await authClient.twoFactor.enable({ password });
// data.totpURI — generate a QR code from this
// data.backupCodes — display once to user
```

`twoFactorEnabled` is not set to `true` until first TOTP verification succeeds.

## TOTP (Authenticator App)

### Verifying TOTP Codes

```ts
const { data, error } = await authClient.twoFactor.verifyTotp({
  code,
  trustDevice: true,
});
```

### TOTP Configuration

```ts
twoFactor({
  totpOptions: {
    digits: 6,   // 6 or 8 (default: 6)
    period: 30,  // seconds (default: 30)
  },
});
```

## OTP (Email/SMS)

```ts
twoFactor({
  otpOptions: {
    sendOTP: async ({ user, otp }) => {
      await sendEmail({ to: user.email, subject: "Your code", text: `Code: ${otp}` });
    },
    period: 5,           // minutes (default: 3)
    allowedAttempts: 5,  // default: 5
    storeOTP: "encrypted",
  },
});
```

Send: `authClient.twoFactor.sendOtp()` · Verify: `authClient.twoFactor.verifyOtp({ code, trustDevice: true })`

## Backup Codes

Generated automatically when 2FA is enabled. Each code is single-use.

```ts
// Regenerate (invalidates all previous)
const { data } = await authClient.twoFactor.generateBackupCodes({ password });
// Verify
await authClient.twoFactor.verifyBackupCode({ code, trustDevice: true });
```

## Sign-In Flow with 2FA

```ts
await authClient.signIn.email({ email, password }, {
  onSuccess(context) {
    if (context.data.twoFactorRedirect) {
      window.location.href = "/2fa";
    }
  },
});
```

## Security Notes

- Flow: credentials → temp 2FA cookie (10 min) → verify → session created
- Built-in rate limiting: 3 req / 10 sec on all 2FA endpoints
- TOTP secrets encrypted at rest with auth secret
- `trustDevice: true` default duration: 30 days

## Disabling 2FA

```ts
await authClient.twoFactor.disable({ password });
```

**Source:** [Lua2147/claude-toolkit-catalog](https://github.com/Lua2147/claude-toolkit-catalog/blob/main/skills/better-auth-two-factor/SKILL.md)
