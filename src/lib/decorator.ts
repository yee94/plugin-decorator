// @ts-ignore
import { func } from 'prop-types';

// @ts-ignore
export function Hook(target, name, descriptor: PropertyDescriptor) {
  const targetFn = descriptor.value;
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
        fn = instance[method].bind(instance);
      }

      if (fn !== targetFn) {
        const injectFunction = next.bind(this);
        injectFunction.instance = this;
        newArgs.splice(0, 0, injectFunction);
      }

      return fn.apply(this, newArgs);
    };

    const result = next.apply(this || target);

    if (needToRunFn.length) {
      throw new Error('Error need to run next() in hooks!');
    }

    return result;
  };

  runAction.addHook = (instance, method) => {
    fnArr.push([instance, method]);
  };
  runAction.removeHook = (instance, method) => {
    const fn = fnArr.find((item) => item[0] === instance && item[1] === method);
    if (fn) {
      fnArr.splice(fnArr.indexOf(fn), 1);
    }
  };

  descriptor.value = runAction;

  return descriptor;
}

export function Inject(target, name, descriptor: PropertyDescriptor) {
  if (!target.pluginHooks) {
    target.pluginHooks = [];
  }

  target.pluginHooks.push(name);

  return descriptor;
}
