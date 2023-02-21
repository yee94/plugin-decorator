import PluginTarget from './PluginTarget';

export default class Plugin {
  public static pluginName: string = '';
  public static pluginSort: number;
  public static pluginSwitch?: (options: any) => boolean;

  public defaultOptions: any = {};
  public options: any = {};

  public mainInstance!: PluginTarget;

  constructor(options = {}) {
    this.options = Object.assign({}, this.defaultOptions, options);
  }
}

export type PluginConstructor = typeof Plugin;
