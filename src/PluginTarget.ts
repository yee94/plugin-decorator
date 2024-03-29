import Plugin, { PluginConstructor } from './Plugin';

export default abstract class PluginTarget {
  protected static $$installedPlugins: PluginConstructor[] = [];

  public static install(plugin: PluginConstructor) {
    this.$$installedPlugins.push(plugin);
  }
  public static uninstall(plugin) {
    this.$$installedPlugins.splice(this.$$installedPlugins.indexOf(plugin), 1);
  }

  protected get pluginContext() {
    return {};
  }

  public init(options?: any) {
    PluginTarget.$$installedPlugins?.forEach((plugin) => {
      if (!!plugin.pluginSwitch && !plugin.pluginSwitch(options)) {
        console.log(`Plugin ${plugin.pluginName || plugin.name} not open, will not install !`);
        return;
      }
      this.install(new plugin(this.pluginContext));
    });
  }

  public plugins: Plugin[] = [];

  public install(plugin: Plugin & any) {
    this.plugins = [...this.plugins, plugin].sort(
      (a, b) => (a.constructor as PluginConstructor).pluginSort - (b.constructor as PluginConstructor).pluginSort,
    );

    plugin.mainInstance = this;

    plugin.pluginHooks &&
      plugin.pluginHooks.forEach(([methodName, fn]) => {
        if (this[methodName] && this[methodName].addHook) {
          this[methodName].addHook.call(this, plugin, fn);
        }
      });
  }

  public uninstall(plugin: Plugin & any) {
    this.plugins.splice(this.plugins.indexOf(plugin), 1);

    // tslint:disable-next-line:no-unused-expression
    plugin.pluginHooks &&
      plugin.pluginHooks.forEach(([methodName, fn]) => {
        if (this[methodName] && this[methodName].removeHook) {
          this[methodName].removeHook.call(this, plugin, fn);
        }
      });
  }
}
