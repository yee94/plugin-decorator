import Plugin from './Plugin';

export default abstract class PluginTarget {
  public plugins: Plugin[] = [];

  public install(plugin: Plugin) {
    this.plugins.push(plugin);

    // tslint:disable-next-line:no-unused-expression
    plugin.pluginHooks &&
      plugin.pluginHooks.forEach(methodName => {
        if (this[methodName] && this[methodName].addHook) {
          this[methodName].addHook(plugin[methodName]);
        }
      });
  }
}
