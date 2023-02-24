import { Hook, Inject, Plugin, PluginTarget } from '../src/index';

class TestTarget extends PluginTarget {
  @Hook()
  public method1() {
    return 'result';
  }

  @Hook()
  public methodPromise() {
    return new Promise((resolve) => {
      setTimeout(() => resolve('result'), 1000);
    });
  }
}
const pluginTarget = new TestTarget();

// tslint:disable-next-line:max-classes-per-file
class TestPlugin extends Plugin {
  @Inject()
  public method1(next) {
    return `plugin_${next()}`;
  }

  @Inject('method1')
  public method2(next) {
    return `plugin_${next()}_2`;
  }

  @Inject()
  public async methodPromise(next) {
    return `plugin_${await next()}`;
  }
}

test('add hook to plugin target', () => {
  expect(pluginTarget.method1.hasOwnProperty('addHook')).toBeTruthy();
  expect(pluginTarget.method1.hasOwnProperty('removeHook')).toBeTruthy();
});

test('install method', () => {
  const plugin = new TestPlugin();

  // @ts-ignore
  expect(plugin.pluginHooks.length).toBe(3);

  pluginTarget.install(plugin);

  expect(pluginTarget.plugins.length).toBe(1);
});

test('invoke method', () => {
  expect(pluginTarget.method1()).toBe('plugin_plugin_result_2');
});

test('another instance', () => {
  const target = new TestTarget();
  expect(target.method1()).toBe('result');
});

test('invoke promise method', async () => {
  expect(await pluginTarget.methodPromise()).toBe('plugin_result');
});

test('uninstall plugin', async () => {
  expect(!!pluginTarget.plugins.length).toBeTruthy();
  pluginTarget.uninstall(pluginTarget.plugins[0]);
  expect(!pluginTarget.plugins.length).toBeTruthy();

  expect(pluginTarget.method1()).toBe('result');
});
