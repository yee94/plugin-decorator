# plugin-decorator

[![Using TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-0072C4.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/npm/l/generator-bxd-oss.svg)](#License)
[![NPM](https://img.shields.io/npm/v/plugin-decorator.svg)](https://www.npmjs.com/package/plugin-decorator)

`plugin-decorator` 是一个工具库，可以为你的项目快速赋予插件能力！

```typescript
import { Hook, Inject, PluginTarget, Plugin } from 'plugin-decorator';

class DemoTarget extends PluginTarget {
  @Hook
  public method1() {
    console.log('origin method');
  }
}

class DemoPlugin extends Plugin {
  @Inject
  public method1(next) {
    next();
    console.log('plugin method');
  }
}

const demoTarget = new DemoTarget();
demoTarget.install(new DemoPlugin());
demoTarget.method1();

// => origin method
// => plugin method
```

## Decorator

```typescript
import { Hook, Inject, PluginTarget, Plugin } from 'plugin-decorator';

class DemoTarget extends PluginTarget {
  @Hook
  public method1() {
    return 'origin method';
  }
}

class DemoPlugin extends Plugin {
  @Inject
  public method1(next) {
    return `plugin ${next()}`;
  }
}

const demoTarget = new DemoTarget();
demoTarget.install(new DemoPlugin());

demoTarget.method1();

// => plugin origin method
```

## Promise

```typescript
import { Hook, Inject, PluginTarget, Plugin } from 'plugin-decorator';

class DemoTarget extends PluginTarget {
  @Hook
  public methodPromise() {
    return new Promise(resolve => {
      setTimeout(() => resolve('origin method'), 1000);
    });
  }
}

class DemoPlugin extends Plugin {
  @Inject
  public async methodPromise(next) {
    return `plugin ${await next()}`;
  }
}

const demoTarget = new DemoTarget();
demoTarget.install(new DemoPlugin());

demoTarget.methodPromise().then(console.log);

// => Promise<plugin origin method>
```
