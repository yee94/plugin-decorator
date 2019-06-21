import test from 'ava';
import { Hook, Inject, Plugin, PluginTarget } from '../index';

class TestTarget extends PluginTarget {
  @Hook
  public method1() {
    return 'result';
  }

  @Hook
  public methodPromise() {
    return new Promise(resolve => {
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

test('add hook to plugin target', t => {
  t.true(pluginTarget.method1.hasOwnProperty('addHook'));
  t.true(pluginTarget.method1.hasOwnProperty('removeHook'));
});

test.serial('install method', t => {
  const plugin = new TestPlugin();
  pluginTarget.install(plugin);

  t.is(pluginTarget.plugins.length, 1);
});

test('invoke method', t => {
  t.is(pluginTarget.method1(), 'plugin_result');
});

test.serial('invoke promise method', async t => {
  t.is(await pluginTarget.methodPromise(), 'plugin_result');
});

test('uninstall plugin', async t => {
  t.true(!!pluginTarget.plugins.length);
  pluginTarget.uninstall(pluginTarget.plugins[0]);
  t.true(!pluginTarget.plugins.length);

  t.is(pluginTarget.method1(), 'result');
});
