import Plugin, { PluginConstructor } from './Plugin';

export default abstract class PluginTarget {
  private static $$installedPlugins: PluginConstructor[] = [];

  public static install(plugin: PluginConstructor) {
    this.$$installedPlugins.push(plugin);
  }
  public static uninstall(plugin) {
    this.$$installedPlugins.splice(this.$$installedPlugins.indexOf(plugin), 1);
  }

  protected get pluginContext() {
    return {};
  }

  protected init() {
    PluginTarget.$$installedPlugins.forEach((plugin) => {
      this.install(new plugin(this.pluginContext));
    });
  }

  public plugins: Plugin[] = [];

  public install(plugin: Plugin) {
    this.plugins.push(plugin);

    // tslint:disable-next-line:no-unused-expression
    plugin.pluginHooks &&
      plugin.pluginHooks.forEach((methodName) => {
        if (this[methodName] && this[methodName].addHook) {
          this[methodName].addHook(plugin, methodName);
        }
      });
  }

  public uninstall(plugin: Plugin) {
    this.plugins.splice(this.plugins.indexOf(plugin), 1);

    // tslint:disable-next-line:no-unused-expression
    plugin.pluginHooks &&
      plugin.pluginHooks.forEach((methodName) => {
        if (this[methodName] && this[methodName].removeHook) {
          this[methodName].removeHook(plugin, methodName);
        }
      });
  }
}
