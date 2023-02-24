import { Applicator, BindApplicator } from 'lodash-decorators/applicators';
import { DecoratorConfig, DecoratorFactory } from 'lodash-decorators/factory';

export const Hook = DecoratorFactory.createInstanceDecorator(
  new DecoratorConfig(
    (targetFn, mainInstance) => {
      const fnArr = [];
      const runAction = function <T>(...args: [T]) {
        const needToRunFn = [...fnArr];
        const next = function (...nextArgs) {
          const newArgs = [...args] as any;
          if (nextArgs.length) {
            Object.keys(nextArgs).forEach((key) => {
              newArgs[key] = nextArgs[key];
            });
          }

          const nextFnInfo = needToRunFn.pop();

          let fn;
          if (!nextFnInfo) {
            fn = targetFn;
          } else {
            const [instance, method] = nextFnInfo;
            fn = method.bind(instance);
          }

          if (fn !== targetFn) {
            const injectFunction: any = next.bind(this);
            injectFunction.instance = this;
            newArgs.splice(0, 0, injectFunction);
          }

          return fn.apply(this, newArgs);
        };

        const result = next.apply(this || mainInstance);

        if (needToRunFn.length) {
          throw new Error('Error need to run next() in hooks!');
        }

        return result;
      };

      targetFn.addHook = (instance, method) => {
        fnArr.push([instance, method]);
      };

      targetFn.removeHook = (instance, method) => {
        const fn = fnArr.find((item) => item[0] === instance && item[1] === method);
        if (fn) {
          fnArr.splice(fnArr.indexOf(fn), 1);
        }
      };

      return runAction.bind(mainInstance);
    },
    new BindApplicator(),
    { optionalParams: true, method: true },
  ),
) as any;

export const Inject = DecoratorFactory.createDecorator(
  new DecoratorConfig(
    function (name, instance, targetFn) {
      if (!instance.pluginHooks) {
        instance.pluginHooks = [];
      }

      instance.pluginHooks.push([name, targetFn]);

      return targetFn;
    },
    new (class extends Applicator {
      apply({ value, config: { execute }, args, target }: any): any {
        const name = args?.[0] ?? value.name;
        return execute(name, target, value);
      }
    })(),
    { method: true, optionalParams: true },
  ),
) as any;
