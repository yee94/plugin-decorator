import PluginTarget from './PluginTarget';

export default class Plugin {
  public static pluginName: string = '';
  public static pluginSort: number;
  public static pluginSwitch?: (options: any) => boolean;

  public readonly pluginHooks: string[]; // 不用指定，通过Inject自动添加
  public defaultOptions: any = {};
  public options: any = {};

  public mainInstance!: PluginTarget;

  constructor(options = {}) {
    this.options = Object.assign({}, this.defaultOptions, options);
  }
}

export type PluginConstructor = typeof Plugin;
