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

test('Add pre hook to plugin target', () => {
  TestTarget.install(TestPlugin);

  const pluginTarget = new TestTarget();

  pluginTarget.init();

  expect(pluginTarget.method1()).toBe('plugin_plugin_result_2');
});
