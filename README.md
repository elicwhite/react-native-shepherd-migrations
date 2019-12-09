# react-native-shepherd-migrations

This repo contains migrations that are run with [NerdWalletOSS/shepherd](https://github.com/NerdWalletOSS/shepherd).

## nativemethodsmixin
This is intended to file issues on repos with explanations of how to migrate off of `NativeMethodsMixin` and `ReactNative.NativeComponent` to `forwardRef`.

```
GITHUB_TOKEN=TOKEN shepherd checkout ./migrations/nativemethodsmixin
GITHUB_TOKEN=TOKEN shepherd pr-preview ./migrations/nativemethodsmixin
```
