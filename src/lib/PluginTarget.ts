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

  protected init(options) {
    PluginTarget.$$installedPlugins.forEach((plugin) => {
      if (!!plugin.pluginSwitch && !plugin.pluginSwitch(options)) {
        console.log(`Plugin ${plugin.pluginName || plugin.name} not open, will not install !`);
        return;
      }
      this.install(new plugin(this.pluginContext));
    });
  }

  public plugins: Plugin[] = [];

  public install(plugin: Plugin) {
    this.plugins = [...this.plugins, plugin].sort(
      (a, b) =>
        (a.constructor as PluginConstructor).pluginSort -
        (b.constructor as PluginConstructor).pluginSort
    );

    plugin.mainInstance = this;

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
