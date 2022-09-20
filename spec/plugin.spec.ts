import { Hook, Inject, Plugin, PluginTarget } from '../src/index';

class TestTarget extends PluginTarget {
  @Hook
  public method1() {
    return 'result';
  }

  @Hook
  public methodPromise() {
    return new Promise((resolve) => {
      setTimeout(() => resolve('result'), 1000);
    });
  }
}
const pluginTarget = new TestTarget();

// tslint:disable-next-line:max-classes-per-file
class TestPlugin extends Plugin {
  @Inject
  public method1(next) {
    return `plugin_${next()}`;
  }

  @Inject
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
  pluginTarget.install(plugin);

  expect(pluginTarget.plugins.length).toBe(1);
});

test('invoke method', () => {
  expect(pluginTarget.method1()).toBe('plugin_result');
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
